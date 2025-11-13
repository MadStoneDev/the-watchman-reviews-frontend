"use client";

import React, { useState, useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  IconChevronDown,
  IconChevronUp,
  IconCheck,
  IconRotate,
  IconTrash,
  IconClock,
  IconCalendar,
} from "@tabler/icons-react";
import Image from "next/image";

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
}

interface SeriesProgressTrackerProps {
  seasons: Season[];
  seriesId: string;
  userId: string;
  username: string;
}

export default function SeriesProgressTracker({
  seasons,
  seriesId,
  userId,
  username,
}: SeriesProgressTrackerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Optimistic state for episodes
  const [optimisticSeasons, setOptimisticSeasons] = useOptimistic(
    seasons,
    (currentSeasons, { seasonId, episodeId, allEpisodes, watched }: any) => {
      return currentSeasons.map((season) => {
        if (season.id !== seasonId) return season;

        let newEpisodes = season.episodes;

        if (allEpisodes) {
          // Mark all episodes as watched/unwatched
          newEpisodes = season.episodes.map((ep) => ({
            ...ep,
            isWatched: watched,
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

  // Determine which season to open by default
  const getDefaultOpenSeason = () => {
    const inProgressSeason = seasons.find(
      (s) => s.percentage < 100 && s.percentage > 0,
    );
    if (inProgressSeason) return inProgressSeason.season_number;

    const incompleteSeason = seasons.find((s) => s.percentage === 0);
    if (incompleteSeason) return incompleteSeason.season_number;

    return seasons[seasons.length - 1]?.season_number || 1;
  };

  const [openSeasons, setOpenSeasons] = useState<Set<number>>(
    new Set([getDefaultOpenSeason()]),
  );
  const [resettingSeasons, setResettingSeasons] = useState<Set<string>>(
    new Set(),
  );
  const [resettingSeries, setResettingSeries] = useState(false);

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

    // Wrap the entire operation in startTransition
    startTransition(async () => {
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
        // Refresh to sync with server
        router.refresh();
      } catch (error) {
        console.error("Error toggling episode:", error);
        alert(
          `Failed to update episode: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        );
        // Revert optimistic update on error
        router.refresh();
      }
    });
  };

  const handleMarkAllToggle = async (
    seasonId: string,
    markAsWatched: boolean,
  ) => {
    // Wrap the entire operation in startTransition
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
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("API error:", data);
          throw new Error(data.error || "Failed to toggle season");
        }

        // Refresh to sync with server
        router.refresh();
      } catch (error) {
        console.error("Error toggling season:", error);
        alert(
          `Failed to update season: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        );
        // Revert optimistic update on error
        router.refresh();
      }
    });
  };

  const handleResetSeason = async (seasonId: string) => {
    if (
      !confirm("Are you sure you want to reset your progress for this season?")
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
      alert("Failed to reset season. Please try again.");
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
        "Are you sure you want to reset ALL your progress for this series? This will mark all episodes as unwatched.",
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
      alert("Failed to reset series. Please try again.");
    } finally {
      setResettingSeries(false);
    }
  };

  const formatAirDate = (airDate: string | null) => {
    if (!airDate) return "TBA";
    const date = new Date(airDate);
    return date.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getRelativeAirDate = (airDate: string | null) => {
    if (!airDate) return null;
    const date = new Date(airDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

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
      {/* Reset All Button - Only show if there's any progress */}
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
                  {/* Reset Button - Only show if season is complete and has progress */}
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
                      <span className="hidden sm:inline">Reset Progress</span>
                    </button>
                  )}

                  {/* Mark All Button - Show unless season is complete */}
                  {!allWatched && (
                    <button
                      onClick={() => handleMarkAllToggle(season.id, true)}
                      className="px-3 py-1.5 text-sm font-medium bg-lime-400 text-neutral-900 hover:bg-lime-500 rounded-lg transition-colors"
                    >
                      Mark All Watched
                    </button>
                  )}

                  {/* Unmark All Button - Only show if all watched */}
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
                {season.episodes.map((episode) => {
                  const relativeAirDate = getRelativeAirDate(episode.air_date);
                  const isDisabled = !episode.hasAired && !episode.isWatched;

                  return (
                    <button
                      key={episode.id}
                      onClick={() =>
                        handleEpisodeToggle(
                          episode.id,
                          episode.isWatched,
                          episode.hasAired,
                        )
                      }
                      disabled={isDisabled}
                      title={
                        isDisabled
                          ? `Episode hasn't aired yet (${formatAirDate(
                              episode.air_date,
                            )})`
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
                              isDisabled
                                ? "text-neutral-500"
                                : "text-neutral-400"
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
                              isDisabled
                                ? "text-neutral-600"
                                : "text-neutral-500"
                            }`}
                          >
                            <span className="font-bold">
                              {new Date(episode.air_date) > new Date()
                                ? "Airs"
                                : "Aired"}
                              :
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
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
