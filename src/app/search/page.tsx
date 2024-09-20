"use client";

import React, { useEffect, useState } from "react";

import axios from "axios";
import SearchForm from "@/components/search-form";

import { Popcorn } from "lucide-react";
import { IconStarFilled } from "@tabler/icons-react";

import { MediaItem } from "@/lib/types";

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
      <section
        className={`mt-14 lg:mt-20 mb-10 flex flex-col gap-5 transition-all duration-300 ease-in-out`}
      >
        <h1 className={`max-w-60 text-4xl font-bold`}>Search</h1>
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

  // const breakpoints = {
  //   sm: 640,
  //   md: 768,
  //   lg: 1024,
  //   xl: 1280,
  //   "2xl": 1536,
  // };
  //
  // const imageSizes = {
  //   poster: ["w92", "w154", "w185", "w342", "w500", "w780", "original"],
  //   backdrop: ["w300", "w780", "w1280", "original"],
  // };

  // States
  // const [posterSize, setPosterSize] = useState(imageSizes.poster[4]);

  // Effects
  // useEffect(() => {
  //   const handleResize = () => {
  //     const width = window.innerWidth;
  //     if (width < breakpoints.sm) {
  //       setPosterSize(imageSizes.poster[3]);
  //     } else if (width < breakpoints.md) {
  //       setPosterSize(imageSizes.poster[3]);
  //     } else if (width < breakpoints.lg) {
  //       setPosterSize(imageSizes.poster[3]);
  //     } else {
  //       setPosterSize(imageSizes.poster[3]);
  //     }
  //   };
  //
  //   handleResize();
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

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
            src={`https://image.tmdb.org/t/p/w342${data.poster}`}
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
