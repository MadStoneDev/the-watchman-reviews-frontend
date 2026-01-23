"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconArrowLeft, IconLoader2 } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { createClient } from "@/src/utils/supabase/client";
import MessageInput from "./message-input";
import {
  getMessages,
  sendMessage,
  markConversationRead,
  type Message,
  type Conversation,
} from "@/src/app/actions/messaging";

interface ConversationThreadProps {
  conversation: Conversation;
  currentUserId: string;
  initialMessages?: Message[];
}

export default function ConversationThread({
  conversation,
  currentUserId,
  initialMessages = [],
}: ConversationThreadProps) {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(initialMessages.length === 0);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const otherUser = conversation.participants.find(
    (p) => p.user_id !== currentUserId,
  );

  useEffect(() => {
    // Mark conversation as read when viewing
    markConversationRead(conversation.id);
  }, [conversation.id]);

  useEffect(() => {
    if (initialMessages.length === 0) {
      const loadMessages = async () => {
        setIsLoading(true);
        try {
          const result = await getMessages(conversation.id, 1, 100);
          if (result.success && result.messages) {
            setMessages(result.messages);
          } else {
            setError(result.error || "Failed to load messages");
          }
        } catch (err) {
          setError("Failed to load messages");
        } finally {
          setIsLoading(false);
        }
      };
      loadMessages();
    }
  }, [conversation.id, initialMessages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    setIsSending(true);
    setError(null);

    try {
      const result = await sendMessage(conversation.id, content);
      if (result.success && result.message) {
        setMessages((prev) => [...prev, result.message!]);
      } else {
        setError(result.error || "Failed to send message");
      }
    } catch (err) {
      setError("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const getAvatarUrl = (avatarPath: string | null) => {
    if (avatarPath) {
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(avatarPath);
      return data.publicUrl;
    }
    return null;
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays < 7) {
      return (
        date.toLocaleDateString([], { weekday: "short" }) +
        " " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-grow flex items-center justify-center">
          <IconLoader2 size={32} className="animate-spin text-lime-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      {otherUser && (
        <div className="flex items-center gap-2 shrink-0 pb-4 border-b border-neutral-700">
          {/* Back button */}
          <Link
            href="/messages"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
          >
            <IconArrowLeft size={24} />
          </Link>

          <Link
            href={`/u/${otherUser.user.username}`}
            className="hover:opacity-80 transition-opacity"
          >
            {otherUser.user.avatar_path ? (
              <Image
                src={getAvatarUrl(otherUser.user.avatar_path) || ""}
                alt={otherUser.user.username}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full aspect-square object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-lime-400 flex items-center justify-center text-neutral-900 text-sm font-bold">
                {otherUser.user.username[0].toUpperCase()}
              </div>
            )}
          </Link>
          <span className="font-medium text-white">
            {otherUser.user.username}
          </span>
        </div>
      )}

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-grow overflow-y-auto pt-4 space-y-2.5"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-neutral-500">
            <p>No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwnMessage = message.sender_id === currentUserId;
            const showAvatar =
              !isOwnMessage &&
              (index === 0 ||
                messages[index - 1].sender_id !== message.sender_id);

            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-start gap-3 max-w-[75%] ${
                    isOwnMessage ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar for other user's messages */}
                  {!isOwnMessage && (
                    <div className="mt-1 w-10 shrink-0">
                      {showAvatar && (
                        <Link href={`/u/${message.sender.username}`}>
                          {message.sender.avatar_path ? (
                            <Image
                              src={
                                getAvatarUrl(message.sender.avatar_path) || ""
                              }
                              alt={message.sender.username}
                              width={40}
                              height={40}
                              className="rounded-full aspect-square object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-lime-400 flex items-center justify-center text-neutral-900 text-base font-bold">
                              {message.sender.username[0].toUpperCase()}
                            </div>
                          )}
                        </Link>
                      )}
                    </div>
                  )}

                  {/* Message bubble */}
                  <div className="group">
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isOwnMessage
                          ? "bg-lime-400 text-neutral-900"
                          : "bg-neutral-700 text-white"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    </div>
                    <p
                      className={`text-xs text-neutral-500 mt-1 opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-40 transition-all ${
                        isOwnMessage ? "text-right pr-2" : "text-left pl-2"
                      } overflow-hidden`}
                    >
                      {formatMessageTime(message.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Error message */}
        {error && (
          <div className="text-center text-red-400 text-sm py-2">{error}</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="shrink-0 py-4 border-t border-neutral-700">
        <MessageInput onSend={handleSendMessage} isLoading={isSending} />
      </div>
    </div>
  );
}
