"use client";

import React, { useEffect, useState } from "react";

import axios from "axios";
import { Popcorn } from "lucide-react";

import { Genre, MediaItem } from "@/lib/types";
import SearchForm from "@/components/search-form";
import MediaBlock from "@/components/media-block";

export default function SearchWrapper() {
  // States
  const [data, setData] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [seriesGenres, setSeriesGenres] = useState<Genre[]>([]);

  // Functions
  useEffect(() => {
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/genre/movie/list?language-en`,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        const genres = [];
        genres.push(...response.data.genres);
        setMovieGenres(genres);
      })
      .catch(function (error) {
        console.error(error);
      });

    options.url = `https://api.themoviedb.org/3/genre/tv/list?language-en`;

    axios
      .request(options)
      .then(function (response) {
        const genres = [];
        genres.push(...response.data.genres);
        setSeriesGenres(genres);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);

  const handleSearch = (results: MediaItem[]) => {
    setData(results);
  };

  return (
    <>
      <section
        className={`mt-0 md:mt-14 lg:mt-20 mb-10 flex flex-col gap-5 transition-all duration-300 ease-in-out`}
      >
        <h1 className={`max-w-60 text-2xl sm:3xl md:text-4xl font-bold`}>
          Search
        </h1>
        <SearchForm onSearch={handleSearch} onLoading={setLoading} />
      </section>

      {loading && (
        <section className={`grid place-items-center min-h-[200px]`}>
          <Popcorn size={40} strokeWidth={1.5} className={`animate-pulse`} />
        </section>
      )}

      {!loading && data.length > 0 && (
        <section
          className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5`}
        >
          {data.map((item: any) => (
            <MediaBlock
              key={item.id}
              data={item}
              movieGenres={movieGenres}
              seriesGenres={seriesGenres}
            />
          ))}
        </section>
      )}
    </>
  );
}
