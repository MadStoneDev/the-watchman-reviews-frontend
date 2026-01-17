"use server";

import { createClient } from "@/src/utils/supabase/server";
import {
  checkVisibility,
  getUserVisibilitySettings,
} from "@/src/lib/visibility-utils";
import { VisibilityLevel } from "@/src/lib/types";

export type ProfileVisibility = "public" | "followers_only" | "private";

export interface PublicProfile {
  id: string;
  username: string;
  avatar_path: string | null;
  created_at: string;
  profile_visibility: ProfileVisibility;
  bio?: string;
}

export interface PublicStats {
  episodes_watched: number;
  shows_started: number;
  shows_completed: number;
  achievements_count: number;
  followers_count: number;
  following_count: number;
}

export interface PublicCollection {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  item_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Get a public profile by username
 */
export async function getPublicProfile(
  username: string
): Promise<{
  success: boolean;
  profile?: PublicProfile;
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  canView?: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Get the profile
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, username, avatar_path, created_at, settings")
      .eq("username", username)
      .single();

    if (error || !profile) {
      return { success: false, error: "Profile not found" };
    }

    // Extract profile visibility from settings
    const visibility: ProfileVisibility =
      profile.settings?.profile_visibility || "public";

    // Get current user (if logged in)
    const { data: userData } = await supabase.auth.getClaims();
    const currentUserId = userData?.claims?.sub;

    const isOwnProfile = currentUserId === profile.id;

    // Check if current user follows this profile
    let isFollowing = false;
    if (currentUserId && !isOwnProfile) {
      const { data: followData } = await supabase
        .from("user_follows")
        .select("id")
        .eq("follower_id", currentUserId)
        .eq("following_id", profile.id)
        .single();
      isFollowing = !!followData;
    }

    // Determine if the user can view this profile
    let canView = true;
    if (visibility === "private" && !isOwnProfile) {
      canView = false;
    } else if (visibility === "followers_only" && !isOwnProfile && !isFollowing) {
      canView = false;
    }

    const publicProfile: PublicProfile = {
      id: profile.id,
      username: profile.username,
      avatar_path: profile.avatar_path,
      created_at: profile.created_at,
      profile_visibility: visibility,
      bio: profile.settings?.bio,
    };

    return {
      success: true,
      profile: publicProfile,
      isOwnProfile,
      isFollowing,
      canView,
    };
  } catch (error) {
    console.error("[Public Profiles] Error in getPublicProfile:", error);
    return { success: false, error: "Failed to fetch profile" };
  }
}

/**
 * Get public stats for a user
 */
export async function getPublicStats(
  userId: string
): Promise<{ success: boolean; stats?: PublicStats; error?: string }> {
  try {
    const supabase = await createClient();

    // Get episode count
    const { count: episodesCount } = await supabase
      .from("episode_watches")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    // Get unique shows started
    const { data: showsData } = await supabase
      .from("episode_watches")
      .select("series_id")
      .eq("user_id", userId);

    const uniqueShows = new Set(showsData?.map((s) => s.series_id) || []);

    // Get shows completed (from leaderboard materialized view if available)
    const { data: completedData } = await supabase
      .from("leaderboard_shows")
      .select("total_shows")
      .eq("user_id", userId)
      .single();

    // Get achievements count
    const { count: achievementsCount } = await supabase
      .from("user_achievements")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .not("unlocked_at", "is", null);

    // Get followers count
    const { count: followersCount } = await supabase
      .from("user_follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", userId);

    // Get following count
    const { count: followingCount } = await supabase
      .from("user_follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", userId);

    return {
      success: true,
      stats: {
        episodes_watched: episodesCount || 0,
        shows_started: uniqueShows.size,
        shows_completed: completedData?.total_shows || 0,
        achievements_count: achievementsCount || 0,
        followers_count: followersCount || 0,
        following_count: followingCount || 0,
      },
    };
  } catch (error) {
    console.error("[Public Profiles] Error in getPublicStats:", error);
    return { success: false, error: "Failed to fetch stats" };
  }
}

/**
 * Get public collections for a user
 */
export async function getPublicCollections(
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<{
  success: boolean;
  collections?: PublicCollection[];
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
        settings.show_collections_to
      );

      if (!visibilityCheck.canView) {
        return { success: true, collections: [], hasMore: false };
      }
    }

    const offset = (page - 1) * limit;

    // Get public collections
    const { data: collections, error } = await supabase
      .from("collections")
      .select("id, name, description, is_public, created_at, updated_at")
      .eq("owner", userId)
      .eq("is_public", true)
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit);

    if (error) {
      console.error("[Public Profiles] Error fetching collections:", error);
      return { success: false, error: error.message };
    }

    // Get item counts for each collection
    const collectionsWithCounts: PublicCollection[] = await Promise.all(
      (collections || []).map(async (collection) => {
        const { count } = await supabase
          .from("collection_items")
          .select("*", { count: "exact", head: true })
          .eq("collection_id", collection.id);

        return {
          ...collection,
          item_count: count || 0,
        };
      })
    );

    return {
      success: true,
      collections: collectionsWithCounts,
      hasMore: (collections?.length || 0) === limit + 1,
    };
  } catch (error) {
    console.error("[Public Profiles] Error in getPublicCollections:", error);
    return { success: false, error: "Failed to fetch collections" };
  }
}

/**
 * Get public activity for a user
 */
export async function getPublicActivity(
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<{
  success: boolean;
  activities?: any[];
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

    // Get activities
    const { data: activities, error } = await supabase
      .from("activity_feed")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit);

    if (error) {
      console.error("[Public Profiles] Error fetching activity:", error);
      return { success: false, error: error.message };
    }

    // Get user data
    const { data: user } = await supabase
      .from("profiles")
      .select("id, username, avatar_path")
      .eq("id", userId)
      .single();

    const activitiesWithUser = (activities || []).map((activity) => ({
      ...activity,
      user: user || {
        id: userId,
        username: "Unknown User",
        avatar_path: null,
      },
    }));

    return {
      success: true,
      activities: activitiesWithUser,
      hasMore: (activities?.length || 0) === limit + 1,
    };
  } catch (error) {
    console.error("[Public Profiles] Error in getPublicActivity:", error);
    return { success: false, error: "Failed to fetch activity" };
  }
}

/**
 * Get public achievements for a user
 */
export async function getPublicAchievements(
  userId: string
): Promise<{
  success: boolean;
  achievements?: any[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Get user's achievements
    const { data: userAchievements, error } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", userId)
      .not("unlocked_at", "is", null)
      .order("unlocked_at", { ascending: false });

    if (error) {
      console.error("[Public Profiles] Error fetching achievements:", error);
      return { success: false, error: error.message };
    }

    if (!userAchievements || userAchievements.length === 0) {
      return { success: true, achievements: [] };
    }

    // Get achievement definitions
    const achievementIds = userAchievements.map((a) => a.achievement_id);
    const { data: definitions } = await supabase
      .from("achievement_definitions")
      .select("*")
      .in("id", achievementIds);

    const definitionMap = new Map(definitions?.map((d) => [d.id, d]) || []);

    const achievementsWithDefinitions = userAchievements.map((ua) => ({
      ...ua,
      achievement: definitionMap.get(ua.achievement_id),
    }));

    return { success: true, achievements: achievementsWithDefinitions };
  } catch (error) {
    console.error("[Public Profiles] Error in getPublicAchievements:", error);
    return { success: false, error: "Failed to fetch achievements" };
  }
}
