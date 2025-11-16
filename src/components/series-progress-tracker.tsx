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
  IconX,
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
  mediaType: "movie" | "series";
  collectionId?: string; // The reel deck collection ID
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

  const date = new Date(airDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return null;
  if (diffDays === 0) return "Airs today";
  if (diffDays === 1) return "Airs tomorrow";
  if (diffDays <= 7) return `Airs in ${diffDays} days`;
  if (diffDays <= 30) return `Airs in ${Math.ceil(diffDays / 7)} weeks`;
  return null; // Don't show for far future dates
};

// Memoized episode item component
const EpisodeItem = React.memo(
    ({
       episode,
       onToggle,
     }: {
      episode: Episode;
      onToggle: (id: string, watched: boolean, hasAired: boolean) => void;
    }) => {
      const relativeAirDate = useMemo(
          () => getRelativeAirDate(episode.air_date),
          [episode.air_date],
      );
      const formattedAirDate = useMemo(
          () => formatAirDate(episode.air_date),
          [episode.air_date],
      );
      const isDisabled = !episode.hasAired && !episode.isWatched;

      return (
          <button
              onClick={() =>
                  onToggle(episode.id, episode.isWatched, episode.hasAired)
              }
              disabled={isDisabled}
              title={
                isDisabled
                    ? `Episode hasn't aired yet (${formattedAirDate})`
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
                    {formattedAirDate}
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
                                                mediaType,
                                                collectionId,
                                              }: SeriesProgressTrackerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Core state
  const [seasons, setSeasons] = useState(initialSeasons);
  const [watchedIds, setWatchedIds] = useState(
      () => new Set(initialWatchedIds),
  );

  // Loading state
  const [loadedSeasons, setLoadedSeasons] = useState<Set<string>>(new Set());
  const [loadingSeasons, setLoadingSeasons] = useState<Set<string>>(new Set());

  // UI state
  const [openSeasons, setOpenSeasons] = useState<Set<number>>(new Set());
  const [resettingSeasons, setResettingSeasons] = useState<Set<string>>(
      new Set(),
  );
  const [resettingSeries, setResettingSeries] = useState(false);
  const [removingFromDeck, setRemovingFromDeck] = useState(false);
  const [hasOpenedDefaultSeason, setHasOpenedDefaultSeason] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Sync with server data when initialWatchedIds changes (after refresh)
  // This only runs when parent component provides new data
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
  }, [initialWatchedIds, watchedIds]);

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

          // Batch state updates
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
          setError("Failed to load episodes. Please try again.");
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

  // Memoized toggle handlers
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

  const handleEpisodeToggle = useCallback(
      async (episodeId: string, currentlyWatched: boolean, hasAired: boolean) => {
        if (!hasAired && !currentlyWatched) return;

        const season = optimisticSeasons.find((s) =>
            s.episodes.some((ep) => ep.id === episodeId),
        );

        if (!season) return;

        startTransition(async () => {
          const newWatchedState = !currentlyWatched;

          // Apply optimistic update immediately
          setOptimisticSeasons({
            seasonId: season.id,
            episodeId,
            watched: newWatchedState,
          });

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
              throw new Error(data.error || "Failed to toggle episode");
            }

            // SUCCESS: Update the base state to match optimistic update
            setWatchedIds((prev) => {
              const newSet = new Set(prev);
              if (newWatchedState) {
                newSet.add(episodeId);
              } else {
                newSet.delete(episodeId);
              }
              return newSet;
            });

            setSeasons((prevSeasons) =>
                prevSeasons.map((s) => {
                  if (s.id !== season.id) return s;

                  const updatedEpisodes = s.episodes.map((ep) =>
                      ep.id === episodeId ? { ...ep, isWatched: newWatchedState } : ep,
                  );

                  const watchedCount = updatedEpisodes.filter(
                      (ep) => ep.isWatched,
                  ).length;
                  const percentage =
                      s.totalCount > 0
                          ? Math.round((watchedCount / s.totalCount) * 100)
                          : 0;

                  return {
                    ...s,
                    episodes: updatedEpisodes,
                    watchedCount,
                    percentage,
                  };
                }),
            );
          } catch (error) {
            console.error("Error toggling episode:", error);

            setError(
                `Failed to update episode: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );

            // Refresh to ensure we're in sync with server
            router.refresh();
          }
        });
      },
      [optimisticSeasons, seriesId, userId, router, setOptimisticSeasons],
  );

  const handleMarkAllToggle = useCallback(
      async (seasonId: string, markAsWatched: boolean) => {
        startTransition(async () => {
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
                airedOnly: markAsWatched,
              }),
            });

            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.error || "Failed to toggle season");
            }

            // SUCCESS: Update base state to match optimistic update
            const season = seasons.find((s) => s.id === seasonId);
            if (!season) return;

            setSeasons((prevSeasons) =>
                prevSeasons.map((s) => {
                  if (s.id !== seasonId) return s;

                  const updatedEpisodes = s.episodes.map((ep) => ({
                    ...ep,
                    isWatched: ep.hasAired ? markAsWatched : ep.isWatched,
                  }));

                  const watchedCount = updatedEpisodes.filter(
                      (ep) => ep.isWatched,
                  ).length;
                  const percentage =
                      s.totalCount > 0
                          ? Math.round((watchedCount / s.totalCount) * 100)
                          : 0;

                  return {
                    ...s,
                    episodes: updatedEpisodes,
                    watchedCount,
                    percentage,
                  };
                }),
            );

            // Update watchedIds
            setWatchedIds((prev) => {
              const newSet = new Set(prev);
              season.episodes.forEach((ep) => {
                if (ep.hasAired) {
                  if (markAsWatched) {
                    newSet.add(ep.id);
                  } else {
                    newSet.delete(ep.id);
                  }
                }
              });
              return newSet;
            });
          } catch (error) {
            console.error("Error toggling season:", error);
            setError(
                `Failed to update season: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
            router.refresh();
          }
        });
      },
      [seriesId, userId, router, setOptimisticSeasons, seasons],
  );

  const handleResetSeason = useCallback(
      async (seasonId: string) => {
        if (
            !confirm("Are you sure you want to reset all progress for this season?")
        ) {
          return;
        }

        setResettingSeasons((prev) => new Set(prev).add(seasonId));

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

          router.refresh();
        } catch (error) {
          console.error("Error resetting season:", error);
          setError(
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
      },
      [seriesId, userId, router],
  );

  const handleResetSeries = useCallback(async () => {
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

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to reset series");
      }

      router.refresh();
    } catch (error) {
      console.error("Error resetting series:", error);
      setError(
          `Failed to reset series: ${
              error instanceof Error ? error.message : "Unknown error"
          }`,
      );
    } finally {
      setResettingSeries(false);
    }
  }, [seriesId, userId, router]);

  const handleRemoveFromDeck = useCallback(async () => {
    if (!collectionId) {
      setError("Collection ID not provided");
      return;
    }

    if (
        !confirm(
            `Are you sure you want to remove this ${mediaType} from your Reel Deck? All progress will be lost.`,
        )
    ) {
      return;
    }

    setRemovingFromDeck(true);

    try {
      const response = await fetch("/api/reel-deck/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collectionId,
          mediaId: seriesId,
          mediaType,
          userId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to remove from Reel Deck");
      }

      // Redirect to reel deck after successful removal
      router.push("/reel-deck");
      router.refresh();
    } catch (error) {
      console.error("Error removing from deck:", error);
      setError(
          `Failed to remove from Reel Deck: ${
              error instanceof Error ? error.message : "Unknown error"
          }`,
      );
    } finally {
      setRemovingFromDeck(false);
    }
  }, [collectionId, seriesId, mediaType, userId, router]);

  // Check if any season has progress
  const hasAnyProgress = useMemo(
      () => optimisticSeasons.some((s) => s.watchedCount > 0),
      [optimisticSeasons],
  );

  return (
      <div className="space-y-4">
        {/* Error Toast */}
        {error && (
            <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-lg text-red-400">
              <p>{error}</p>
              <button
                  onClick={() => setError(null)}
                  className="mt-2 text-sm underline hover:no-underline"
              >
                Dismiss
              </button>
            </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center gap-2">
          {/* Remove from Reel Deck Button */}
          <button
              onClick={handleRemoveFromDeck}
              disabled={removingFromDeck}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {removingFromDeck ? (
                <IconLoader2 size={16} className="animate-spin" />
            ) : (
                <IconX size={16} />
            )}
            {removingFromDeck ? "Removing..." : "Remove from Reel Deck"}
          </button>

          {/* Reset All Button */}
          {hasAnyProgress && (
              <button
                  onClick={handleResetSeries}
                  disabled={resettingSeries}
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

                      {/* Mark All Button */}
                      {!allWatched && hasEpisodes && (
                          <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAllToggle(season.id, true);
                              }}
                              disabled={isPending}
                              className="px-3 py-1.5 text-sm font-medium bg-lime-400 text-neutral-900 hover:bg-lime-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Mark all aired episodes as watched"
                          >
                            Mark All Watched
                          </button>
                      )}

                      {/* Unmark All Button */}
                      {allWatched && (
                          <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAllToggle(season.id, false);
                              }}
                              disabled={isPending}
                              className="px-3 py-1.5 text-sm font-medium bg-neutral-800 text-neutral-300 hover:bg-neutral-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Mark All Unwatched
                          </button>
                      )}

                      {/* Toggle Button */}
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
                        isOpen ? "py-4" : "max-h-0 py-0"
                    }`}
                    style={{
                      maxHeight: isOpen
                          ? `${season.episodes.length * 80 + 100}px`
                          : "0px",
                    }}
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
                                onToggle={handleEpisodeToggle}
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