import { createClient } from "@/src/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const MEDIA_REFRESH_INTERVAL_DAYS = 30;

interface EnsureMediaRequest {
  tmdb_id: number;
  media_type: "movie" | "tv";
}

interface EnsureMediaResponse {
  success: boolean;
  media_id?: string;
  error?: string;
}

const needsRefresh = (lastFetched: string | null): boolean => {
  if (!lastFetched) return true;

  const lastFetchedDate = new Date(lastFetched);
  const daysSinceLastFetch =
    (Date.now() - lastFetchedDate.getTime()) / (1000 * 60 * 60 * 24);

  return daysSinceLastFetch >= MEDIA_REFRESH_INTERVAL_DAYS;
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body: EnsureMediaRequest = await request.json();
    const { tmdb_id, media_type } = body;

    if (!tmdb_id || !media_type) {
      return NextResponse.json(
        { success: false, error: "Missing tmdb_id or media_type" },
        { status: 400 },
      );
    }

    const tableName = media_type === "movie" ? "movies" : "series";
    const tmdbEndpoint = media_type === "movie" ? "movie" : "tv";

    // Check if media exists
    const { data: existingMedia } = await supabase
      .from(tableName)
      .select("id, last_fetched")
      .eq("tmdb_id", tmdb_id)
      .maybeSingle();

    let mediaDbId: string;

    if (existingMedia) {
      mediaDbId = existingMedia.id;

      // Check if needs refresh
      const shouldRefresh = needsRefresh(existingMedia.last_fetched);

      if (shouldRefresh) {
        // Fetch fresh data from TMDB
        const tmdbResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/tmdb/${tmdbEndpoint}/${tmdb_id}?language=en-US`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (tmdbResponse.ok) {
          const tmdbData = await tmdbResponse.json();

          // Update with fresh data
          if (media_type === "movie") {
            await supabase
              .from("movies")
              .update({
                title: tmdbData.title,
                overview: tmdbData.overview || "",
                poster_path: tmdbData.poster_path,
                backdrop_path: tmdbData.backdrop_path,
                release_year: tmdbData.release_date
                  ? new Date(tmdbData.release_date).getFullYear().toString()
                  : "",
                runtime: tmdbData.runtime || null,
                popularity: tmdbData.popularity
                  ? parseInt(tmdbData.popularity)
                  : null,
                tmdb_popularity: tmdbData.popularity
                  ? String(tmdbData.popularity)
                  : null,
                last_fetched: new Date().toISOString(),
              })
              .eq("id", mediaDbId);
          } else {
            await supabase
              .from("series")
              .update({
                title: tmdbData.name,
                overview: tmdbData.overview || "",
                poster_path: tmdbData.poster_path,
                backdrop_path: tmdbData.backdrop_path,
                release_year: tmdbData.first_air_date
                  ? new Date(tmdbData.first_air_date).getFullYear().toString()
                  : "",
                first_air_date: tmdbData.first_air_date || null,
                last_air_date: tmdbData.last_air_date || null,
                status: tmdbData.status || null,
                last_fetched: new Date().toISOString(),
              })
              .eq("id", mediaDbId);
          }
        }
      }
    } else {
      // Media doesn't exist - fetch from TMDB and create
      const tmdbResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/tmdb/${tmdbEndpoint}/${tmdb_id}?language=en-US`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!tmdbResponse.ok) {
        return NextResponse.json(
          { success: false, error: "Failed to fetch from TMDB" },
          { status: 500 },
        );
      }

      const tmdbData = await tmdbResponse.json();

      if (media_type === "movie") {
        const { data: newMedia, error: createError } = await supabase
          .from("movies")
          .upsert(
            {
              tmdb_id: tmdbData.id,
              title: tmdbData.title,
              overview: tmdbData.overview || "",
              poster_path: tmdbData.poster_path,
              backdrop_path: tmdbData.backdrop_path,
              release_year: tmdbData.release_date
                ? new Date(tmdbData.release_date).getFullYear().toString()
                : "",
              runtime: tmdbData.runtime || null,
              popularity: tmdbData.popularity
                ? parseInt(tmdbData.popularity)
                : null,
              tmdb_popularity: tmdbData.popularity
                ? String(tmdbData.popularity)
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

        if (createError) throw createError;
        mediaDbId = newMedia.id;
      } else {
        const { data: newMedia, error: createError } = await supabase
          .from("series")
          .upsert(
            {
              tmdb_id: tmdbData.id,
              title: tmdbData.name,
              overview: tmdbData.overview || "",
              poster_path: tmdbData.poster_path,
              backdrop_path: tmdbData.backdrop_path,
              release_year: tmdbData.first_air_date
                ? new Date(tmdbData.first_air_date).getFullYear().toString()
                : "",
              first_air_date: tmdbData.first_air_date || null,
              last_air_date: tmdbData.last_air_date || null,
              status: tmdbData.status || null,
              last_fetched: new Date().toISOString(),
            },
            {
              onConflict: "tmdb_id",
              ignoreDuplicates: false,
            },
          )
          .select("id")
          .single();

        if (createError) throw createError;
        mediaDbId = newMedia.id;
      }
    }

    return NextResponse.json({
      success: true,
      media_id: mediaDbId,
    });
  } catch (error) {
    console.error("Error ensuring media exists:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
