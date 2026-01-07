import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/src/utils/supabase/server";

/**
 * GET /api/series/[seriesId]/season/[seasonNumber]/episodes
 * Load episodes for a specific season from database
 * Fetches from TMDB if not cached
 *
 * This endpoint is used for progressive loading in SeriesProgressTracker
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ seriesId: string; seasonNumber: string }> },
) {
  try {
    const { seriesId, seasonNumber } = await params;
    const seasonNum = parseInt(seasonNumber, 10);

    // Validate season number
    if (isNaN(seasonNum) || seasonNum < 0) {
      return NextResponse.json(
        { error: "Invalid season number" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Get the series TMDB ID and season info
    const { data: series, error: seriesError } = await supabase
      .from("series")
      .select("tmdb_id")
      .eq("id", seriesId)
      .single();

    if (seriesError || !series) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    // Get the season
    const { data: season, error: seasonError } = await supabase
      .from("seasons")
      .select("id, tmdb_id, episode_count")
      .eq("series_id", seriesId)
      .eq("season_number", seasonNum)
      .single();

    if (seasonError || !season) {
      return NextResponse.json({ error: "Season not found" }, { status: 404 });
    }

    // Check if we have episodes cached
    const { data: existingEpisodes, count } = await supabase
      .from("episodes")
      .select(
        "id, episode_number, title, overview, air_date, runtime, poster_path, tmdb_id",
        { count: "exact" },
      )
      .eq("season_id", season.id)
      .order("episode_number", { ascending: true });

    const expectedCount = season.episode_count || 0;
    const actualCount = count || 0;

    // If we have all episodes cached, return them
    if (expectedCount > 0 && actualCount >= expectedCount && existingEpisodes) {
      console.log(
        `[Episodes API] Returning ${actualCount} cached episodes for season ${seasonNum}`,
      );

      return NextResponse.json(existingEpisodes, {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
        },
      });
    }

    // Fetch from TMDB if not fully cached
    console.log(
      `[Episodes API] Fetching season ${seasonNum} (have ${actualCount}/${expectedCount})`,
    );

    const tmdbUrl = `https://api.themoviedb.org/3/tv/${series.tmdb_id}/season/${seasonNum}?language=en-US`;

    const tmdbResponse = await fetch(tmdbUrl, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
      },
      next: { revalidate: 3600 }, // Cache TMDB response for 1 hour
    });

    // In route.ts, update the TMDB fetch section:

    if (!tmdbResponse.ok) {
      console.error(`[Episodes API] TMDB API error: ${tmdbResponse.status}`);

      // If it's a 404, the season doesn't exist on TMDB
      if (tmdbResponse.status === 404) {
        console.warn(
            `[Episodes API] Season ${seasonNum} not found on TMDB for series ${seriesId}`
        );

        // Return existing cached episodes if we have any
        if (existingEpisodes && existingEpisodes.length > 0) {
          return NextResponse.json(existingEpisodes);
        }

        // Otherwise return empty array with 404
        return NextResponse.json(
            { error: 'Season not found on TMDB', episodes: [] },
            { status: 404 }
        );
      }

      // If TMDB fails but we have some cached episodes, return those
      if (existingEpisodes && existingEpisodes.length > 0) {
        console.log(
            `[Episodes API] TMDB failed, returning ${actualCount} cached episodes`
        );
        return NextResponse.json(existingEpisodes);
      }

      throw new Error(`TMDB API error: ${tmdbResponse.status}`);
    }

    const seasonData = await tmdbResponse.json();

    if (!seasonData.episodes || seasonData.episodes.length === 0) {
      console.warn(`[Episodes API] No episodes in TMDB response`);
      return NextResponse.json(existingEpisodes || []);
    }

    // Prepare episodes for upsert
    const episodesToUpsert = seasonData.episodes.map((ep: any) => ({
      series_id: seriesId,
      season_id: season.id,
      season_number: seasonNum,
      episode_number: ep.episode_number,
      tmdb_id: ep.id,
      title: ep.name || `Episode ${ep.episode_number}`,
      overview: ep.overview,
      poster_path: ep.still_path,
      air_date: ep.air_date,
      runtime: ep.runtime,
    }));

    // Upsert episodes to database
    const { data: upsertedEpisodes, error: upsertError } = await supabase
      .from("episodes")
      .upsert(episodesToUpsert, {
        onConflict: "series_id,season_number,episode_number",
        ignoreDuplicates: false,
      })
      .select(
        "id, episode_number, title, overview, air_date, runtime, poster_path, tmdb_id",
      )
      .order("episode_number", { ascending: true });

    if (upsertError) {
      console.error(`[Episodes API] Error upserting episodes:`, upsertError);
      // Return TMDB data even if database update fails
      return NextResponse.json(
        seasonData.episodes.map((ep: any) => ({
          id: `tmdb-${ep.id}`,
          episode_number: ep.episode_number,
          title: ep.name,
          overview: ep.overview,
          air_date: ep.air_date,
          runtime: ep.runtime,
          poster_path: ep.still_path,
          tmdb_id: ep.id,
        })),
      );
    }

    console.log(
      `[Episodes API] Successfully upserted ${
        upsertedEpisodes?.length || 0
      } episodes`,
    );

    return NextResponse.json(upsertedEpisodes || [], {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    });
  } catch (error) {
    console.error("[Episodes API] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to load episodes",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
