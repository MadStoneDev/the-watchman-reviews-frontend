"use client";

import Link from "next/link";
import type { FollowCounts } from "@/src/lib/types";

interface FollowCountsDisplayProps {
  username: string;
  counts: FollowCounts;
  basePath?: string; // Optional base path (e.g., "/me" instead of "/{username}")
}

export default function FollowCountsDisplay({
  username,
  counts,
  basePath,
}: FollowCountsDisplayProps) {
  const base = basePath || `/${username}`;
  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="flex gap-4 text-sm">
      <Link
        href={`${base}/followers`}
        className="group flex items-center gap-1 hover:text-lime-400 transition-colors"
      >
        <span className="font-bold text-neutral-100 group-hover:text-lime-400">
          {formatCount(counts.followers)}
        </span>
        <span className="text-neutral-400 group-hover:text-lime-400">
          {counts.followers === 1 ? "Follower" : "Followers"}
        </span>
      </Link>
      <Link
        href={`${base}/following`}
        className="group flex items-center gap-1 hover:text-lime-400 transition-colors"
      >
        <span className="font-bold text-neutral-100 group-hover:text-lime-400">
          {formatCount(counts.following)}
        </span>
        <span className="text-neutral-400 group-hover:text-lime-400">
          Following
        </span>
      </Link>
    </div>
  );
}
