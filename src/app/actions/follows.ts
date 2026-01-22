"use server";

import { createClient } from "@/src/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { FollowStatus, FollowCounts, UserListProfile } from "@/src/lib/types";
import { checkFollowAchievements, checkFollowingAchievements } from "./achievements";
import {
  sendFollowerEmailNotification,
  sendMutualEmailNotification,
} from "./email-notifications";
import {
  cacheKey,
  cacheGet,
  cacheSet,
  CACHE_KEYS,
  TTL,
  invalidateFollowCaches,
} from "@/src/lib/cache";

/**
 * Follow a user
 */
export async function followUser(
  targetUserId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in to follow users" };
    }

    if (user.id === targetUserId) {
      return { success: false, error: "You cannot follow yourself" };
    }

    // Check if already following
    const { data: existingFollow } = await supabase
      .from("user_follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("following_id", targetUserId)
      .single();

    if (existingFollow) {
      return { success: false, error: "Already following this user" };
    }

    // Check if blocked
    const { data: blocked } = await supabase
      .from("user_blocks")
      .select("id")
      .or(`blocker_id.eq.${targetUserId},blocked_id.eq.${targetUserId}`)
      .or(`blocker_id.eq.${user.id},blocked_id.eq.${user.id}`)
      .single();

    if (blocked) {
      return { success: false, error: "Cannot follow this user" };
    }

    // Create follow
    const { error } = await supabase.from("user_follows").insert({
      follower_id: user.id,
      following_id: targetUserId,
    });

    if (error) {
      console.error("Error following user:", error);
      return { success: false, error: error.message };
    }

    // Check achievements for both users (don't await to avoid slowing down the response)
    // The user who followed gets "first_follow" and potentially "first_mutual"
    checkFollowingAchievements(user.id).catch(console.error);
    // The user being followed gets "first_follower" etc.
    checkFollowAchievements(targetUserId).catch(console.error);

    // Send email notification to the person being followed
    sendFollowerEmailNotification(targetUserId, user.id).catch(console.error);

    // Check if this creates a mutual follow (target already follows the current user)
    const { data: reverseFollow } = await supabase
      .from("user_follows")
      .select("id")
      .eq("follower_id", targetUserId)
      .eq("following_id", user.id)
      .single();

    if (reverseFollow) {
      // Now mutuals! Send email to both users
      sendMutualEmailNotification(user.id, targetUserId).catch(console.error);
      sendMutualEmailNotification(targetUserId, user.id).catch(console.error);
    }

    // Invalidate follow-related caches for both users
    invalidateFollowCaches(user.id, targetUserId).catch(console.error);

    return { success: true };
  } catch (error) {
    console.error("Error in followUser:", error);
    return { success: false, error: "Failed to follow user" };
  }
}

/**
 * Unfollow a user
 */
export async function unfollowUser(
  targetUserId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in to unfollow users" };
    }

    const { error } = await supabase
      .from("user_follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", targetUserId);

    if (error) {
      console.error("Error unfollowing user:", error);
      return { success: false, error: error.message };
    }

    // Invalidate follow-related caches for both users
    invalidateFollowCaches(user.id, targetUserId).catch(console.error);

    return { success: true };
  } catch (error) {
    console.error("Error in unfollowUser:", error);
    return { success: false, error: "Failed to unfollow user" };
  }
}

/**
 * Check follow status between current user and target user
 */
export async function checkFollowStatus(
  targetUserId: string
): Promise<{ success: boolean; status?: FollowStatus; error?: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: true,
        status: { isFollowing: false, isFollowedBy: false, isMutual: false },
      };
    }

    // Try cache first
    const statusCacheKey = cacheKey(CACHE_KEYS.USER_FOLLOW_STATUS, user.id, targetUserId);
    const cached = await cacheGet<FollowStatus>(statusCacheKey);
    if (cached) {
      return { success: true, status: cached };
    }

    // Check both directions in parallel
    const [followingResult, followedByResult] = await Promise.all([
      supabase
        .from("user_follows")
        .select("id")
        .eq("follower_id", user.id)
        .eq("following_id", targetUserId)
        .single(),
      supabase
        .from("user_follows")
        .select("id")
        .eq("follower_id", targetUserId)
        .eq("following_id", user.id)
        .single(),
    ]);

    const isFollowing = !!followingResult.data;
    const isFollowedBy = !!followedByResult.data;

    const status: FollowStatus = {
      isFollowing,
      isFollowedBy,
      isMutual: isFollowing && isFollowedBy,
    };

    // Cache for 15 minutes
    cacheSet(statusCacheKey, status, TTL.MEDIUM).catch(() => {});

    return { success: true, status };
  } catch (error) {
    console.error("Error in checkFollowStatus:", error);
    return { success: false, error: "Failed to check follow status" };
  }
}

/**
 * Get follow counts for a user
 */
export async function getFollowCounts(
  userId: string
): Promise<{ success: boolean; counts?: FollowCounts; error?: string }> {
  try {
    // Try cache first
    const countsCacheKey = cacheKey(CACHE_KEYS.USER_FOLLOW_COUNTS, userId);
    const cached = await cacheGet<FollowCounts>(countsCacheKey);
    if (cached) {
      return { success: true, counts: cached };
    }

    const supabase = await createClient();

    // Count both in parallel
    const [followersResult, followingResult] = await Promise.all([
      supabase
        .from("user_follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", userId),
      supabase
        .from("user_follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", userId),
    ]);

    if (followersResult.error) {
      console.error("Error counting followers:", followersResult.error);
      return { success: false, error: followersResult.error.message };
    }

    if (followingResult.error) {
      console.error("Error counting following:", followingResult.error);
      return { success: false, error: followingResult.error.message };
    }

    const counts: FollowCounts = {
      followers: followersResult.count || 0,
      following: followingResult.count || 0,
    };

    // Cache for 15 minutes
    cacheSet(countsCacheKey, counts, TTL.MEDIUM).catch(() => {});

    return { success: true, counts };
  } catch (error) {
    console.error("Error in getFollowCounts:", error);
    return { success: false, error: "Failed to get follow counts" };
  }
}

/**
 * Get paginated list of followers for a user
 */
export async function getFollowers(
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<{
  success: boolean;
  users?: UserListProfile[];
  total?: number;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    const offset = (page - 1) * limit;

    // Get total count
    const { count: total } = await supabase
      .from("user_follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", userId);

    // Get followers with profile data
    const { data: follows, error } = await supabase
      .from("user_follows")
      .select("follower_id, created_at")
      .eq("following_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching followers:", error);
      return { success: false, error: error.message };
    }

    if (!follows || follows.length === 0) {
      return { success: true, users: [], total: 0 };
    }

    // Get profile data for followers
    const followerIds = follows.map((f) => f.follower_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, avatar_path")
      .in("id", followerIds);

    // Get follow status for each user (if logged in)
    let followStatuses: Record<string, FollowStatus> = {};
    if (currentUser) {
      // Check which of these users the current user follows
      const { data: currentUserFollows } = await supabase
        .from("user_follows")
        .select("following_id")
        .eq("follower_id", currentUser.id)
        .in("following_id", followerIds);

      // Check which of these users follow the current user
      const { data: followsCurrentUser } = await supabase
        .from("user_follows")
        .select("follower_id")
        .eq("following_id", currentUser.id)
        .in("follower_id", followerIds);

      const followingSet = new Set(currentUserFollows?.map((f) => f.following_id) || []);
      const followedBySet = new Set(followsCurrentUser?.map((f) => f.follower_id) || []);

      followerIds.forEach((id) => {
        const isFollowing = followingSet.has(id);
        const isFollowedBy = followedBySet.has(id);
        followStatuses[id] = {
          isFollowing,
          isFollowedBy,
          isMutual: isFollowing && isFollowedBy,
        };
      });
    }

    // Map to UserListProfile
    const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
    const users: UserListProfile[] = follows
      .map((f) => {
        const profile = profileMap.get(f.follower_id);
        if (!profile) return null;
        return {
          id: profile.id,
          username: profile.username,
          avatar_path: profile.avatar_path,
          followStatus: followStatuses[profile.id],
        };
      })
      .filter((u): u is any => u !== null);
    // TODO: Check if u is any is fine here

    return { success: true, users, total: total || 0 };
  } catch (error) {
    console.error("Error in getFollowers:", error);
    return { success: false, error: "Failed to get followers" };
  }
}

/**
 * Get paginated list of users that a user is following
 */
export async function getFollowing(
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<{
  success: boolean;
  users?: UserListProfile[];
  total?: number;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    const offset = (page - 1) * limit;

    // Get total count
    const { count: total } = await supabase
      .from("user_follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", userId);

    // Get following with profile data
    const { data: follows, error } = await supabase
      .from("user_follows")
      .select("following_id, created_at")
      .eq("follower_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching following:", error);
      return { success: false, error: error.message };
    }

    if (!follows || follows.length === 0) {
      return { success: true, users: [], total: 0 };
    }

    // Get profile data for following
    const followingIds = follows.map((f) => f.following_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, avatar_path")
      .in("id", followingIds);

    // Get follow status for each user (if logged in)
    let followStatuses: Record<string, FollowStatus> = {};
    if (currentUser) {
      // Check which of these users the current user follows
      const { data: currentUserFollows } = await supabase
        .from("user_follows")
        .select("following_id")
        .eq("follower_id", currentUser.id)
        .in("following_id", followingIds);

      // Check which of these users follow the current user
      const { data: followsCurrentUser } = await supabase
        .from("user_follows")
        .select("follower_id")
        .eq("following_id", currentUser.id)
        .in("follower_id", followingIds);

      const followingSet = new Set(currentUserFollows?.map((f) => f.following_id) || []);
      const followedBySet = new Set(followsCurrentUser?.map((f) => f.follower_id) || []);

      followingIds.forEach((id) => {
        const isFollowing = followingSet.has(id);
        const isFollowedBy = followedBySet.has(id);
        followStatuses[id] = {
          isFollowing,
          isFollowedBy,
          isMutual: isFollowing && isFollowedBy,
        };
      });
    }

    // Map to UserListProfile
    const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
    const users: UserListProfile[] = follows
      .map((f) => {
        const profile = profileMap.get(f.following_id);
        if (!profile) return null;
        return {
          id: profile.id,
          username: profile.username,
          avatar_path: profile.avatar_path,
          followStatus: followStatuses[profile.id],
        };
      })
      .filter((u): u is any => u !== null);
    // TODO: Check if u is any is fine here

    return { success: true, users, total: total || 0 };
  } catch (error) {
    console.error("Error in getFollowing:", error);
    return { success: false, error: "Failed to get following" };
  }
}

/**
 * Block a user
 */
export async function blockUser(
  targetUserId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in to block users" };
    }

    if (user.id === targetUserId) {
      return { success: false, error: "You cannot block yourself" };
    }

    // Remove any existing follows in both directions
    await supabase
      .from("user_follows")
      .delete()
      .or(`follower_id.eq.${user.id},following_id.eq.${user.id}`)
      .or(`follower_id.eq.${targetUserId},following_id.eq.${targetUserId}`);

    // Create block
    const { error } = await supabase.from("user_blocks").insert({
      blocker_id: user.id,
      blocked_id: targetUserId,
    });

    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "User already blocked" };
      }
      console.error("Error blocking user:", error);
      return { success: false, error: error.message };
    }

    // Invalidate follow-related caches for both users (since follows were removed)
    invalidateFollowCaches(user.id, targetUserId).catch(console.error);

    return { success: true };
  } catch (error) {
    console.error("Error in blockUser:", error);
    return { success: false, error: "Failed to block user" };
  }
}

/**
 * Unblock a user
 */
export async function unblockUser(
  targetUserId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in to unblock users" };
    }

    const { error } = await supabase
      .from("user_blocks")
      .delete()
      .eq("blocker_id", user.id)
      .eq("blocked_id", targetUserId);

    if (error) {
      console.error("Error unblocking user:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in unblockUser:", error);
    return { success: false, error: "Failed to unblock user" };
  }
}
