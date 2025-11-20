import React from "react";
import type { Metadata } from "next";
import { createClient } from "@/src/utils/supabase/server";
import SpecialBlockWrapper from "@/src/components/special-block-wrapper";
import { BrowseMediaRow } from "@/src/components/browse-media-row";

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
    ...(newestMovies || []),
    ...(newestSeries || []),
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
    poster_path: item.poster_path,
    release_year: item.release_year,
    vote_average: item.vote_average,
    backdrop_path: item.backdrop_path,
  }));

  // Fetch popular movies
  const { data: popularMoviesRaw } = await supabase
    .from("movies")
    .select("id, title, poster_path, release_year, vote_average, backdrop_path")
    .order("popularity", { ascending: false })
    .limit(20);

  const popularMovies: MediaItem[] = (popularMoviesRaw || []).map(
    (item: any) => ({
      id: item.id,
      title: item.title,
      poster_path: item.poster_path,
      release_year: item.release_year,
      vote_average: item.vote_average,
      backdrop_path: item.backdrop_path,
    }),
  );

  // Fetch popular series
  const { data: popularSeriesRaw } = await supabase
    .from("series")
    .select("id, title, poster_path, release_year, vote_average, backdrop_path")
    .order("created_at", { ascending: false })
    .limit(20);

  const popularSeries: MediaItem[] = (popularSeriesRaw || []).map(
    (item: any) => ({
      id: item.id,
      title: item.title,
      poster_path: item.poster_path,
      release_year: item.release_year,
      vote_average: item.vote_average,
      backdrop_path: item.backdrop_path,
    }),
  );

  // Fetch kids content
  const { data: kidsContentRaw } = await supabase
    .from("movies")
    .select("id, title, poster_path, release_year, vote_average, backdrop_path")
    .limit(20);

  const kidsContent: MediaItem[] = (kidsContentRaw || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    poster_path: item.poster_path,
    release_year: item.release_year,
    vote_average: item.vote_average,
    backdrop_path: item.backdrop_path,
  }));

  return (
    <>
      <section
        className={`mt-14 lg:mt-20 transition-all duration-300 ease-in-out`}
      >
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
      <BrowseMediaRow
        title="Newest Additions"
        data={newest}
        type="newest"
        linkType="movie"
      />

      <BrowseMediaRow
        title="Popular Movies"
        data={popularMovies}
        type="movies"
        linkType="movie"
      />

      <BrowseMediaRow
        title="Popular TV Shows"
        data={popularSeries}
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
