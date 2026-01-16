"use server";

import { createClient } from "@/src/utils/supabase/server";
import { createNotification } from "./notifications";

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
 */
export async function checkCommentAchievements(
  userId: string,
  commentCount: number,
  isFirstOnMedia?: boolean
): Promise<void> {
  const milestones = [
    { count: 1, id: "first_comment" },
    { count: 10, id: "comments_10" },
    { count: 50, id: "comments_50" },
    { count: 100, id: "comments_100" },
  ];

  for (const milestone of milestones) {
    if (commentCount >= milestone.count) {
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
    const [watchingCounts, socialCounts, engagementCounts] = await Promise.all([
      getWatchingCounts(userId),
      getSocialCounts(userId),
      getEngagementCounts(userId),
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
