import { createClient } from "@/src/utils/supabase/server";

const MEDIA_REFRESH_INTERVAL_DAYS = 30;

/**
 * Check if data needs to be refreshed based on last_fetched timestamp
 */
function needsRefresh(lastFetched: string | null): boolean {
  if (!lastFetched) return true;

  const lastFetchedDate = new Date(lastFetched);
  const daysSinceLastFetch =
    (Date.now() - lastFetchedDate.getTime()) / (1000 * 60 * 60 * 24);

  return daysSinceLastFetch >= MEDIA_REFRESH_INTERVAL_DAYS;
}

interface SeasonData {
  id: string;
  series_id: string;
  season_number: number;
  tmdb_id: number;
  title: string | null;
  overview: string | null;
  poster_path: string | null;
  air_date: string | null;
  episode_count: number | null;
  last_fetched: string | null;
}

interface EpisodeData {
  id: string;
  series_id: string;
  season_id: string;
  season_number: number;
  episode_number: number;
  tmdb_id: number;
  title: string;
  overview: string | null;
  poster_path: string | null;
  air_date: string | null;
  runtime: number | null;
}

/**
 * OPTIMIZATION 1: New function to only ensure season metadata exists
 * Does NOT fetch episodes - those will be loaded progressively
 * Much faster initial page load
 */
export async function ensureSeasonMetadata(
  seriesId: string,
  tmdbId: number,
): Promise<void> {
  const supabase = await createClient();

  console.log(`🔍 Ensuring season metadata for series ${seriesId}`);

  // Check if we have seasons
  const { data: existingSeasons } = await supabase
    .from("seasons")
    .select("id, season_number, last_fetched, episode_count")
    .eq("series_id", seriesId);

  // Check if we need to fetch from TMDB
  const needsFetch =
    !existingSeasons ||
    existingSeasons.length === 0 ||
    existingSeasons.some((s) => needsRefresh(s.last_fetched));

  if (needsFetch) {
    console.log(`   📡 Fetching season metadata...`);
    await ensureSeasonDataWithCounts(seriesId, tmdbId);
    console.log(`   ✅ Season metadata updated`);
  } else {
    console.log(
      `   ✅ Season metadata is fresh (${existingSeasons.length} seasons)`,
    );
  }
}

/**
 * OPTIMIZATION 2: Load episodes for a specific season only
 * Called by the API endpoint for progressive loading
 */
export async function loadSeasonEpisodes(
  seriesId: string,
  seasonNumber: number,
  tmdbId: number,
): Promise<EpisodeData[]> {
  const supabase = await createClient();

  console.log(`📺 Loading episodes for Season ${seasonNumber}`);

  // Get the season
  const { data: season } = await supabase
    .from("seasons")
    .select("id, tmdb_id, episode_count")
    .eq("series_id", seriesId)
    .eq("season_number", seasonNumber)
    .single();

  if (!season) {
    throw new Error(`Season ${seasonNumber} not found`);
  }

  // Check if we already have all episodes for this season
  const { data: existingEpisodes, count } = await supabase
    .from("episodes")
    .select("*", { count: "exact" })
    .eq("season_id", season.id)
    .order("episode_number", { ascending: true });

  const expectedCount = season.episode_count || 0;
  const actualCount = count || 0;

  // If we have all episodes, return them
  if (expectedCount > 0 && actualCount >= expectedCount) {
    console.log(`   ✅ Already have all ${actualCount} episodes cached`);
    return existingEpisodes || [];
  }

  // Fetch from TMDB
  console.log(
    `   📡 Fetching (have ${actualCount}/${expectedCount})...`,
  );

  try {
    const url = `https://api.themoviedb.org/3/tv/${tmdbId}/season/${seasonNumber}?language=en-US`;

    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
      },
      // Add caching for better performance
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const seasonData = await response.json();

    if (!seasonData.episodes || seasonData.episodes.length === 0) {
      console.log(`   ⚠️  No episodes found in TMDB response`);
      return existingEpisodes || [];
    }

    // Prepare episodes for upsert
    const episodesToUpsert = seasonData.episodes.map((ep: any) => ({
      series_id: seriesId,
      season_id: season.id,
      season_number: seasonNumber,
      episode_number: ep.episode_number,
      tmdb_id: ep.id,
      title: ep.name || `Episode ${ep.episode_number}`,
      overview: ep.overview,
      poster_path: ep.still_path,
      air_date: ep.air_date,
      runtime: ep.runtime,
    }));

    // Upsert episodes
    const { data: upsertedEpisodes, error } = await supabase
      .from("episodes")
      .upsert(episodesToUpsert, {
        onConflict: "series_id,season_number,episode_number",
        ignoreDuplicates: false,
      })
      .select("*")
      .order("episode_number", { ascending: true });

    if (error) {
      console.error(`   ❌ Error upserting episodes:`, error);
      throw error;
    }

    console.log(`   ✅ Loaded ${upsertedEpisodes?.length || 0} episodes`);
    return upsertedEpisodes || [];
  } catch (error) {
    console.error(`   ❌ Error loading season episodes:`, error);
    // Return cached episodes if available
    return existingEpisodes || [];
  }
}

/**
 * Original function - now simplified to use the optimized approach
 * Kept for backward compatibility
 */
export async function ensureSeriesDataPopulated(
  seriesId: string,
  tmdbId: number,
): Promise<{
  seasons: (SeasonData & { episodes: EpisodeData[] })[];
  totalEpisodes: number;
}> {
  const supabase = await createClient();

  console.log(`🔍 ensureSeriesDataPopulated for series ${seriesId}`);

  // Ensure season metadata exists
  await ensureSeasonMetadata(seriesId, tmdbId);

  // Get all seasons
  const { data: seasons } = await supabase
    .from("seasons")
    .select("*")
    .eq("series_id", seriesId)
    .order("season_number", { ascending: true });

  if (!seasons || seasons.length === 0) {
    return { seasons: [], totalEpisodes: 0 };
  }

  // Load episodes for all seasons
  const seasonsWithEpisodes = await Promise.all(
    seasons.map(async (season) => {
      const episodes = await loadSeasonEpisodes(
        seriesId,
        season.season_number,
        tmdbId,
      );

      return {
        ...season,
        episodes,
      };
    }),
  );

  const totalEpisodes = seasonsWithEpisodes.reduce(
    (total, season) => total + season.episodes.length,
    0,
  );

  console.log(
    `✅ Loaded ${totalEpisodes} total episodes for ${seasons.length} seasons`,
  );

  return { seasons: seasonsWithEpisodes, totalEpisodes };
}

/**
 * Get episode count for a series from season episode_counts
 * Much faster than counting individual episodes
 */
export async function getSeriesEpisodeCount(
  seriesId: string,
  tmdbId: number,
): Promise<number> {
  const supabase = await createClient();

  // Check if we have seasons with episode_count
  const { data: seasons } = await supabase
    .from("seasons")
    .select("episode_count, last_fetched")
    .eq("series_id", seriesId);

  // Check if we need to fetch from TMDB
  const needsFetch =
    !seasons ||
    seasons.length === 0 ||
    seasons.some((s) => s.episode_count === null || s.episode_count === 0) ||
    seasons.some((s) => needsRefresh(s.last_fetched));

  if (needsFetch) {
    await ensureSeasonDataWithCounts(seriesId, tmdbId);

    // Re-fetch seasons after populating
    const { data: updatedSeasons } = await supabase
      .from("seasons")
      .select("episode_count")
      .eq("series_id", seriesId);

    if (!updatedSeasons) return 0;

    return updatedSeasons.reduce(
      (total, season) => total + (season.episode_count || 0),
      0,
    );
  }

  // Use cached data
  return seasons.reduce(
    (total, season) => total + (season.episode_count || 0),
    0,
  );
}

/**
 * Ensures seasons are populated with episode counts from TMDB series call
 * Does NOT fetch individual episodes - just season metadata
 */
async function ensureSeasonDataWithCounts(
  seriesId: string,
  tmdbId: number,
): Promise<void> {
  const supabase = await createClient();

  console.log(`   🔄 Fetching season metadata...`);

  try {
    const url = `https://api.themoviedb.org/3/tv/${tmdbId}?language=en-US`;

    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
      },
      // Add caching
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const seriesData = await response.json();

    // Update series last_fetched
    await supabase
      .from("series")
      .update({ last_fetched: new Date().toISOString() })
      .eq("id", seriesId);

    // Upsert seasons with episode counts
    const seasonsToUpsert = seriesData.seasons.map((tmdbSeason: any) => ({
      series_id: seriesId,
      season_number: tmdbSeason.season_number,
      tmdb_id: tmdbSeason.id,
      title: tmdbSeason.name,
      overview: tmdbSeason.overview,
      poster_path: tmdbSeason.poster_path,
      air_date: tmdbSeason.air_date,
      episode_count: tmdbSeason.episode_count,
      last_fetched: new Date().toISOString(),
    }));

    const { error } = await supabase.from("seasons").upsert(seasonsToUpsert, {
      onConflict: "series_id,season_number",
      ignoreDuplicates: false,
    });

    if (error) {
      console.error(`   ❌ Error upserting seasons:`, error);
      throw error;
    }

    console.log(`   ✅ Upserted ${seasonsToUpsert.length} seasons`);
  } catch (error) {
    console.error("   ❌ Error in ensureSeasonDataWithCounts:", error);
    throw error;
  }
}
