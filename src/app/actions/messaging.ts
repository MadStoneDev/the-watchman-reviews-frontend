"use server";

import { createClient } from "@/src/utils/supabase/server";
import { revalidatePath } from "next/cache";

export interface ConversationParticipant {
  id: string;
  user_id: string;
  last_read_at: string | null;
  user: {
    id: string;
    username: string;
    avatar_path: string | null;
  };
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  last_message_at: string | null;
  last_message_preview: string | null;
  participants: ConversationParticipant[];
  unread_count: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender: {
    id: string;
    username: string;
    avatar_path: string | null;
  };
}

/**
 * Check if the current user can message another user
 * Respects the target user's allow_messages_from privacy setting
 */
export async function canMessageUser(
  targetUserId: string
): Promise<{ success: boolean; canMessage?: boolean; reason?: string; error?: string }> {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: userData } = await supabase.auth.getClaims();
    const currentUserId = userData?.claims?.sub;

    if (!currentUserId) {
      return { success: false, error: "You must be logged in" };
    }

    if (currentUserId === targetUserId) {
      return { success: true, canMessage: false, reason: "Cannot message yourself" };
    }

    // Get target user's messaging privacy setting
    const { data: targetProfile } = await supabase
      .from("profiles")
      .select("settings")
      .eq("id", targetUserId)
      .single();

    const allowMessagesFrom = targetProfile?.settings?.allow_messages_from || "everyone";

    // Check follow relationships
    const { data: currentFollowsTarget } = await supabase
      .from("user_follows")
      .select("id")
      .eq("follower_id", currentUserId)
      .eq("following_id", targetUserId)
      .single();

    const { data: targetFollowsCurrent } = await supabase
      .from("user_follows")
      .select("id")
      .eq("follower_id", targetUserId)
      .eq("following_id", currentUserId)
      .single();

    const iFollowThem = !!currentFollowsTarget;
    const theyFollowMe = !!targetFollowsCurrent;
    const areMutuals = iFollowThem && theyFollowMe;

    // Check based on privacy setting
    switch (allowMessagesFrom) {
      case "nobody":
        return { success: true, canMessage: false, reason: "This user has disabled messages" };
      case "mutuals":
        if (!areMutuals) {
          return { success: true, canMessage: false, reason: "Only mutual followers can message this user" };
        }
        break;
      case "followers":
        // They must follow me (I'm their follower, they follow me back)
        if (!theyFollowMe) {
          return { success: true, canMessage: false, reason: "Only people this user follows can message them" };
        }
        break;
      case "everyone":
      default:
        // Anyone can message, but we still require at least one-way follow for safety
        if (!iFollowThem && !theyFollowMe) {
          return { success: true, canMessage: false, reason: "You must follow or be followed by this user" };
        }
        break;
    }

    return { success: true, canMessage: true };
  } catch (error) {
    console.error("[Messaging] Error in canMessageUser:", error);
    return { success: false, error: "Failed to check messaging permission" };
  }
}

/**
 * Get all conversations for the current user
 */
export async function getConversations(
  page: number = 1,
  limit: number = 20
): Promise<{
  success: boolean;
  conversations?: Conversation[];
  hasMore?: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: userData } = await supabase.auth.getClaims();
    const currentUserId = userData?.claims?.sub;

    if (!currentUserId) {
      return { success: false, error: "You must be logged in" };
    }

    const offset = (page - 1) * limit;

    // Get conversations where user is a participant
    const { data: participantRecords, error: participantError } = await supabase
      .from("conversation_participants")
      .select("conversation_id, last_read_at")
      .eq("user_id", currentUserId);

    if (participantError) {
      console.error("[Messaging] Error fetching participant records:", participantError);
      return { success: false, error: participantError.message };
    }

    if (!participantRecords || participantRecords.length === 0) {
      return { success: true, conversations: [], hasMore: false };
    }

    const conversationIds = participantRecords.map((p) => p.conversation_id);
    const lastReadMap = new Map(
      participantRecords.map((p) => [p.conversation_id, p.last_read_at])
    );

    // Fetch conversations
    const { data: conversations, error: convError } = await supabase
      .from("conversations")
      .select("*")
      .in("id", conversationIds)
      .order("last_message_at", { ascending: false, nullsFirst: false })
      .range(offset, offset + limit);

    if (convError) {
      console.error("[Messaging] Error fetching conversations:", convError);
      return { success: false, error: convError.message };
    }

    if (!conversations || conversations.length === 0) {
      return { success: true, conversations: [], hasMore: false };
    }

    // Fetch all participants for these conversations
    const { data: allParticipants } = await supabase
      .from("conversation_participants")
      .select("*")
      .in(
        "conversation_id",
        conversations.map((c) => c.id)
      );

    // Fetch user data for all participants
    const participantUserIds = Array.from(
      new Set(allParticipants?.map((p) => p.user_id) || [])
    );
    const { data: users } = await supabase
      .from("profiles")
      .select("id, username, avatar_path")
      .in("id", participantUserIds);

    const userMap = new Map(users?.map((u) => [u.id, u]) || []);

    // Batch fetch unread counts - get all messages from others in one query
    const convIds = conversations.map((c) => c.id);
    const { data: allMessages } = await supabase
      .from("messages")
      .select("conversation_id, created_at")
      .in("conversation_id", convIds)
      .neq("sender_id", currentUserId);

    // Calculate unread counts from the batch result
    const unreadCounts = new Map<string, number>();
    for (const conv of conversations) {
      const lastRead = lastReadMap.get(conv.id);
      const convMessages = allMessages?.filter((m) => m.conversation_id === conv.id) || [];

      if (lastRead) {
        const unreadMessages = convMessages.filter((m) => m.created_at > lastRead);
        unreadCounts.set(conv.id, unreadMessages.length);
      } else {
        unreadCounts.set(conv.id, convMessages.length);
      }
    }

    // Build conversation objects
    const conversationsWithParticipants: Conversation[] = conversations.map((conv) => {
      const convParticipants =
        allParticipants?.filter((p) => p.conversation_id === conv.id) || [];

      return {
        id: conv.id,
        created_at: conv.created_at,
        updated_at: conv.updated_at,
        last_message_at: conv.last_message_at,
        last_message_preview: conv.last_message_preview,
        participants: convParticipants.map((p) => ({
          id: p.id,
          user_id: p.user_id,
          last_read_at: p.last_read_at,
          user: userMap.get(p.user_id) || {
            id: p.user_id,
            username: "Unknown User",
            avatar_path: null,
          },
        })),
        unread_count: unreadCounts.get(conv.id) || 0,
      };
    });

    return {
      success: true,
      conversations: conversationsWithParticipants,
      hasMore: conversations.length === limit + 1,
    };
  } catch (error) {
    console.error("[Messaging] Error in getConversations:", error);
    return { success: false, error: "Failed to fetch conversations" };
  }
}

/**
 * Get or create a conversation with another user
 */
export async function getOrCreateConversation(
  otherUserId: string
): Promise<{ success: boolean; conversationId?: string; error?: string }> {
  try {
    const supabase = await createClient();

    // Get current user - use getUser() to ensure session is established for RLS
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "You must be logged in" };
    }

    const currentUserId = user.id;

    if (currentUserId === otherUserId) {
      return { success: false, error: "Cannot message yourself" };
    }

    // Check if they can message (must be mutuals)
    const canMessageResult = await canMessageUser(otherUserId);
    if (!canMessageResult.success || !canMessageResult.canMessage) {
      return {
        success: false,
        error: "You can only message mutual followers",
      };
    }

    // Try to find existing conversation
    const { data: existingParticipants } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", currentUserId);

    if (existingParticipants && existingParticipants.length > 0) {
      const convIds = existingParticipants.map((p) => p.conversation_id);

      // Check if other user is in any of these conversations
      const { data: matchingConv } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .in("conversation_id", convIds)
        .eq("user_id", otherUserId)
        .limit(1)
        .single();

      if (matchingConv) {
        return { success: true, conversationId: matchingConv.conversation_id };
      }
    }

    // Generate UUID client-side to avoid RLS SELECT check on RETURNING
    const newConversationId = crypto.randomUUID();

    // Create new conversation with the generated ID
    const { error: convError } = await supabase
      .from("conversations")
      .insert({ id: newConversationId });

    if (convError) {
      console.error("[Messaging] Error creating conversation:", convError);
      return { success: false, error: "Failed to create conversation" };
    }

    // Add both participants
    const { error: participantError } = await supabase
      .from("conversation_participants")
      .insert([
        { conversation_id: newConversationId, user_id: currentUserId },
        { conversation_id: newConversationId, user_id: otherUserId },
      ]);

    if (participantError) {
      console.error("[Messaging] Error adding participants:", participantError);
      // Clean up the conversation
      await supabase.from("conversations").delete().eq("id", newConversationId);
      return { success: false, error: "Failed to add participants" };
    }

    return { success: true, conversationId: newConversationId };
  } catch (error) {
    console.error("[Messaging] Error in getOrCreateConversation:", error);
    return { success: false, error: "Failed to get or create conversation" };
  }
}

/**
 * Get messages for a conversation
 */
export async function getMessages(
  conversationId: string,
  page: number = 1,
  limit: number = 50
): Promise<{
  success: boolean;
  messages?: Message[];
  hasMore?: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: userData } = await supabase.auth.getClaims();
    const currentUserId = userData?.claims?.sub;

    if (!currentUserId) {
      return { success: false, error: "You must be logged in" };
    }

    // Verify user is a participant
    const { data: participant } = await supabase
      .from("conversation_participants")
      .select("id")
      .eq("conversation_id", conversationId)
      .eq("user_id", currentUserId)
      .single();

    if (!participant) {
      return { success: false, error: "You are not a participant in this conversation" };
    }

    const offset = (page - 1) * limit;

    // Fetch messages
    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit);

    if (error) {
      console.error("[Messaging] Error fetching messages:", error);
      return { success: false, error: error.message };
    }

    if (!messages || messages.length === 0) {
      return { success: true, messages: [], hasMore: false };
    }

    // Fetch user data for senders
    const senderIds = Array.from(new Set(messages.map((m) => m.sender_id)));
    const { data: users } = await supabase
      .from("profiles")
      .select("id, username, avatar_path")
      .in("id", senderIds);

    const userMap = new Map(users?.map((u) => [u.id, u]) || []);

    const messagesWithSenders: Message[] = messages
      .map((message) => ({
        id: message.id,
        conversation_id: message.conversation_id,
        sender_id: message.sender_id,
        content: message.content,
        created_at: message.created_at,
        sender: userMap.get(message.sender_id) || {
          id: message.sender_id,
          username: "Unknown User",
          avatar_path: null,
        },
      }))
      .reverse(); // Reverse to get chronological order

    return {
      success: true,
      messages: messagesWithSenders,
      hasMore: messages.length === limit + 1,
    };
  } catch (error) {
    console.error("[Messaging] Error in getMessages:", error);
    return { success: false, error: "Failed to fetch messages" };
  }
}

/**
 * Send a message to a conversation
 */
export async function sendMessage(
  conversationId: string,
  content: string
): Promise<{ success: boolean; message?: Message; error?: string }> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in" };
    }

    // Verify user is a participant
    const { data: participant } = await supabase
      .from("conversation_participants")
      .select("id")
      .eq("conversation_id", conversationId)
      .eq("user_id", user.id)
      .single();

    if (!participant) {
      return { success: false, error: "You are not a participant in this conversation" };
    }

    // Validate content
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return { success: false, error: "Message cannot be empty" };
    }

    if (trimmedContent.length > 2000) {
      return { success: false, error: "Message is too long (max 2000 characters)" };
    }

    // Insert message
    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: trimmedContent,
      })
      .select()
      .single();

    if (error) {
      console.error("[Messaging] Error sending message:", error);
      return { success: false, error: error.message };
    }

    // Update sender's last_read_at
    await supabase
      .from("conversation_participants")
      .update({ last_read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .eq("user_id", user.id);

    // Get sender profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, username, avatar_path")
      .eq("id", user.id)
      .single();

    const messageWithSender: Message = {
      id: message.id,
      conversation_id: message.conversation_id,
      sender_id: message.sender_id,
      content: message.content,
      created_at: message.created_at,
      sender: profile || {
        id: user.id,
        username: "Unknown User",
        avatar_path: null,
      },
    };

    revalidatePath("/messages");
    revalidatePath(`/messages/${conversationId}`);

    return { success: true, message: messageWithSender };
  } catch (error) {
    console.error("[Messaging] Error in sendMessage:", error);
    return { success: false, error: "Failed to send message" };
  }
}

/**
 * Mark a conversation as read
 */
export async function markConversationRead(
  conversationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: userData } = await supabase.auth.getClaims();
    const currentUserId = userData?.claims?.sub;

    if (!currentUserId) {
      return { success: false, error: "You must be logged in" };
    }

    // Update last_read_at
    const { error } = await supabase
      .from("conversation_participants")
      .update({ last_read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .eq("user_id", currentUserId);

    if (error) {
      console.error("[Messaging] Error marking conversation read:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/messages");

    return { success: true };
  } catch (error) {
    console.error("[Messaging] Error in markConversationRead:", error);
    return { success: false, error: "Failed to mark conversation as read" };
  }
}

/**
 * Get total unread message count for the current user
 */
export async function getUnreadMessageCount(): Promise<{
  success: boolean;
  count?: number;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: userData } = await supabase.auth.getClaims();
    const currentUserId = userData?.claims?.sub;

    if (!currentUserId) {
      return { success: true, count: 0 };
    }

    // Get all conversations for current user
    const { data: participantRecords } = await supabase
      .from("conversation_participants")
      .select("conversation_id, last_read_at")
      .eq("user_id", currentUserId);

    if (!participantRecords || participantRecords.length === 0) {
      return { success: true, count: 0 };
    }

    let totalUnread = 0;

    for (const participant of participantRecords) {
      let query = supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", participant.conversation_id)
        .neq("sender_id", currentUserId);

      if (participant.last_read_at) {
        query = query.gt("created_at", participant.last_read_at);
      }

      const { count } = await query;
      totalUnread += count || 0;
    }

    return { success: true, count: totalUnread };
  } catch (error) {
    console.error("[Messaging] Error in getUnreadMessageCount:", error);
    return { success: false, error: "Failed to get unread count" };
  }
}

/**
 * Get conversation details with participants
 */
export async function getConversation(
  conversationId: string
): Promise<{ success: boolean; conversation?: Conversation; error?: string }> {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: userData } = await supabase.auth.getClaims();
    const currentUserId = userData?.claims?.sub;

    if (!currentUserId) {
      return { success: false, error: "You must be logged in" };
    }

    // Verify user is a participant
    const { data: participant } = await supabase
      .from("conversation_participants")
      .select("id, last_read_at")
      .eq("conversation_id", conversationId)
      .eq("user_id", currentUserId)
      .single();

    if (!participant) {
      return { success: false, error: "Conversation not found" };
    }

    // Fetch conversation
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single();

    if (convError || !conversation) {
      return { success: false, error: "Conversation not found" };
    }

    // Fetch all participants
    const { data: participants } = await supabase
      .from("conversation_participants")
      .select("*")
      .eq("conversation_id", conversationId);

    // Fetch user data for participants
    const participantUserIds = participants?.map((p) => p.user_id) || [];
    const { data: users } = await supabase
      .from("profiles")
      .select("id, username, avatar_path")
      .in("id", participantUserIds);

    const userMap = new Map(users?.map((u) => [u.id, u]) || []);

    // Calculate unread count
    let unreadCount = 0;
    if (participant.last_read_at && conversation.last_message_at) {
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", conversationId)
        .neq("sender_id", currentUserId)
        .gt("created_at", participant.last_read_at);
      unreadCount = count || 0;
    } else if (conversation.last_message_at) {
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", conversationId)
        .neq("sender_id", currentUserId);
      unreadCount = count || 0;
    }

    const conversationWithParticipants: Conversation = {
      id: conversation.id,
      created_at: conversation.created_at,
      updated_at: conversation.updated_at,
      last_message_at: conversation.last_message_at,
      last_message_preview: conversation.last_message_preview,
      participants:
        participants?.map((p) => ({
          id: p.id,
          user_id: p.user_id,
          last_read_at: p.last_read_at,
          user: userMap.get(p.user_id) || {
            id: p.user_id,
            username: "Unknown User",
            avatar_path: null,
          },
        })) || [],
      unread_count: unreadCount,
    };

    return { success: true, conversation: conversationWithParticipants };
  } catch (error) {
    console.error("[Messaging] Error in getConversation:", error);
    return { success: false, error: "Failed to fetch conversation" };
  }
}

/**
 * Get users that the current user can message
 * Returns users based on follow relationships and their privacy settings
 */
export async function getMessageableUsers(): Promise<{
  success: boolean;
  users?: Array<{
    id: string;
    username: string;
    avatar_path: string | null;
    hasExistingConversation: boolean;
  }>;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: userData } = await supabase.auth.getClaims();
    const currentUserId = userData?.claims?.sub;

    if (!currentUserId) {
      return { success: false, error: "You must be logged in" };
    }

    // Get people I follow
    const { data: following } = await supabase
      .from("user_follows")
      .select("following_id")
      .eq("follower_id", currentUserId);

    // Get people who follow me
    const { data: followers } = await supabase
      .from("user_follows")
      .select("follower_id")
      .eq("following_id", currentUserId);

    const followingIds = new Set(following?.map((f) => f.following_id) || []);
    const followerIds = new Set(followers?.map((f) => f.follower_id) || []);

    // Combine all potential messageable users (anyone with a follow relationship)
    const potentialUserIds = new Set([...followingIds, ...followerIds]);

    if (potentialUserIds.size === 0) {
      return { success: true, users: [] };
    }

    // Get user profiles with their settings
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, avatar_path, settings")
      .in("id", Array.from(potentialUserIds));

    if (!profiles) {
      return { success: true, users: [] };
    }

    // Get existing conversations
    const { data: existingParticipants } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", currentUserId);

    const myConversationIds = existingParticipants?.map((p) => p.conversation_id) || [];

    let existingConversationUserIds = new Set<string>();
    if (myConversationIds.length > 0) {
      const { data: otherParticipants } = await supabase
        .from("conversation_participants")
        .select("user_id")
        .in("conversation_id", myConversationIds)
        .neq("user_id", currentUserId);

      existingConversationUserIds = new Set(otherParticipants?.map((p) => p.user_id) || []);
    }

    // Filter users based on their messaging settings
    const messageableUsers = profiles
      .filter((profile) => {
        const allowMessagesFrom = profile.settings?.allow_messages_from || "everyone";
        const iFollowThem = followingIds.has(profile.id);
        const theyFollowMe = followerIds.has(profile.id);
        const areMutuals = iFollowThem && theyFollowMe;

        switch (allowMessagesFrom) {
          case "nobody":
            return false;
          case "mutuals":
            return areMutuals;
          case "followers":
            return theyFollowMe; // They follow me
          case "everyone":
          default:
            return iFollowThem || theyFollowMe;
        }
      })
      .map((profile) => ({
        id: profile.id,
        username: profile.username,
        avatar_path: profile.avatar_path,
        hasExistingConversation: existingConversationUserIds.has(profile.id),
      }))
      .sort((a, b) => a.username.localeCompare(b.username));

    return { success: true, users: messageableUsers };
  } catch (error) {
    console.error("[Messaging] Error in getMessageableUsers:", error);
    return { success: false, error: "Failed to get messageable users" };
  }
}
