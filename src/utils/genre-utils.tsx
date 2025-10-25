// Server-side utility functions for managing genres
// Use in server components or API routes

import { createClient } from "@/src/utils/supabase/server";
import axios from "axios";

// Refresh interval: 5 months (150 days)
const GENRE_REFRESH_INTERVAL_DAYS = 150;

interface TMDBGenre {
  id: number;
  name: string;
}

interface Genre {
  id: string;
  tmdb_id: number;
  name: string;
  media_type: "movie" | "tv";
  icon: string | null;
  last_fetched: string | null;
}

/**
 * Check if genres need refreshing from TMDB
 */
export async function genresNeedRefresh(
  mediaType: "movie" | "tv",
): Promise<boolean> {
  const supabase = await createClient();

  const { data: genres } = await supabase
    .from("genres")
    .select("last_fetched")
    .eq("media_type", mediaType)
    .limit(1)
    .single();

  if (!genres || !genres.last_fetched) return true;

  const lastFetchedDate = new Date(genres.last_fetched);
  const daysSinceLastFetch =
    (Date.now() - lastFetchedDate.getTime()) / (1000 * 60 * 60 * 24);

  return daysSinceLastFetch >= GENRE_REFRESH_INTERVAL_DAYS;
}

/**
 * Fetch and update genres from TMDB
 * This updates the entire genre table for the media type
 * Updates ALL last_fetched timestamps for the media type
 */
export async function refreshGenres(
  mediaType: "movie" | "tv",
): Promise<Genre[]> {
  const supabase = await createClient();

  try {
    // 1. Fetch from TMDB
    const endpoint =
      mediaType === "movie"
        ? "https://api.themoviedb.org/3/genre/movie/list"
        : "https://api.themoviedb.org/3/genre/tv/list";

    const response = await axios.get(endpoint, {
      params: { language: "en-US" },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
      },
    });

    const tmdbGenres: TMDBGenre[] = response.data.genres;
    const tmdbGenreIds = tmdbGenres.map((g) => g.id);
    const currentTimestamp = new Date().toISOString();

    // 2. Get existing genres from our database
    const { data: existingGenres } = await supabase
      .from("genres")
      .select("id, tmdb_id, name, icon")
      .eq("media_type", mediaType);

    // 3. Prepare genres for upsert
    const genresToUpsert = tmdbGenres.map((genre) => {
      // Find existing genre to preserve icon
      const existing = existingGenres?.find((g) => g.tmdb_id === genre.id);

      return {
        tmdb_id: genre.id,
        name: genre.name,
        media_type: mediaType,
        last_fetched: currentTimestamp,
        icon: existing?.icon || null, // Preserve existing icon
      };
    });

    // 4. Upsert all genres from TMDB
    const { data: upsertedGenres, error } = await supabase
      .from("genres")
      .upsert(genresToUpsert, {
        onConflict: "tmdb_id,media_type",
        ignoreDuplicates: false, // Update existing records
      })
      .select();

    if (error) {
      console.error("Error upserting genres:", error);
      throw error;
    }

    // 5. Update last_fetched for ALL genres of this media type
    // This ensures even genres not in the upsert list get updated timestamps
    const { error: updateError } = await supabase
      .from("genres")
      .update({ last_fetched: currentTimestamp })
      .eq("media_type", mediaType);

    if (updateError) {
      console.error("Error updating last_fetched timestamps:", updateError);
    }

    // 6. Detect deprecated genres (genres TMDB removed)
    const deprecatedGenres = existingGenres?.filter(
      (existing) => !tmdbGenreIds.includes(existing.tmdb_id),
    );

    if (deprecatedGenres && deprecatedGenres.length > 0) {
      console.warn(
        `Found ${deprecatedGenres.length} deprecated genres for ${mediaType}:`,
        deprecatedGenres.map((g) => `${g.name} (tmdb_id: ${g.tmdb_id})`),
      );
      // Keep them in database in case movies still reference them
      // but they won't be assigned to new movies
    }

    console.log(
      `Refreshed ${upsertedGenres?.length || 0} ${mediaType} genres from TMDB`,
    );

    return upsertedGenres || [];
  } catch (error) {
    console.error("Error refreshing genres from TMDB:", error);
    throw error;
  }
}

/**
 * Get genres for a specific media item
 * Checks if refresh is needed and updates if necessary
 */
export async function ensureGenresRefreshed(
  mediaType: "movie" | "tv",
): Promise<void> {
  const needsRefresh = await genresNeedRefresh(mediaType);

  if (needsRefresh) {
    console.log(`Refreshing ${mediaType} genres from TMDB (5-month check)...`);
    await refreshGenres(mediaType);
  }
}

/**
 * Sync movie genres from TMDB
 * Fetches genre data from TMDB and links to our genres table
 */
export async function syncMovieGenres(
  movieId: string,
  tmdbMovieId: number,
): Promise<void> {
  const supabase = await createClient();

  // Check if already synced by querying junction table
  const { data: existingLinks } = await supabase
    .from("movie_genres")
    .select("genre_id")
    .eq("movie_id", movieId)
    .limit(1);

  if (existingLinks && existingLinks.length > 0) {
    return; // Already synced
  }

  // Ensure genres table is up to date (5-month check)
  await ensureGenresRefreshed("movie");

  // Fetch movie details from TMDB to get genres
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${tmdbMovieId}`,
      {
        params: { language: "en-US" },
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
        },
      },
    );

    const tmdbGenres = response.data.genres; // [{id: 28, name: "Action"}, ...]

    if (!tmdbGenres || tmdbGenres.length === 0) {
      console.log(`No genres found for movie ${movieId}`);
      return;
    }

    const genreTmdbIds = tmdbGenres.map((g: any) => g.id);

    // Get our genre UUIDs from TMDB IDs
    const { data: genres } = await supabase
      .from("genres")
      .select("id, tmdb_id")
      .eq("media_type", "movie")
      .in("tmdb_id", genreTmdbIds);

    if (!genres || genres.length === 0) {
      console.warn(
        `No matching genres found in database for movie ${movieId}`,
        genreTmdbIds,
      );
      return;
    }

    // Create junction records with our UUIDs
    const junctionRecords = genres.map((genre) => ({
      movie_id: movieId,
      genre_id: genre.id, // Our UUID
    }));

    // Insert into junction table
    const { error: upsertError } = await supabase
      .from("movie_genres")
      .upsert(junctionRecords, {
        onConflict: "movie_id,genre_id",
        ignoreDuplicates: true,
      });

    if (upsertError) {
      console.error("Error upserting movie genres:", upsertError);
      throw upsertError;
    }

    console.log(`Synced ${genres.length} genres for movie ${movieId}`);
  } catch (error) {
    console.error("Error syncing movie genres:", error);
    // Don't throw - allow page to load without genres
  }
}

/**
 * Sync series genres from TMDB
 * Fetches genre data from TMDB and links to our genres table
 */
export async function syncSeriesGenres(
  seriesId: string,
  tmdbSeriesId: number,
): Promise<void> {
  const supabase = await createClient();

  // Check if already synced by querying junction table
  const { data: existingLinks } = await supabase
    .from("series_genres")
    .select("genre_id")
    .eq("series_id", seriesId)
    .limit(1);

  if (existingLinks && existingLinks.length > 0) {
    return; // Already synced
  }

  // Ensure genres table is up to date (5-month check)
  await ensureGenresRefreshed("tv");

  // Fetch series details from TMDB to get genres
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/tv/${tmdbSeriesId}`,
      {
        params: { language: "en-US" },
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
        },
      },
    );

    const tmdbGenres = response.data.genres; // [{id: 18, name: "Drama"}, ...]

    if (!tmdbGenres || tmdbGenres.length === 0) {
      console.log(`No genres found for series ${seriesId}`);
      return;
    }

    const genreTmdbIds = tmdbGenres.map((g: any) => g.id);

    // Get our genre UUIDs from TMDB IDs
    const { data: genres } = await supabase
      .from("genres")
      .select("id, tmdb_id")
      .eq("media_type", "tv")
      .in("tmdb_id", genreTmdbIds);

    if (!genres || genres.length === 0) {
      console.warn(
        `No matching genres found in database for series ${seriesId}`,
        genreTmdbIds,
      );
      return;
    }

    // Create junction records with our UUIDs
    const junctionRecords = genres.map((genre) => ({
      series_id: seriesId,
      genre_id: genre.id, // Our UUID
    }));

    // Insert into junction table
    const { error: upsertError } = await supabase
      .from("series_genres")
      .upsert(junctionRecords, {
        onConflict: "series_id,genre_id",
        ignoreDuplicates: true,
      });

    if (upsertError) {
      console.error("Error upserting series genres:", upsertError);
      throw upsertError;
    }

    console.log(`Synced ${genres.length} genres for series ${seriesId}`);
  } catch (error) {
    console.error("Error syncing series genres:", error);
    // Don't throw - allow page to load without genres
  }
}

/**
 * Get genres for a movie (with icons)
 */
export async function getMovieGenres(movieId: string): Promise<Genre[]> {
  const supabase = await createClient();

  // Get the genre IDs for this movie from junction table
  const { data: movieGenres } = await supabase
    .from("movie_genres")
    .select("genre_id")
    .eq("movie_id", movieId);

  if (!movieGenres || movieGenres.length === 0) return [];

  const genreIds = movieGenres.map((mg) => mg.genre_id);

  // Get the full genre details
  const { data: genres } = await supabase
    .from("genres")
    .select("*")
    .in("id", genreIds);

  return genres || [];
}

/**
 * Get genres for a series (with icons)
 */
export async function getSeriesGenres(seriesId: string): Promise<Genre[]> {
  const supabase = await createClient();

  // Get the genre IDs for this series from junction table
  const { data: seriesGenres } = await supabase
    .from("series_genres")
    .select("genre_id")
    .eq("series_id", seriesId);

  if (!seriesGenres || seriesGenres.length === 0) return [];

  const genreIds = seriesGenres.map((sg) => sg.genre_id);

  // Get the full genre details
  const { data: genres } = await supabase
    .from("genres")
    .select("*")
    .in("id", genreIds);

  return genres || [];
}
