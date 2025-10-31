import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> },
) {
  try {
    const { type } = await params;

    // Validate type is either 'movie' or 'tv'
    if (type !== "movie" && type !== "tv") {
      return NextResponse.json(
        { error: "Type must be 'movie' or 'tv'" },
        { status: 400 },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get("language") || "en-US";

    const endpoint =
      type === "movie"
        ? "https://api.themoviedb.org/3/genre/movie/list"
        : "https://api.themoviedb.org/3/genre/tv/list";

    const response = await fetch(`${endpoint}?language=${language}`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
      },
      // Cache genres for 1 week (they rarely change)
      next: { revalidate: 604800 },
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in TMDB genres API:", error);
    return NextResponse.json(
      { error: "Failed to fetch genres" },
      { status: 500 },
    );
  }
}
