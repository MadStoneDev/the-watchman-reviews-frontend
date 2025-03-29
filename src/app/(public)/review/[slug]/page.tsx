import React from "react";

import axios from "axios";

import { Genre } from "@/src/types/media";
import { Database } from "@/src/types/supabase";

import { createClient } from "@/src/utils/supabase/server";
import SingleMediaWrapper from "@/src/components/wrapper-single-media";
import { getMovieDetails, getSeriesDetails } from "@/src/utils/tmdb/get-data";

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

async function getMediaData(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("medias")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(error);
    return null;
  } else if (data) {
    return data;
  }
}

async function getReviewData(mediaId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("media_id", mediaId)
    .single();

  if (error) {
    console.error(error);
    return null;
  } else if (data) {
    return data;
  }
}

export default async function MediaPage(searchParams: SearchParams) {
  const mediaSlug = searchParams.params.slug;
  let TMDBData: TMDBItem | null = null;
  let mediaData: MediaItem | null = null;
  let reviewData: ReviewItem | null = null;

  // Functions
  mediaData = await getMediaData(mediaSlug);
  reviewData = mediaData ? await getReviewData(mediaData.id.toString()) : null;

  if (mediaData) {
    let mediaType = mediaData.type;
    if (mediaType === "movie") {
      TMDBData = await getMovieDetails(mediaData.tmdb_id);
    } else if (mediaType === "series") {
      TMDBData = await getSeriesDetails(mediaData.tmdb_id);
    }
  }

  return (
    <SingleMediaWrapper
      mediaData={mediaData}
      reviewData={reviewData}
      TMDBData={TMDBData}
    />
  );
}
