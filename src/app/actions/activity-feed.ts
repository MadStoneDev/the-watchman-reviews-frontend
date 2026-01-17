"use server";

import { createClient } from "@/src/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  batchCheckVisibility,
  checkVisibility,
  getUserVisibilitySettings,
} from "@/src/lib/visibility-utils";

export type ActivityType =
  | "episode_watched"
  | "series_started"
  | "series_completed"
  | "comment_posted"
  | "achievement_unlocked";

export interface ActivityData {
  series_name?: string;
  series_poster?: string;
  episode_number?: number;
  season_number?: number;
  episode_name?: string;
  comment_preview?: string;
  media_type?: string;
  media_id?: string;
  media_name?: string;
  achievement_id?: string;
  achievement_name?: string;
  achievement_tier?: string;
}

export interface ActivityFeedItem {
  id: string;
  user_id: string;
  activity_type: ActivityType;
  data: ActivityData;
  series_id: string | null;
  episode_id: string | null;
  created_at: string;
  user: {
    id: string;
    username: string;
    avatar_path: string | null;
  };
}

/**
 * Create an activity entry for the current user
 */
export async function createActivity(
  activityType: ActivityType,
  data: ActivityData,
  seriesId?: string | null,
  episodeId?: string | null
): Promise<{ success: boolean; activityId?: string; error?: string }> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in" };
    }

    const { data: activity, error } = await supabase
      .from("activity_feed")
      .insert({
        user_id: user.id,
        activity_type: activityType,
        data: data,
        series_id: seriesId || null,
        episode_id: episodeId || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[Activity Feed] Error creating activity:", error);
      return { success: false, error: error.message };
    }

    return { success: true, activityId: activity.id };
  } catch (error) {
    console.error("[Activity Feed] Error in createActivity:", error);
    return { success: false, error: "Failed to create activity" };
  }
}

/**
 * Create an activity entry for a specific user (used by server-side code)
 */
export async function createActivityForUser(
  userId: string,
  activityType: ActivityType,
  data: ActivityData,
  seriesId?: string | null,
  episodeId?: string | null
): Promise<{ success: boolean; activityId?: string; error?: string }> {
  try {
    const supabase = await createClient();

    const { data: activity, error } = await supabase
      .from("activity_feed")
      .insert({
        user_id: userId,
        activity_type: activityType,
        data: data,
        series_id: seriesId || null,
        episode_id: episodeId || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[Activity Feed] Error creating activity for user:", error);
      return { success: false, error: error.message };
    }

    return { success: true, activityId: activity.id };
  } catch (error) {
    console.error("[Activity Feed] Error in createActivityForUser:", error);
    return { success: false, error: "Failed to create activity" };
  }
}

/**
 * Get activity feed for the current user (activities from followed users)
 */
export async function getActivityFeed(
  page: number = 1,
  limit: number = 20
): Promise<{
  success: boolean;
  activities?: ActivityFeedItem[];
  hasMore?: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: userData } = await supabase.auth.getClaims();
    const currentUserId = userData?.claims?.sub;

    if (!currentUserId) {
      return { success: false, error: "You must be logged in" };
    }

    // Get users that current user follows
    const { data: following } = await supabase
      .from("user_follows")
      .select("following_id")
      .eq("follower_id", currentUserId);

    let followingIds = following?.map((f) => f.following_id) || [];

    // Filter followingIds by visibility settings
    if (followingIds.length > 0) {
      const visibilityMap = await batchCheckVisibility(
        followingIds,
        currentUserId,
        "show_watch_progress_to"
      );

      // Only keep users who allow the current user to view their activity
      followingIds = followingIds.filter((id) => visibilityMap.get(id) === true);
    }

    // Include current user's own activity
    followingIds.push(currentUserId);

    if (followingIds.length === 0) {
      return { success: true, activities: [], hasMore: false };
    }

    const offset = (page - 1) * limit;

    // Fetch activities from followed users
    const { data: activities, error } = await supabase
      .from("activity_feed")
      .select("*")
      .in("user_id", followingIds)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit);

    if (error) {
      console.error("[Activity Feed] Error fetching feed:", error);
      return { success: false, error: error.message };
    }

    if (!activities || activities.length === 0) {
      return { success: true, activities: [], hasMore: false };
    }

    // Fetch user data for all activities
    const userIds = Array.from(new Set(activities.map((a) => a.user_id)));
    const { data: users } = await supabase
      .from("profiles")
      .select("id, username, avatar_path")
      .in("id", userIds);

    const userMap = new Map(users?.map((u) => [u.id, u]) || []);

    const activitiesWithUsers: ActivityFeedItem[] = activities.map((activity) => ({
      id: activity.id,
      user_id: activity.user_id,
      activity_type: activity.activity_type,
      data: activity.data,
      series_id: activity.series_id,
      episode_id: activity.episode_id,
      created_at: activity.created_at,
      user: userMap.get(activity.user_id) || {
        id: activity.user_id,
        username: "Unknown User",
        avatar_path: null,
      },
    }));

    return {
      success: true,
      activities: activitiesWithUsers,
      hasMore: activities.length === limit + 1,
    };
  } catch (error) {
    console.error("[Activity Feed] Error in getActivityFeed:", error);
    return { success: false, error: "Failed to fetch activity feed" };
  }
}

/**
 * Get activity for a specific user
 */
export async function getUserActivity(
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<{
  success: boolean;
  activities?: ActivityFeedItem[];
  hasMore?: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Get current viewer
    const { data: userData } = await supabase.auth.getClaims();
    const viewerId = userData?.claims?.sub || null;

    // Check visibility settings
    const settings = await getUserVisibilitySettings(userId);
    if (settings) {
      const visibilityCheck = await checkVisibility(
        userId,
        viewerId,
        settings.show_watch_progress_to
      );

      if (!visibilityCheck.canView) {
        return { success: true, activities: [], hasMore: false };
      }
    }

    const offset = (page - 1) * limit;

    // Fetch activities for the specific user
    const { data: activities, error } = await supabase
      .from("activity_feed")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit);

    if (error) {
      console.error("[Activity Feed] Error fetching user activity:", error);
      return { success: false, error: error.message };
    }

    if (!activities || activities.length === 0) {
      return { success: true, activities: [], hasMore: false };
    }

    // Fetch user data
    const { data: user } = await supabase
      .from("profiles")
      .select("id, username, avatar_path")
      .eq("id", userId)
      .single();

    const activitiesWithUser: ActivityFeedItem[] = activities.map((activity) => ({
      id: activity.id,
      user_id: activity.user_id,
      activity_type: activity.activity_type,
      data: activity.data,
      series_id: activity.series_id,
      episode_id: activity.episode_id,
      created_at: activity.created_at,
      user: user || {
        id: userId,
        username: "Unknown User",
        avatar_path: null,
      },
    }));

    return {
      success: true,
      activities: activitiesWithUser,
      hasMore: activities.length === limit + 1,
    };
  } catch (error) {
    console.error("[Activity Feed] Error in getUserActivity:", error);
    return { success: false, error: "Failed to fetch user activity" };
  }
}

/**
 * Delete an activity entry (user can delete their own)
 */
export async function deleteActivity(
  activityId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in" };
    }

    // Verify ownership
    const { data: activity } = await supabase
      .from("activity_feed")
      .select("user_id")
      .eq("id", activityId)
      .single();

    if (!activity || activity.user_id !== user.id) {
      return { success: false, error: "You can only delete your own activity" };
    }

    const { error } = await supabase
      .from("activity_feed")
      .delete()
      .eq("id", activityId);

    if (error) {
      console.error("[Activity Feed] Error deleting activity:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("[Activity Feed] Error in deleteActivity:", error);
    return { success: false, error: "Failed to delete activity" };
  }
}

/**
 * Check if this is the first episode watched for a series (for series_started activity)
 */
export async function isFirstEpisodeForSeries(
  userId: string,
  seriesId: string
): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { count } = await supabase
      .from("episode_watches")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("series_id", seriesId);

    // If count is 1, this was the first episode
    return count === 1;
  } catch (error) {
    console.error("[Activity Feed] Error checking first episode:", error);
    return false;
  }
}

/**
 * Check if all episodes of a series have been watched (for series_completed activity)
 */
export async function isSeriesCompleted(
  userId: string,
  seriesId: string
): Promise<boolean> {
  try {
    const supabase = await createClient();

    // Get total aired episodes for the series
    const today = new Date().toISOString().split("T")[0];
    const { count: totalEpisodes } = await supabase
      .from("episodes")
      .select("*", { count: "exact", head: true })
      .eq("series_id", seriesId)
      .lte("air_date", today);

    if (!totalEpisodes || totalEpisodes === 0) {
      return false;
    }

    // Get watched episodes count
    const { count: watchedEpisodes } = await supabase
      .from("episode_watches")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("series_id", seriesId);

    return watchedEpisodes === totalEpisodes;
  } catch (error) {
    console.error("[Activity Feed] Error checking series completed:", error);
    return false;
  }
}
