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
  IconChecks,
  IconHourglass,
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
  watchedAiredEpisodes?: number;
  airedEpisodesCount?: number;
  hasUpcomingEpisodes?: boolean;
  nextUpcomingEpisodeDate?: string | null;
  seriesStatus?: string | null; // TMDB status: Returning Series, Ended, Canceled, etc.
}

interface ReelDeckGridProps {
  items: MediaWithReelDeck[];
  username: string;
  userId: string;
}

// Display status types for computed statuses
type DisplayStatus =
  | "watching"
  | "up_to_date"
  | "completed"
  | "waiting"
  | "paused";

// OPTIMIZATION 1: Move constants outside component to prevent recreation
const STATUS_CONFIG: Record<
  DisplayStatus,
  {
    label: string;
    icon: typeof IconPlayerPlay;
    color: string;
    bgColor: string;
    textColor: string;
  }
> = {
  watching: {
    label: "Watching",
    icon: IconPlayerPlay,
    color: "text-blue-400",
    bgColor: "bg-blue-500",
    textColor: "text-white",
  },
  up_to_date: {
    label: "Up to Date",
    icon: IconChecks,
    color: "text-teal-400",
    bgColor: "bg-teal-500",
    textColor: "text-white",
  },
  completed: {
    label: "Completed",
    icon: IconCircleCheck,
    color: "text-lime-400",
    bgColor: "bg-lime-500",
    textColor: "text-neutral-900",
  },
  waiting: {
    label: "Waiting",
    icon: IconHourglass,
    color: "text-purple-400",
    bgColor: "bg-purple-500",
    textColor: "text-white",
  },
  paused: {
    label: "On Hold",
    icon: IconPlayerPause,
    color: "text-orange-400",
    bgColor: "bg-orange-500",
    textColor: "text-white",
  },
};

const MEDIA_TYPES = {
  MOVIE: "movie",
  TV: "tv",
} as const;

/**
 * Computes the display status based on episode progress and series airing status
 *
 * Logic:
 * - Paused: User manually set status to "paused" (takes priority)
 * - Watching: Has unwatched aired episodes
 * - Up to Date: Caught up on all aired episodes + series is still airing (Returning Series/In Production)
 * - Completed: Watched all episodes + series has ended (Ended/Canceled) OR user marked as completed
 * - Waiting: Caught up + has upcoming episodes with known air dates
 */
function computeDisplayStatus(item: MediaWithReelDeck): DisplayStatus {
  const isMovie = item.reelDeckItem.media_type === MEDIA_TYPES.MOVIE;
  const userStatus = item.reelDeckItem.status;

  // User manually paused - takes priority
  if (userStatus === "paused") {
    return "paused";
  }

  // Movies: simple logic
  if (isMovie) {
    return userStatus === "completed" ? "completed" : "watching";
  }

  // TV Shows: compute based on episode progress and series status
  const watchedAired = item.watchedAiredEpisodes || 0;
  const airedCount = item.airedEpisodesCount || 0;
  const totalEpisodes = item.totalEpisodes || 0;
  const watchedEpisodes = item.watchedEpisodes || 0;
  const hasUpcoming = item.hasUpcomingEpisodes || false;
  const seriesStatus = item.seriesStatus;

  // Check if caught up on aired episodes
  const isCaughtUpOnAired = airedCount > 0 && watchedAired >= airedCount;

  // Check if series has ended
  const seriesEnded = seriesStatus === "Ended" || seriesStatus === "Canceled";

  // Check if series is still airing
  const seriesAiring =
    seriesStatus === "Returning Series" || seriesStatus === "In Production";

  // User manually marked as completed OR (watched all + series ended + no upcoming)
  if (
    userStatus === "completed" ||
    (watchedEpisodes >= totalEpisodes &&
      totalEpisodes > 0 &&
      seriesEnded &&
      !hasUpcoming)
  ) {
    return "completed";
  }

  // Caught up on aired episodes
  if (isCaughtUpOnAired) {
    // Has upcoming episodes with dates - waiting for next episode
    if (hasUpcoming && item.nextUpcomingEpisodeDate) {
      return "waiting";
    }

    // Series still airing but no upcoming dates yet - up to date
    if (seriesAiring) {
      return "up_to_date";
    }

    // Series ended and caught up - completed
    if (seriesEnded) {
      return "completed";
    }

    // Default for caught up: up to date
    return "up_to_date";
  }

  // Has unwatched aired episodes - watching
  return "watching";
}

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
    // Compute the display status based on episode progress and series status
    const displayStatus = useMemo(() => computeDisplayStatus(item), [item]);
    const statusConfig = STATUS_CONFIG[displayStatus];
    const StatusIcon = statusConfig.icon;
    const isMovie = item.reelDeckItem.media_type === MEDIA_TYPES.MOVIE;
    const isSeries = item.reelDeckItem.media_type === MEDIA_TYPES.TV;

    // Memoize computed values
    const detailUrl = useMemo(
      () =>
        isMovie ? `/movies/${item.id}` : `/me/reel-deck/series/${item.id}`,
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
          <div className="relative aspect-2/3 bg-neutral-800 overflow-hidden">
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
              <div className="absolute bottom-0 left-0 right-0 bg-neutral-900/95 backdrop-blur-xs p-3 border-t border-neutral-800">
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
      prevProps.item.watchedAiredEpisodes ===
        nextProps.item.watchedAiredEpisodes &&
      prevProps.item.airedEpisodesCount === nextProps.item.airedEpisodesCount &&
      prevProps.item.hasUpcomingEpisodes ===
        nextProps.item.hasUpcomingEpisodes &&
      prevProps.item.seriesStatus === nextProps.item.seriesStatus &&
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
