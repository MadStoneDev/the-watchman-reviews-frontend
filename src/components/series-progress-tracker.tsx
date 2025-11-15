"use client";

import React, {
  useState,
  useOptimistic,
  useTransition,
  useEffect,
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
} from "@tabler/icons-react";

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

interface SeriesProgressTrackerProps {
  seasons: Season[];
  seriesId: string;
  userId: string;
  username: string;
  initialWatchedIds: string[];
}

// OPTIMIZATION 1: Memoize episode item to prevent unnecessary re-renders
const EpisodeItem = React.memo(
  ({
    episode,
    onToggle,
    formatAirDate,
    getRelativeAirDate,
  }: {
    episode: Episode;
    onToggle: (id: string, watched: boolean, hasAired: boolean) => void;
    formatAirDate: (date: string | null) => string;
    getRelativeAirDate: (date: string | null) => string | null;
  }) => {
    const relativeAirDate = getRelativeAirDate(episode.air_date);
    const isDisabled = !episode.hasAired && !episode.isWatched;

    return (
      <button
        onClick={() =>
          onToggle(episode.id, episode.isWatched, episode.hasAired)
        }
        disabled={isDisabled}
        title={
          isDisabled
            ? `Episode hasn't aired yet (${formatAirDate(episode.air_date)})`
            : episode.isWatched
              ? "Mark as unwatched"
              : "Mark as watched"
        }
        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
          isDisabled
            ? "bg-neutral-800/30 cursor-not-allowed opacity-60"
            : episode.isWatched
              ? "bg-lime-400/10 border border-lime-400/20"
              : "bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600"
        }`}
      >
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
              {formatAirDate(episode.air_date)}
            </p>
          )}
        </div>

        {/* Checkbox */}
        <div
          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            episode.isWatched
              ? "bg-lime-400 border-lime-400"
              : isDisabled
                ? "border-neutral-600"
                : "border-neutral-600"
          }`}
        >
          {episode.isWatched && (
            <IconCheck size={14} className="text-neutral-900" />
          )}
          {!episode.isWatched && isDisabled && (
            <IconClock size={14} className="text-neutral-600" />
          )}
        </div>
      </button>
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
}: SeriesProgressTrackerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [seasons, setSeasons] = useState(initialSeasons);
  const [loadedSeasons, setLoadedSeasons] = useState<Set<string>>(new Set());
  const [loadingSeasons, setLoadingSeasons] = useState<Set<string>>(new Set());

  // OPTIMIZATION 2: Store watched IDs in state for faster lookups
  const [watchedIds, setWatchedIds] = useState(
    () => new Set(initialWatchedIds),
  );

  useEffect(() => {
    const newWatchedIds = new Set(initialWatchedIds);
    setWatchedIds(newWatchedIds);

    // Update episodes' isWatched status based on new watchedIds from server
    setSeasons((prevSeasons) =>
      prevSeasons.map((season) => {
        // Only update if this season has loaded episodes
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
  }, [initialWatchedIds]);

  // Optimistic state for episodes
  const [optimisticSeasons, setOptimisticSeasons] = useOptimistic(
    seasons,
    (currentSeasons, { seasonId, episodeId, allEpisodes, watched }: any) => {
      return currentSeasons.map((season) => {
        if (season.id !== seasonId) return season;

        let newEpisodes = season.episodes;

        if (allEpisodes) {
          // Only mark AIRED episodes as watched
          newEpisodes = season.episodes.map((ep) => ({
            ...ep,
            isWatched: ep.hasAired ? watched : ep.isWatched,
          }));
        } else if (episodeId) {
          // Toggle single episode
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

  // Determine which season to open by default based on watch progress
  const getDefaultOpenSeason = () => {
    // Since seasons array is reversed (latest first), iterate from end to start for chronological order
    let lastCompletedIndex = -1;

    for (let i = optimisticSeasons.length - 1; i >= 0; i--) {
      const season = optimisticSeasons[i];

      // If this season has progress but isn't complete, open it (they're currently watching it)
      if (season.percentage > 0 && season.percentage < 100) {
        return season.season_number;
      }

      // If this season is fully watched, keep track of it
      if (season.percentage === 100) {
        lastCompletedIndex = i;
      }
    }

    // If we found completed seasons, open the next unwatched season after the last completed one
    if (lastCompletedIndex !== -1 && lastCompletedIndex > 0) {
      // Next season is at lastCompletedIndex - 1 (since array is reversed)
      return optimisticSeasons[lastCompletedIndex - 1]?.season_number;
    }

    // If all seasons are complete, open the latest season
    if (lastCompletedIndex === 0) {
      return optimisticSeasons[0]?.season_number || 1;
    }

    // If nothing has been watched, open season 1 (last item in reversed array)
    return optimisticSeasons[optimisticSeasons.length - 1]?.season_number || 1;
  };

  const [openSeasons, setOpenSeasons] = useState<Set<number>>(new Set());
  const [resettingSeasons, setResettingSeasons] = useState<Set<string>>(
    new Set(),
  );
  const [resettingSeries, setResettingSeries] = useState(false);
  const [hasOpenedDefaultSeason, setHasOpenedDefaultSeason] = useState(false);

  // OPTIMIZATION 3: Load all episodes progressively on mount
  useEffect(() => {
    // Load episodes for all seasons progressively
    optimisticSeasons.forEach((season) => {
      if (!loadedSeasons.has(season.id) && !loadingSeasons.has(season.id)) {
        loadEpisodesForSeason(season.id, season.season_number);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open the appropriate season once all episodes have loaded
  useEffect(() => {
    // Wait until all seasons have loaded their episodes
    const allSeasonsLoaded = optimisticSeasons.every(
      (season) => loadedSeasons.has(season.id) || season.episodes.length > 0,
    );

    if (allSeasonsLoaded && !hasOpenedDefaultSeason) {
      const defaultSeason = getDefaultOpenSeason();
      setOpenSeasons(new Set([defaultSeason]));
      setHasOpenedDefaultSeason(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedSeasons, hasOpenedDefaultSeason]);

  // OPTIMIZATION 4: Progressive episode loading
  const loadEpisodesForSeason = async (
    seasonId: string,
    seasonNumber: number,
  ) => {
    if (loadedSeasons.has(seasonId) || loadingSeasons.has(seasonId)) {
      return; // Already loaded or loading
    }

    setLoadingSeasons((prev) => {
      const newSet = new Set(prev);
      newSet.add(seasonId);
      return newSet;
    });

    try {
      // Fetch episodes for this season only
      const response = await fetch(
        `/api/series/${seriesId}/season/${seasonNumber}/episodes`,
      );

      if (!response.ok) {
        throw new Error("Failed to load episodes");
      }

      const episodes = await response.json();
      const today = new Date().toISOString().split("T")[0];

      // Transform episodes with watched status
      const transformedEpisodes = episodes
        .map((ep: any) => ({
          id: ep.id,
          episode_number: ep.episode_number,
          title: ep.title,
          isWatched: watchedIds.has(ep.id),
          air_date: ep.air_date,
          hasAired: ep.air_date ? ep.air_date <= today : false,
        }))
        .reverse(); // Latest episodes first

      // Update the season with episodes
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

      setLoadedSeasons((prev) => {
        const newSet = new Set(prev);
        newSet.add(seasonId);
        return newSet;
      });
    } catch (error) {
      console.error("Error loading episodes:", error);
    } finally {
      setLoadingSeasons((prev) => {
        const newSet = new Set(prev);
        newSet.delete(seasonId);
        return newSet;
      });
    }
  };

  const toggleSeason = (seasonNumber: number) => {
    setOpenSeasons((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(seasonNumber)) {
        newSet.delete(seasonNumber);
      } else {
        newSet.add(seasonNumber);
      }
      return newSet;
    });
  };

  const handleEpisodeToggle = async (
    episodeId: string,
    currentlyWatched: boolean,
    hasAired: boolean,
  ) => {
    // Prevent marking unaired episodes as watched
    if (!hasAired && !currentlyWatched) {
      return;
    }

    const season = optimisticSeasons.find((s) =>
      s.episodes.some((ep) => ep.id === episodeId),
    );

    if (!season) {
      console.error("Season not found for episode:", episodeId);
      return;
    }

    startTransition(async () => {
      // Update watchedIds immediately for optimistic UI
      setWatchedIds((prev) => {
        const newSet = new Set(prev);
        if (!currentlyWatched) {
          newSet.add(episodeId);
        } else {
          newSet.delete(episodeId);
        }
        return newSet;
      });

      // Optimistic update
      setOptimisticSeasons({
        seasonId: season.id,
        episodeId,
        watched: !currentlyWatched,
      });

      try {
        const response = await fetch("/api/reel-deck/toggle-episode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            episodeId,
            seriesId,
            userId,
            isWatched: !currentlyWatched,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("API error:", data);
          throw new Error(data.error || "Failed to toggle episode");
        }
        router.refresh();
      } catch (error) {
        console.error("Error toggling episode:", error);
        // Revert watchedIds on error
        setWatchedIds((prev) => {
          const newSet = new Set(prev);
          if (currentlyWatched) {
            newSet.add(episodeId);
          } else {
            newSet.delete(episodeId);
          }
          return newSet;
        });
        alert(
          `Failed to update episode: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        );
        router.refresh();
      }
    });
  };

  const handleMarkAllToggle = async (
    seasonId: string,
    markAsWatched: boolean,
  ) => {
    startTransition(async () => {
      // Optimistic update
      setOptimisticSeasons({
        seasonId,
        allEpisodes: true,
        watched: markAsWatched,
      });

      try {
        const response = await fetch("/api/reel-deck/toggle-season", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            seasonId,
            seriesId,
            userId,
            markAsWatched,
            // Tell API to only mark aired episodes
            airedOnly: markAsWatched,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("API error:", data);
          throw new Error(data.error || "Failed to toggle season");
        }

        router.refresh();
      } catch (error) {
        console.error("Error toggling season:", error);
        alert(
          `Failed to update season: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        );
        router.refresh();
      }
    });
  };

  const handleResetSeason = async (seasonId: string) => {
    if (
      !confirm("Are you sure you want to reset all progress for this season?")
    ) {
      return;
    }

    setResettingSeasons((prev) => {
      const newSet = new Set(prev);
      newSet.add(seasonId);
      return newSet;
    });

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset season");
      }

      router.refresh();
    } catch (error) {
      console.error("Error resetting season:", error);
      alert(
        `Failed to reset season: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    } finally {
      setResettingSeasons((prev) => {
        const newSet = new Set(prev);
        newSet.delete(seasonId);
        return newSet;
      });
    }
  };

  const handleResetSeries = async () => {
    if (
      !confirm(
        "Are you sure you want to reset ALL progress for this series? This cannot be undone.",
      )
    ) {
      return;
    }

    setResettingSeries(true);

    try {
      const response = await fetch("/api/reel-deck/reset-series", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seriesId,
          userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset series");
      }

      router.refresh();
    } catch (error) {
      console.error("Error resetting series:", error);
      alert(
        `Failed to reset series: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    } finally {
      setResettingSeries(false);
    }
  };

  // OPTIMIZATION 5: Extract date formatting functions (memoized outside component would be even better)
  const formatAirDate = (airDate: string | null) => {
    if (!airDate) return "Date TBA";
    const date = new Date(airDate);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRelativeAirDate = (airDate: string | null) => {
    if (!airDate) return null;

    const date = new Date(airDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return null; // Already aired
    if (diffDays === 0) return "Airs today";
    if (diffDays === 1) return "Airs tomorrow";
    if (diffDays <= 7) return `Airs in ${diffDays} days`;
    if (diffDays <= 30) return `Airs in ${Math.ceil(diffDays / 7)} weeks`;
    return `Airs ${formatAirDate(airDate)}`;
  };

  return (
    <div className="space-y-4">
      {/* Reset All Button */}
      {optimisticSeasons.some((s) => s.watchedCount > 0) && (
        <div className="flex justify-end">
          <button
            onClick={handleResetSeries}
            disabled={resettingSeries}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-red-900/20 text-red-400 hover:bg-red-900/30 border border-red-800/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconTrash size={16} />
            {resettingSeries ? "Resetting..." : "Reset All Progress"}
          </button>
        </div>
      )}

      {/* Seasons */}
      {optimisticSeasons.map((season) => {
        const isOpen = openSeasons.has(season.season_number);
        const allWatched = season.percentage === 100;
        const hasProgress = season.watchedCount > 0;
        const isResetting = resettingSeasons.has(season.id);
        const isLoading = loadingSeasons.has(season.id);
        const hasEpisodes = season.episodes.length > 0;

        return (
          <div
            key={season.id}
            className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden"
          >
            {/* Season Header */}
            <div className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    Season {season.season_number}
                  </h3>
                  <p className="text-sm text-neutral-400 mt-1">
                    {season.watchedCount} of {season.totalCount} episodes
                    watched
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2">
                  {/* Reset Button */}
                  {!allWatched && hasProgress && (
                    <button
                      onClick={() => handleResetSeason(season.id)}
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

                  {/* Mark All Button */}
                  {!allWatched && hasEpisodes && (
                    <button
                      onClick={() => handleMarkAllToggle(season.id, true)}
                      className="px-3 py-1.5 text-sm font-medium bg-lime-400 text-neutral-900 hover:bg-lime-500 rounded-lg transition-colors"
                      title="Mark all aired episodes as watched"
                    >
                      Mark All Watched
                    </button>
                  )}

                  {/* Unmark All Button */}
                  {allWatched && (
                    <button
                      onClick={() => handleMarkAllToggle(season.id, false)}
                      className="px-3 py-1.5 text-sm font-medium bg-neutral-800 text-neutral-300 hover:bg-neutral-700 rounded-lg transition-colors"
                    >
                      Mark All Unwatched
                    </button>
                  )}

                  {/* Toggle Button */}
                  <button
                    onClick={() => toggleSeason(season.season_number)}
                    className="p-2 text-neutral-400 hover:text-lime-400 transition-colors"
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
            <div className="border-t border-neutral-800">
              <div
                className={`px-4 space-y-2 ${
                  isOpen ? "py-4 max-h-[999px]" : "max-h-0"
                } transition-all duration-200 ease-in-out overflow-y-auto`}
              >
                {/* Show loading state while episodes are being fetched */}
                {isOpen && isLoading && (
                  <div className="flex items-center justify-center py-8 text-neutral-400">
                    <IconLoader2 size={24} className="animate-spin mr-2" />
                    <span>Loading episodes...</span>
                  </div>
                )}

                {/* Show episodes once loaded */}
                {isOpen && !isLoading && hasEpisodes && (
                  <>
                    {season.episodes.map((episode) => (
                      <EpisodeItem
                        key={episode.id}
                        episode={episode}
                        onToggle={handleEpisodeToggle}
                        formatAirDate={formatAirDate}
                        getRelativeAirDate={getRelativeAirDate}
                      />
                    ))}
                  </>
                )}

                {/* Show message if no episodes after loading */}
                {isOpen && !isLoading && !hasEpisodes && (
                  <div className="py-8 text-center text-neutral-500">
                    No episodes found for this season.
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
