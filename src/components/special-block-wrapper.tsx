import React from "react";
import { createClient } from "@/src/utils/supabase/server";
import SpecialBlockWrapperClient from "./special-block-wrapper-client";

interface FeaturedMedia {
  id: string;
  title: string;
  overview: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  release_year: string | null;
  vote_average: number | null;
  media_type: "movie" | "series";
  tmdb_id: number;
}

export default async function SpecialBlockWrapper() {
  const supabase = await createClient();

  // Fetch featured movies (high rated, recent)
  // const { data: featuredMovies } = await supabase
  //   .from("movies")
  //   .select(
  //     "id, title, overview, poster_path, backdrop_path, release_year, vote_average, tmdb_id",
  //   )
  //   .not("backdrop_path", "is", null) // Must have backdrop
  //   .not("vote_average", "is", null)
  //   .gte("vote_average", 7.5) // High rated
  //   .order("vote_average", { ascending: false })
  //   .limit(10);
  const { data: featuredMovies } = await supabase
    .from("movies")
    .select(
      "id, title, overview, poster_path, backdrop_path, release_year, vote_average, tmdb_id",
    )
    .not("backdrop_path", "is", null) // Must have backdrop
    .order("created_at", { ascending: false })
    .limit(50);
  
  // Fetch featured series (high rated, recent)
  // const { data: featuredSeries } = await supabase
  //   .from("series")
  //   .select(
  //     "id, title, overview, poster_path, backdrop_path, release_year, vote_average, tmdb_id",
  //   )
  //   .not("backdrop_path", "is", null)
  //   .not("vote_average", "is", null)
  //   .gte("vote_average", 7.5)
  //   .order("vote_average", { ascending: false })
  //   .limit(10);
  
  const { data: featuredSeries } = await supabase
    .from("series")
    .select(
      "id, title, overview, poster_path, backdrop_path, release_year, vote_average, tmdb_id",
    )
    .not("backdrop_path", "is", null)
    .order("created_at", { ascending: false })
    .limit(50);

  // Combine and shuffle
  const allFeatured: FeaturedMedia[] = [
    ...(featuredMovies || []).map((m: any) => ({
      ...m,
      media_type: "movie" as const,
    })),
    ...(featuredSeries || []).map((s: any) => ({
      ...s,
      media_type: "series" as const,
    })),
  ];

  // Shuffle array
  const shuffled = allFeatured.sort(() => Math.random() - 0.5);

  // Take top 20 for rotation
  const featuredMedia = shuffled.slice(0, 20);

  return <SpecialBlockWrapperClient featuredMedia={featuredMedia} />;
}
