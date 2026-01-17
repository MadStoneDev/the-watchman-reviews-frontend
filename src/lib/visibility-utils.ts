import { createClient } from "@/src/utils/supabase/server";
import { VisibilityLevel } from "@/src/lib/types";

export interface VisibilityCheckResult {
  canView: boolean;
  reason?: string;
}

export interface UserVisibilitySettings {
  show_collections_to: VisibilityLevel;
  show_watch_progress_to: VisibilityLevel;
  default_collection_privacy: "public" | "private";
}

/**
 * Get a user's visibility settings from their profile
 */
export async function getUserVisibilitySettings(
  userId: string
): Promise<UserVisibilitySettings | null> {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("settings")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    return null;
  }

  return {
    show_collections_to: profile.settings?.show_collections_to || "everyone",
    show_watch_progress_to: profile.settings?.show_watch_progress_to || "everyone",
    default_collection_privacy: profile.settings?.default_collection_privacy || "private",
  };
}

/**
 * Check if viewer can see content based on visibility level
 * @param contentOwnerId - The ID of the user who owns the content
 * @param viewerId - The ID of the user trying to view (null if logged out)
 * @param visibilityLevel - The visibility setting
 */
export async function checkVisibility(
  contentOwnerId: string,
  viewerId: string | null,
  visibilityLevel: VisibilityLevel
): Promise<VisibilityCheckResult> {
  // Owner can always view their own content
  if (viewerId && contentOwnerId === viewerId) {
    return { canView: true };
  }

  // "everyone" - anyone can view
  if (visibilityLevel === "everyone") {
    return { canView: true };
  }

  // "nobody" - only owner can view
  if (visibilityLevel === "nobody") {
    return { canView: false, reason: "Content is private" };
  }

  // For "followers" and "mutuals", viewer must be logged in
  if (!viewerId) {
    return { canView: false, reason: "You must be logged in to view this content" };
  }

  const supabase = await createClient();

  // Check if viewer follows the content owner
  const { data: viewerFollowsOwner } = await supabase
    .from("user_follows")
    .select("id")
    .eq("follower_id", viewerId)
    .eq("following_id", contentOwnerId)
    .single();

  const isFollowing = !!viewerFollowsOwner;

  // "followers" - viewer must follow the owner
  if (visibilityLevel === "followers") {
    if (isFollowing) {
      return { canView: true };
    }
    return { canView: false, reason: "Only followers can view this content" };
  }

  // "mutuals" - must be mutual followers
  if (visibilityLevel === "mutuals") {
    // Check if owner follows viewer back
    const { data: ownerFollowsViewer } = await supabase
      .from("user_follows")
      .select("id")
      .eq("follower_id", contentOwnerId)
      .eq("following_id", viewerId)
      .single();

    const isMutual = isFollowing && !!ownerFollowsViewer;

    if (isMutual) {
      return { canView: true };
    }
    return { canView: false, reason: "Only mutual followers can view this content" };
  }

  return { canView: false, reason: "Unknown visibility level" };
}

/**
 * Batch check visibility for multiple content owners
 * More efficient than checking one by one when filtering activity feeds
 * @param ownerIds - Array of content owner IDs to check
 * @param viewerId - The ID of the user trying to view (null if logged out)
 * @param settingKey - Which visibility setting to check
 */
export async function batchCheckVisibility(
  ownerIds: string[],
  viewerId: string | null,
  settingKey: "show_collections_to" | "show_watch_progress_to"
): Promise<Map<string, boolean>> {
  const result = new Map<string, boolean>();

  if (ownerIds.length === 0) {
    return result;
  }

  const supabase = await createClient();

  // Fetch settings for all owners at once
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, settings")
    .in("id", ownerIds);

  if (error || !profiles) {
    // Default to not visible on error
    ownerIds.forEach((id) => result.set(id, false));
    return result;
  }

  // Build a map of owner settings
  const settingsMap = new Map<string, VisibilityLevel>();
  profiles.forEach((profile) => {
    const visibility = profile.settings?.[settingKey] || "everyone";
    settingsMap.set(profile.id, visibility);
  });

  // If viewer is logged out, only "everyone" visibility is allowed
  if (!viewerId) {
    ownerIds.forEach((id) => {
      const visibility = settingsMap.get(id) || "everyone";
      result.set(id, visibility === "everyone");
    });
    return result;
  }

  // Get the viewer's follow relationships
  const { data: viewerFollows } = await supabase
    .from("user_follows")
    .select("following_id")
    .eq("follower_id", viewerId)
    .in("following_id", ownerIds);

  const followingSet = new Set(viewerFollows?.map((f) => f.following_id) || []);

  // Get owners who follow the viewer back (for mutual check)
  const { data: ownersFollowViewer } = await supabase
    .from("user_follows")
    .select("follower_id")
    .in("follower_id", ownerIds)
    .eq("following_id", viewerId);

  const followedBySet = new Set(ownersFollowViewer?.map((f) => f.follower_id) || []);

  // Check each owner
  ownerIds.forEach((ownerId) => {
    // Owner can always see their own content
    if (ownerId === viewerId) {
      result.set(ownerId, true);
      return;
    }

    const visibility = settingsMap.get(ownerId) || "everyone";

    switch (visibility) {
      case "everyone":
        result.set(ownerId, true);
        break;
      case "nobody":
        result.set(ownerId, false);
        break;
      case "followers":
        result.set(ownerId, followingSet.has(ownerId));
        break;
      case "mutuals":
        result.set(ownerId, followingSet.has(ownerId) && followedBySet.has(ownerId));
        break;
      default:
        result.set(ownerId, false);
    }
  });

  return result;
}
