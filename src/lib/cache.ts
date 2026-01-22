import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// TTL constants in seconds
export const TTL = {
  SHORT: 5 * 60,           // 5 minutes - for frequently changing data
  MEDIUM: 15 * 60,         // 15 minutes - for moderately stable data
  LONG: 30 * 60,           // 30 minutes - for stable data
  HOUR: 60 * 60,           // 1 hour
  DAY: 24 * 60 * 60,       // 24 hours - for rarely changing data
  WEEK: 7 * 24 * 60 * 60,  // 7 days - for static data
};

// Cache key prefixes for organization
export const CACHE_KEYS = {
  // Leaderboards
  LEADERBOARD: "lb",
  LEADERBOARD_STATS: "lb:stats",
  USER_RANK: "user:rank",

  // Achievements
  ACHIEVEMENT_DEFS: "ach:defs",
  USER_ACHIEVEMENT_STATS: "user:ach:stats",
  USER_ACHIEVEMENTS: "user:ach",

  // Public profiles
  USER_PUBLIC_STATS: "user:pub:stats",
  USER_PUBLIC_COLLECTIONS: "user:pub:cols",
  USER_PUBLIC_ACTIVITY: "user:pub:act",
  USER_PUBLIC_ACHIEVEMENTS: "user:pub:ach",

  // Recommendations
  USER_VIEWING_PROFILE: "user:view:profile",
  USER_RECOMMENDATIONS: "user:recs",
  USER_CAN_REQUEST_RECS: "user:recs:can",

  // Activity feed
  USER_ACTIVITY_FEED: "user:feed",
  USER_ACTIVITY: "user:activity",

  // Follows
  USER_FOLLOW_COUNTS: "user:follow:counts",
  USER_FOLLOW_STATUS: "user:follow:status",
};

/**
 * Generate a cache key with consistent formatting
 */
export function cacheKey(...parts: (string | number | undefined | null)[]): string {
  return parts.filter((p) => p !== undefined && p !== null).join(":");
}

/**
 * Get a cached value with automatic JSON parsing
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const value = await redis.get<T>(key);
    return value;
  } catch (error) {
    console.error(`[Cache] Error getting key ${key}:`, error);
    return null;
  }
}

/**
 * Set a cached value with TTL
 */
export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds: number = TTL.MEDIUM
): Promise<boolean> {
  try {
    await redis.set(key, value, { ex: ttlSeconds });
    return true;
  } catch (error) {
    console.error(`[Cache] Error setting key ${key}:`, error);
    return false;
  }
}

/**
 * Delete a cached value
 */
export async function cacheDel(key: string): Promise<boolean> {
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error(`[Cache] Error deleting key ${key}:`, error);
    return false;
  }
}

/**
 * Delete multiple keys matching a pattern
 * Note: Use sparingly as SCAN can be slow on large datasets
 */
export async function cacheDelPattern(pattern: string): Promise<boolean> {
  try {
    let cursor = 0;
    do {
      const result = await redis.scan(cursor, { match: pattern, count: 100 });
      cursor = result[0];
      const keys = result[1];
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== 0);
    return true;
  } catch (error) {
    console.error(`[Cache] Error deleting pattern ${pattern}:`, error);
    return false;
  }
}

/**
 * Get or set pattern - fetches from cache or executes function and caches result
 */
export async function cacheGetOrSet<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = TTL.MEDIUM
): Promise<T> {
  // Try to get from cache first
  const cached = await cacheGet<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const fresh = await fetchFn();

  // Cache the result (don't await - fire and forget)
  cacheSet(key, fresh, ttlSeconds).catch(() => {});

  return fresh;
}

/**
 * Invalidate user-specific caches when user takes an action
 */
export async function invalidateUserCaches(userId: string): Promise<void> {
  const keysToDelete = [
    cacheKey(CACHE_KEYS.USER_ACHIEVEMENT_STATS, userId),
    cacheKey(CACHE_KEYS.USER_PUBLIC_STATS, userId),
    cacheKey(CACHE_KEYS.USER_FOLLOW_COUNTS, userId),
  ];

  try {
    await Promise.all(keysToDelete.map((key) => cacheDel(key)));
  } catch (error) {
    console.error("[Cache] Error invalidating user caches:", error);
  }
}

/**
 * Invalidate leaderboard caches
 */
export async function invalidateLeaderboardCaches(): Promise<void> {
  try {
    await cacheDelPattern(`${CACHE_KEYS.LEADERBOARD}:*`);
    await cacheDel(CACHE_KEYS.LEADERBOARD_STATS);
  } catch (error) {
    console.error("[Cache] Error invalidating leaderboard caches:", error);
  }
}

/**
 * Invalidate achievement caches for a user
 */
export async function invalidateAchievementCaches(userId: string): Promise<void> {
  try {
    await cacheDel(cacheKey(CACHE_KEYS.USER_ACHIEVEMENT_STATS, userId));
    await cacheDel(cacheKey(CACHE_KEYS.USER_ACHIEVEMENTS, userId));
    await cacheDel(cacheKey(CACHE_KEYS.USER_PUBLIC_ACHIEVEMENTS, userId));
  } catch (error) {
    console.error("[Cache] Error invalidating achievement caches:", error);
  }
}

/**
 * Invalidate follow-related caches
 */
export async function invalidateFollowCaches(
  userId: string,
  targetUserId: string
): Promise<void> {
  try {
    await Promise.all([
      cacheDel(cacheKey(CACHE_KEYS.USER_FOLLOW_COUNTS, userId)),
      cacheDel(cacheKey(CACHE_KEYS.USER_FOLLOW_COUNTS, targetUserId)),
      cacheDel(cacheKey(CACHE_KEYS.USER_PUBLIC_STATS, userId)),
      cacheDel(cacheKey(CACHE_KEYS.USER_PUBLIC_STATS, targetUserId)),
      cacheDelPattern(`${CACHE_KEYS.USER_FOLLOW_STATUS}:${userId}:*`),
      cacheDelPattern(`${CACHE_KEYS.USER_FOLLOW_STATUS}:${targetUserId}:*`),
    ]);
  } catch (error) {
    console.error("[Cache] Error invalidating follow caches:", error);
  }
}

/**
 * Invalidate activity feed caches
 */
export async function invalidateActivityCaches(userId: string): Promise<void> {
  try {
    await cacheDelPattern(`${CACHE_KEYS.USER_ACTIVITY_FEED}:${userId}:*`);
    await cacheDelPattern(`${CACHE_KEYS.USER_ACTIVITY}:${userId}:*`);
    await cacheDelPattern(`${CACHE_KEYS.USER_PUBLIC_ACTIVITY}:${userId}:*`);
  } catch (error) {
    console.error("[Cache] Error invalidating activity caches:", error);
  }
}

/**
 * Invalidate recommendations caches
 */
export async function invalidateRecommendationCaches(userId: string): Promise<void> {
  try {
    await cacheDel(cacheKey(CACHE_KEYS.USER_RECOMMENDATIONS, userId));
    await cacheDel(cacheKey(CACHE_KEYS.USER_VIEWING_PROFILE, userId));
    await cacheDel(cacheKey(CACHE_KEYS.USER_CAN_REQUEST_RECS, userId));
  } catch (error) {
    console.error("[Cache] Error invalidating recommendation caches:", error);
  }
}
