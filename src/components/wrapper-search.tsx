"use client";

import React, { useEffect, useState } from "react";

import axios from "axios";
import { Popcorn } from "lucide-react";

import { Genre, MediaItem } from "@/lib/types";
import SearchForm from "@/components/search-form";
import MediaBlock from "@/components/media-block";

export default function SearchWrapper({ admin = false }: { admin?: boolean }) {
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
    const sortedResults = results.sort((a, b) =>
      a.releaseDate > b.releaseDate ? -1 : 1,
    );

    setData(sortedResults);
  };

  return (
    <>
      <SearchForm onSearch={handleSearch} onLoading={setLoading} />

      {loading && (
        <section className={`grid place-items-center min-h-[200px]`}>
          <Popcorn size={40} strokeWidth={1.5} className={`animate-pulse`} />
        </section>
      )}

      {!loading && data.length > 0 && (
        <section
          className={`grid ${
            admin
              ? "grid-cols-1"
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" +
                " 2xl:grid-cols-6"
          } gap-5`}
        >
          {data.map((item: any) => (
            <MediaBlock
              key={item.id}
              data={item}
              movieGenres={movieGenres}
              seriesGenres={seriesGenres}
              admin={admin}
            />
          ))}
        </section>
      )}
    </>
  );
}
