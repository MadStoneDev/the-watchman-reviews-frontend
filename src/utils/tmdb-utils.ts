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
 * Ensures a series has seasons and episodes populated from TMDB
 * Returns the seasons with their episodes
 * This fetches FULL episode data (for progress tracker)
 */
export async function ensureSeriesDataPopulated(
  seriesId: string,
  tmdbId: number,
): Promise<{
  seasons: (SeasonData & { episodes: EpisodeData[] })[];
  totalEpisodes: number;
}> {
  const supabase = await createClient();

  console.log("═══════════════════════════════════════════════════");
  console.log(`🔍 STARTING ensureSeriesDataPopulated`);
  console.log(`   Series ID: ${seriesId}`);
  console.log(`   TMDB ID: ${tmdbId}`);
  console.log(
    `   Environment Token Available: ${!!process.env.TMDB_API_TOKEN}`,
  );
  if (process.env.TMDB_API_TOKEN) {
    console.log(
      `   Token Preview: ${process.env.TMDB_API_TOKEN.substring(0, 15)}...`,
    );
  }
  console.log("═══════════════════════════════════════════════════");

  // Check if we have seasons
  const { data: existingSeasons } = await supabase
    .from("seasons")
    .select("id, season_number, last_fetched, episode_count")
    .eq("series_id", seriesId)
    .order("season_number", { ascending: true });

  console.log(`📊 Found ${existingSeasons?.length || 0} seasons in database`);

  if (existingSeasons && existingSeasons.length > 0) {
    for (const season of existingSeasons) {
      const { count } = await supabase
        .from("episodes")
        .select("*", { count: "exact", head: true })
        .eq("season_id", season.id);

      console.log(
        `   Season ${season.season_number}: ${count || 0}/${
          season.episode_count || "?"
        } episodes (last_fetched: ${
          season.last_fetched
            ? new Date(season.last_fetched).toLocaleDateString()
            : "never"
        })`,
      );
    }
  }

  // ✅ FIX: Check if EACH season has the CORRECT NUMBER of episodes
  let needsEpisodeFetch = false;

  if (!existingSeasons || existingSeasons.length === 0) {
    needsEpisodeFetch = true;
    console.log(
      `❌ No seasons found for series ${seriesId}, will fetch from TMDB`,
    );
  } else {
    // Check if any season needs refresh
    if (existingSeasons.some((s) => needsRefresh(s.last_fetched))) {
      needsEpisodeFetch = true;
      console.log(
        `⏰ Some seasons need refresh (older than ${MEDIA_REFRESH_INTERVAL_DAYS} days)`,
      );
    } else {
      // First get all seasons with their episode_count
      const { data: seasonsWithCounts } = await supabase
        .from("seasons")
        .select("id, season_number, episode_count")
        .eq("series_id", seriesId);

      if (seasonsWithCounts) {
        // Check if each season has the correct number of episodes
        for (const season of seasonsWithCounts) {
          // Count actual episodes in database
          const { count } = await supabase
            .from("episodes")
            .select("*", { count: "exact", head: true })
            .eq("season_id", season.id);

          const actualCount = count || 0;
          const expectedCount = season.episode_count || 0;

          if (actualCount === 0) {
            needsEpisodeFetch = true;
            console.log(
              `❌ Season ${season.season_number} has NO episodes (expected ${expectedCount})`,
            );
            break;
          } else if (expectedCount > 0 && actualCount < expectedCount) {
            needsEpisodeFetch = true;
            console.log(
              `❌ Season ${season.season_number} incomplete: ${actualCount}/${expectedCount} episodes`,
            );
            break;
          } else {
            console.log(
              `   ✅ Season ${season.season_number}: ${actualCount}/${expectedCount} episodes (complete)`,
            );
          }
        }
      }
    }
  }

  if (needsEpisodeFetch) {
    console.log("═══════════════════════════════════════════════════");
    console.log(`🚀 FETCHING episodes from TMDB for series ${seriesId}...`);
    console.log("═══════════════════════════════════════════════════");

    try {
      // First, ensure we have seasons with episode counts
      await ensureSeasonDataWithCounts(seriesId, tmdbId);

      // Get the seasons we just populated
      const { data: seasons } = await supabase
        .from("seasons")
        .select("*")
        .eq("series_id", seriesId)
        .order("season_number", { ascending: true });

      if (!seasons) {
        throw new Error("Failed to get seasons after populating");
      }

      console.log(
        `📝 Processing ${seasons.length} seasons for episode data...`,
      );

      // Now fetch detailed episode data for each season
      for (const season of seasons) {
        // Check if this season already has the correct number of episodes
        const { count } = await supabase
          .from("episodes")
          .select("*", { count: "exact", head: true })
          .eq("season_id", season.id);

        const actualCount = count || 0;
        const expectedCount = season.episode_count || 0;

        // Skip if we already have the correct number of episodes for this season
        if (expectedCount > 0 && actualCount >= expectedCount) {
          console.log(
            `   ✅ Season ${season.season_number}: Already has all ${actualCount} episodes, skipping`,
          );
          continue;
        } else if (actualCount > 0 && expectedCount === 0) {
          // We have episodes but don't know the expected count - assume it's complete
          console.log(
            `   ✅ Season ${season.season_number}: Has ${actualCount} episodes (expected count unknown), skipping`,
          );
          continue;
        }

        console.log("");
        console.log(`   ┌─────────────────────────────────────────────`);
        console.log(`   │ 🌐 FETCHING Season ${season.season_number}`);
        console.log(`   │ Current: ${actualCount} episodes`);
        console.log(`   │ Expected: ${expectedCount} episodes`);
        console.log(`   └─────────────────────────────────────────────`);

        const url = `https://api.themoviedb.org/3/tv/${tmdbId}/season/${season.season_number}?language=en-US`;
        console.log(`   📡 Calling TMDB API: ${url}`);

        const seasonResponse = await fetch(url, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
          },
        });

        console.log(
          `   📥 Response: ${seasonResponse.status} ${seasonResponse.statusText}`,
        );

        console.log(
          `   📥 Response: ${seasonResponse.status} ${seasonResponse.statusText}`,
        );

        if (!seasonResponse.ok) {
          let errorDetails = `Status ${seasonResponse.status}`;
          try {
            const errorText = await seasonResponse.text();
            errorDetails += ` - ${errorText.substring(0, 200)}`;
          } catch (e) {
            // Ignore error parsing error
          }
          console.error(
            `   ❌ TMDB API Error for Season ${season.season_number}: ${errorDetails}`,
          );
          continue;
        }

        const seasonData = await seasonResponse.json();
        const episodeCount = seasonData.episodes?.length || 0;
        console.log(`   📦 Received ${episodeCount} episodes from TMDB`);

        // Upsert episodes for this season
        if (seasonData.episodes && seasonData.episodes.length > 0) {
          const episodesToUpsert = seasonData.episodes.map((ep: any) => ({
            series_id: seriesId,
            season_id: season.id,
            season_number: season.season_number,
            episode_number: ep.episode_number,
            tmdb_id: ep.id,
            title: ep.name,
            overview: ep.overview,
            poster_path: ep.poster_path,
            air_date: ep.air_date,
            runtime: ep.runtime,
          }));

          console.log(
            `   💾 Upserting ${episodesToUpsert.length} episodes to database...`,
          );
          console.log(
            `   📝 Episodes: ${episodesToUpsert
              .map((e: any) => `E${e.episode_number}`)
              .join(", ")}`,
          );

          const { error: episodesError, data: upsertResult } = await supabase
            .from("episodes")
            .upsert(episodesToUpsert, {
              onConflict: "series_id,season_number,episode_number",
              ignoreDuplicates: false,
            })
            .select("id, episode_number");

          if (episodesError) {
            console.error(
              `   ❌ Database Error:`,
              JSON.stringify(episodesError, null, 2),
            );
            console.error(`   ❌ Error Code: ${episodesError.code}`);
            console.error(`   ❌ Error Message: ${episodesError.message}`);
            console.error(`   ❌ Error Details:`, episodesError.details);
          } else {
            console.log(
              `   ✅ Successfully upserted ${episodesToUpsert.length} episodes`,
            );
            if (upsertResult && upsertResult.length > 0) {
              console.log(
                `   ✅ Confirmed ${upsertResult.length} episodes in database`,
              );
            }
          }
        } else {
          console.warn(
            `   ⚠️  No episodes array in TMDB response for Season ${season.season_number}`,
          );
          console.warn(
            `   ⚠️  Response keys:`,
            Object.keys(seasonData).join(", "),
          );
        }
      }

      console.log("");
      console.log(`✅ Episode fetching complete for series ${seriesId}`);
      console.log("═══════════════════════════════════════════════════");
    } catch (error) {
      console.error("═══════════════════════════════════════════════════");
      console.error("❌ CRITICAL ERROR in ensureSeriesDataPopulated:");
      console.error("═══════════════════════════════════════════════════");
      console.error(error);
      if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      console.error("═══════════════════════════════════════════════════");
    }
  } else {
    console.log(
      `✅ All seasons have complete episode data for series ${seriesId}, using cached data`,
    );
  }

  // Fetch all seasons and episodes from the database
  console.log(`\n📊 Fetching final data from database...`);
  const { data: seasons } = await supabase
    .from("seasons")
    .select("*")
    .eq("series_id", seriesId)
    .order("season_number", { ascending: true });

  if (!seasons || seasons.length === 0) {
    console.log(`❌ ERROR: No seasons found in final database query`);
    return { seasons: [], totalEpisodes: 0 };
  }

  console.log(`📊 Found ${seasons.length} seasons in database`);

  // Fetch episodes for all seasons
  const seasonsWithEpisodes = await Promise.all(
    seasons.map(async (season) => {
      const { data: episodes } = await supabase
        .from("episodes")
        .select("*")
        .eq("season_id", season.id)
        .order("episode_number", { ascending: true });

      const episodeCount = episodes?.length || 0;
      console.log(
        `   Season ${season.season_number}: ${episodeCount} episodes loaded from database`,
      );

      return {
        ...season,
        episodes: episodes || [],
      };
    }),
  );

  // Calculate total episodes from actual episode count
  const totalEpisodes = seasonsWithEpisodes.reduce(
    (total, season) => total + season.episodes.length,
    0,
  );

  console.log("");
  console.log(
    `✅ FINAL RESULT: Returning ${totalEpisodes} total episodes across ${seasonsWithEpisodes.length} seasons`,
  );
  console.log("═══════════════════════════════════════════════════\n");

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
    // Fetch series data to get episode counts
    await ensureSeasonDataWithCounts(seriesId, tmdbId);

    // Re-fetch seasons after populating
    const { data: updatedSeasons } = await supabase
      .from("seasons")
      .select("episode_count")
      .eq("series_id", seriesId);

    if (!updatedSeasons) return 0;

    // Sum up episode counts
    return updatedSeasons.reduce(
      (total, season) => total + (season.episode_count || 0),
      0,
    );
  }

  // Use cached data - sum up episode counts
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

  console.log(
    `   🔄 Fetching season metadata (with episode counts) for series ${seriesId} from TMDB...`,
  );

  try {
    // Fetch series details from TMDB - includes episode_count per season
    const url = `https://api.themoviedb.org/3/tv/${tmdbId}?language=en-US`;
    console.log(`   📡 Calling TMDB API: ${url}`);

    const seriesResponse = await fetch(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
      },
    });

    console.log(
      `   📥 Response: ${seriesResponse.status} ${seriesResponse.statusText}`,
    );

    if (!seriesResponse.ok) {
      throw new Error(
        `Failed to fetch series from TMDB (Status: ${seriesResponse.status})`,
      );
    }

    const seriesData = await seriesResponse.json();
    console.log(
      `   📦 Received data for ${seriesData.seasons?.length || 0} seasons`,
    );

    // Update series last_fetched
    await supabase
      .from("series")
      .update({ last_fetched: new Date().toISOString() })
      .eq("id", seriesId);

    // Upsert seasons with episode counts from the series call
    let seasonsUpserted = 0;
    for (const tmdbSeason of seriesData.seasons) {
      console.log(
        `   💾 Upserting Season ${tmdbSeason.season_number} (${tmdbSeason.episode_count} episodes)...`,
      );

      const { error } = await supabase.from("seasons").upsert(
        {
          series_id: seriesId,
          season_number: tmdbSeason.season_number,
          tmdb_id: tmdbSeason.id,
          title: tmdbSeason.name,
          overview: tmdbSeason.overview,
          poster_path: tmdbSeason.poster_path,
          air_date: tmdbSeason.air_date,
          episode_count: tmdbSeason.episode_count, // Use episode_count from series call!
          last_fetched: new Date().toISOString(),
        },
        {
          onConflict: "series_id,season_number",
          ignoreDuplicates: false,
        },
      );

      if (error) {
        console.error(
          `   ❌ Error upserting Season ${tmdbSeason.season_number}:`,
          error,
        );
      } else {
        seasonsUpserted++;
      }
    }

    console.log(
      `   ✅ Successfully populated ${seasonsUpserted} seasons with episode counts for series ${seriesId}`,
    );
  } catch (error) {
    console.error("   ❌ Error in ensureSeasonDataWithCounts:", error);
    if (error instanceof Error) {
      console.error("   Error message:", error.message);
    }
  }
}
