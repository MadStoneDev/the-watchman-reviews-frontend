"use server";

import { TMDBCredits, TMDBCastMember } from "@/src/lib/types";

const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;
const MAX_CAST_MEMBERS = 20;

/**
 * Fetch credits for a TV series from TMDB
 */
export async function getTVCredits(
  tmdbId: number
): Promise<{ success: boolean; credits?: TMDBCredits; error?: string }> {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${tmdbId}/credits?language=en-US`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_API_TOKEN}`,
        },
        next: { revalidate: 86400 }, // Cache for 1 day
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: "TV series not found" };
      }
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();

    // Limit cast members and sort by order
    const limitedCredits: TMDBCredits = {
      id: data.id,
      cast: (data.cast || [])
        .slice(0, MAX_CAST_MEMBERS)
        .sort((a: TMDBCastMember, b: TMDBCastMember) => a.order - b.order),
      crew: data.crew || [],
    };

    return { success: true, credits: limitedCredits };
  } catch (error) {
    console.error("[Credits] Error fetching TV credits:", error);
    return { success: false, error: "Failed to fetch TV credits" };
  }
}

/**
 * Fetch credits for a movie from TMDB
 */
export async function getMovieCredits(
  tmdbId: number
): Promise<{ success: boolean; credits?: TMDBCredits; error?: string }> {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}/credits?language=en-US`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_API_TOKEN}`,
        },
        next: { revalidate: 86400 }, // Cache for 1 day
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: "Movie not found" };
      }
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();

    // Limit cast members and sort by order
    const limitedCredits: TMDBCredits = {
      id: data.id,
      cast: (data.cast || [])
        .slice(0, MAX_CAST_MEMBERS)
        .sort((a: TMDBCastMember, b: TMDBCastMember) => a.order - b.order),
      crew: data.crew || [],
    };

    return { success: true, credits: limitedCredits };
  } catch (error) {
    console.error("[Credits] Error fetching movie credits:", error);
    return { success: false, error: "Failed to fetch movie credits" };
  }
}
