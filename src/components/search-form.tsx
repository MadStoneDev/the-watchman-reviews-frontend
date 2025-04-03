"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import axios from "axios";

import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

import { IconSearch } from "@tabler/icons-react";
import { MediaSearchResult } from "@/src/lib/types";

export default ({
  onSearch,
  onLoading,
  setMessage,
  setAnimateMessage,
}: {
  onSearch: (results: MediaSearchResult[]) => void;
  onLoading?: (loading: boolean) => void;
  setMessage: (message: string) => void;
  setAnimateMessage: (animateMessage: boolean) => void;
}) => {
  // Hooks
  const router = useRouter();
  const searchParams = useSearchParams();

  // States
  const [search, setSearch] = useState("");

  // Functions
  const cleanSearchTerm = (term: string): string => {
    // Remove non-alphanumeric characters except spaces
    let cleaned = term.replace(/[^\w\s]/g, "");

    // Replace multiple spaces with a single space
    cleaned = cleaned.replace(/\s+/g, " ");

    // Trim leading and trailing whitespace
    cleaned = cleaned.trim();

    // URL encode the cleaned term
    return encodeURIComponent(cleaned);
  };

  const getYear = (dateString: string) => {
    if (!dateString) return null;

    try {
      const date = new Date(dateString);
      return date.getFullYear().toString() || "";
    } catch {
      return "";
    }
  };

  const handleSearch = async (searchString: string) => {
    onSearch?.([]);

    if (searchString.length < 3) return;

    onLoading?.(true);
    setMessage("Searching...");
    setAnimateMessage(true);

    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/search/multi`,
      params: {
        query: cleanSearchTerm(searchString),
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
      const searchResults: MediaSearchResult[] = response.data.results
        .filter(
          (item: any) =>
            item.media_type === "movie" || item.media_type === "tv",
        )
        .map(
          (item: any): MediaSearchResult => ({
            title: item.title || item.name,
            overview: item.overview,
            posterPath: item.poster_path,
            backdropPath: item.backdrop_path,
            tmdbId: item.id,
            mediaType: item.media_type,
            releaseYear:
              getYear(
                item.release_date || item.first_air_date || item.air_date || "",
              ) || "",
            tmdbRating: item.vote_average,
            popularity: item.popularity,
          }),
        );

      router.push(`/search?q=${encodeURIComponent(searchString)}`);

      setTimeout(() => {
        onSearch(searchResults);
        onLoading?.(false);

        if (searchResults.length === 0) {
          setMessage("No results found...try something else?");
          setAnimateMessage(false);
        } else {
          setMessage("");
        }
      }, 1500);
    } catch (error) {
      console.error(`Error fetching search results: ${error}`);
    }
  };

  // Hooks
  useEffect(() => {
    if (searchParams.has("q")) {
      setSearch(searchParams.get("q") as string);
      handleSearch(searchParams.get("q") as string);
    }
  }, []);

  return (
    <>
      <section
        className={`flex flex-row gap-3 transition-all duration-300 ease-in-out`}
      >
        <Input
          type="search"
          placeholder="Search"
          className={`outline-none ring-none border-none bg-neutral-800 hover:bg-neutral-600 focus:bg-neutral-600 transition-all duration-300 ease-in-out`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && handleSearch(search)}
        />

        <Button
          type="button"
          variant={"secondary"}
          onClick={async () => await handleSearch(search)}
          className={`flex items-center gap-1 bg-lime-400 hover:bg-lime-400 hover:scale-110 text-neutral-900 transition-all duration-300 ease-in-out`}
        >
          <IconSearch size={20} strokeWidth={1.5} />
          <p className={`hidden sm:block`}>Search</p>
        </Button>
      </section>
    </>
  );
};
