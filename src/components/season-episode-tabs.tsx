"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/utils/supabase/client";
import { Tables } from "@/database.types";
import { IconCalendar, IconClock, IconStar } from "@tabler/icons-react";

type Episode = Tables<"episodes">;

interface SeasonEpisodeTabsProps {
  seriesId: string;
  seasonId: string;
  seriesTmdbId: number;
  seasonNumber: number;
  initialEpisodes: Episode[];
}

// Refresh interval: 14 days (2 weeks)
const REFRESH_INTERVAL_DAYS = 14;

export default function SeasonEpisodeTabs({
  seriesId,
  seasonId,
  seriesTmdbId,
  seasonNumber,
  initialEpisodes,
}: SeasonEpisodeTabsProps) {
  const router = useRouter();
  const supabase = createClient();
  const [episodes, setEpisodes] = useState<Episode[]>(initialEpisodes);
  const [loading, setLoading] = useState(false);

  // Check if data needs refreshing
  const needsRefresh = (lastFetched: string | null): boolean => {
    if (!lastFetched) return true;

    const lastFetchedDate = new Date(lastFetched);
    const daysSinceLastFetch =
      (Date.now() - lastFetchedDate.getTime()) / (1000 * 60 * 60 * 24);

    return daysSinceLastFetch >= REFRESH_INTERVAL_DAYS;
  };

  // Automatically fetch episodes if none exist OR if they need refreshing
  useEffect(() => {
    const shouldFetch =
      initialEpisodes.length === 0 ||
      (initialEpisodes.length > 0 &&
        needsRefresh(initialEpisodes[0]?.last_fetched));

    if (shouldFetch && !loading) {
      fetchEpisodesFromTMDB();
    }
  }, [initialEpisodes.length]);

  // Fetch episodes from TMDB and upsert to database
  const fetchEpisodesFromTMDB = async () => {
    setLoading(true);
    try {
      // ✅ NEW: Use our secure API route instead of calling TMDB directly
      const response = await fetch(
        `/api/tmdb/tv/${seriesTmdbId}/season/${seasonNumber}?language=en-US`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch season data: ${response.status}`);
      }

      const data = await response.json();
      const tmdbEpisodes = data.episodes;

      // Prepare episode records for upsert
      const episodesToUpsert = tmdbEpisodes.map((episode: any) => ({
        series_id: seriesId,
        season_id: seasonId,
        episode_number: episode.episode_number,
        title: episode.name,
        overview: episode.overview,
        poster_path: episode.still_path,
        release_year: episode.air_date
          ? new Date(episode.air_date).getFullYear().toString()
          : null,
        air_date: episode.air_date,
        runtime: episode.runtime,
        vote_average: episode.vote_average,
        tmdb_id: episode.id,
        last_fetched: new Date().toISOString(),
      }));

      // Use upsert to update existing records or insert new ones
      // Conflict resolution on (season_id, episode_number) composite key
      const { data: upsertedEpisodes, error } = await supabase
        .from("episodes")
        .upsert(episodesToUpsert, {
          onConflict: "season_id,episode_number",
          ignoreDuplicates: false, // Update existing records
        })
        .select();

      if (error) {
        console.error("Error upserting episodes:", error);
        throw error;
      }

      setEpisodes(upsertedEpisodes || []);
    } catch (error) {
      console.error("Error fetching episodes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle episode click
  const handleEpisodeClick = async (episode: Episode) => {
    router.push(
      `/series/${seriesId}/seasons/${seasonId}/episodes/${episode.id}`,
    );
  };

  if (loading) {
    return (
      <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
        <div className="flex items-center justify-center gap-3 py-4">
          <div className="animate-spin h-6 w-6 border-2 border-lime-400 border-t-transparent rounded-full"></div>
          <p className="text-neutral-400">
            {initialEpisodes.length > 0
              ? "Refreshing episode data..."
              : "Loading episodes..."}
          </p>
        </div>
      </div>
    );
  }

  if (episodes.length === 0) {
    return (
      <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
        <p className="text-neutral-400 text-center">
          No episodes available for this season.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Episode List */}
      <div className="grid gap-4">
        {episodes.map((episode) => (
          <button
            key={episode.id}
            onClick={() => handleEpisodeClick(episode)}
            className="p-4 rounded-lg border bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-all text-left group"
          >
            <div className="flex gap-4">
              {/* Episode Still */}
              {episode.poster_path ? (
                <div className="relative w-40 aspect-video rounded-sm overflow-hidden shrink-0 bg-neutral-800">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${episode.poster_path}`}
                    alt={episode.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                  />
                </div>
              ) : (
                <div className="relative w-40 aspect-video rounded-sm overflow-hidden shrink-0 bg-neutral-800 flex items-center justify-center">
                  <IconClock size={32} className="text-neutral-600" />
                </div>
              )}

              {/* Episode Info */}
              <div className="flex-1 min-w-0">
                {/* Title and Episode Number */}
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-lg font-bold text-lime-400 shrink-0">
                    {episode.episode_number}
                  </span>
                  <h3 className="font-semibold text-lg group-hover:text-lime-400 transition-colors">
                    {episode.title}
                  </h3>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 mb-2 text-sm text-neutral-400">
                  {episode.air_date && (
                    <div className="flex items-center gap-1.5">
                      <IconCalendar size={16} />
                      <span>
                        {new Date(episode.air_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  )}

                  {episode.runtime && (
                    <div className="flex items-center gap-1.5">
                      <IconClock size={16} />
                      <span>{episode.runtime} min</span>
                    </div>
                  )}

                  {episode.vote_average !== null &&
                    episode.vote_average !== undefined &&
                    episode.vote_average > 0 && (
                      <div className="flex items-center gap-1.5">
                        <IconStar size={16} className="text-yellow-500" />
                        <span>{episode.vote_average.toFixed(1)}</span>
                      </div>
                    )}
                </div>

                {/* Overview */}
                {episode.overview && (
                  <p className="text-sm text-neutral-400 line-clamp-2">
                    {episode.overview}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
