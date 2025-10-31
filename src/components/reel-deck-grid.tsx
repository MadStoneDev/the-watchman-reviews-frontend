"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconChairDirector,
  IconDeviceTv,
  IconPlayerPlay,
  IconPlayerPause,
  IconCircleCheck,
  IconClock,
  IconCalendar,
  IconProgress,
} from "@tabler/icons-react";

interface ReelDeckItem {
  id: string;
  added_at: string | null;
  last_watched_at: string | null;
  media_id: string;
  media_type: string;
  status: string | null;
  user_id: string;
}

interface MediaWithReelDeck {
  id: string;
  title: string;
  poster_path: string | null;
  release_year: string | null;
  tmdb_id: number;
  reelDeckItem: ReelDeckItem;
  watchedEpisodes?: number;
  totalEpisodes?: number;
}

interface ReelDeckGridProps {
  items: MediaWithReelDeck[];
  username: string;
  userId: string;
}

const STATUS_CONFIG = {
  watching: {
    label: "Watching",
    icon: IconPlayerPlay,
    color: "text-blue-400",
    bgColor: "bg-blue-500",
    textColor: "text-white",
  },
  completed: {
    label: "Completed",
    icon: IconCircleCheck,
    color: "text-lime-400",
    bgColor: "bg-lime-500",
    textColor: "text-neutral-900",
  },
  paused: {
    label: "On Hold",
    icon: IconPlayerPause,
    color: "text-orange-400",
    bgColor: "bg-orange-500",
    textColor: "text-white",
  },
  plan_to_watch: {
    label: "Plan to Watch",
    icon: IconClock,
    color: "text-neutral-400",
    bgColor: "bg-neutral-600",
    textColor: "text-white",
  },
};

export default function ReelDeckGrid({
  items,
  username,
  userId,
}: ReelDeckGridProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateProgress = (watched: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((watched / total) * 100);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((item) => {
        const statusConfig =
          STATUS_CONFIG[
            item.reelDeckItem.status as keyof typeof STATUS_CONFIG
          ] || STATUS_CONFIG.watching;
        const StatusIcon = statusConfig.icon;
        const isMovie = item.reelDeckItem.media_type === "movie";
        const isSeries = item.reelDeckItem.media_type === "tv";

        // For TV shows, link to progress page; for movies, link to detail page
        const detailUrl = isMovie
          ? `/movies/${item.id}`
          : `/${username}/reel-deck/series/${item.id}`;

        const progress =
          isSeries && item.totalEpisodes
            ? calculateProgress(
                item.watchedEpisodes || 0,
                item.totalEpisodes || 0,
              )
            : 0;

        return (
          <article
            key={item.id}
            className="group relative bg-neutral-900 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-all overflow-hidden hover:shadow-lg hover:shadow-black/20"
          >
            {/* Poster */}
            <Link href={detailUrl} className="block">
              <div className="relative aspect-[2/3] bg-neutral-800">
                {item.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {isMovie ? (
                      <IconChairDirector
                        size={48}
                        className="text-neutral-600"
                      />
                    ) : (
                      <IconDeviceTv size={48} className="text-neutral-600" />
                    )}
                  </div>
                )}

                {/* Large Status Badge - Top */}
                <div
                  className={`absolute top-0 left-0 right-0 ${statusConfig.bgColor} ${statusConfig.textColor} px-3 py-2 flex items-center justify-center gap-2 shadow-lg`}
                >
                  <StatusIcon size={16} />
                  <span className="text-sm font-bold uppercase tracking-wide">
                    {statusConfig.label}
                  </span>
                </div>

                {/* Progress Bar for TV Shows */}
                {isSeries && item.totalEpisodes && item.totalEpisodes > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-neutral-900/95 backdrop-blur-sm p-3 border-t border-neutral-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <IconProgress size={14} className="text-neutral-400" />
                        <span className="text-xs font-medium text-neutral-300">
                          Progress
                        </span>
                      </div>
                      <span className="text-xs font-bold text-neutral-200">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-lime-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-neutral-400 mt-2 text-center">
                      {item.watchedEpisodes} / {item.totalEpisodes} episodes
                    </p>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>

            {/* Content */}
            <div className="p-3">
              <Link href={detailUrl}>
                <h3 className="text-sm font-medium line-clamp-2 mb-2 group-hover:text-lime-400 transition-colors leading-tight">
                  {item.title}
                </h3>
              </Link>

              {/* Meta Info */}
              <div className="space-y-1.5">
                {/* Release Year & Type */}
                <div className="flex items-center gap-2">
                  {item.release_year && (
                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                      <IconCalendar size={12} />
                      <span>{item.release_year}</span>
                    </div>
                  )}
                  <span className="text-neutral-700">•</span>
                  <span className="text-xs text-neutral-500">
                    {isMovie ? "Movie" : "TV Series"}
                  </span>
                </div>

                {/* Last Watched */}
                {item.reelDeckItem.last_watched_at && (
                  <p className="text-xs text-neutral-600">
                    Updated {formatDate(item.reelDeckItem.last_watched_at)}
                  </p>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
