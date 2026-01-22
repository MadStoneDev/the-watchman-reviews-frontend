"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IconBell, IconDeviceTv } from "@tabler/icons-react";
import { getUnreadCount } from "@/src/app/actions/notifications";

interface NotificationBellProps {
  username: string;
  className?: string;
  pathname: string;
}

export default function NotificationBell({
  username,
  className = "",
  pathname = "",
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
      className={`flex items-center gap-6 max-w-fit ${
        pathname && pathname.includes(`notifications`)
          ? "text-lime-400"
          : "text-neutral-500 hover:text-neutral-200"
      } font-bold transition-all duration-300 ease-in-out`}
    >
      <span className={`relative`}>
        <IconBell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 flex items-center justify-center bg-rose-500 text-white text-xs font-bold rounded-full px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </span>
      <span className={`hidden lg:block`}>Notifications</span>
    </Link>
  );
}
