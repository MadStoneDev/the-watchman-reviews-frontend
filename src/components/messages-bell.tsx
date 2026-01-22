"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IconMessage } from "@tabler/icons-react";
import { getUnreadMessageCount } from "@/src/app/actions/messaging";

interface MessagesBellProps {
  className?: string;
  pathname?: string;
}

export default function MessagesBell({
  className = "",
  pathname = "",
}: MessagesBellProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const result = await getUnreadMessageCount();
      if (result.success) {
        setUnreadCount(result.count || 0);
      }
    };

    fetchCount();

    // Poll for new messages every 30 seconds
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link
      href="/messages"
      className={`relative flex items-center gap-6 max-w-fit ${
        pathname && pathname.includes("messages")
          ? "text-lime-400"
          : "text-neutral-500 hover:text-neutral-200"
      } font-bold transition-all duration-300 ease-in-out ${className}`}
    >
      <span className={`relative`}>
        <IconMessage size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 flex items-center justify-center bg-rose-500 text-white text-xs font-bold rounded-full px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </span>
      <span className="hidden lg:block">Messages</span>
    </Link>
  );
}
