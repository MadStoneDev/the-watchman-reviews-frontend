"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/utils/supabase/client";
import { Tables } from "@/database.types";
import { IconCalendar, IconMovie, IconLoader2 } from "@tabler/icons-react";

type Season = Tables<"seasons">;

interface SeriesSeasonTabsProps {
  seriesId: string;
  seriesTmdbId: number;
  initialSeasons: Season[];
}

// Refresh interval: 14 days (2 weeks)
const REFRESH_INTERVAL_DAYS = 14;

export default function SeriesSeasonTabs({
  seriesId,
  seriesTmdbId,
  initialSeasons,
}: SeriesSeasonTabsProps) {
  const router = useRouter();
  const supabase = createClient();
  const [seasons, setSeasons] = useState<Season[]>(initialSeasons);
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(
    initialSeasons[0] || null,
  );

  // Check if data needs refreshing
  const needsRefresh = (lastFetched: string | null): boolean => {
    if (!lastFetched) return true;

    const lastFetchedDate = new Date(lastFetched);
    const daysSinceLastFetch =
      (Date.now() - lastFetchedDate.getTime()) / (1000 * 60 * 60 * 24);

    return daysSinceLastFetch >= REFRESH_INTERVAL_DAYS;
  };

  // Automatically fetch seasons if none exist OR if they need refreshing
  useEffect(() => {
    const shouldFetch =
      initialSeasons.length === 0 ||
      (initialSeasons.length > 0 &&
        needsRefresh(initialSeasons[0]?.last_fetched));

    if (shouldFetch && !loading) {
      fetchSeasonsFromTMDB();
    }
  }, [initialSeasons.length]);

  // Fetch seasons from TMDB and upsert to database
  const fetchSeasonsFromTMDB = async () => {
    setLoading(true);
    try {
      // ✅ NEW: Use our secure API route instead of calling TMDB directly
      const response = await fetch(
        `/api/tmdb/tv/${seriesTmdbId}?language=en-US`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch series data: ${response.status}`);
      }

      const data = await response.json();
      const tmdbSeasons = data.seasons;

      // Prepare season records for upsert
      const seasonsToUpsert = tmdbSeasons.map((season: any) => ({
        series_id: seriesId,
        season_number: season.season_number,
        title: season.name,
        overview: season.overview,
        poster_path: season.poster_path,
        release_year: season.air_date
          ? new Date(season.air_date).getFullYear().toString()
          : null,
        air_date: season.air_date,
        episode_count: season.episode_count,
        last_fetched: new Date().toISOString(),
      }));

      // Use upsert to update existing records or insert new ones
      // Conflict resolution on (series_id, season_number) composite key
      const { data: upsertedSeasons, error } = await supabase
        .from("seasons")
        .upsert(seasonsToUpsert, {
          onConflict: "series_id,season_number",
          ignoreDuplicates: false, // Update existing records
        })
        .select();

      if (error) {
        console.error("Error upserting seasons:", error);
        throw error;
      }

      setSeasons(upsertedSeasons || []);
      if (upsertedSeasons && upsertedSeasons.length > 0) {
        setSelectedSeason(upsertedSeasons[0]);
      }
    } catch (error) {
      console.error("Error fetching seasons:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
        <div className="flex items-center justify-center gap-3 py-4">
          <div className="animate-spin h-6 w-6 border-2 border-lime-400 border-t-transparent rounded-full"></div>
          <p className="text-neutral-400">
            {initialSeasons.length > 0
              ? "Refreshing season data..."
              : "Loading seasons..."}
          </p>
        </div>
      </div>
    );
  }

  if (seasons.length === 0) {
    return (
      <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
        <p className="text-neutral-400 text-center">
          No seasons available for this series.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Season Tabs - Not clickable, just for switching */}
      <div className="flex flex-wrap gap-2">
        {seasons.map((season) => (
          <button
            key={season.id}
            onClick={() => setSelectedSeason(season)}
            className={`px-4 py-2 rounded-lg transition-all font-medium ${
              selectedSeason?.id === season.id
                ? "bg-lime-400 text-neutral-900"
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            }`}
          >
            Season {season.season_number}
          </button>
        ))}
      </div>

      {/* Selected Season Details */}
      {selectedSeason && (
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden">
          {/* Season Header with Poster */}
          <div className="flex gap-6 p-6">
            {/* Season Poster */}
            {selectedSeason.poster_path && (
              <div className="w-32 h-48 rounded-lg overflow-hidden shrink-0 bg-neutral-800">
                <img
                  src={`https://image.tmdb.org/t/p/w300${selectedSeason.poster_path}`}
                  alt={selectedSeason.title || ""}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Season Info */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-3">
                {selectedSeason.title}
              </h3>

              {/* Season Meta */}
              <div className="flex flex-wrap gap-4 mb-4">
                {selectedSeason.air_date && (
                  <div className="flex items-center gap-2 text-neutral-400">
                    <IconCalendar size={18} />
                    <span className="text-sm">
                      {new Date(selectedSeason.air_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>
                )}

                {selectedSeason.episode_count !== null &&
                  selectedSeason.episode_count !== undefined && (
                    <div className="flex items-center gap-2 text-neutral-400">
                      <IconMovie size={18} />
                      <span className="text-sm">
                        {selectedSeason.episode_count}{" "}
                        {selectedSeason.episode_count === 1
                          ? "Episode"
                          : "Episodes"}
                      </span>
                    </div>
                  )}
              </div>

              {/* Overview */}
              {selectedSeason.overview && (
                <p className="text-neutral-300 leading-relaxed mb-4">
                  {selectedSeason.overview}
                </p>
              )}

              {/* View Episodes Button */}
              <button
                onClick={() => {
                  setNavigating(true);
                  router.push(`/series/${seriesId}/seasons/${selectedSeason.id}`);
                }}
                disabled={navigating}
                className="inline-flex items-center gap-2 px-6 py-3 bg-lime-400 text-neutral-900 hover:bg-lime-500 rounded-lg transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {navigating && <IconLoader2 size={18} className="animate-spin" />}
                {navigating ? "Loading..." : "View Episodes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
