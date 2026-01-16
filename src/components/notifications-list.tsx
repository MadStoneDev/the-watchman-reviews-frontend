"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconCheck, IconBell } from "@tabler/icons-react";
import NotificationItem from "./notification-item";
import { markAllAsRead } from "@/src/app/actions/notifications";
import type { Notification } from "@/src/app/actions/notifications";

interface NotificationsListProps {
  initialNotifications: Notification[];
  initialUnreadCount: number;
  currentPage: number;
  totalPages: number;
  username: string;
}

export default function NotificationsList({
  initialNotifications,
  initialUnreadCount,
  currentPage,
  totalPages,
  username,
}: NotificationsListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);

  const handleMarkAllAsRead = async () => {
    startTransition(async () => {
      await markAllAsRead();
      // Mark all local notifications as read
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
      setUnreadCount(0);
      router.refresh();
    });
  };

  const handleUpdate = () => {
    router.refresh();
  };

  return (
    <section className={`pb-6`}>
      {/* Mark All as Read Button */}
      {unreadCount > 0 && (
        <div className="mb-4">
          <button
            onClick={handleMarkAllAsRead}
            disabled={isPending}
            className="px-4 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <IconCheck size={16} />
            Mark all as read
          </button>
        </div>
      )}

      {/* Notifications List */}
      <section className="space-y-2">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <IconBell size={48} className="mx-auto text-neutral-600 mb-4" />
            <p className="text-neutral-500">No notifications yet</p>
            <p className="text-sm text-neutral-600 mt-1">
              When someone follows you or you unlock an achievement, you'll see it here.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onUpdate={handleUpdate}
            />
          ))
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex justify-center gap-2 mt-8 pb-8">
          {currentPage > 1 && (
            <a
              href={`/${username}/notifications?page=${currentPage - 1}`}
              className="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
            >
              Previous
            </a>
          )}
          <span className="px-4 py-2 text-neutral-400">
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <a
              href={`/${username}/notifications?page=${currentPage + 1}`}
              className="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
            >
              Next
            </a>
          )}
        </nav>
      )}
    </section>
  );
}
