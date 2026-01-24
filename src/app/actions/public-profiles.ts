"use server";

import { createClient } from "@/src/utils/supabase/server";
import {
  checkVisibility,
  getUserVisibilitySettings,
} from "@/src/lib/visibility-utils";
import { VisibilityLevel } from "@/src/lib/types";
import {
  cacheKey,
  cacheGet,
  cacheSet,
  CACHE_KEYS,
  TTL,
} from "@/src/lib/cache";

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
  title: string;
  is_public: boolean;
  item_count: number;
  created_at: string;
  backdrop_path?: string | null;
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

    // Get the profile (case-insensitive lookup)
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, username, avatar_path, created_at, settings")
      .ilike("username", username)
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
    // Try cache first
    const statsCacheKey = cacheKey(CACHE_KEYS.USER_PUBLIC_STATS, userId);
    const cached = await cacheGet<PublicStats>(statsCacheKey);
    if (cached) {
      return { success: true, stats: cached };
    }

    const supabase = await createClient();

    // Run all queries in parallel for better performance
    const [
      episodesResult,
      showsResult,
      completedResult,
      achievementsResult,
      followersResult,
      followingResult,
    ] = await Promise.all([
      // Get episode count
      supabase
        .from("episode_watches")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId),
      // Get unique shows started
      supabase
        .from("episode_watches")
        .select("series_id")
        .eq("user_id", userId),
      // Get shows completed (from leaderboard materialized view)
      supabase
        .from("leaderboard_shows")
        .select("total_shows")
        .eq("user_id", userId)
        .single(),
      // Get achievements count
      supabase
        .from("user_achievements")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .not("unlocked_at", "is", null),
      // Get followers count
      supabase
        .from("user_follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", userId),
      // Get following count
      supabase
        .from("user_follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", userId),
    ]);

    // Log any RLS errors for debugging
    if (episodesResult.error) {
      console.error("[Public Profiles] Error fetching episodes:", episodesResult.error);
    }
    if (showsResult.error) {
      console.error("[Public Profiles] Error fetching shows:", showsResult.error);
    }

    const uniqueShows = new Set(showsResult.data?.map((s) => s.series_id) || []);

    const stats: PublicStats = {
      episodes_watched: episodesResult.count || 0,
      shows_started: uniqueShows.size,
      shows_completed: completedResult.data?.total_shows || 0,
      achievements_count: achievementsResult.count || 0,
      followers_count: followersResult.count || 0,
      following_count: followingResult.count || 0,
    };

    // Cache for 30 minutes
    cacheSet(statsCacheKey, stats, TTL.LONG).catch(() => {});

    return { success: true, stats };
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

    // Try cache for public collections (only cache first 5 pages)
    const canUseCache = page <= 5;
    const collectionsCacheKey = cacheKey(CACHE_KEYS.USER_PUBLIC_COLLECTIONS, userId, page, limit);

    if (canUseCache) {
      const cached = await cacheGet<{ collections: PublicCollection[]; hasMore: boolean }>(collectionsCacheKey);
      if (cached) {
        return { success: true, collections: cached.collections, hasMore: cached.hasMore };
      }
    }

    const offset = (page - 1) * limit;

    // Get public collections
    const { data: collections, error } = await supabase
      .from("collections")
      .select("id, title, is_public, created_at")
      .eq("owner", userId)
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit);

    if (error) {
      console.error("[Public Profiles] Error fetching collections:", error);
      return { success: false, error: error.message };
    }

    // Get item counts and first media for backdrop for each collection
    const collectionsWithDetails: PublicCollection[] = await Promise.all(
      (collections || []).map(async (collection) => {
        // Get count and first item in parallel
        const [countResult, firstItemResult] = await Promise.all([
          supabase
            .from("medias_collections")
            .select("*", { count: "exact", head: true })
            .eq("collection_id", collection.id),
          supabase
            .from("medias_collections")
            .select("media_id, media_type")
            .eq("collection_id", collection.id)
            .limit(1)
            .single(),
        ]);

        let backdrop_path: string | null = null;

        // Fetch backdrop from the first media item
        if (firstItemResult.data) {
          const { media_id, media_type } = firstItemResult.data;

          if (media_type === "movie") {
            const { data: movie } = await supabase
              .from("movies")
              .select("backdrop_path")
              .eq("id", media_id)
              .single();
            backdrop_path = movie?.backdrop_path || null;
          } else if (media_type === "tv") {
            const { data: series } = await supabase
              .from("series")
              .select("backdrop_path")
              .eq("id", media_id)
              .single();
            backdrop_path = series?.backdrop_path || null;
          }
        }

        return {
          ...collection,
          item_count: countResult.count || 0,
          backdrop_path,
        };
      })
    );

    const hasMore = (collections?.length || 0) === limit + 1;

    // Cache for 15 minutes
    if (canUseCache && collectionsWithDetails.length > 0) {
      cacheSet(collectionsCacheKey, { collections: collectionsWithDetails, hasMore }, TTL.MEDIUM).catch(() => {});
    }

    return {
      success: true,
      collections: collectionsWithDetails,
      hasMore,
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

    // Try cache for first 3 pages (activity changes more frequently)
    const canUseCache = page <= 3;
    const activityCacheKey = cacheKey(CACHE_KEYS.USER_PUBLIC_ACTIVITY, userId, page, limit);

    if (canUseCache) {
      const cached = await cacheGet<{ activities: any[]; hasMore: boolean }>(activityCacheKey);
      if (cached) {
        return { success: true, activities: cached.activities, hasMore: cached.hasMore };
      }
    }

    const offset = (page - 1) * limit;

    // Get activities and user data in parallel
    const [activitiesResult, userResult] = await Promise.all([
      supabase
        .from("activity_feed")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit),
      supabase
        .from("profiles")
        .select("id, username, avatar_path")
        .eq("id", userId)
        .single(),
    ]);

    if (activitiesResult.error) {
      console.error("[Public Profiles] Error fetching activity:", activitiesResult.error);
      return { success: false, error: activitiesResult.error.message };
    }

    const activitiesWithUser = (activitiesResult.data || []).map((activity) => ({
      ...activity,
      user: userResult.data || {
        id: userId,
        username: "Unknown User",
        avatar_path: null,
      },
    }));

    const hasMore = (activitiesResult.data?.length || 0) === limit + 1;

    // Cache for 5 minutes (activity changes more frequently)
    if (canUseCache && activitiesWithUser.length > 0) {
      cacheSet(activityCacheKey, { activities: activitiesWithUser, hasMore }, TTL.SHORT).catch(() => {});
    }

    return {
      success: true,
      activities: activitiesWithUser,
      hasMore,
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

    // Get current viewer
    const { data: userData } = await supabase.auth.getClaims();
    const viewerId = userData?.claims?.sub || null;

    // Check visibility settings
    const settings = await getUserVisibilitySettings(userId);
    if (settings) {
      const visibilityCheck = await checkVisibility(
        userId,
        viewerId,
        settings.show_achievements_to
      );

      if (!visibilityCheck.canView) {
        return { success: true, achievements: [] };
      }
    }

    // Try cache first
    const achievementsCacheKey = cacheKey(CACHE_KEYS.USER_PUBLIC_ACHIEVEMENTS, userId);
    const cached = await cacheGet<any[]>(achievementsCacheKey);
    if (cached) {
      return { success: true, achievements: cached };
    }

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

    // Cache for 30 minutes
    cacheSet(achievementsCacheKey, achievementsWithDefinitions, TTL.LONG).catch(() => {});

    return { success: true, achievements: achievementsWithDefinitions };
  } catch (error) {
    console.error("[Public Profiles] Error in getPublicAchievements:", error);
    return { success: false, error: "Failed to fetch achievements" };
  }
}

export interface PublicReelDeckItem {
  id: string;
  media_id: string;
  media_type: "movie" | "tv";
  status: string;
  added_at: string;
  last_watched_at: string | null;
  title: string;
  poster_path: string | null;
  release_year: number | null;
  isCompleted: boolean;
}

/**
 * Get public reel deck for a user (what they're currently watching)
 */
export async function getPublicReelDeck(
  userId: string
): Promise<{
  success: boolean;
  items?: PublicReelDeckItem[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Check if user has show_watching_deck enabled
    const { data: profile } = await supabase
      .from("profiles")
      .select("settings")
      .eq("id", userId)
      .single();

    const showWatchingDeck = profile?.settings?.show_watching_deck ?? true;

    if (!showWatchingDeck) {
      return { success: true, items: [] };
    }

    // Try cache first
    const reelDeckCacheKey = cacheKey(CACHE_KEYS.USER_PUBLIC_STATS, userId, "reel-deck");
    const cached = await cacheGet<PublicReelDeckItem[]>(reelDeckCacheKey);
    if (cached) {
      return { success: true, items: cached };
    }

    // Fetch reel deck items (all statuses for public view, we'll categorize on the page)
    const { data: reelDeckItems, error: reelDeckError } = await supabase
      .from("reel_deck")
      .select("id, media_id, media_type, status, added_at, last_watched_at")
      .eq("user_id", userId)
      .order("last_watched_at", { ascending: false, nullsFirst: false })
      .limit(100);

    if (reelDeckError) {
      console.error("[Public Profiles] Error fetching reel deck:", reelDeckError);
      return { success: false, error: reelDeckError.message };
    }

    if (!reelDeckItems || reelDeckItems.length === 0) {
      return { success: true, items: [] };
    }

    // Separate movie and TV series IDs
    const movieIds = reelDeckItems
      .filter((i) => i.media_type === "movie")
      .map((i) => i.media_id);
    const seriesIds = reelDeckItems
      .filter((i) => i.media_type === "tv")
      .map((i) => i.media_id);

    // Fetch media details and series stats in parallel
    const [moviesResult, seriesResult, seriesStatsResult] = await Promise.all([
      movieIds.length > 0
        ? supabase
            .from("movies")
            .select("id, title, poster_path, release_year")
            .in("id", movieIds)
        : Promise.resolve({ data: [] }),
      seriesIds.length > 0
        ? supabase
            .from("series")
            .select("id, title, poster_path, release_year, status")
            .in("id", seriesIds)
        : Promise.resolve({ data: [] }),
      // Fetch user's watch stats to determine actual completion
      seriesIds.length > 0
        ? supabase
            .from("user_series_stats")
            .select("series_id, watched_episodes, total_episodes, aired_episodes_count, has_upcoming_episodes")
            .eq("user_id", userId)
            .in("series_id", seriesIds)
        : Promise.resolve({ data: [] }),
    ]);

    const movieMap = new Map((moviesResult.data || []).map((m) => [m.id, m]));
    const seriesMap = new Map((seriesResult.data || []).map((s) => [s.id, s]));
    const statsMap = new Map((seriesStatsResult.data || []).map((s: any) => [s.series_id, s]));

    // Build final items with media details
    const itemsWithDetails: PublicReelDeckItem[] = reelDeckItems
      .map((item) => {
        const media =
          item.media_type === "movie"
            ? movieMap.get(item.media_id)
            : seriesMap.get(item.media_id);

        if (!media) return null;

        // Determine if item is completed
        let isCompleted = item.status === "completed";

        if (item.media_type === "tv" && !isCompleted) {
          const stats = statsMap.get(item.media_id);
          if (stats) {
            // A series is completed if all episodes are watched and no upcoming episodes
            isCompleted =
              stats.watched_episodes >= stats.total_episodes &&
              stats.total_episodes > 0 &&
              !stats.has_upcoming_episodes;
          }
        }

        return {
          id: item.id,
          media_id: item.media_id,
          media_type: item.media_type as "movie" | "tv",
          status: item.status,
          added_at: item.added_at,
          last_watched_at: item.last_watched_at,
          title: media.title,
          poster_path: media.poster_path,
          release_year: media.release_year,
          isCompleted,
        };
      })
      .filter((item): item is PublicReelDeckItem => item !== null);

    // Cache for 15 minutes
    cacheSet(reelDeckCacheKey, itemsWithDetails, TTL.MEDIUM).catch(() => {});

    return { success: true, items: itemsWithDetails };
  } catch (error) {
    console.error("[Public Profiles] Error in getPublicReelDeck:", error);
    return { success: false, error: "Failed to fetch reel deck" };
  }
}
