"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { MediaImage } from "@/src/components/ui/media-image";
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

// OPTIMIZATION 1: Move constants outside component to prevent recreation
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
} as const;

const MEDIA_TYPES = {
  MOVIE: "movie",
  TV: "tv",
} as const;

// OPTIMIZATION 2: Extract utility functions outside component
function formatDate(dateString: string | null): string | null {
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
}

function calculateProgress(watched: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((watched / total) * 100);
}

// OPTIMIZATION 3: Memoize individual grid items to prevent unnecessary re-renders
const ReelDeckCard = React.memo(
  ({ item, username }: { item: MediaWithReelDeck; username: string }) => {
    const statusConfig =
      STATUS_CONFIG[item.reelDeckItem.status as keyof typeof STATUS_CONFIG] ||
      STATUS_CONFIG.watching;
    const StatusIcon = statusConfig.icon;
    const isMovie = item.reelDeckItem.media_type === MEDIA_TYPES.MOVIE;
    const isSeries = item.reelDeckItem.media_type === MEDIA_TYPES.TV;

    // Memoize computed values
    const detailUrl = useMemo(
      () =>
        isMovie
          ? `/movies/${item.id}`
          : `/${username}/reel-deck/series/${item.id}`,
      [isMovie, item.id, username],
    );

    const progress = useMemo(
      () =>
        isSeries && item.totalEpisodes
          ? calculateProgress(
              item.watchedEpisodes || 0,
              item.totalEpisodes || 0,
            )
          : 0,
      [isSeries, item.watchedEpisodes, item.totalEpisodes],
    );

    const formattedDate = useMemo(
      () => formatDate(item.reelDeckItem.last_watched_at),
      [item.reelDeckItem.last_watched_at],
    );

    const showProgress =
      isSeries && item.totalEpisodes && item.totalEpisodes > 0;

    return (
      <article className="group relative bg-neutral-900 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-all overflow-hidden hover:shadow-lg hover:shadow-black/20">
        {/* Poster */}
        <Link href={detailUrl} className="block">
          <div className="relative aspect-[2/3] bg-neutral-800 overflow-hidden">
            {/* OPTIMIZED: Using MediaImage component */}
            <MediaImage
              src={item.poster_path}
              alt={item.title}
              mediaType={isMovie ? "movie" : "tv"}
              size="md"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Status Badge */}
            <div
              className={`absolute top-0 left-0 right-0 ${statusConfig.bgColor} ${statusConfig.textColor} px-3 py-2 flex items-center justify-center gap-2 shadow-lg`}
            >
              <StatusIcon size={16} />
              <span className="text-sm font-bold uppercase tracking-wide">
                {statusConfig.label}
              </span>
            </div>

            {/* Progress Bar for TV Shows */}
            {showProgress && (
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
            {formattedDate && (
              <p className="text-xs text-neutral-600">
                Updated {formattedDate}
              </p>
            )}
          </div>
        </div>
      </article>
    );
  },
  // OPTIMIZATION 6: Custom comparison function for better memo performance
  (prevProps, nextProps) => {
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.item.reelDeckItem.status ===
        nextProps.item.reelDeckItem.status &&
      prevProps.item.reelDeckItem.last_watched_at ===
        nextProps.item.reelDeckItem.last_watched_at &&
      prevProps.item.watchedEpisodes === nextProps.item.watchedEpisodes &&
      prevProps.username === nextProps.username
    );
  },
);

ReelDeckCard.displayName = "ReelDeckCard";

// OPTIMIZATION 7: Memoize the entire grid component
function ReelDeckGrid({ items, username, userId }: ReelDeckGridProps) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {items.map((item) => (
        <ReelDeckCard key={item.id} item={item} username={username} />
      ))}
    </div>
  );
}

// OPTIMIZATION 8: Export memoized version of the component
export default React.memo(ReelDeckGrid);
