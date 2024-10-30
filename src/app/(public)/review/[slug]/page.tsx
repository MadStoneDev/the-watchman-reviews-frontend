import React from "react";

import axios from "axios";

import { Genre } from "@/src/types/media";
import { Database } from "@/src/types/supabase";

import SingleMediaWrapper from "@/src/components/wrapper-single-media";

interface SearchParams {
  params: {
    slug: string;
  };
}

interface TMDBItem {
  id: number;
  title: string;
  tagline: string;
  backdrop: string;
  poster: string;
  genres: Genre[];
  imdb_id: string;
  overview: string;
  date: string;
  rating: number;
  adult: boolean;
}

type MediaItem = Database["public"]["Tables"]["medias"]["Row"];
type ReviewItem = Database["public"]["Tables"]["reviews"]["Row"];

export default async function MediaPage(searchParams: SearchParams) {
  const mediaSlug = searchParams.params.slug.slice(1);
  let TMDBData: TMDBItem | null = null;
  let mediaData: MediaItem | null = null;
  let reviewData: ReviewItem | null = null;

  // Functions

  return mediaData && <SingleMediaWrapper data={mediaData} />;
}
