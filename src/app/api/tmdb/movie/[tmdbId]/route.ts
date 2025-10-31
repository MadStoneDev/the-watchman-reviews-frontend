import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tmdbId: string }> },
) {
  try {
    const { tmdbId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get("language") || "en-US";

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}?language=${language}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
        },
        // Cache for 1 day
        next: { revalidate: 86400 },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Movie not found" }, { status: 404 });
      }
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in TMDB movie API:", error);
    return NextResponse.json(
      { error: "Failed to fetch movie details" },
      { status: 500 },
    );
  }
}
