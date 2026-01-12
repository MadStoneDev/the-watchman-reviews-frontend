import React from "react";

import SingleMediaWrapperSimple from "@/src/components/wrapper-single-media-simple";

interface SearchParams {
  params: {
    id: string;
  };
}

interface FullMediaItem {
  id: number;
  title: string;
  tagline: string;
  backdrop: string;
  poster: string;
  imdb_id: string;
  overview: string;
  date: string;
  rating: number;
  adult: boolean;
}

export default async function MediaPage(searchParams: SearchParams) {
  // Variables & States
  let mediaType: string;

  switch (searchParams.params.id.charAt(0)) {
    case "m":
      mediaType = "movie";
      break;
    case "s":
      mediaType = "series";
      break;
    default:
      console.error(`Invalid media type: ${searchParams.params.id.charAt(0)}`);
      return <></>;
  }

  const mediaId = searchParams.params.id.slice(1);
  let mediaData: FullMediaItem | null = null;

  // ✅ UPDATED: Server-side page can call TMDB directly with secure env var
  const url =
    mediaType === "movie"
      ? `https://api.themoviedb.org/3/movie/${mediaId}?language=en-US`
      : `https://api.themoviedb.org/3/tv/${mediaId}?language=en-US`;

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        // ✅ FIXED: Use TMDB_API_TOKEN (server-only) instead of NEXT_PUBLIC_TMDB_API_TOKEN
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
      },
      // Add caching for better performance
      next: { revalidate: 86400 }, // Cache for 1 day
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();

    mediaData = {
      id: data.id,
      title: data.title || data.name,
      tagline: data.tagline,
      backdrop: data.backdrop_path,
      poster: data.poster_path,
      imdb_id: data.imdb_id,
      overview: data.overview,
      date: data.release_date || data.first_air_date,
      rating: data.vote_average,
      adult: data.adult,
    };
  } catch (error) {
    console.error("Error fetching media data:", error);
  }

  return mediaData && <SingleMediaWrapperSimple mediaData={mediaData} />;
}
