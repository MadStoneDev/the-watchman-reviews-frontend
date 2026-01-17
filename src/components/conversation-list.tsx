"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconLoader2, IconMessageOff } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { createClient } from "@/src/utils/supabase/client";
import {
  getConversations,
  type Conversation,
} from "@/src/app/actions/messaging";

interface ConversationListProps {
  currentUserId: string;
  initialConversations?: Conversation[];
}

export default function ConversationList({
  currentUserId,
  initialConversations = [],
}: ConversationListProps) {
  const supabase = createClient();
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [isLoading, setIsLoading] = useState(initialConversations.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialConversations.length === 0) {
      const loadConversations = async () => {
        setIsLoading(true);
        try {
          const result = await getConversations(1, 50);
          if (result.success && result.conversations) {
            setConversations(result.conversations);
          } else {
            setError(result.error || "Failed to load conversations");
          }
        } catch (err) {
          setError("Failed to load conversations");
        } finally {
          setIsLoading(false);
        }
      };
      loadConversations();
    }
  }, [initialConversations.length]);

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find((p) => p.user_id !== currentUserId);
  };

  const getAvatarUrl = (avatarPath: string | null) => {
    if (avatarPath) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(avatarPath);
      return data.publicUrl;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <IconLoader2 size={32} className="animate-spin text-lime-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
        <IconMessageOff size={48} className="mb-4" />
        <p className="text-lg">No messages yet</p>
        <p className="text-sm mt-1">
          Start a conversation with someone you follow
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const otherUser = getOtherParticipant(conversation);
        if (!otherUser) return null;

        const avatarUrl = getAvatarUrl(otherUser.user.avatar_path);
        const timeAgo = conversation.last_message_at
          ? formatDistanceToNow(new Date(conversation.last_message_at), {
              addSuffix: true,
            })
          : null;

        return (
          <Link
            key={conversation.id}
            href={`/messages/${conversation.id}`}
            className={`block p-4 rounded-lg transition-colors ${
              conversation.unread_count > 0
                ? "bg-neutral-800 hover:bg-neutral-700"
                : "bg-neutral-800/50 hover:bg-neutral-800"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="shrink-0">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={otherUser.user.username}
                    width={48}
                    height={48}
                    className="rounded-full aspect-square object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-lime-400 flex items-center justify-center text-neutral-900 text-xl font-bold">
                    {otherUser.user.username[0].toUpperCase()}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-medium ${
                      conversation.unread_count > 0 ? "text-white" : "text-neutral-200"
                    }`}
                  >
                    {otherUser.user.username}
                  </span>
                  {timeAgo && (
                    <span className="text-xs text-neutral-500 shrink-0">
                      {timeAgo}
                    </span>
                  )}
                </div>

                {conversation.last_message_preview && (
                  <p
                    className={`text-sm mt-0.5 truncate ${
                      conversation.unread_count > 0
                        ? "text-neutral-200"
                        : "text-neutral-400"
                    }`}
                  >
                    {conversation.last_message_preview}
                  </p>
                )}
              </div>

              {/* Unread badge */}
              {conversation.unread_count > 0 && (
                <div className="shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-lime-400 text-neutral-900 text-xs font-bold rounded-full">
                  {conversation.unread_count > 99 ? "99+" : conversation.unread_count}
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
