import axios from "axios";
import Image from "next/image";
import { IconChairDirector, IconDeviceTv } from "@tabler/icons-react";
import React from "react";
import MediaPreferenceItem from "@/src/components/media-preference-item";

const fetchMoviesByPopularity = async () => {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1`,
    params: {
      language: `en-US`,
      page: 1,
    },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const fetchTvShowsByPopularity = async () => {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1`,
    params: {
      language: `en-US`,
      page: 1,
    },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const fetchActosByPopularity = async () => {
  const options = {
    method: "GET",
    url: "https://api.themoviedb.org/3/person/popular?language=en-US&page=1",
    params: {
      language: `en-US`,
      page: 1,
    },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default async function MediaPreferenceBlock() {
  const movies = await fetchMoviesByPopularity();
  const tvShows = await fetchTvShowsByPopularity();
  const actors = await fetchActosByPopularity();

  return (
    <section>
      <h1 className={`text-2xl font-bold mb-4`}>Refine Your Preferences</h1>
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-5 gap-y-5 transition-all duration-300 ease-in-out`}
      >
        {movies.results.map((movie) => {
          return (
            <MediaPreferenceItem
              key={movie.id}
              data={movie}
              photo={movie.poster_path}
              title={movie.title}
              dependencies={[movie.poster_path]}
            />
          );
        })}
        profile_path
      </div>

      <div
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-5 gap-y-5 transition-all duration-300 ease-in-out`}
      >
        {actors.results.map((actor) => {
          return (
            <MediaPreferenceItem
              key={actor.id}
              data={actor}
              photo={actor.profile_path}
              title={actor.name}
              dependencies={[actor.profile_path]}
            />
          );
        })}
      </div>
    </section>
  );
}
