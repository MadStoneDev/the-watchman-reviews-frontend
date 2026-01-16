"use server";

import { createClient } from "@/src/utils/supabase/server";

export type NotificationType = "follow" | "achievement" | "comment_reaction" | "message" | "system";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string | null;
  data: Record<string, any>;
  read: boolean;
  created_at: string;
  actor_id: string | null;
  actor?: {
    id: string;
    username: string;
    avatar_path: string | null;
  } | null;
}

/**
 * Get notifications for the current user
 */
export async function getNotifications(
  page: number = 1,
  limit: number = 20,
  unreadOnly: boolean = false
): Promise<{
  success: boolean;
  notifications?: Notification[];
  total?: number;
  unreadCount?: number;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in" };
    }

    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (unreadOnly) {
      query = query.eq("read", false);
    }

    const { data: notifications, count, error } = await query;

    if (error) {
      console.error("Error fetching notifications:", error);
      return { success: false, error: error.message };
    }

    // Get unread count
    const { count: unreadCount } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false);

    // Fetch actor profiles if needed
    const actorIds = notifications
      ?.filter((n) => n.actor_id)
      .map((n) => n.actor_id) || [];

    let actorMap = new Map();
    if (actorIds.length > 0) {
      const { data: actors } = await supabase
        .from("profiles")
        .select("id, username, avatar_path")
        .in("id", actorIds);

      actorMap = new Map(actors?.map((a) => [a.id, a]) || []);
    }

    // Attach actor data
    const notificationsWithActors: Notification[] = (notifications || []).map((n) => ({
      ...n,
      actor: n.actor_id ? actorMap.get(n.actor_id) || null : null,
    }));

    return {
      success: true,
      notifications: notificationsWithActors,
      total: count || 0,
      unreadCount: unreadCount || 0,
    };
  } catch (error) {
    console.error("Error in getNotifications:", error);
    return { success: false, error: "Failed to fetch notifications" };
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(): Promise<{
  success: boolean;
  count?: number;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: true, count: 0 };
    }

    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false);

    if (error) {
      console.error("Error fetching unread count:", error);
      return { success: false, error: error.message };
    }

    return { success: true, count: count || 0 };
  } catch (error) {
    console.error("Error in getUnreadCount:", error);
    return { success: false, error: "Failed to fetch unread count" };
  }
}

/**
 * Mark a notification as read
 */
export async function markAsRead(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in" };
    }

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error marking notification as read:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in markAsRead:", error);
    return { success: false, error: "Failed to mark notification as read" };
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in" };
    }

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);

    if (error) {
      console.error("Error marking all as read:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in markAllAsRead:", error);
    return { success: false, error: "Failed to mark all as read" };
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in" };
    }

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting notification:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deleteNotification:", error);
    return { success: false, error: "Failed to delete notification" };
  }
}

/**
 * Create a notification (for server-side use)
 */
export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message?: string,
  data?: Record<string, any>,
  actorId?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const supabase = await createClient();

    const { data: notification, error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        type,
        title,
        message: message || null,
        data: data || {},
        actor_id: actorId || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating notification:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: notification.id };
  } catch (error) {
    console.error("Error in createNotification:", error);
    return { success: false, error: "Failed to create notification" };
  }
}
