"use server";

import { createClient } from "@/src/utils/supabase/server";
import { createAdminClient } from "@/src/utils/supabase/admin";
import { sendEmail } from "@/src/lib/email";
import { newFollowerEmail } from "@/src/emails/new-follower";
import { newMutualEmail } from "@/src/emails/new-mutual";
import { newMessageEmail } from "@/src/emails/new-message";
import { achievementUnlockedEmail } from "@/src/emails/achievement-unlocked";
import { weeklyDigestEmail } from "@/src/emails/weekly-digest";
import { getTrendingMovies, getTrendingSeries } from "@/src/lib/trending";

// Rate limiting: 1 hour between message emails
const MESSAGE_EMAIL_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

interface NotificationSettings {
  email_new_followers?: boolean;
  email_new_mutuals?: boolean;
  email_messages?: boolean;
  email_achievements?: boolean;
  email_weekly_digest?: boolean;
  last_message_email_at?: string;
}

/**
 * Get user's email address using admin client
 */
async function getUserEmail(userId: string): Promise<string | null> {
  try {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient.auth.admin.getUserById(userId);

    if (error || !data.user) {
      console.error("[EmailNotifications] Error getting user email:", error);
      return null;
    }

    return data.user.email || null;
  } catch (error) {
    console.error("[EmailNotifications] Error getting user email:", error);
    return null;
  }
}

/**
 * Get user's notification settings
 */
async function getUserSettings(userId: string): Promise<NotificationSettings | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("settings")
      .eq("id", userId)
      .single();

    if (error || !data) {
      console.error("[EmailNotifications] Error getting user settings:", error);
      return null;
    }

    return data.settings || {};
  } catch (error) {
    console.error("[EmailNotifications] Error getting user settings:", error);
    return null;
  }
}

/**
 * Update user's settings (for rate limiting)
 */
async function updateUserSettings(
  userId: string,
  updates: Partial<NotificationSettings>
): Promise<void> {
  try {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("settings")
      .eq("id", userId)
      .single();

    const currentSettings = profile?.settings || {};
    const newSettings = { ...currentSettings, ...updates };

    await supabase
      .from("profiles")
      .update({ settings: newSettings })
      .eq("id", userId);
  } catch (error) {
    console.error("[EmailNotifications] Error updating user settings:", error);
  }
}

/**
 * Send email notification for a new follower
 */
export async function sendFollowerEmailNotification(
  userId: string,
  followerId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get user's settings
    const settings = await getUserSettings(userId);
    if (!settings || settings.email_new_followers === false) {
      console.log("[EmailNotifications] User has disabled new follower emails");
      return { success: true };
    }

    // Get user's email
    const email = await getUserEmail(userId);
    if (!email) {
      return { success: false, error: "Could not get user email" };
    }

    // Get follower's profile
    const supabase = await createClient();
    const { data: follower } = await supabase
      .from("profiles")
      .select("username, avatar_path")
      .eq("id", followerId)
      .single();

    if (!follower) {
      return { success: false, error: "Could not get follower profile" };
    }

    // Generate email
    const { subject, html } = newFollowerEmail({
      followerUsername: follower.username,
      followerAvatarUrl: follower.avatar_path,
    });

    // Send email
    return await sendEmail({ to: email, subject, html });
  } catch (error) {
    console.error("[EmailNotifications] Error sending follower email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

/**
 * Send email notification for becoming mutuals
 */
export async function sendMutualEmailNotification(
  userId: string,
  mutualUserId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get user's settings
    const settings = await getUserSettings(userId);
    if (!settings || settings.email_new_mutuals === false) {
      console.log("[EmailNotifications] User has disabled mutual emails");
      return { success: true };
    }

    // Get user's email
    const email = await getUserEmail(userId);
    if (!email) {
      return { success: false, error: "Could not get user email" };
    }

    // Get mutual user's profile
    const supabase = await createClient();
    const { data: mutualUser } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", mutualUserId)
      .single();

    if (!mutualUser) {
      return { success: false, error: "Could not get mutual user profile" };
    }

    // Generate email
    const { subject, html } = newMutualEmail({
      mutualUsername: mutualUser.username,
    });

    // Send email
    return await sendEmail({ to: email, subject, html });
  } catch (error) {
    console.error("[EmailNotifications] Error sending mutual email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

/**
 * Send email notification for a new message
 * Includes rate limiting: max 1 email per hour
 */
export async function sendMessageEmailNotification(
  userId: string,
  senderId: string,
  messagePreview: string
): Promise<{ success: boolean; rateLimited?: boolean; error?: string }> {
  try {
    // Get user's settings
    const settings = await getUserSettings(userId);
    if (!settings || settings.email_messages === false) {
      console.log("[EmailNotifications] User has disabled message emails");
      return { success: true };
    }

    // Check rate limiting
    if (settings.last_message_email_at) {
      const lastSent = new Date(settings.last_message_email_at).getTime();
      const now = Date.now();
      if (now - lastSent < MESSAGE_EMAIL_COOLDOWN_MS) {
        console.log("[EmailNotifications] Message email rate limited");
        return { success: true, rateLimited: true };
      }
    }

    // Get user's email
    const email = await getUserEmail(userId);
    if (!email) {
      return { success: false, error: "Could not get user email" };
    }

    // Get sender's profile
    const supabase = await createClient();
    const { data: sender } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", senderId)
      .single();

    if (!sender) {
      return { success: false, error: "Could not get sender profile" };
    }

    // Generate email
    const { subject, html } = newMessageEmail({
      senderUsername: sender.username,
      messagePreview,
    });

    // Send email
    const result = await sendEmail({ to: email, subject, html });

    // Update rate limiting timestamp
    if (result.success) {
      await updateUserSettings(userId, {
        last_message_email_at: new Date().toISOString(),
      });
    }

    return result;
  } catch (error) {
    console.error("[EmailNotifications] Error sending message email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

/**
 * Send email notification for unlocking an achievement
 */
export async function sendAchievementEmailNotification(
  userId: string,
  achievementId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get user's settings
    const settings = await getUserSettings(userId);
    if (!settings || settings.email_achievements === false) {
      console.log("[EmailNotifications] User has disabled achievement emails");
      return { success: true };
    }

    // Get user's email
    const email = await getUserEmail(userId);
    if (!email) {
      return { success: false, error: "Could not get user email" };
    }

    // Get achievement definition
    const supabase = await createClient();
    const { data: achievement } = await supabase
      .from("achievement_definitions")
      .select("name, description, tier")
      .eq("id", achievementId)
      .single();

    if (!achievement) {
      return { success: false, error: "Could not get achievement definition" };
    }

    // Generate email
    const { subject, html } = achievementUnlockedEmail({
      achievementName: achievement.name,
      achievementDescription: achievement.description,
      achievementTier: achievement.tier,
    });

    // Send email
    return await sendEmail({ to: email, subject, html });
  } catch (error) {
    console.error("[EmailNotifications] Error sending achievement email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

/**
 * Send weekly digest email to a user
 */
export async function sendWeeklyDigestEmail(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get user's settings
    const settings = await getUserSettings(userId);
    if (!settings || settings.email_weekly_digest === false) {
      console.log("[EmailNotifications] User has disabled weekly digest");
      return { success: true };
    }

    // Get user's email and profile
    const email = await getUserEmail(userId);
    if (!email) {
      return { success: false, error: "Could not get user email" };
    }

    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", userId)
      .single();

    if (!profile) {
      return { success: false, error: "Could not get user profile" };
    }

    // Get trending content
    const [trendingMovies, trendingSeries] = await Promise.all([
      getTrendingMovies(),
      getTrendingSeries(),
    ]);

    // Get user's weekly stats (episodes watched in last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { count: episodesWatched } = await supabase
      .from("episode_watches")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("watched_at", oneWeekAgo.toISOString());

    // Get shows completed in last 7 days
    const { count: showsCompleted } = await supabase
      .from("watch_cycles")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "completed")
      .gte("completed_at", oneWeekAgo.toISOString());

    // Generate email
    const { subject, html } = weeklyDigestEmail({
      username: profile.username,
      trendingMovies,
      trendingSeries,
      weeklyStats: {
        episodesWatched: episodesWatched || 0,
        showsCompleted: showsCompleted || 0,
      },
    });

    // Send email
    return await sendEmail({ to: email, subject, html });
  } catch (error) {
    console.error("[EmailNotifications] Error sending weekly digest:", error);
    return { success: false, error: "Failed to send email" };
  }
}

/**
 * Get all users who have weekly digest enabled
 * Used by the cron job
 */
export async function getUsersForWeeklyDigest(): Promise<string[]> {
  try {
    const supabase = await createClient();

    // Get all profiles where email_weekly_digest is true or not set (default true)
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, settings");

    if (error || !profiles) {
      console.error("[EmailNotifications] Error getting users for digest:", error);
      return [];
    }

    // Filter users who have digest enabled (or haven't disabled it)
    const eligibleUsers = profiles.filter((profile) => {
      const settings = profile.settings || {};
      // Default is true if not set
      return settings.email_weekly_digest !== false;
    });

    return eligibleUsers.map((p) => p.id);
  } catch (error) {
    console.error("[EmailNotifications] Error getting users for digest:", error);
    return [];
  }
}
