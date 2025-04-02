"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/src/utils/supabase/client";
import { Popcorn } from "lucide-react";

import { Genre, MediaItem } from "@/src/types/media";

import SearchForm from "@/src/components/search-form";
import MediaBlock from "@/src/components/media-block";
import { User } from "@supabase/supabase-js";

type Profile = {
  id: string;
  username: string;
  created_at: string;
  settings: any | null;
};

export default function SearchWrapper({
  admin = false,
  user,
  profile,
  collections = [],
}: {
  admin?: boolean;
  user?: User | null;
  profile?: Profile | null;
  collections?: string[];
}) {
  // States
  const [data, setData] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Start Searching!");
  const [animateMessage, setAnimateMessage] = useState(false);

  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [seriesGenres, setSeriesGenres] = useState<Genre[]>([]);

  // Sort search results by release year
  const sortSearchResults = (results: MediaItem[]) => {
    if (!results.length) return results;

    // Sort the results by release year
    return [...results].sort((a, b) =>
      a.releaseYear > b.releaseYear ? -1 : 1,
    );
  };

  // Functions
  const handleSearch = (results: MediaItem[]) => {
    const sortedResults = sortSearchResults(results);
    setData(sortedResults);
  };

  // Fetch genres when component mounts
  useEffect(() => {
    // You might want to add logic here to populate the genres
    // from your local database instead of TMDB API if you're caching them
  }, []);

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
          {data.map((item) => (
            <MediaBlock
              key={item.id}
              data={item}
              movieGenres={movieGenres}
              seriesGenres={seriesGenres}
              admin={admin}
              user={user}
              collections={collections}
            />
          ))}
        </section>
      )}
    </>
  );
}
