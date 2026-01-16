"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  IconUserPlus,
  IconTrophy,
  IconMessage,
  IconBell,
  IconThumbUp,
  IconX,
  IconCheck,
} from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { createClient } from "@/src/utils/supabase/client";
import { markAsRead, deleteNotification } from "@/src/app/actions/notifications";
import type { Notification } from "@/src/app/actions/notifications";

interface NotificationItemProps {
  notification: Notification;
  onUpdate?: () => void;
}

export default function NotificationItem({
  notification,
  onUpdate,
}: NotificationItemProps) {
  const supabase = createClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarking, setIsMarking] = useState(false);

  const getIcon = () => {
    switch (notification.type) {
      case "follow":
        return <IconUserPlus size={20} className="text-lime-400" />;
      case "achievement":
        return <IconTrophy size={20} className="text-amber-400" />;
      case "comment_reaction":
        return <IconThumbUp size={20} className="text-indigo-400" />;
      case "message":
        return <IconMessage size={20} className="text-cyan-400" />;
      default:
        return <IconBell size={20} className="text-neutral-400" />;
    }
  };

  const getLink = (): string | null => {
    switch (notification.type) {
      case "follow":
        return notification.data?.follower_username
          ? `/${notification.data.follower_username}`
          : null;
      case "achievement":
        return null; // Could link to achievements page
      default:
        return null;
    }
  };

  const getAvatarUrl = () => {
    if (notification.actor?.avatar_path) {
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(notification.actor.avatar_path);
      return data.publicUrl;
    }
    return null;
  };

  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (notification.read) return;

    setIsMarking(true);
    await markAsRead(notification.id);
    setIsMarking(false);
    onUpdate?.();
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDeleting(true);
    await deleteNotification(notification.id);
    setIsDeleting(false);
    onUpdate?.();
  };

  const avatarUrl = getAvatarUrl();
  const link = getLink();
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  });

  const content = (
    <article
      className={`group p-4 flex items-start gap-3 rounded-lg transition-colors ${
        notification.read
          ? "bg-neutral-900/50 hover:bg-neutral-800/50"
          : "bg-neutral-800 hover:bg-neutral-700"
      }`}
    >
      {/* Icon or Avatar */}
      <div className="shrink-0">
        {notification.actor ? (
          avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={notification.actor.username}
              width={40}
              height={40}
              className="rounded-full aspect-square object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-lime-400 flex items-center justify-center text-neutral-900 text-lg font-bold">
              {notification.actor.username[0].toUpperCase()}
            </div>
          )
        ) : (
          <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center">
            {getIcon()}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-sm">{notification.title}</p>
            {notification.message && (
              <p className="text-sm text-neutral-400 mt-0.5">
                {notification.message}
              </p>
            )}
            <p className="text-xs text-neutral-500 mt-1">{timeAgo}</p>
          </div>

          {/* Unread indicator */}
          {!notification.read && (
            <div className="w-2 h-2 rounded-full bg-lime-400 shrink-0 mt-2" />
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notification.read && (
          <button
            onClick={handleMarkAsRead}
            disabled={isMarking}
            className="p-1.5 rounded hover:bg-neutral-600 text-neutral-400 hover:text-lime-400 transition-colors"
            title="Mark as read"
          >
            <IconCheck size={16} />
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-1.5 rounded hover:bg-neutral-600 text-neutral-400 hover:text-red-400 transition-colors"
          title="Delete"
        >
          <IconX size={16} />
        </button>
      </div>
    </article>
  );

  if (link) {
    return (
      <Link href={link} onClick={handleMarkAsRead}>
        {content}
      </Link>
    );
  }

  return <div onClick={handleMarkAsRead}>{content}</div>;
}
