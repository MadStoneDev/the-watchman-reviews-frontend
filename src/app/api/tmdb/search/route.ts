import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");
    const page = searchParams.get("page") || "1";
    const language = searchParams.get("language") || "en-US";

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
        query,
      )}&page=${page}&language=${language}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
        },
        // Cache for 5 minutes
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in TMDB search API:", error);
    return NextResponse.json(
      { error: "Failed to search TMDB" },
      { status: 500 },
    );
  }
}
