"use client";

import React from "react";
import Image from "next/image";
import { IconTrophy, IconTrendingUp } from "@tabler/icons-react";
import { createClient } from "@/src/utils/supabase/client";
import type { LeaderboardEntry, LeaderboardType } from "@/src/app/actions/leaderboards";

interface LeaderboardUserRankProps {
  userRank: LeaderboardEntry;
  type: LeaderboardType;
}

export default function LeaderboardUserRank({
  userRank,
  type,
}: LeaderboardUserRankProps) {
  const supabase = createClient();

  const getAvatarUrl = () => {
    if (userRank.avatar_path) {
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(userRank.avatar_path);
      return data.publicUrl;
    }
    return null;
  };

  const getTypeLabel = () => {
    switch (type) {
      case "episodes":
        return "episodes watched";
      case "shows":
        return "shows completed";
      case "achievements":
        return "achievement points";
      case "comments":
        return "comments";
      default:
        return "";
    }
  };

  const avatarUrl = getAvatarUrl();

  return (
    <div className="bg-neutral-800 rounded-xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
          Your Rank
        </h3>
        <IconTrendingUp size={20} className="text-lime-400" />
      </div>

      <div className="flex items-center gap-4">
        {/* Avatar */}
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={userRank.username}
            width={56}
            height={56}
            className="rounded-full aspect-square object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-lime-400 flex items-center justify-center text-neutral-900 text-2xl font-bold">
            {userRank.username[0].toUpperCase()}
          </div>
        )}

        {/* Rank info */}
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-white">#{userRank.rank}</span>
            {userRank.rank <= 3 && (
              <IconTrophy
                size={24}
                className={
                  userRank.rank === 1
                    ? "text-amber-400"
                    : userRank.rank === 2
                    ? "text-neutral-300"
                    : "text-orange-400"
                }
              />
            )}
          </div>
          <p className="text-sm text-neutral-400">
            {userRank.value.toLocaleString()} {getTypeLabel()}
          </p>
        </div>
      </div>
    </div>
  );
}
