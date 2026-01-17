"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IconTrophy, IconMedal } from "@tabler/icons-react";
import { createClient } from "@/src/utils/supabase/client";
import type { LeaderboardEntry } from "@/src/app/actions/leaderboards";

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  type: "episodes" | "shows" | "achievements" | "comments";
  isCurrentUser?: boolean;
}

export default function LeaderboardRow({
  entry,
  type,
  isCurrentUser = false,
}: LeaderboardRowProps) {
  const supabase = createClient();

  const getAvatarUrl = () => {
    if (entry.avatar_path) {
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(entry.avatar_path);
      return data.publicUrl;
    }
    return null;
  };

  const getRankDisplay = () => {
    if (entry.rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center">
          <IconTrophy size={18} className="text-amber-900" />
        </div>
      );
    }
    if (entry.rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-neutral-300 flex items-center justify-center">
          <IconMedal size={18} className="text-neutral-700" />
        </div>
      );
    }
    if (entry.rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center">
          <IconMedal size={18} className="text-orange-900" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 flex items-center justify-center text-neutral-400 font-medium">
        {entry.rank}
      </div>
    );
  };

  const getValueDisplay = () => {
    switch (type) {
      case "episodes":
        return (
          <div className="text-right">
            <div className="text-lg font-bold text-lime-400">
              {entry.value.toLocaleString()}
            </div>
            <div className="text-xs text-neutral-500">episodes</div>
          </div>
        );
      case "shows":
        return (
          <div className="text-right">
            <div className="text-lg font-bold text-lime-400">
              {entry.value.toLocaleString()}
            </div>
            <div className="text-xs text-neutral-500">shows completed</div>
          </div>
        );
      case "achievements":
        return (
          <div className="text-right">
            <div className="text-lg font-bold text-amber-400">
              {entry.value.toLocaleString()}
            </div>
            <div className="text-xs text-neutral-500">
              {entry.achievements_count} achievement
              {entry.achievements_count !== 1 ? "s" : ""}
            </div>
          </div>
        );
      case "comments":
        return (
          <div className="text-right">
            <div className="text-lg font-bold text-indigo-400">
              {entry.value.toLocaleString()}
            </div>
            <div className="text-xs text-neutral-500">comments</div>
          </div>
        );
    }
  };

  const avatarUrl = getAvatarUrl();

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg ${
        isCurrentUser
          ? "bg-lime-400/10 border border-lime-400/30"
          : "bg-neutral-800/50 hover:bg-neutral-800"
      } transition-colors`}
    >
      {/* Rank */}
      <div className="shrink-0">{getRankDisplay()}</div>

      {/* User info */}
      <Link
        href={`/${entry.username}`}
        className="flex items-center gap-3 flex-grow min-w-0"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={entry.username}
            width={40}
            height={40}
            className="rounded-full aspect-square object-cover shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-lime-400 flex items-center justify-center text-neutral-900 text-lg font-bold shrink-0">
            {entry.username[0].toUpperCase()}
          </div>
        )}
        <span
          className={`font-medium truncate ${
            isCurrentUser ? "text-lime-400" : "text-white"
          }`}
        >
          {entry.username}
          {isCurrentUser && (
            <span className="text-xs text-neutral-400 ml-2">(you)</span>
          )}
        </span>
      </Link>

      {/* Value */}
      <div className="shrink-0">{getValueDisplay()}</div>
    </div>
  );
}
