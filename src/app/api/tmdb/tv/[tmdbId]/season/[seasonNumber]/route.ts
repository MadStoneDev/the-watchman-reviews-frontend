import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/tmdb/tv/[tmdbId]/season/[seasonNumber]
 * Fetch season details from TMDB API
 *
 * OPTIMIZED:
 * - Better error handling
 * - Response compression hints
 * - Proper type safety
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tmdbId: string; seasonNumber: string }> },
) {
  try {
    const { tmdbId, seasonNumber } = await params;
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get("language") || "en-US";

    // Validate inputs
    const seasonNum = parseInt(seasonNumber, 10);
    if (isNaN(seasonNum) || seasonNum < 0) {
      return NextResponse.json(
        { error: "Invalid season number" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${tmdbId}/season/${seasonNumber}?language=${language}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
        },
        // OPTIMIZATION: Cache for 1 day (season data rarely changes)
        next: { revalidate: 86400 },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Season not found" },
          { status: 404 },
        );
      }
      if (response.status === 401) {
        console.error("TMDB API authentication failed - check token");
        return NextResponse.json(
          { error: "API authentication failed" },
          { status: 500 },
        );
      }
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();

    // OPTIMIZATION: Return with cache headers for client-side caching too
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    });
  } catch (error) {
    console.error("Error in TMDB season API:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch season details",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
