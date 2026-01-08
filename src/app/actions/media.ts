"use server";

import { createClient } from "@/src/utils/supabase/server";
import { revalidatePath } from "next/cache";

const MEDIA_REFRESH_INTERVAL_DAYS = 30;

function needsRefresh(lastFetched: string | null): boolean {
  if (!lastFetched) return true;

  const lastFetchedDate = new Date(lastFetched);
  const daysSinceLastFetch =
    (Date.now() - lastFetchedDate.getTime()) / (1000 * 60 * 60 * 24);

  return daysSinceLastFetch >= MEDIA_REFRESH_INTERVAL_DAYS;
}

interface EnsureMediaResult {
  success: boolean;
  dbId: string | null;
  cached: boolean;
  error?: string;
}

/**
 * Ensures media exists in database and returns DB ID
 * This replaces the client-side DB operations in media-block.tsx
 */
export async function ensureMediaExists(
  tmdbId: number,
  mediaType: "movie" | "tv",
): Promise<EnsureMediaResult> {
  try {
    const supabase = await createClient();

    if (mediaType === "movie") {
      return await ensureMovieExists(supabase, tmdbId);
    } else {
      return await ensureSeriesExists(supabase, tmdbId);
    }
  } catch (error) {
    console.error("Error ensuring media exists:", error);
    return {
      success: false,
      dbId: null,
      cached: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function ensureMovieExists(
  supabase: any,
  tmdbId: number,
): Promise<EnsureMediaResult> {
  // Check if movie exists
  const { data: movieData } = await supabase
    .from("movies")
    .select("id, last_fetched")
    .eq("tmdb_id", tmdbId)
    .maybeSingle();

  if (movieData) {
    const shouldRefresh = needsRefresh(movieData.last_fetched);

    if (shouldRefresh) {
      // Refresh in background (non-blocking)
      refreshMovieData(supabase, movieData.id, tmdbId).catch(console.error);
    }

    return {
      success: true,
      dbId: movieData.id,
      cached: true,
    };
  }

  // Movie doesn't exist, fetch and create
  try {
    const tmdbResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}?language=en-US`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
        },
      },
    );

    if (!tmdbResponse.ok) {
      throw new Error("Failed to fetch movie");
    }

    const tmdbMovie = await tmdbResponse.json();

    const { data: newMovie, error } = await supabase
      .from("movies")
      .upsert(
        {
          tmdb_id: tmdbMovie.id,
          title: tmdbMovie.title,
          overview: tmdbMovie.overview || "",
          poster_path: tmdbMovie.poster_path,
          backdrop_path: tmdbMovie.backdrop_path,
          release_year: tmdbMovie.release_date
            ? new Date(tmdbMovie.release_date).getFullYear().toString()
            : "",
          runtime: tmdbMovie.runtime || null,
          popularity: tmdbMovie.popularity
            ? parseInt(tmdbMovie.popularity)
            : null,
          tmdb_popularity: tmdbMovie.popularity
            ? String(tmdbMovie.popularity)
            : null,
          last_fetched: new Date().toISOString(),
        },
        {
          onConflict: "tmdb_id",
          ignoreDuplicates: false,
        },
      )
      .select("id")
      .single();

    if (error) throw error;

    return {
      success: true,
      dbId: newMovie.id,
      cached: false,
    };
  } catch (error) {
    console.error("Error creating movie:", error);
    return {
      success: false,
      dbId: null,
      cached: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function ensureSeriesExists(
  supabase: any,
  tmdbId: number,
): Promise<EnsureMediaResult> {
  // Check if series exists
  const { data: seriesData } = await supabase
    .from("series")
    .select("id, last_fetched")
    .eq("tmdb_id", tmdbId)
    .maybeSingle();

  if (seriesData) {
    const shouldRefresh = needsRefresh(seriesData.last_fetched);

    if (shouldRefresh) {
      // Refresh in background (non-blocking)
      refreshSeriesData(supabase, seriesData.id, tmdbId).catch(console.error);
    }

    return {
      success: true,
      dbId: seriesData.id,
      cached: true,
    };
  }

  // Series doesn't exist, fetch and create
  try {
    const tmdbResponse = await fetch(
      `https://api.themoviedb.org/3/tv/${tmdbId}?language=en-US`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
        },
      },
    );

    if (!tmdbResponse.ok) {
      throw new Error("Failed to fetch series");
    }

    const tmdbSeries = await tmdbResponse.json();

    const { data: newSeries, error } = await supabase
      .from("series")
      .upsert(
        {
          tmdb_id: tmdbSeries.id,
          title: tmdbSeries.name,
          overview: tmdbSeries.overview || "",
          poster_path: tmdbSeries.poster_path,
          backdrop_path: tmdbSeries.backdrop_path,
          release_year: tmdbSeries.first_air_date
            ? new Date(tmdbSeries.first_air_date).getFullYear().toString()
            : "",
          popularity: tmdbSeries.popularity
            ? parseInt(tmdbSeries.popularity)
            : null,
          tmdb_popularity: tmdbSeries.popularity
            ? String(tmdbSeries.popularity)
            : null,
          last_fetched: new Date().toISOString(),
        },
        {
          onConflict: "tmdb_id",
          ignoreDuplicates: false,
        },
      )
      .select("id")
      .single();

    if (error) throw error;

    // Also create seasons
    if (tmdbSeries.seasons && Array.isArray(tmdbSeries.seasons)) {
      const seasonsToInsert = tmdbSeries.seasons
        .filter((s: any) => s.season_number >= 0)
        .map((season: any) => ({
          series_id: newSeries.id,
          tmdb_id: season.id,
          season_number: season.season_number,
          title: season.name,
          overview: season.overview || "",
          poster_path: season.poster_path,
          episode_count: season.episode_count || 0,
          air_date: season.air_date,
        }));

      if (seasonsToInsert.length > 0) {
        await supabase.from("seasons").upsert(seasonsToInsert, {
          onConflict: "series_id,season_number",
          ignoreDuplicates: false,
        });
      }
    }

    return {
      success: true,
      dbId: newSeries.id,
      cached: false,
    };
  } catch (error) {
    console.error("Error creating series:", error);
    return {
      success: false,
      dbId: null,
      cached: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Background refresh functions (non-blocking)
async function refreshMovieData(supabase: any, dbId: string, tmdbId: number) {
  try {
    const tmdbResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}?language=en-US`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
        },
      },
    );

    if (!tmdbResponse.ok) return;

    const tmdbMovie = await tmdbResponse.json();

    await supabase
      .from("movies")
      .update({
        title: tmdbMovie.title,
        overview: tmdbMovie.overview || "",
        poster_path: tmdbMovie.poster_path,
        backdrop_path: tmdbMovie.backdrop_path,
        release_year: tmdbMovie.release_date
          ? new Date(tmdbMovie.release_date).getFullYear().toString()
          : "",
        runtime: tmdbMovie.runtime || null,
        popularity: tmdbMovie.popularity
          ? parseInt(tmdbMovie.popularity)
          : null,
        tmdb_popularity: tmdbMovie.popularity
          ? String(tmdbMovie.popularity)
          : null,
        last_fetched: new Date().toISOString(),
      })
      .eq("id", dbId);

    revalidatePath(`/movies/${dbId}`);
  } catch (error) {
    console.error("Error refreshing movie:", error);
  }
}

async function refreshSeriesData(supabase: any, dbId: string, tmdbId: number) {
  try {
    const tmdbResponse = await fetch(
      `https://api.themoviedb.org/3/tv/${tmdbId}?language=en-US`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
        },
      },
    );

    if (!tmdbResponse.ok) return;

    const tmdbSeries = await tmdbResponse.json();

    await supabase
      .from("series")
      .update({
        title: tmdbSeries.name,
        overview: tmdbSeries.overview || "",
        poster_path: tmdbSeries.poster_path,
        backdrop_path: tmdbSeries.backdrop_path,
        release_year: tmdbSeries.first_air_date
          ? new Date(tmdbSeries.first_air_date).getFullYear().toString()
          : "",
        popularity: tmdbSeries.popularity
          ? parseInt(tmdbSeries.popularity)
          : null,
        tmdb_popularity: tmdbSeries.popularity
          ? String(tmdbSeries.popularity)
          : null,
        last_fetched: new Date().toISOString(),
      })
      .eq("id", dbId);

    revalidatePath(`/series/${dbId}`);
  } catch (error) {
    console.error("Error refreshing series:", error);
  }
}
