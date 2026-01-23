import React from "react";
import type { Metadata } from "next";
import { createClient } from "@/src/utils/supabase/server";
import SpecialBlockWrapper from "@/src/components/special-block-wrapper";
import { BrowseMediaRow } from "@/src/components/browse-media-row";
import { getTrendingMovies, getTrendingSeries } from "@/src/lib/trending";

export const metadata: Metadata = {
  title: "Browse | JustReel",
  description:
    "Discover movies and TV shows. Browse by category, genre, and popularity.",
};

interface MediaItem {
  id: string;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_year: string | null;
  vote_average: number | null;
}

export default async function BrowsePage() {
  const supabase = await createClient();

  // Fetch newest content (mixed movies and series)
  const { data: newestMovies } = await supabase
    .from("movies")
    .select("id, title, poster_path, release_year, vote_average, backdrop_path")
    .not("release_year", "is", "null")
    .order("release_year", { ascending: false })
    .limit(10);

  const { data: newestSeries } = await supabase
    .from("series")
    .select("id, title, poster_path, release_year, vote_average, backdrop_path")
    .order("release_year", { ascending: false })
    .limit(10);

  const newestRaw: MediaItem[] = [
    ...(newestMovies?.map((movie) => ({ ...movie, type: "movie" as const })) ||
      []),
    ...(newestSeries?.map((series) => ({
      ...series,
      type: "series" as const,
    })) || []),
  ];

  newestRaw.sort((a, b) => {
    const yearA = parseInt(a.release_year!) || 0;
    const yearB = parseInt(b.release_year!) || 0;

    // 1. Primary Sort: Release Year (Descending - Newest First)
    const yearDiff = yearB - yearA;

    if (yearDiff !== 0) {
      return yearDiff;
    }

    // 2. Secondary Sort (Tie-Breaker): Title (Ascending - A-Z)
    return a.title.localeCompare(b.title);
  });

  const newest: MediaItem[] = (newestRaw || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    type: item.type,
    poster_path: item.poster_path,
    release_year: item.release_year,
    vote_average: item.vote_average,
    backdrop_path: item.backdrop_path,
  }));

  // Fetch trending movies and series (cached in Upstash, refreshed weekly)
  const [trendingMoviesData, trendingSeriesData] = await Promise.all([
    getTrendingMovies(),
    getTrendingSeries(),
  ]);

  // Transform trending data to MediaItem format
  const trendingMovies: MediaItem[] = trendingMoviesData.map((item) => ({
    id: item.db_id,
    title: item.title,
    poster_path: item.poster_path,
    backdrop_path: item.backdrop_path,
    release_year: item.release_year,
    vote_average: item.vote_average,
  }));

  const trendingSeries: MediaItem[] = trendingSeriesData.map((item) => ({
    id: item.db_id,
    title: item.title,
    poster_path: item.poster_path,
    backdrop_path: item.backdrop_path,
    release_year: item.release_year,
    vote_average: item.vote_average,
  }));

  return (
    <>
      <section className={`transition-all duration-300 ease-in-out`}>
        <h1 className={`max-w-60 text-2xl sm:3xl md:text-4xl font-bold`}>
          Browse
        </h1>
      </section>

      {/* Featured/Special Blocks Carousel */}
      <div
        className={`mt-8 flex flex-nowrap items-center justify-between gap-2 transition-all duration-300 ease-in-out`}
      >
        <SpecialBlockWrapper />
      </div>

      {/* Content Rows with Real Data */}
      <BrowseMediaRow title="Newest Additions" data={newest} type="newest" />

      <BrowseMediaRow
        title="Trending Movies"
        data={trendingMovies}
        type="movies"
        linkType="movie"
      />

      <BrowseMediaRow
        title="Trending TV Shows"
        data={trendingSeries}
        type="series"
        linkType="series"
      />

      {/*<BrowseMediaRow*/}
      {/*  title="Great for Kids"*/}
      {/*  data={kidsContent}*/}
      {/*  type="kids"*/}
      {/*  linkType="movie"*/}
      {/*/>*/}
    </>
  );
}
