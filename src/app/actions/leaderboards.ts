"use server";

import { createClient } from "@/src/utils/supabase/server";
import {
  cacheKey,
  cacheGet,
  cacheSet,
  cacheGetOrSet,
  CACHE_KEYS,
  TTL,
} from "@/src/lib/cache";

export type LeaderboardType = "episodes" | "shows" | "achievements" | "comments";
export type TimePeriod = "all_time" | "weekly" | "monthly";
export type LeaderboardScope = "global" | "friends";

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_path: string | null;
  rank: number;
  value: number;
  // Type-specific fields
  weekly_value?: number;
  monthly_value?: number;
  achievements_count?: number;
}

export interface LeaderboardResult {
  success: boolean;
  entries?: LeaderboardEntry[];
  userRank?: LeaderboardEntry | null;
  error?: string;
}

/**
 * Get leaderboard data
 */
export async function getLeaderboard(
  type: LeaderboardType,
  period: TimePeriod = "all_time",
  scope: LeaderboardScope = "global",
  page: number = 1,
  limit: number = 50
): Promise<LeaderboardResult> {
  try {
    const supabase = await createClient();

    // Get current user for friends scope
    const { data: userData } = await supabase.auth.getClaims();
    const currentUserId = userData?.claims?.sub;

    // For global scope, try to get cached entries (first 5 pages)
    const canUseCache = scope === "global" && page <= 5;
    const entriesCacheKey = cacheKey(CACHE_KEYS.LEADERBOARD, type, period, page, limit);

    if (canUseCache) {
      const cachedEntries = await cacheGet<LeaderboardEntry[]>(entriesCacheKey);
      if (cachedEntries) {
        // Still need to get user rank if logged in
        let userRank: LeaderboardEntry | null = null;
        if (currentUserId) {
          userRank = await getCachedUserRank(supabase, currentUserId, type, period);
        }
        return { success: true, entries: cachedEntries, userRank };
      }
    }

    const offset = (page - 1) * limit;
    let entries: LeaderboardEntry[] = [];

    // Determine sort column based on type and period
    let table: string;
    let sortColumn: string;
    let valueColumn: string;

    switch (type) {
      case "episodes":
        table = "leaderboard_episodes";
        sortColumn =
          period === "weekly"
            ? "weekly_episodes"
            : period === "monthly"
            ? "monthly_episodes"
            : "total_episodes";
        valueColumn = sortColumn;
        break;
      case "shows":
        table = "leaderboard_shows";
        sortColumn = "total_shows";
        valueColumn = sortColumn;
        break;
      case "achievements":
        table = "leaderboard_achievements";
        sortColumn = "total_points";
        valueColumn = sortColumn;
        break;
      case "comments":
        table = "leaderboard_comments";
        sortColumn =
          period === "weekly"
            ? "weekly_comments"
            : period === "monthly"
            ? "monthly_comments"
            : "total_comments";
        valueColumn = sortColumn;
        break;
      default:
        return { success: false, error: "Invalid leaderboard type" };
    }

    // Build query based on scope
    let query = supabase.from(table).select("*");

    if (scope === "friends" && currentUserId) {
      // Get friends list (not cached - personalized)
      const { data: following } = await supabase
        .from("user_follows")
        .select("following_id")
        .eq("follower_id", currentUserId);

      const friendIds = following?.map((f) => f.following_id) || [];
      friendIds.push(currentUserId); // Include self

      query = query.in("user_id", friendIds);
    }

    // Get entries
    const { data, error } = await query
      .order(sortColumn, { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("[Leaderboards] Error fetching leaderboard:", error);
      return { success: false, error: error.message };
    }

    // Transform data with ranks
    entries = (data || []).map((entry: any, index: number) => ({
      user_id: entry.user_id,
      username: entry.username,
      avatar_path: entry.avatar_path,
      rank: offset + index + 1,
      value: entry[valueColumn] || 0,
      weekly_value:
        type === "episodes"
          ? entry.weekly_episodes
          : type === "comments"
          ? entry.weekly_comments
          : undefined,
      monthly_value:
        type === "episodes"
          ? entry.monthly_episodes
          : type === "comments"
          ? entry.monthly_comments
          : undefined,
      achievements_count:
        type === "achievements" ? entry.achievements_count : undefined,
    }));

    // Cache global leaderboard entries
    if (canUseCache && entries.length > 0) {
      cacheSet(entriesCacheKey, entries, TTL.MEDIUM).catch(() => {});
    }

    // Get current user's rank if logged in
    let userRank: LeaderboardEntry | null = null;
    if (currentUserId) {
      userRank = await getCachedUserRank(supabase, currentUserId, type, period);
    }

    return { success: true, entries, userRank };
  } catch (error) {
    console.error("[Leaderboards] Error in getLeaderboard:", error);
    return { success: false, error: "Failed to fetch leaderboard" };
  }
}

/**
 * Helper to get cached user rank
 */
async function getCachedUserRank(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  type: LeaderboardType,
  period: TimePeriod
): Promise<LeaderboardEntry | null> {
  const rankCacheKey = cacheKey(CACHE_KEYS.USER_RANK, userId, type, period);

  // Try cache first
  const cached = await cacheGet<LeaderboardEntry>(rankCacheKey);
  if (cached) return cached;

  // Determine table and value column
  let table: string;
  let valueColumn: string;

  switch (type) {
    case "episodes":
      table = "leaderboard_episodes";
      valueColumn = period === "weekly" ? "weekly_episodes" : period === "monthly" ? "monthly_episodes" : "total_episodes";
      break;
    case "shows":
      table = "leaderboard_shows";
      valueColumn = "total_shows";
      break;
    case "achievements":
      table = "leaderboard_achievements";
      valueColumn = "total_points";
      break;
    case "comments":
      table = "leaderboard_comments";
      valueColumn = period === "weekly" ? "weekly_comments" : period === "monthly" ? "monthly_comments" : "total_comments";
      break;
    default:
      return null;
  }

  const { data: userEntry } = await supabase
    .from(table)
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!userEntry) return null;

  // Get actual rank
  const { data: rankData } = await supabase.rpc("get_user_rank", {
    p_user_id: userId,
    p_leaderboard_type: type,
    p_time_period: period,
  });

  const userRank: LeaderboardEntry = {
    user_id: userEntry.user_id,
    username: userEntry.username,
    avatar_path: userEntry.avatar_path,
    rank: rankData || 0,
    value: userEntry[valueColumn] || 0,
    weekly_value:
      type === "episodes"
        ? userEntry.weekly_episodes
        : type === "comments"
        ? userEntry.weekly_comments
        : undefined,
    monthly_value:
      type === "episodes"
        ? userEntry.monthly_episodes
        : type === "comments"
        ? userEntry.monthly_comments
        : undefined,
    achievements_count:
      type === "achievements" ? userEntry.achievements_count : undefined,
  };

  // Cache for 10 minutes
  cacheSet(rankCacheKey, userRank, TTL.MEDIUM).catch(() => {});

  return userRank;
}

/**
 * Get user's rank on a specific leaderboard
 */
export async function getUserRank(
  userId: string,
  type: LeaderboardType,
  period: TimePeriod = "all_time"
): Promise<{ success: boolean; rank?: number; error?: string }> {
  try {
    const supabase = await createClient();

    const { data: rank, error } = await supabase.rpc("get_user_rank", {
      p_user_id: userId,
      p_leaderboard_type: type,
      p_time_period: period,
    });

    if (error) {
      console.error("[Leaderboards] Error getting user rank:", error);
      return { success: false, error: error.message };
    }

    return { success: true, rank: rank || undefined };
  } catch (error) {
    console.error("[Leaderboards] Error in getUserRank:", error);
    return { success: false, error: "Failed to get user rank" };
  }
}

/**
 * Get top performers for homepage/dashboard display
 */
export async function getTopPerformers(
  type: LeaderboardType,
  limit: number = 5
): Promise<LeaderboardResult> {
  return getLeaderboard(type, "all_time", "global", 1, limit);
}

/**
 * Get leaderboard summary stats
 */
export async function getLeaderboardStats(): Promise<{
  success: boolean;
  stats?: {
    totalEpisodesWatched: number;
    totalShowsCompleted: number;
    totalAchievementsUnlocked: number;
    totalComments: number;
    activeUsers: number;
  };
  error?: string;
}> {
  try {
    // Try cache first
    const cached = await cacheGet<{
      totalEpisodesWatched: number;
      totalShowsCompleted: number;
      totalAchievementsUnlocked: number;
      totalComments: number;
      activeUsers: number;
    }>(CACHE_KEYS.LEADERBOARD_STATS);

    if (cached) {
      return { success: true, stats: cached };
    }

    const supabase = await createClient();

    // Get counts from each leaderboard
    const { count: episodesCount } = await supabase
      .from("leaderboard_episodes")
      .select("*", { count: "exact", head: true });

    const { count: showsCount } = await supabase
      .from("leaderboard_shows")
      .select("*", { count: "exact", head: true });

    const { count: achievementsCount } = await supabase
      .from("leaderboard_achievements")
      .select("*", { count: "exact", head: true });

    const { count: commentsCount } = await supabase
      .from("leaderboard_comments")
      .select("*", { count: "exact", head: true });

    // Get total values
    const { data: episodesTotal } = await supabase
      .from("leaderboard_episodes")
      .select("total_episodes");

    const { data: showsTotal } = await supabase
      .from("leaderboard_shows")
      .select("total_shows");

    const { data: achievementsTotal } = await supabase
      .from("leaderboard_achievements")
      .select("achievements_count");

    const { data: commentsTotal } = await supabase
      .from("leaderboard_comments")
      .select("total_comments");

    const sumArray = (arr: any[] | null, key: string) =>
      arr?.reduce((sum, item) => sum + (item[key] || 0), 0) || 0;

    const stats = {
      totalEpisodesWatched: sumArray(episodesTotal, "total_episodes"),
      totalShowsCompleted: sumArray(showsTotal, "total_shows"),
      totalAchievementsUnlocked: sumArray(achievementsTotal, "achievements_count"),
      totalComments: sumArray(commentsTotal, "total_comments"),
      activeUsers: Math.max(
        episodesCount || 0,
        showsCount || 0,
        achievementsCount || 0,
        commentsCount || 0
      ),
    };

    // Cache for 15 minutes
    cacheSet(CACHE_KEYS.LEADERBOARD_STATS, stats, TTL.MEDIUM).catch(() => {});

    return { success: true, stats };
  } catch (error) {
    console.error("[Leaderboards] Error in getLeaderboardStats:", error);
    return { success: false, error: "Failed to get leaderboard stats" };
  }
}
