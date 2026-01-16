"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IconBell } from "@tabler/icons-react";
import { getUnreadCount } from "@/src/app/actions/notifications";

interface NotificationBellProps {
  username: string;
  className?: string;
}

export default function NotificationBell({
  username,
  className = "",
}: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const result = await getUnreadCount();
      if (result.success) {
        setUnreadCount(result.count || 0);
      }
    };

    fetchCount();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link
      href={`/${username}/notifications`}
      className={`relative flex items-center justify-center p-2 text-neutral-500 hover:text-neutral-200 transition-colors ${className}`}
      title="Notifications"
    >
      <IconBell size={24} />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-rose-500 text-white text-xs font-bold rounded-full px-1">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
