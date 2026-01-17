"use client";

import React from "react";
import { IconMoodEmpty } from "@tabler/icons-react";
import LeaderboardRow from "./leaderboard-row";
import type { LeaderboardEntry, LeaderboardType } from "@/src/app/actions/leaderboards";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  type: LeaderboardType;
  currentUserId?: string;
}

export default function LeaderboardTable({
  entries,
  type,
  currentUserId,
}: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
        <IconMoodEmpty size={48} className="mb-4" />
        <p className="text-lg">No data yet</p>
        <p className="text-sm mt-1">
          Be the first to appear on this leaderboard!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <LeaderboardRow
          key={entry.user_id}
          entry={entry}
          type={type}
          isCurrentUser={entry.user_id === currentUserId}
        />
      ))}
    </div>
  );
}
