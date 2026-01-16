"use server";

import { createClient } from "@/src/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { FollowStatus, FollowCounts, UserListProfile } from "@/src/lib/types";
import { checkFollowAchievements, checkFollowingAchievements } from "./achievements";

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

    // Check if current user follows target
    const { data: following } = await supabase
      .from("user_follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("following_id", targetUserId)
      .single();

    // Check if target follows current user
    const { data: followedBy } = await supabase
      .from("user_follows")
      .select("id")
      .eq("follower_id", targetUserId)
      .eq("following_id", user.id)
      .single();

    const isFollowing = !!following;
    const isFollowedBy = !!followedBy;

    return {
      success: true,
      status: {
        isFollowing,
        isFollowedBy,
        isMutual: isFollowing && isFollowedBy,
      },
    };
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
    const supabase = await createClient();

    // Count followers
    const { count: followerCount, error: followerError } = await supabase
      .from("user_follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", userId);

    if (followerError) {
      console.error("Error counting followers:", followerError);
      return { success: false, error: followerError.message };
    }

    // Count following
    const { count: followingCount, error: followingError } = await supabase
      .from("user_follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", userId);

    if (followingError) {
      console.error("Error counting following:", followingError);
      return { success: false, error: followingError.message };
    }

    return {
      success: true,
      counts: {
        followers: followerCount || 0,
        following: followingCount || 0,
      },
    };
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
      .filter((u): u is UserListProfile => u !== null);

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
      .filter((u): u is UserListProfile => u !== null);

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
