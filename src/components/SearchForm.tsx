﻿"use client";

import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { MediaItem } from "@/lib/types";

export default function SearchForm({
  onSearch,
  onLoading,
}: {
  onSearch: (results: MediaItem[]) => void;
  onLoading?: (loading: boolean) => void;
}) {
  // States
  const [search, setSearch] = useState("");

  // Functions
  const cleanSearchTerm = (term: string): string => {
    // Remove any non-alphanumeric characters except spaces
    let cleaned = term.replace(/[^\w\s]/g, "");
    // Replace multiple spaces with a single space
    cleaned = cleaned.replace(/\s+/g, " ");
    // Trim leading and trailing whitespace
    cleaned = cleaned.trim();
    // URL encode the cleaned term
    return encodeURIComponent(cleaned);
  };

  const handleSearch = async () => {
    onSearch?.([]);
    if (search.length < 3) return;
    onLoading?.(true);

    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/search/multi`,
      params: {
        query: cleanSearchTerm(search),
        include_adult: false,
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
      const searchResults: MediaItem[] = response.data.results
        .filter(
          (item: any) =>
            item.media_type === "movie" || item.media_type === "tv",
        )
        .map((item: any) => ({
          id: item.id,
          type: item.media_type,
          title: item.title || item.name,
          summary: item.overview,
          poster: item.poster_path,
          backdrop: item.backdrop_path,
          genres: item.genre_ids,
          rating: item.vote_average,
          adult: item.adult,
          releaseDate: item.release_date || item.first_air_date,
        }));

      setTimeout(() => {
        onSearch(searchResults);
        onLoading?.(false);
      }, 1000);
    } catch (error) {
      console.error(`Error fetching search results: ${error}`);
    }
  };

  return (
    <>
      <section className={`flex gap-3 transition-all duration-300 ease-in-out`}>
        <Input
          type="search"
          placeholder="Search"
          className={`outline-none ring-none border-none bg-neutral-800 hover:bg-neutral-600 focus:bg-neutral-600 transition-all duration-300 ease-in-out`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && handleSearch()}
        />

        <Button type="button" variant={"secondary"} onClick={handleSearch}>
          Search
        </Button>
      </section>
    </>
  );
}
