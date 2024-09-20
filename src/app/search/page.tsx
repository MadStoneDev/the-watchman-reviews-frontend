"use client";

import React, { useEffect, useState } from "react";
import SearchForm from "@/components/SearchForm";
import axios from "axios";
import { MediaItem } from "@/lib/types";
import { IconStarFilled } from "@tabler/icons-react";
import { Popcorn } from "lucide-react";

interface Genre {
  id: number;
  name: string;
}

export default function SearchPage() {
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
      <section className={`mt-20 mb-10 flex flex-col gap-5`}>
        <h1 className={`max-w-60 text-4xl font-bold`}>Search</h1>
        <SearchForm onSearch={handleSearch} onLoading={setLoading} />
      </section>

      {loading && (
        <section className={`grid place-items-center min-h-[200px]`}>
          <Popcorn size={40} strokeWidth={1.5} className={`animate-pulse`} />
        </section>
      )}

      {!loading && data.length > 0 && (
        <section className={`grid grid-cols-5 2xl:grid-cols-7 gap-5`}>
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

interface MediaItemProps {
  data: any;
  movieGenres: Genre[];
  seriesGenres: Genre[];
}

const MediaBlock = ({
  data = {},
  movieGenres = [],
  seriesGenres = [],
}: MediaItemProps) => {
  if (!data.title || !data.releaseDate) return null;

  const cleanRating = Math.floor(data.rating / 2);

  return (
    <article
      className={`p-3 pb-5 flex flex-col justify-between gap-4 bg-black rounded-3xl`}
    >
      <div
        className={`grid place-items-center w-full aspect-square bg-neutral-800 rounded-xl overflow-hidden`}
      >
        {data.poster ? (
          <img
            className={`w-full h-full bg-black object-top object-cover`}
            style={{ aspectRatio: "1/1" }}
            src={`https://image.tmdb.org/t/p/w500${data.poster}`}
            alt={`${data.title} Poster`}
            onClick={() => console.log(data)}
          ></img>
        ) : (
          <Popcorn className={``} />
        )}
      </div>

      <div className={`flex-grow w-full`}>
        <h3 className={`text-neutral-50 whitespace-nowrap truncate`}>
          {data.title}
        </h3>
        <h4 className={`text-sm text-neutral-500`}>
          {data.genres &&
            data.genres
              .map((genre: number) => {
                if (data.type === "movie")
                  return movieGenres.find((g) => g.id === genre)?.name;
                else return seriesGenres.find((g) => g.id === genre)?.name;
              })
              .join(", ")}
        </h4>
      </div>

      <div
        className={`flex gap-1 items-center`}
        title={`User Rating: ${data.rating / 2} / 5`}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <IconStarFilled
            key={`${data.id}-${index}`}
            className={`${
              index <= cleanRating ? "text-lime-400" : "text-neutral-50"
            }`}
          />
        ))}
      </div>
    </article>
  );
};
