"use client";

import React, {
  useState,
  useOptimistic,
  useTransition,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import {
  IconChevronDown,
  IconChevronUp,
  IconCheck,
  IconRotate,
  IconTrash,
  IconClock,
  IconCalendar,
  IconLoader2,
  IconMessage2,
  IconRefresh,
} from "@tabler/icons-react";

import { toast } from "sonner";

interface Episode {
  id: string;
  episode_number: number;
  title: string;
  isWatched: boolean;
  air_date: string | null;
  hasAired: boolean;
}

interface Season {
  id: string;
  season_number: number;
  title: string | null;
  poster_path: string | null;
  episodes: Episode[];
  watchedCount: number;
  totalCount: number;
  percentage: number;
  isLoading?: boolean;
}

interface WatchCycle {
  id: string;
  cycle_number: number;
  status: string;
  started_at: string;
  episodes_watched: number;
  total_episodes: number;
}

interface SeriesProgressTrackerProps {
  seasons: Season[];
  seriesId: string;
  userId: string;
  username?: string;
  initialWatchedIds: string[];
  initialWatchCycle?: WatchCycle | null;
}

// Memoize date formatting functions outside component for better performance
const formatAirDate = (airDate: string | null): string => {
  if (!airDate) return "Date TBA";
  const date = new Date(airDate);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const getRelativeAirDate = (airDate: string | null): string | null => {
  if (!airDate) return null;

  const airDateTime = new Date(airDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  airDateTime.setHours(0, 0, 0, 0);

  const diffTime = airDateTime.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return null;
  if (diffDays === 0) return "Airs today";
  if (diffDays === 1) return "Airs tomorrow";
  if (diffDays === 2) return "Airs in 2 days";

  // Get day name for dates beyond 2 days
  const dayName = airDateTime.toLocaleDateString("en-US", { weekday: "long" });

  // Calculate calendar weeks (Sunday-based)
  const currentSunday = new Date(today);
  currentSunday.setDate(today.getDate() - today.getDay());
  currentSunday.setHours(0, 0, 0, 0);

  const airSunday = new Date(airDateTime);
  airSunday.setDate(airDateTime.getDate() - airDateTime.getDay());
  airSunday.setHours(0, 0, 0, 0);

  const weeksDiff = Math.round(
    (airSunday.getTime() - currentSunday.getTime()) / (1000 * 60 * 60 * 24 * 7),
  );

  // Same week (after 2 days threshold)
  if (weeksDiff === 0) return `Airs this week, on ${dayName}`;

  // Next week
  if (weeksDiff === 1) return `Airs next week, on ${dayName}`;

  // 2-4 weeks out
  if (weeksDiff <= 4) return `Airs in ${weeksDiff} weeks, on ${dayName}`;

  // Calculate months for dates beyond 4 weeks
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const airMonth = airDateTime.getMonth();
  const airYear = airDateTime.getFullYear();

  const monthsDiff = (airYear - currentYear) * 12 + (airMonth - currentMonth);

  if (monthsDiff === 1) return "Airs next month";
  if (monthsDiff > 1) return `Airs in ${monthsDiff} months`;

  return null;
};

// Helper to get ordinal suffix (st, nd, rd, th)
const getOrdinalSuffix = (n: number): string => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};

// Memoized episode item component
const EpisodeItem = React.memo(
  ({
    episode,
    seriesId,
    seasonId,
    onToggle,
    isPending,
  }: {
    episode: Episode;
    seriesId: string;
    seasonId: string;
    onToggle: (id: string, watched: boolean, hasAired: boolean) => void;
    isPending: boolean;
  }) => {
    const router = useRouter();
    const relativeAirDate = useMemo(
      () => getRelativeAirDate(episode.air_date),
      [episode.air_date],
    );
    const formattedAirDate = useMemo(
      () => formatAirDate(episode.air_date),
      [episode.air_date],
    );
    const isDisabled = !episode.hasAired && !episode.isWatched;

    const handleDiscussionClick = () => {
      router.push(
        `/series/${seriesId}/seasons/${seasonId}/episodes/${episode.id}`,
      );
    };

    return (
      <article
        className={`group w-full flex items-center bg-neutral-800/50 rounded-lg transition-all`}
      >
        <button
          type="button"
          onClick={handleDiscussionClick}
          className={`cursor-pointer grid place-content-center w-14 md:w-0 group-hover:w-14 hover:text-lime-400 overflow-hidden transition-all`}
        >
          <IconMessage2 />
        </button>
        <button
          onClick={() =>
            onToggle(episode.id, episode.isWatched, episode.hasAired)
          }
          disabled={isDisabled || isPending}
          title={
            isDisabled
              ? `Episode hasn't aired yet (${formattedAirDate})`
              : episode.isWatched
                ? "Mark as unwatched"
                : "Mark as watched"
          }
          className={`group/watch cursor-pointer relative w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
            isDisabled || isPending
              ? "bg-neutral-800/30 cursor-not-allowed opacity-60"
              : episode.isWatched
                ? "bg-lime-400/10 border border-lime-400/20"
                : "bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600"
          }`}
        >
          {/* Hover Overlay */}
          {!isDisabled && !isPending && (
            <div className="absolute inset-0 rounded-lg bg-neutral-900/70 opacity-0 group-hover/watch:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
              <span className="text-sm font-medium text-white">
                {episode.isWatched ? "Unwatch episode" : "Mark as watched"}
              </span>
            </div>
          )}

          {/* Episode Info */}
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-sm font-medium ${
                  isDisabled ? "text-neutral-500" : "text-neutral-400"
                }`}
              >
                Episode {episode.episode_number}
              </span>
              <span className="text-neutral-600">•</span>
              <span
                className={`text-sm ${
                  episode.isWatched
                    ? "text-lime-400"
                    : isDisabled
                      ? "text-neutral-500"
                      : "text-neutral-300"
                }`}
              >
                {episode.title}
              </span>
              {relativeAirDate && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1">
                  <IconCalendar size={12} />
                  {relativeAirDate}
                </span>
              )}
            </div>
            {episode.air_date && (
              <p
                className={`text-xs mt-1 ${
                  isDisabled ? "text-neutral-600" : "text-neutral-500"
                }`}
              >
                <span className="font-bold">
                  {new Date(episode.air_date) > new Date() ? "Airs" : "Aired"}:
                </span>{" "}
                {formattedAirDate}
              </p>
            )}
          </div>

          {/* Checkbox with Loading State */}
          <div
            className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              episode.isWatched
                ? "bg-lime-400 border-lime-400"
                : isDisabled
                  ? "border-neutral-600"
                  : "border-neutral-600"
            }`}
          >
            {isPending ? (
              <IconLoader2
                size={14}
                className="animate-spin text-neutral-900"
              />
            ) : episode.isWatched ? (
              <IconCheck size={14} className="text-neutral-900" />
            ) : !episode.isWatched && isDisabled ? (
              <IconClock size={14} className="text-neutral-600" />
            ) : null}
          </div>
        </button>
      </article>
    );
  },
);

EpisodeItem.displayName = "EpisodeItem";

export default function SeriesProgressTracker({
  seasons: initialSeasons,
  seriesId,
  userId,
  username,
  initialWatchedIds,
  initialWatchCycle,
}: SeriesProgressTrackerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Core state
  const [seasons, setSeasons] = useState(initialSeasons);
  const [watchedIds, setWatchedIds] = useState(
    () => new Set(initialWatchedIds),
  );
  const [watchCycle, setWatchCycle] = useState<WatchCycle | null>(
    initialWatchCycle || null,
  );

  // Loading state
  const [loadedSeasons, setLoadedSeasons] = useState<Set<string>>(new Set());
  const [loadingSeasons, setLoadingSeasons] = useState<Set<string>>(new Set());

  // Track which specific episode/season is being updated
  const [pendingEpisodeId, setPendingEpisodeId] = useState<string | null>(null);
  const [pendingSeasonId, setPendingSeasonId] = useState<string | null>(null);

  // UI state
  const [openSeasons, setOpenSeasons] = useState<Set<number>>(new Set());
  const [resettingSeasons, setResettingSeasons] = useState<Set<string>>(
    new Set(),
  );
  const [startingRewatch, setStartingRewatch] = useState(false);
  const [resettingSeries, setResettingSeries] = useState(false);
  const [hasOpenedDefaultSeason, setHasOpenedDefaultSeason] = useState(false);

  // Optimistic state for episodes
  const [optimisticSeasons, setOptimisticSeasons] = useOptimistic(
    seasons,
    (currentSeasons, { seasonId, episodeId, allEpisodes, watched }: any) => {
      return currentSeasons.map((season) => {
        if (season.id !== seasonId) return season;

        let newEpisodes = season.episodes;

        if (allEpisodes) {
          newEpisodes = season.episodes.map((ep) => ({
            ...ep,
            isWatched: ep.hasAired ? watched : ep.isWatched,
          }));
        } else if (episodeId) {
          newEpisodes = season.episodes.map((ep) =>
            ep.id === episodeId ? { ...ep, isWatched: watched } : ep,
          );
        }

        const watchedCount = newEpisodes.filter((ep) => ep.isWatched).length;
        const percentage =
          season.totalCount > 0
            ? Math.round((watchedCount / season.totalCount) * 100)
            : 0;

        return {
          ...season,
          episodes: newEpisodes,
          watchedCount,
          percentage,
        };
      });
    },
  );

  // Calculate overall progress (excluding Season 0 / Extras)
  const overallProgress = useMemo(() => {
    const regularSeasons = optimisticSeasons.filter(
      (season) => season.season_number !== 0,
    );
    const totalEpisodes = regularSeasons.reduce(
      (sum, season) => sum + season.totalCount,
      0,
    );
    const watchedEpisodes = regularSeasons.reduce(
      (sum, season) => sum + season.watchedCount,
      0,
    );
    const percentage =
      totalEpisodes > 0
        ? Math.round((watchedEpisodes / totalEpisodes) * 100)
        : 0;

    return {
      watchedEpisodes,
      totalEpisodes,
      percentage,
    };
  }, [optimisticSeasons]);

  // Sync with server data when initialWatchedIds changes (after refresh)
  useEffect(() => {
    const newWatchedIds = new Set(initialWatchedIds);
    const hasChanged =
      newWatchedIds.size !== watchedIds.size ||
      Array.from(newWatchedIds).some((id) => !watchedIds.has(id));

    if (!hasChanged) return;

    setWatchedIds(newWatchedIds);

    setSeasons((prevSeasons) =>
      prevSeasons.map((season) => {
        if (season.episodes.length === 0) return season;

        const updatedEpisodes = season.episodes.map((ep) => ({
          ...ep,
          isWatched: newWatchedIds.has(ep.id),
        }));

        const watchedCount = updatedEpisodes.filter(
          (ep) => ep.isWatched,
        ).length;
        const percentage =
          season.totalCount > 0
            ? Math.round((watchedCount / season.totalCount) * 100)
            : 0;

        return {
          ...season,
          episodes: updatedEpisodes,
          watchedCount,
          percentage,
        };
      }),
    );
  }, [initialWatchedIds]); // Only initialWatchedIds

  // Memoize default season calculation
  const getDefaultOpenSeason = useCallback(() => {
    let lastCompletedIndex = -1;

    for (let i = optimisticSeasons.length - 1; i >= 0; i--) {
      const season = optimisticSeasons[i];

      if (season.percentage > 0 && season.percentage < 100) {
        return season.season_number;
      }

      if (season.percentage === 100) {
        lastCompletedIndex = i;
      }
    }

    if (lastCompletedIndex !== -1 && lastCompletedIndex > 0) {
      return optimisticSeasons[lastCompletedIndex - 1]?.season_number;
    }

    if (lastCompletedIndex === 0) {
      return optimisticSeasons[0]?.season_number || 1;
    }

    return optimisticSeasons[optimisticSeasons.length - 1]?.season_number || 1;
  }, [optimisticSeasons]);

  // Progressive loading of episodes
  const loadEpisodesForSeason = useCallback(
    async (seasonId: string, seasonNumber: number) => {
      if (loadedSeasons.has(seasonId) || loadingSeasons.has(seasonId)) {
        return;
      }

      setLoadingSeasons((prev) => new Set(prev).add(seasonId));

      try {
        const response = await fetch(
          `/api/series/${seriesId}/season/${seasonNumber}/episodes`,
        );

        // Handle 404 - season doesn't exist
        if (response.status === 404) {
          console.warn(
            `Season ${seasonNumber} not found, removing from display`,
          );

          // Remove this season from the list
          setSeasons((prevSeasons) =>
            prevSeasons.filter((s) => s.id !== seasonId),
          );

          setLoadedSeasons((prev) => new Set(prev).add(seasonId));
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load episodes");
        }

        const episodes = await response.json();
        const today = new Date().toISOString().split("T")[0];

        const transformedEpisodes = episodes
          .map((ep: any) => ({
            id: ep.id,
            episode_number: ep.episode_number,
            title: ep.title,
            isWatched: watchedIds.has(ep.id),
            air_date: ep.air_date,
            hasAired: ep.air_date ? ep.air_date <= today : false,
          }))
          .reverse();

        setSeasons((prevSeasons) =>
          prevSeasons.map((season) => {
            if (season.id !== seasonId) return season;

            const watchedCount = transformedEpisodes.filter((ep: Episode) =>
              watchedIds.has(ep.id),
            ).length;

            return {
              ...season,
              episodes: transformedEpisodes,
              watchedCount,
              percentage:
                season.totalCount > 0
                  ? Math.round((watchedCount / season.totalCount) * 100)
                  : 0,
              isLoading: false,
            };
          }),
        );

        setLoadedSeasons((prev) => new Set(prev).add(seasonId));
      } catch (error) {
        console.error("Error loading episodes:", error);
        toast.error("Failed to load episodes. Please try again.");
      } finally {
        setLoadingSeasons((prev) => {
          const newSet = new Set(prev);
          newSet.delete(seasonId);
          return newSet;
        });
      }
    },
    [seriesId, watchedIds, loadedSeasons, loadingSeasons],
  );

  // Load all seasons progressively on mount
  useEffect(() => {
    optimisticSeasons.forEach((season) => {
      if (!loadedSeasons.has(season.id) && !loadingSeasons.has(season.id)) {
        loadEpisodesForSeason(season.id, season.season_number);
      }
    });
  }, [optimisticSeasons, loadedSeasons, loadingSeasons, loadEpisodesForSeason]);

  // Open default season once all episodes loaded
  useEffect(() => {
    const allSeasonsLoaded = optimisticSeasons.every(
      (season) => loadedSeasons.has(season.id) || season.episodes.length > 0,
    );

    if (allSeasonsLoaded && !hasOpenedDefaultSeason) {
      const defaultSeason = getDefaultOpenSeason();
      setOpenSeasons(new Set([defaultSeason]));
      setHasOpenedDefaultSeason(true);
    }
  }, [
    loadedSeasons,
    hasOpenedDefaultSeason,
    optimisticSeasons,
    getDefaultOpenSeason,
  ]);

  const toggleSeason = useCallback((seasonNumber: number) => {
    setOpenSeasons((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(seasonNumber)) {
        newSet.delete(seasonNumber);
      } else {
        newSet.add(seasonNumber);
      }
      return newSet;
    });
  }, []);

  // ✨ FIXED: Update real state after successful API call
  const updateSeasonState = useCallback(
    (seasonId: string, episodeId: string, watched: boolean) => {
      setSeasons((prevSeasons) =>
        prevSeasons.map((season) => {
          if (season.id !== seasonId) return season;

          const updatedEpisodes = season.episodes.map((ep) =>
            ep.id === episodeId ? { ...ep, isWatched: watched } : ep,
          );

          const watchedCount = updatedEpisodes.filter(
            (ep) => ep.isWatched,
          ).length;
          const percentage =
            season.totalCount > 0
              ? Math.round((watchedCount / season.totalCount) * 100)
              : 0;

          return {
            ...season,
            episodes: updatedEpisodes,
            watchedCount,
            percentage,
          };
        }),
      );
    },
    [],
  );

  const handleEpisodeToggle = useCallback(
    async (
      episodeId: string,
      isCurrentlyWatched: boolean,
      hasAired: boolean,
    ) => {
      if (!hasAired && !isCurrentlyWatched) {
        toast.error("Cannot mark unaired episodes as watched");
        return;
      }

      const newWatchedState = !isCurrentlyWatched;
      const season = seasons.find((s) =>
        s.episodes.some((ep) => ep.id === episodeId),
      );

      if (!season) return;

      // Update local state immediately
      if (newWatchedState) {
        setWatchedIds((prev) => new Set(prev).add(episodeId));
      } else {
        setWatchedIds((prev) => {
          const next = new Set(prev);
          next.delete(episodeId);
          return next;
        });
      }

      setPendingEpisodeId(episodeId);

      // Optimistic update
      setOptimisticSeasons({
        seasonId: season.id,
        episodeId,
        watched: newWatchedState,
      });

      startTransition(async () => {
        try {
          const response = await fetch("/api/reel-deck/toggle-episode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              episodeId,
              seriesId,
              userId,
              isWatched: newWatchedState,
            }),
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Failed to update episode");
          }

          // ✨ FIXED: Update real state on success
          updateSeasonState(season.id, episodeId, newWatchedState);

          // Success - show toast
          toast.success(
            newWatchedState ? "Marked as watched" : "Marked as unwatched",
          );

          // Sync with server (non-blocking)
          router.refresh();
        } catch (error) {
          console.error("Error toggling episode:", error);

          // Revert optimistic update on error
          if (newWatchedState) {
            setWatchedIds((prev) => {
              const next = new Set(prev);
              next.delete(episodeId);
              return next;
            });
          } else {
            setWatchedIds((prev) => new Set(prev).add(episodeId));
          }

          // ✨ FIXED: Revert real state too
          setSeasons((prevSeasons) =>
            prevSeasons.map((s) => {
              if (s.id !== season.id) return s;

              const revertedEpisodes = s.episodes.map((ep) =>
                ep.id === episodeId
                  ? { ...ep, isWatched: isCurrentlyWatched }
                  : ep,
              );

              const watchedCount = revertedEpisodes.filter(
                (ep) => ep.isWatched,
              ).length;
              const percentage =
                s.totalCount > 0
                  ? Math.round((watchedCount / s.totalCount) * 100)
                  : 0;

              return {
                ...s,
                episodes: revertedEpisodes,
                watchedCount,
                percentage,
              };
            }),
          );

          toast.error(
            `Failed to mark as ${newWatchedState ? "watched" : "unwatched"}`,
          );
        } finally {
          setPendingEpisodeId(null);
        }
      });
    },
    [
      seasons,
      seriesId,
      userId,
      router,
      setOptimisticSeasons,
      startTransition,
      updateSeasonState,
    ],
  );

  // ✨ FIXED: Update real state for season toggle
  const updateSeasonStateAll = useCallback(
    (seasonId: string, watched: boolean) => {
      setSeasons((prevSeasons) =>
        prevSeasons.map((season) => {
          if (season.id !== seasonId) return season;

          const updatedEpisodes = season.episodes.map((ep) => ({
            ...ep,
            isWatched: ep.hasAired ? watched : ep.isWatched,
          }));

          const watchedCount = updatedEpisodes.filter(
            (ep) => ep.isWatched,
          ).length;
          const percentage =
            season.totalCount > 0
              ? Math.round((watchedCount / season.totalCount) * 100)
              : 0;

          return {
            ...season,
            episodes: updatedEpisodes,
            watchedCount,
            percentage,
          };
        }),
      );
    },
    [],
  );

  const handleMarkAllToggle = useCallback(
    async (seasonId: string, markAsWatched: boolean) => {
      const season = seasons.find((s) => s.id === seasonId);
      if (!season) return;

      const airedEpisodes = season.episodes.filter((ep) => ep.hasAired);
      const episodeIds = airedEpisodes.map((ep) => ep.id);

      if (episodeIds.length === 0) {
        toast.error("No aired episodes to update");
        return;
      }

      // Update local state immediately
      if (markAsWatched) {
        setWatchedIds((prev) => {
          const next = new Set(prev);
          episodeIds.forEach((id) => next.add(id));
          return next;
        });
      } else {
        setWatchedIds((prev) => {
          const next = new Set(prev);
          episodeIds.forEach((id) => next.delete(id));
          return next;
        });
      }

      setPendingSeasonId(seasonId);

      // Optimistic update
      setOptimisticSeasons({
        seasonId,
        allEpisodes: true,
        watched: markAsWatched,
      });

      const toastId = toast.loading(
        markAsWatched
          ? `Marking ${episodeIds.length} episodes as watched...`
          : `Unmarking ${episodeIds.length} episodes...`,
      );

      startTransition(async () => {
        try {
          const response = await fetch("/api/reel-deck/toggle-season", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              seasonId,
              seriesId,
              userId,
              markAsWatched,
            }),
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Failed to update season");
          }

          const data = await response.json();

          // ✨ FIXED: Update real state on success
          updateSeasonStateAll(seasonId, markAsWatched);

          toast.success(
            markAsWatched
              ? `Marked ${data.episodesAffected} episodes as watched`
              : `Unmarked ${data.episodesAffected} episodes`,
            { id: toastId },
          );

          // Sync with server (non-blocking)
          router.refresh();
        } catch (error) {
          console.error("Error toggling season:", error);

          // Revert optimistic update on error
          if (markAsWatched) {
            setWatchedIds((prev) => {
              const next = new Set(prev);
              episodeIds.forEach((id) => next.delete(id));
              return next;
            });
          } else {
            setWatchedIds((prev) => {
              const next = new Set(prev);
              episodeIds.forEach((id) => next.add(id));
              return next;
            });
          }

          // ✨ FIXED: Revert real state too
          updateSeasonStateAll(seasonId, !markAsWatched);

          toast.error("Failed to update season", { id: toastId });
        } finally {
          setPendingSeasonId(null);
        }
      });
    },
    [
      seasons,
      seriesId,
      userId,
      router,
      setOptimisticSeasons,
      startTransition,
      updateSeasonStateAll,
    ],
  );

  const handleResetSeason = useCallback(
    async (seasonId: string) => {
      if (!confirm("Reset all progress for this season?")) return;

      const season = seasons.find((s) => s.id === seasonId);
      if (!season) return;

      setResettingSeasons((prev) => new Set(prev).add(seasonId));

      const toastId = toast.loading("Resetting season...");

      try {
        const response = await fetch("/api/reel-deck/reset-season", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            seasonId,
            seriesId,
            userId,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to reset season");
        }

        // ✨ FIXED: Update real state on success
        updateSeasonStateAll(seasonId, false);

        toast.success("Season progress reset", { id: toastId });
        router.refresh();
      } catch (error) {
        console.error("Error resetting season:", error);
        toast.error("Failed to reset season", { id: toastId });
      } finally {
        setResettingSeasons((prev) => {
          const next = new Set(prev);
          next.delete(seasonId);
          return next;
        });
      }
    },
    [seriesId, userId, router, seasons, updateSeasonStateAll],
  );

  const handleResetSeries = useCallback(async () => {
    if (
      !confirm("Reset all progress for this series? This cannot be undone.")
    ) {
      return;
    }

    setResettingSeries(true);

    const toastId = toast.loading("Resetting series...");

    try {
      const response = await fetch("/api/reel-deck/reset-series", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seriesId,
          userId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to reset series");
      }

      // ✨ FIXED: Update real state on success - mark all unwatched
      setWatchedIds(new Set());
      setSeasons((prevSeasons) =>
        prevSeasons.map((season) => {
          const updatedEpisodes = season.episodes.map((ep) => ({
            ...ep,
            isWatched: false,
          }));

          return {
            ...season,
            episodes: updatedEpisodes,
            watchedCount: 0,
            percentage: 0,
          };
        }),
      );

      toast.success("Series progress reset", {
        id: toastId,
        description: "All episodes have been unmarked",
      });

      router.refresh();
    } catch (error) {
      console.error("Error resetting series:", error);
      toast.error("Failed to reset series", { id: toastId });
    } finally {
      setResettingSeries(false);
    }
  }, [seriesId, userId, router]);

  const handleStartRewatch = useCallback(async () => {
    const cycleNumber = watchCycle?.cycle_number || 1;
    const confirmMessage = `Start Rewatch #${cycleNumber + 1}?

A rewatch means you're starting the series over from the beginning — like rewatching your favorite show for the ${cycleNumber + 1}${getOrdinalSuffix(cycleNumber + 1)} time.

This will:
• Clear your current watch progress
• Mark your previous watch as complete
• Start a fresh viewing cycle

Your rewatch count will be saved and contributes to achievements.

Continue?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setStartingRewatch(true);

    const toastId = toast.loading("Starting rewatch...");

    try {
      const response = await fetch("/api/reel-deck/start-rewatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seriesId,
          userId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to start rewatch");
      }

      const data = await response.json();

      // Update local state
      setWatchedIds(new Set());
      setSeasons((prevSeasons) =>
        prevSeasons.map((season) => {
          const updatedEpisodes = season.episodes.map((ep) => ({
            ...ep,
            isWatched: false,
          }));

          return {
            ...season,
            episodes: updatedEpisodes,
            watchedCount: 0,
            percentage: 0,
          };
        }),
      );

      // Update watch cycle state
      if (data.cycle) {
        setWatchCycle(data.cycle);
      }

      toast.success(`Started rewatch #${data.cycle?.cycle_number || cycleNumber + 1}`, {
        id: toastId,
        description: "Your progress has been reset. Enjoy rewatching!",
      });

      router.refresh();
    } catch (error) {
      console.error("Error starting rewatch:", error);
      toast.error("Failed to start rewatch", { id: toastId });
    } finally {
      setStartingRewatch(false);
    }
  }, [seriesId, userId, router, watchCycle]);

  const hasAnyProgress = useMemo(
    () => optimisticSeasons.some((s) => s.watchedCount > 0),
    [optimisticSeasons],
  );

  // Helper to format cycle text
  const getCycleText = () => {
    if (!watchCycle || watchCycle.cycle_number <= 1) return null;
    const ordinal = getOrdinal(watchCycle.cycle_number);
    return `${ordinal} Watch`;
  };

  const getOrdinal = (n: number) => n + getOrdinalSuffix(n);

  return (
    <div className="space-y-4">
      {/* Overall Progress Card */}
      <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">Overall Progress</h2>
            {getCycleText() && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                {getCycleText()}
              </span>
            )}
          </div>
          <span className="text-2xl font-bold text-lime-400">
            {overallProgress.percentage}%
          </span>
        </div>
        <p className="text-sm text-neutral-400 mb-3">
          {overallProgress.watchedEpisodes} of {overallProgress.totalEpisodes}{" "}
          episodes watched
        </p>
        <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden">
          <div
            className="bg-lime-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${overallProgress.percentage}%` }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          {hasAnyProgress && (
            <button
              onClick={handleResetSeries}
              disabled={resettingSeries || startingRewatch}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-red-900/20 text-red-400 hover:bg-red-900/30 border border-red-800/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resettingSeries ? (
                <IconLoader2 size={16} className="animate-spin" />
              ) : (
                <IconTrash size={16} />
              )}
              {resettingSeries ? "Resetting..." : "Reset All Progress"}
            </button>
          )}
        </div>

        {hasAnyProgress && (
          <button
            onClick={handleStartRewatch}
            disabled={startingRewatch || resettingSeries}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 border border-indigo-500/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {startingRewatch ? (
              <IconLoader2 size={16} className="animate-spin" />
            ) : (
              <IconRefresh size={16} />
            )}
            {startingRewatch ? "Starting..." : "Start a Rewatch"}
          </button>
        )}
      </div>

      {/* Seasons */}
      {optimisticSeasons.map((season) => {
        const isOpen = openSeasons.has(season.season_number);
        const allWatched = season.percentage === 100;
        const hasProgress = season.watchedCount > 0;
        const isResetting = resettingSeasons.has(season.id);
        const isLoading = loadingSeasons.has(season.id);
        const hasEpisodes = season.episodes.length > 0;
        const isSeasonPending = pendingSeasonId === season.id;

        return (
          <div
            key={season.id}
            className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden"
          >
            {/* Season Header */}
            <div
              className="p-4 cursor-pointer"
              onClick={() => toggleSeason(season.season_number)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className={`flex items-center gap-3`}>
                    <h3 className="text-lg font-semibold">
                      {season.season_number === 0
                        ? "Extras"
                        : `Season ${season.season_number}`}
                    </h3>
                    <span>|</span>
                    <a
                      href={`/series/${seriesId}/seasons/${season.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className={`flex items-center gap-1 text-sm text-neutral-400 hover:text-lime-400 transition-colors`}
                    >
                      <IconMessage2 size={16} />
                      Join the Discussion
                    </a>
                  </div>
                  <p className="text-sm text-neutral-400 mt-1">
                    {season.watchedCount} of {season.totalCount} episodes
                    watched
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2">
                  {!allWatched && hasProgress && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResetSeason(season.id);
                      }}
                      disabled={isResetting}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-red-800/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Reset season progress"
                    >
                      <IconRotate
                        size={16}
                        className={isResetting ? "animate-spin" : ""}
                      />
                      <span className="hidden sm:inline">Reset</span>
                    </button>
                  )}

                  {!allWatched && hasEpisodes && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAllToggle(season.id, true);
                      }}
                      disabled={isPending && isSeasonPending}
                      className="cursor-pointer px-3 py-1.5 text-sm font-medium bg-lime-400 text-neutral-900 hover:bg-lime-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      title="Mark all aired episodes as watched"
                    >
                      {isPending && isSeasonPending && (
                        <IconLoader2 size={16} className="animate-spin" />
                      )}
                      Mark All Watched
                    </button>
                  )}

                  {allWatched && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAllToggle(season.id, false);
                      }}
                      disabled={isPending && isSeasonPending}
                      className="px-3 py-1.5 text-sm font-medium bg-neutral-800 text-neutral-300 hover:bg-neutral-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isPending && isSeasonPending && (
                        <IconLoader2 size={16} className="animate-spin" />
                      )}
                      Mark All Unwatched
                    </button>
                  )}

                  <button
                    onClick={() => toggleSeason(season.season_number)}
                    className="p-2 text-neutral-400 hover:text-lime-400 transition-colors"
                    aria-label={isOpen ? "Collapse season" : "Expand season"}
                  >
                    {isOpen ? (
                      <IconChevronUp size={20} />
                    ) : (
                      <IconChevronDown size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-lime-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${season.percentage}%` }}
                />
              </div>
            </div>

            {/* Episodes List */}
            <div
              className={`border-t border-neutral-800 px-4 space-y-2 transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen
                  ? `py-4 max-h-fit md:max-h-[${season.episodes.length * 80 + 100}px]`
                  : "max-h-0 py-0"
              }`}
            >
              {isLoading && (
                <div className="flex items-center justify-center py-8 text-neutral-400">
                  <IconLoader2 size={24} className="animate-spin mr-2" />
                  <span>Loading episodes...</span>
                </div>
              )}

              {!isLoading && hasEpisodes && (
                <>
                  {season.episodes.map((episode) => (
                    <EpisodeItem
                      key={episode.id}
                      episode={episode}
                      seriesId={seriesId}
                      seasonId={season.id}
                      onToggle={handleEpisodeToggle}
                      isPending={isPending && pendingEpisodeId === episode.id}
                    />
                  ))}
                </>
              )}

              {!isLoading && !hasEpisodes && (
                <div className="py-8 text-center text-neutral-500">
                  No episodes found for this season.
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
