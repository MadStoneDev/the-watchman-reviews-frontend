"use client";

import Link from "next/link";
import { IconTrophy } from "@tabler/icons-react";

interface AchievementsLinkProps {
  username: string;
  unlockedCount: number;
  totalCount: number;
  basePath?: string; // Optional base path (e.g., "/me" instead of "/{username}")
}

export default function AchievementsLink({
  username,
  unlockedCount,
  totalCount,
  basePath,
}: AchievementsLinkProps) {
  const base = basePath || `/${username}`;

  return (
    <Link
      href={`${base}/achievements`}
      className="group flex items-center gap-2 text-sm hover:text-amber-400 transition-colors"
    >
      <IconTrophy size={16} className="text-amber-400" />
      <span className="font-bold text-neutral-100 group-hover:text-amber-400">
        {unlockedCount}
      </span>
      <span className="text-neutral-400 group-hover:text-amber-400">
        / {totalCount} Achievements
      </span>
    </Link>
  );
}
