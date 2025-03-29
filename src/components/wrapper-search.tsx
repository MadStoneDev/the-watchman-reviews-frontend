"use client";

import React, { useState } from "react";

import { Popcorn } from "lucide-react";

import { Genre, MediaItem } from "@/src/types/media";

import SearchForm from "@/src/components/search-form";
import MediaBlock from "@/src/components/media-block";

export default function SearchWrapper({ admin = false }: { admin?: boolean }) {
  // States
  const [data, setData] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Start Searching!");
  const [animateMessage, setAnimateMessage] = useState(false);

  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [seriesGenres, setSeriesGenres] = useState<Genre[]>([]);

  // Functions
  const handleSearch = (results: MediaItem[]) => {
    const sortedResults = results.sort((a, b) =>
      a.releaseDate > b.releaseDate ? -1 : 1,
    );

    setData(sortedResults);
  };

  return (
    <>
      <SearchForm
        onSearch={handleSearch}
        onLoading={setLoading}
        setMessage={setMessage}
        setAnimateMessage={setAnimateMessage}
      />

      {message && (
        <section
          className={`flex flex-col gap-3 justify-center items-center min-h-[200px] ${
            animateMessage ? "animate-pulse" : ""
          } text-neutral-200`}
        >
          <Popcorn size={40} strokeWidth={1.5} />
          <p className={`text-sm italic`}>{message}</p>
        </section>
      )}

      {!loading && data.length > 0 && (
        <section
          className={`grid ${
            admin
              ? "grid-cols-1"
              : "grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
          } gap-x-5 gap-y-5 transition-all duration-300 ease-in-out`}
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
