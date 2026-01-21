"use server";

import { createClient } from "@/src/utils/supabase/server";
import { createNotification } from "./notifications";
import { createActivityForUser } from "./activity-feed";

// Cache of already-checked achievements per user session to avoid redundant DB calls
const checkedAchievements = new Map<string, Set<string>>();

/**
 * Check if a user already has an achievement (to skip redundant checks)
 */
async function hasAchievement(
  supabase: any,
  userId: string,
  achievementId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("user_achievements")
    .select("id")
    .eq("user_id", userId)
    .eq("achievement_id", achievementId)
    .single();

  return !!data;
}

export type AchievementTier = "bronze" | "silver" | "gold" | "platinum";
export type AchievementCategory = "watching" | "social" | "engagement" | "special";

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  category: AchievementCategory;
  tier: AchievementTier;
  threshold: number | null;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  progress: number;
  metadata: Record<string, any>;
  achievement?: AchievementDefinition;
}

/**
 * Get all achievement definitions
 */
export async function getAchievementDefinitions(): Promise<{
  success: boolean;
  achievements?: AchievementDefinition[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data: achievements, error } = await supabase
      .from("achievement_definitions")
      .select("*")
      .order("category", { ascending: true })
      .order("threshold", { ascending: true, nullsFirst: false });

    if (error) {
      console.error("Error fetching achievement definitions:", error);
      return { success: false, error: error.message };
    }

    return { success: true, achievements: achievements || [] };
  } catch (error) {
    console.error("Error in getAchievementDefinitions:", error);
    return { success: false, error: "Failed to fetch achievement definitions" };
  }
}

/**
 * Get achievements for a specific user
 */
export async function getUserAchievements(
  userId: string
): Promise<{
  success: boolean;
  achievements?: UserAchievement[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data: userAchievements, error } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", userId)
      .order("unlocked_at", { ascending: false });

    if (error) {
      console.error("Error fetching user achievements:", error);
      return { success: false, error: error.message };
    }

    if (!userAchievements || userAchievements.length === 0) {
      return { success: true, achievements: [] };
    }

    // Fetch achievement definitions
    const achievementIds = userAchievements.map((a) => a.achievement_id);
    const { data: definitions } = await supabase
      .from("achievement_definitions")
      .select("*")
      .in("id", achievementIds);

    const definitionMap = new Map(definitions?.map((d) => [d.id, d]) || []);

    const achievementsWithDefinitions: UserAchievement[] = userAchievements.map((ua) => ({
      ...ua,
      achievement: definitionMap.get(ua.achievement_id),
    }));

    return { success: true, achievements: achievementsWithDefinitions };
  } catch (error) {
    console.error("Error in getUserAchievements:", error);
    return { success: false, error: "Failed to fetch user achievements" };
  }
}

/**
 * Get achievement stats for a user (unlocked count, total, by category)
 */
export async function getAchievementStats(
  userId: string
): Promise<{
  success: boolean;
  stats?: {
    unlocked: number;
    total: number;
    byCategory: Record<string, { unlocked: number; total: number }>;
    recentUnlocks: UserAchievement[];
  };
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Get all definitions
    const { data: definitions } = await supabase
      .from("achievement_definitions")
      .select("*");

    // Get user's achievements
    const { data: userAchievements } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", userId)
      .order("unlocked_at", { ascending: false });

    const unlockedIds = new Set(userAchievements?.map((a) => a.achievement_id) || []);
    const definitionMap = new Map(definitions?.map((d) => [d.id, d]) || []);

    // Calculate by category
    const byCategory: Record<string, { unlocked: number; total: number }> = {};
    definitions?.forEach((def) => {
      if (!byCategory[def.category]) {
        byCategory[def.category] = { unlocked: 0, total: 0 };
      }
      byCategory[def.category].total++;
      if (unlockedIds.has(def.id)) {
        byCategory[def.category].unlocked++;
      }
    });

    // Get recent unlocks with definitions
    const recentUnlocks: UserAchievement[] = (userAchievements?.slice(0, 5) || []).map((ua) => ({
      ...ua,
      achievement: definitionMap.get(ua.achievement_id),
    }));

    return {
      success: true,
      stats: {
        unlocked: unlockedIds.size,
        total: definitions?.length || 0,
        byCategory,
        recentUnlocks,
      },
    };
  } catch (error) {
    console.error("Error in getAchievementStats:", error);
    return { success: false, error: "Failed to fetch achievement stats" };
  }
}

/**
 * Award an achievement to a user
 */
export async function awardAchievement(
  userId: string,
  achievementId: string,
  metadata?: Record<string, any>
): Promise<{ success: boolean; alreadyUnlocked?: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Check if already unlocked
    const { data: existing } = await supabase
      .from("user_achievements")
      .select("id")
      .eq("user_id", userId)
      .eq("achievement_id", achievementId)
      .single();

    if (existing) {
      return { success: true, alreadyUnlocked: true };
    }

    // Get achievement definition for notification
    const { data: definition } = await supabase
      .from("achievement_definitions")
      .select("*")
      .eq("id", achievementId)
      .single();

    if (!definition) {
      return { success: false, error: "Achievement not found" };
    }

    // Award the achievement
    const { error } = await supabase.from("user_achievements").insert({
      user_id: userId,
      achievement_id: achievementId,
      metadata: metadata || {},
    });

    if (error) {
      console.error("Error awarding achievement:", error);
      return { success: false, error: error.message };
    }

    // Create notification
    await createNotification(
      userId,
      "achievement",
      "Achievement Unlocked!",
      `You earned "${definition.name}" - ${definition.description}`,
      { achievement_id: achievementId, tier: definition.tier }
    );

    // Create activity feed entry (don't await)
    createActivityForUser(
      userId,
      "achievement_unlocked",
      {
        achievement_id: achievementId,
        achievement_name: definition.name,
        achievement_tier: definition.tier,
      }
    ).catch(console.error);

    return { success: true };
  } catch (error) {
    console.error("Error in awardAchievement:", error);
    return { success: false, error: "Failed to award achievement" };
  }
}

/**
 * Update progress toward a milestone achievement
 */
export async function updateAchievementProgress(
  userId: string,
  achievementId: string,
  newProgress: number
): Promise<{ success: boolean; unlocked?: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Get achievement definition to check threshold
    const { data: definition } = await supabase
      .from("achievement_definitions")
      .select("*")
      .eq("id", achievementId)
      .single();

    if (!definition) {
      return { success: false, error: "Achievement not found" };
    }

    // Check if already unlocked
    const { data: existing } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", userId)
      .eq("achievement_id", achievementId)
      .single();

    if (existing && existing.unlocked_at) {
      // Already unlocked, nothing to do
      return { success: true, unlocked: true };
    }

    // Check if threshold met
    const thresholdMet = definition.threshold && newProgress >= definition.threshold;

    if (thresholdMet) {
      // Award the achievement
      return awardAchievement(userId, achievementId, { final_progress: newProgress });
    }

    // Just update progress (upsert)
    const { error } = await supabase
      .from("user_achievements")
      .upsert({
        user_id: userId,
        achievement_id: achievementId,
        progress: newProgress,
        unlocked_at: null,
      }, {
        onConflict: "user_id,achievement_id",
      });

    if (error) {
      console.error("Error updating achievement progress:", error);
      return { success: false, error: error.message };
    }

    return { success: true, unlocked: false };
  } catch (error) {
    console.error("Error in updateAchievementProgress:", error);
    return { success: false, error: "Failed to update achievement progress" };
  }
}

/**
 * Check and award follower-related achievements
 */
export async function checkFollowerAchievements(
  userId: string,
  followerCount: number
): Promise<void> {
  const milestones = [
    { count: 1, id: "first_follower" },
    { count: 10, id: "followers_10" },
    { count: 50, id: "followers_50" },
    { count: 100, id: "followers_100" },
  ];

  for (const milestone of milestones) {
    if (followerCount >= milestone.count) {
      await awardAchievement(userId, milestone.id);
    }
  }
}

/**
 * Check and award comment-related achievements
 * If commentCount is not provided, it will be fetched from the database
 */
export async function checkCommentAchievements(
  userId: string,
  commentCount?: number,
  isFirstOnMedia?: boolean
): Promise<void> {
  // If no count provided, fetch it from database
  let count = commentCount;
  if (count === undefined) {
    const supabase = await createClient();
    const commentTables = ["movie_comments", "series_comments", "season_comments", "episode_comments"];
    let totalComments = 0;

    for (const table of commentTables) {
      const { count: tableCount } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);
      totalComments += tableCount || 0;
    }
    count = totalComments;
  }

  const milestones = [
    { count: 1, id: "first_comment" },
    { count: 10, id: "comments_10" },
    { count: 50, id: "comments_50" },
    { count: 100, id: "comments_100" },
  ];

  for (const milestone of milestones) {
    if (count >= milestone.count) {
      await awardAchievement(userId, milestone.id);
    }
  }

  if (isFirstOnMedia) {
    await awardAchievement(userId, "first_responder");
  }
}

/**
 * Check and award watching-related achievements (TV shows only)
 */
export async function checkWatchingAchievements(
  userId: string,
  stats?: {
    showCount?: number;
    episodeCount?: number;
  }
): Promise<void> {
  const supabase = await createClient();

  // If stats not provided, fetch them
  let showCount = stats?.showCount;
  let episodeCount = stats?.episodeCount;

  if (showCount === undefined || episodeCount === undefined) {
    const counts = await getWatchingCounts(userId);
    showCount = showCount ?? counts.showCount;
    episodeCount = episodeCount ?? counts.episodeCount;
  }

  // Show milestones
  const showMilestones = [
    { count: 1, id: "first_show" },
    { count: 10, id: "watched_10_shows" },
    { count: 50, id: "watched_50_shows" },
    { count: 100, id: "watched_100_shows" },
    { count: 250, id: "watched_250_shows" },
  ];

  for (const milestone of showMilestones) {
    if (showCount >= milestone.count) {
      // Check if already has this achievement before awarding
      if (!(await hasAchievement(supabase, userId, milestone.id))) {
        await awardAchievement(userId, milestone.id);
      }
    }
  }

  // Episode milestones
  const episodeMilestones = [
    { count: 1, id: "first_episode" },
    { count: 100, id: "watched_100_episodes" },
    { count: 500, id: "watched_500_episodes" },
    { count: 1000, id: "watched_1000_episodes" },
    { count: 5000, id: "watched_5000_episodes" },
  ];

  for (const milestone of episodeMilestones) {
    if (episodeCount >= milestone.count) {
      if (!(await hasAchievement(supabase, userId, milestone.id))) {
        await awardAchievement(userId, milestone.id);
      }
    }
  }
}

/**
 * Get watching counts for a user from the database
 */
async function getWatchingCounts(userId: string): Promise<{
  showCount: number;
  episodeCount: number;
}> {
  const supabase = await createClient();

  // Count total episodes watched
  const { count: episodeCount } = await supabase
    .from("episode_watches")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Count distinct shows watched
  const { data: shows } = await supabase
    .from("episode_watches")
    .select("series_id")
    .eq("user_id", userId);

  const uniqueShows = new Set(shows?.map((s) => s.series_id) || []);

  return {
    showCount: uniqueShows.size,
    episodeCount: episodeCount || 0,
  };
}

/**
 * Get social counts for a user from the database
 */
async function getSocialCounts(userId: string): Promise<{
  followerCount: number;
  followingCount: number;
  hasMutual: boolean;
}> {
  const supabase = await createClient();

  // Count followers
  const { count: followerCount } = await supabase
    .from("user_follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", userId);

  // Count following
  const { count: followingCount } = await supabase
    .from("user_follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", userId);

  // Check for any mutual follows
  const { data: following } = await supabase
    .from("user_follows")
    .select("following_id")
    .eq("follower_id", userId);

  const followingIds = following?.map((f) => f.following_id) || [];

  let hasMutual = false;
  if (followingIds.length > 0) {
    const { data: mutuals } = await supabase
      .from("user_follows")
      .select("follower_id")
      .eq("following_id", userId)
      .in("follower_id", followingIds)
      .limit(1);

    hasMutual = (mutuals?.length || 0) > 0;
  }

  return {
    followerCount: followerCount || 0,
    followingCount: followingCount || 0,
    hasMutual,
  };
}

/**
 * Get engagement counts for a user from the database
 */
async function getEngagementCounts(userId: string): Promise<{
  commentCount: number;
  reactionsReceived: number;
  collectionCount: number;
  hasPublicCollection: boolean;
}> {
  const supabase = await createClient();

  // Count comments across all media types
  const commentTables = ["movie_comments", "series_comments", "season_comments", "episode_comments"];
  let totalComments = 0;

  for (const table of commentTables) {
    const { count } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    totalComments += count || 0;
  }

  // Count reactions received on comments (we'd need to join, simplified here)
  // This is a simplified version - in production you might want to optimize this
  let totalReactions = 0;
  for (const table of commentTables) {
    const { data: comments } = await supabase
      .from(table)
      .select("id")
      .eq("user_id", userId);

    if (comments && comments.length > 0) {
      const commentIds = comments.map((c) => c.id);
      const { count } = await supabase
        .from("comment_reactions")
        .select("*", { count: "exact", head: true })
        .in("comment_id", commentIds);
      totalReactions += count || 0;
    }
  }

  // Count collections
  const { count: collectionCount } = await supabase
    .from("collections")
    .select("*", { count: "exact", head: true })
    .eq("owner", userId);

  // Check for public collections
  const { data: publicCollections } = await supabase
    .from("collections")
    .select("id")
    .eq("owner", userId)
    .eq("is_public", true)
    .limit(1);

  return {
    commentCount: totalComments,
    reactionsReceived: totalReactions,
    collectionCount: collectionCount || 0,
    hasPublicCollection: (publicCollections?.length || 0) > 0,
  };
}

/**
 * Get rewatch counts for a user from the database
 */
async function getRewatchCounts(userId: string): Promise<{
  totalRewatches: number;
  maxSeriesRewatches: number;
}> {
  const supabase = await createClient();

  // Count total rewatches (cycles > 1)
  const { count: totalRewatches } = await supabase
    .from("watch_cycles")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gt("cycle_number", 1);

  // Find the max cycle_number for any series (to check dedicated fan achievements)
  const { data: maxCycleData } = await supabase
    .from("watch_cycles")
    .select("cycle_number")
    .eq("user_id", userId)
    .order("cycle_number", { ascending: false })
    .limit(1)
    .single();

  // maxSeriesRewatches is cycle_number - 1 (since cycle 1 is first watch)
  const maxSeriesRewatches = maxCycleData ? maxCycleData.cycle_number - 1 : 0;

  return {
    totalRewatches: totalRewatches || 0,
    maxSeriesRewatches,
  };
}

/**
 * Get completion counts for a user (completed series)
 */
async function getCompletionCounts(userId: string): Promise<{
  completedSeries: number;
  hasLongSeries: boolean;
  hasEpicSeries: boolean;
  hasSpeedDemon: boolean;
  hasSlowBurn: boolean;
}> {
  const supabase = await createClient();

  // Count completed series
  const { count: completedSeries } = await supabase
    .from("watch_cycles")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "completed");

  // Check for long series (100+ episodes) completion
  const { data: longSeriesData } = await supabase
    .from("watch_cycles")
    .select("total_episodes")
    .eq("user_id", userId)
    .eq("status", "completed")
    .gte("total_episodes", 100)
    .limit(1);

  // Check for epic series (200+ episodes) completion
  const { data: epicSeriesData } = await supabase
    .from("watch_cycles")
    .select("total_episodes")
    .eq("user_id", userId)
    .eq("status", "completed")
    .gte("total_episodes", 200)
    .limit(1);

  // Check for speed demon (completed within 7 days)
  const { data: speedDemonData } = await supabase
    .from("watch_cycles")
    .select("started_at, completed_at")
    .eq("user_id", userId)
    .eq("status", "completed")
    .not("completed_at", "is", null)
    .limit(100);

  const hasSpeedDemon = speedDemonData?.some((cycle) => {
    if (!cycle.started_at || !cycle.completed_at) return false;
    const start = new Date(cycle.started_at);
    const end = new Date(cycle.completed_at);
    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  }) || false;

  // Check for slow burn (6+ months to complete)
  const hasSlowBurn = speedDemonData?.some((cycle) => {
    if (!cycle.started_at || !cycle.completed_at) return false;
    const start = new Date(cycle.started_at);
    const end = new Date(cycle.completed_at);
    const diffMonths = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return diffMonths >= 6;
  }) || false;

  return {
    completedSeries: completedSeries || 0,
    hasLongSeries: (longSeriesData?.length || 0) > 0,
    hasEpicSeries: (epicSeriesData?.length || 0) > 0,
    hasSpeedDemon,
    hasSlowBurn,
  };
}

/**
 * Get binge and streak stats for a user
 */
async function getBingeAndStreakStats(userId: string): Promise<{
  maxDailyEpisodes: number;
  longestStreak: number;
  currentStreak: number;
  hasSeasonInDay: boolean;
}> {
  const supabase = await createClient();

  // Get max daily episodes using RPC function
  const { data: maxDaily } = await supabase.rpc("get_user_max_daily_episodes", {
    p_user_id: userId,
  });

  // Get longest streak using RPC function
  const { data: longestStreak } = await supabase.rpc("get_user_longest_streak", {
    p_user_id: userId,
  });

  // Get current streak using RPC function
  const { data: currentStreak } = await supabase.rpc("get_user_current_streak", {
    p_user_id: userId,
  });

  // Check if user has completed a season in a single day
  // This requires checking if all episodes of any season were watched on the same day
  const { data: dailyWatches } = await supabase
    .from("episode_watches")
    .select("episode_id, watched_at, series_id")
    .eq("user_id", userId);

  let hasSeasonInDay = false;
  if (dailyWatches && dailyWatches.length > 0) {
    // Group by date and series
    const byDateAndSeries = new Map<string, Set<string>>();
    for (const watch of dailyWatches) {
      const date = new Date(watch.watched_at).toISOString().split("T")[0];
      const key = `${date}:${watch.series_id}`;
      if (!byDateAndSeries.has(key)) {
        byDateAndSeries.set(key, new Set());
      }
      byDateAndSeries.get(key)!.add(watch.episode_id);
    }

    // Check if any date+series combo has 8+ episodes (rough proxy for a season)
    for (const [, episodes] of byDateAndSeries) {
      if (episodes.size >= 8) {
        hasSeasonInDay = true;
        break;
      }
    }
  }

  return {
    maxDailyEpisodes: maxDaily || 0,
    longestStreak: longestStreak || 0,
    currentStreak: currentStreak || 0,
    hasSeasonInDay,
  };
}

/**
 * Get feedback counts for a user (new schema: is_seen + reaction)
 */
async function getFeedbackCounts(userId: string): Promise<{
  totalFeedback: number;
  lovedCount: number;
  likedCount: number;
  seenCount: number;
  dislikedCount: number;
}> {
  const supabase = await createClient();

  const { data: feedbackStats } = await supabase
    .from("user_media_feedback")
    .select("is_seen, reaction")
    .eq("user_id", userId);

  if (!feedbackStats) {
    return {
      totalFeedback: 0,
      lovedCount: 0,
      likedCount: 0,
      seenCount: 0,
      dislikedCount: 0,
    };
  }

  return {
    totalFeedback: feedbackStats.length,
    lovedCount: feedbackStats.filter((f) => f.reaction === "loved").length,
    likedCount: feedbackStats.filter((f) => f.reaction === "liked").length,
    seenCount: feedbackStats.filter((f) => f.is_seen).length,
    dislikedCount: feedbackStats.filter((f) => f.reaction === "disliked").length,
  };
}

/**
 * Get extended social stats for a user
 */
async function getExtendedSocialStats(userId: string): Promise<{
  followingCount: number;
  mutualCount: number;
  reactionsGiven: number;
  showsTracking: number;
}> {
  const supabase = await createClient();

  // Count following
  const { count: followingCount } = await supabase
    .from("user_follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", userId);

  // Get mutual count using RPC function
  const { data: mutualCount } = await supabase.rpc("get_user_mutual_count", {
    p_user_id: userId,
  });

  // Count reactions given
  const { count: reactionsGiven } = await supabase
    .from("comment_reactions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Count shows currently tracking (in reel_deck with status 'watching')
  const { count: showsTracking } = await supabase
    .from("reel_deck")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("media_type", "tv")
    .eq("status", "watching");

  return {
    followingCount: followingCount || 0,
    mutualCount: mutualCount || 0,
    reactionsGiven: reactionsGiven || 0,
    showsTracking: showsTracking || 0,
  };
}

/**
 * Backfill all achievements for a user based on their current stats
 * Call this when a user visits their achievements page or profile
 */
export async function backfillUserAchievements(userId: string): Promise<{
  success: boolean;
  newAchievements?: string[];
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const newAchievements: string[] = [];

    // Get all current stats in parallel
    const [
      watchingCounts,
      socialCounts,
      engagementCounts,
      rewatchCounts,
      completionCounts,
      bingeAndStreakStats,
      extendedSocialStats,
      feedbackCounts,
    ] = await Promise.all([
      getWatchingCounts(userId),
      getSocialCounts(userId),
      getEngagementCounts(userId),
      getRewatchCounts(userId),
      getCompletionCounts(userId),
      getBingeAndStreakStats(userId),
      getExtendedSocialStats(userId),
      getFeedbackCounts(userId),
    ]);

    // Get user's existing achievements
    const { data: existingAchievements } = await supabase
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", userId);

    const existingSet = new Set(existingAchievements?.map((a) => a.achievement_id) || []);

    // Helper to check and award
    const checkAndAward = async (achievementId: string, condition: boolean) => {
      if (condition && !existingSet.has(achievementId)) {
        const result = await awardAchievement(userId, achievementId);
        if (result.success && !result.alreadyUnlocked) {
          newAchievements.push(achievementId);
        }
      }
    };

    // Watching achievements
    await checkAndAward("first_show", watchingCounts.showCount >= 1);
    await checkAndAward("watched_10_shows", watchingCounts.showCount >= 10);
    await checkAndAward("watched_50_shows", watchingCounts.showCount >= 50);
    await checkAndAward("watched_100_shows", watchingCounts.showCount >= 100);
    await checkAndAward("watched_250_shows", watchingCounts.showCount >= 250);

    await checkAndAward("first_episode", watchingCounts.episodeCount >= 1);
    await checkAndAward("watched_100_episodes", watchingCounts.episodeCount >= 100);
    await checkAndAward("watched_500_episodes", watchingCounts.episodeCount >= 500);
    await checkAndAward("watched_1000_episodes", watchingCounts.episodeCount >= 1000);
    await checkAndAward("watched_5000_episodes", watchingCounts.episodeCount >= 5000);

    // Social achievements
    await checkAndAward("first_follower", socialCounts.followerCount >= 1);
    await checkAndAward("followers_10", socialCounts.followerCount >= 10);
    await checkAndAward("followers_50", socialCounts.followerCount >= 50);
    await checkAndAward("followers_100", socialCounts.followerCount >= 100);

    await checkAndAward("first_follow", socialCounts.followingCount >= 1);
    await checkAndAward("first_mutual", socialCounts.hasMutual);

    // Engagement achievements
    await checkAndAward("first_comment", engagementCounts.commentCount >= 1);
    await checkAndAward("comments_10", engagementCounts.commentCount >= 10);
    await checkAndAward("comments_50", engagementCounts.commentCount >= 50);
    await checkAndAward("comments_100", engagementCounts.commentCount >= 100);

    await checkAndAward("reactions_received_10", engagementCounts.reactionsReceived >= 10);
    await checkAndAward("reactions_received_50", engagementCounts.reactionsReceived >= 50);
    await checkAndAward("reactions_received_100", engagementCounts.reactionsReceived >= 100);

    await checkAndAward("first_collection", engagementCounts.collectionCount >= 1);
    await checkAndAward("collections_5", engagementCounts.collectionCount >= 5);
    await checkAndAward("public_collection", engagementCounts.hasPublicCollection);

    // Rewatch achievements
    await checkAndAward("first_rewatch", rewatchCounts.totalRewatches >= 1);
    await checkAndAward("rewatches_5", rewatchCounts.totalRewatches >= 5);
    await checkAndAward("rewatches_10", rewatchCounts.totalRewatches >= 10);
    await checkAndAward("rewatches_25", rewatchCounts.totalRewatches >= 25);
    await checkAndAward("rewatches_50", rewatchCounts.totalRewatches >= 50);

    await checkAndAward("series_rewatch_3", rewatchCounts.maxSeriesRewatches >= 3);
    await checkAndAward("series_rewatch_5", rewatchCounts.maxSeriesRewatches >= 5);
    await checkAndAward("series_rewatch_10", rewatchCounts.maxSeriesRewatches >= 10);

    // Completion achievements
    await checkAndAward("first_completion", completionCounts.completedSeries >= 1);
    await checkAndAward("completed_10", completionCounts.completedSeries >= 10);
    await checkAndAward("completed_25", completionCounts.completedSeries >= 25);
    await checkAndAward("completed_50", completionCounts.completedSeries >= 50);
    await checkAndAward("completed_100", completionCounts.completedSeries >= 100);

    await checkAndAward("long_series", completionCounts.hasLongSeries);
    await checkAndAward("epic_series", completionCounts.hasEpicSeries);
    await checkAndAward("speed_demon", completionCounts.hasSpeedDemon);
    await checkAndAward("slow_burn", completionCounts.hasSlowBurn);

    // Binge achievements
    await checkAndAward("daily_binge_10", bingeAndStreakStats.maxDailyEpisodes >= 10);
    await checkAndAward("daily_binge_20", bingeAndStreakStats.maxDailyEpisodes >= 20);
    await checkAndAward("season_in_day", bingeAndStreakStats.hasSeasonInDay);

    // Streak achievements
    await checkAndAward("streak_7", bingeAndStreakStats.longestStreak >= 7);
    await checkAndAward("streak_30", bingeAndStreakStats.longestStreak >= 30);
    await checkAndAward("streak_100", bingeAndStreakStats.longestStreak >= 100);

    // Extended social achievements
    await checkAndAward("following_25", extendedSocialStats.followingCount >= 25);
    await checkAndAward("mutuals_5", extendedSocialStats.mutualCount >= 5);
    await checkAndAward("mutuals_10", extendedSocialStats.mutualCount >= 10);
    await checkAndAward("reactions_given_50", extendedSocialStats.reactionsGiven >= 50);
    await checkAndAward("reactions_given_100", extendedSocialStats.reactionsGiven >= 100);
    await checkAndAward("diverse_tracker", extendedSocialStats.showsTracking >= 10);

    // Feedback achievements
    await checkAndAward("first_feedback", feedbackCounts.totalFeedback >= 1);
    await checkAndAward("feedback_10", feedbackCounts.totalFeedback >= 10);
    await checkAndAward("feedback_25", feedbackCounts.totalFeedback >= 25);
    await checkAndAward("feedback_50", feedbackCounts.totalFeedback >= 50);
    await checkAndAward("feedback_100", feedbackCounts.totalFeedback >= 100);
    await checkAndAward("feedback_250", feedbackCounts.totalFeedback >= 250);

    await checkAndAward("first_love", feedbackCounts.lovedCount >= 1);
    await checkAndAward("loved_10", feedbackCounts.lovedCount >= 10);
    await checkAndAward("loved_25", feedbackCounts.lovedCount >= 25);

    await checkAndAward("seen_50", feedbackCounts.seenCount >= 50);
    await checkAndAward("seen_100", feedbackCounts.seenCount >= 100);
    await checkAndAward("seen_250", feedbackCounts.seenCount >= 250);

    const positiveCount = feedbackCounts.likedCount + feedbackCounts.lovedCount;
    await checkAndAward("balanced_critic", positiveCount >= 5 && feedbackCounts.dislikedCount >= 5);

    return { success: true, newAchievements };
  } catch (error) {
    console.error("Error in backfillUserAchievements:", error);
    return { success: false, error: "Failed to backfill achievements" };
  }
}

/**
 * Quick check for specific achievement categories
 * Use these after specific actions to avoid full backfill
 */
export async function checkFollowAchievements(userId: string): Promise<void> {
  const supabase = await createClient();
  const socialCounts = await getSocialCounts(userId);

  // Follower milestones (for the user being followed)
  const followerMilestones = [
    { count: 1, id: "first_follower" },
    { count: 10, id: "followers_10" },
    { count: 50, id: "followers_50" },
    { count: 100, id: "followers_100" },
  ];

  for (const milestone of followerMilestones) {
    if (socialCounts.followerCount >= milestone.count) {
      if (!(await hasAchievement(supabase, userId, milestone.id))) {
        await awardAchievement(userId, milestone.id);
      }
    }
  }
}

export async function checkFollowingAchievements(userId: string): Promise<void> {
  const supabase = await createClient();
  const socialCounts = await getSocialCounts(userId);

  // First follow achievement
  if (socialCounts.followingCount >= 1) {
    if (!(await hasAchievement(supabase, userId, "first_follow"))) {
      await awardAchievement(userId, "first_follow");
    }
  }

  // Mutual achievement
  if (socialCounts.hasMutual) {
    if (!(await hasAchievement(supabase, userId, "first_mutual"))) {
      await awardAchievement(userId, "first_mutual");
    }
  }
}

/**
 * Check and award feedback-related achievements
 * Called when a user gives feedback on a movie or TV show
 */
export async function checkFeedbackAchievements(
  userId: string,
  feedbackType: "seen" | "liked" | "loved" | "disliked"
): Promise<void> {
  const supabase = await createClient();

  // Get feedback counts (new schema: is_seen + reaction)
  const { data: feedbackStats } = await supabase
    .from("user_media_feedback")
    .select("is_seen, reaction")
    .eq("user_id", userId);

  if (!feedbackStats) return;

  const totalFeedback = feedbackStats.length;
  const lovedCount = feedbackStats.filter((f) => f.reaction === "loved").length;
  const seenCount = feedbackStats.filter((f) => f.is_seen).length;
  const likedCount = feedbackStats.filter((f) => f.reaction === "liked").length;
  const dislikedCount = feedbackStats.filter((f) => f.reaction === "disliked").length;

  // Total feedback milestones
  const feedbackMilestones = [
    { count: 1, id: "first_feedback" },
    { count: 10, id: "feedback_10" },
    { count: 25, id: "feedback_25" },
    { count: 50, id: "feedback_50" },
    { count: 100, id: "feedback_100" },
    { count: 250, id: "feedback_250" },
  ];

  for (const milestone of feedbackMilestones) {
    if (totalFeedback >= milestone.count) {
      if (!(await hasAchievement(supabase, userId, milestone.id))) {
        await awardAchievement(userId, milestone.id);
      }
    }
  }

  // Love-specific milestones
  const loveMilestones = [
    { count: 1, id: "first_love" },
    { count: 10, id: "loved_10" },
    { count: 25, id: "loved_25" },
  ];

  for (const milestone of loveMilestones) {
    if (lovedCount >= milestone.count) {
      if (!(await hasAchievement(supabase, userId, milestone.id))) {
        await awardAchievement(userId, milestone.id);
      }
    }
  }

  // Seen milestones
  const seenMilestones = [
    { count: 50, id: "seen_50" },
    { count: 100, id: "seen_100" },
    { count: 250, id: "seen_250" },
  ];

  for (const milestone of seenMilestones) {
    if (seenCount >= milestone.count) {
      if (!(await hasAchievement(supabase, userId, milestone.id))) {
        await awardAchievement(userId, milestone.id);
      }
    }
  }

  // Balanced critic achievement (at least 5 positive and 5 negative)
  const positiveCount = likedCount + lovedCount;
  if (positiveCount >= 5 && dislikedCount >= 5) {
    if (!(await hasAchievement(supabase, userId, "balanced_critic"))) {
      await awardAchievement(userId, "balanced_critic");
    }
  }
}

/**
 * Check and award rewatch-related achievements
 * Called when a user starts a new rewatch cycle
 */
export async function checkRewatchAchievements(
  userId: string,
  seriesId: string,
  newCycleNumber: number
): Promise<void> {
  const supabase = await createClient();

  // Get total rewatch count across all series (cycles > 1 means it's a rewatch)
  const { count: totalRewatches } = await supabase
    .from("watch_cycles")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gt("cycle_number", 1);

  const rewatchCount = totalRewatches || 0;

  // Total rewatch milestones
  const rewatchMilestones = [
    { count: 1, id: "first_rewatch" },
    { count: 5, id: "rewatches_5" },
    { count: 10, id: "rewatches_10" },
    { count: 25, id: "rewatches_25" },
    { count: 50, id: "rewatches_50" },
  ];

  for (const milestone of rewatchMilestones) {
    if (rewatchCount >= milestone.count) {
      if (!(await hasAchievement(supabase, userId, milestone.id))) {
        await awardAchievement(userId, milestone.id);
      }
    }
  }

  // Check dedicated fan achievements (same series rewatched multiple times)
  // newCycleNumber is the cycle they just started, so cycle 2 = 1st rewatch, cycle 3 = 2nd rewatch, etc.
  const seriesRewatchCount = newCycleNumber - 1; // Number of times they've rewatched this series

  const dedicatedFanMilestones = [
    { count: 3, id: "series_rewatch_3" },
    { count: 5, id: "series_rewatch_5" },
    { count: 10, id: "series_rewatch_10" },
  ];

  for (const milestone of dedicatedFanMilestones) {
    if (seriesRewatchCount >= milestone.count) {
      if (!(await hasAchievement(supabase, userId, milestone.id))) {
        // Include series info in metadata
        const { data: series } = await supabase
          .from("series")
          .select("title")
          .eq("id", seriesId)
          .single();

        await awardAchievement(userId, milestone.id, {
          series_id: seriesId,
          series_title: series?.title || "Unknown",
          rewatch_count: seriesRewatchCount,
        });
      }
    }
  }
}
