import React from "react";

import axios from "axios";

import { Genre } from "@/src/types/media";
import SingleMediaWrapper from "@/src/components/wrapper-single-media";

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
  genres: Genre[];
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

  // Functions
  const options =
    mediaType === "movie"
      ? {
          method: "GET",
          url: `https://api.themoviedb.org/3/movie/${mediaId}`,
          params: {
            language: `en-US`,
          },
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
          },
        }
      : {
          method: "GET",
          url: `https://api.themoviedb.org/3/tv/${mediaId}`,
          params: {
            language: `en-US`,
          },
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
          },
        };

  await axios
    .request(options)
    .then(function (response) {
      console.log(response.data);

      mediaData = {
        id: response.data.id,
        title: response.data.title || response.data.name,
        tagline: response.data.tagline,
        backdrop: response.data.backdrop_path,
        poster: response.data.poster_path,
        genres: response.data.genres,
        imdb_id: response.data.imdb_id,
        overview: response.data.overview,
        date: response.data.release_date || response.data.first_air_date,
        rating: response.data.vote_average,
        adult: response.data.adult,
      };
    })
    .catch(function (error) {
      console.error(error);
    });

  console.log(mediaData);
  return mediaData && <SingleMediaWrapper mediaData={mediaData} />;
}
