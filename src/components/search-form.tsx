"use client";

import React, { useEffect, useState, useCallback } from "react";
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
  onMoreResultsAvailable,
}: {
  onSearch: (results: MediaSearchResult[], isNewSearch: boolean) => void;
  onLoading?: (loading: boolean) => void;
  setMessage: (message: string) => void;
  setAnimateMessage: (animateMessage: boolean) => void;
  onMoreResultsAvailable: (
    hasMore: boolean,
    loadMoreFn: () => Promise<void>,
  ) => void;
}) => {
  // Hooks
  const router = useRouter();
  const searchParams = useSearchParams();

  // States
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);

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

  const fetchSearchResults = async (
    searchString: string,
    page = 1,
    isNewSearch = true,
  ) => {
    if (searchString.length < 3) return;

    onLoading?.(true);

    if (isNewSearch) {
      setMessage("Searching...");
      setAnimateMessage(true);
    } else {
      setMessage("Loading more results...");
      setAnimateMessage(true);
    }

    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/search/multi`,
      params: {
        query: cleanSearchTerm(searchString),
        include_adult: false,
        language: `en-US`,
        page: page,
      },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
      },
    };

    try {
      const response = await axios.request(options);
      const totalPagesFromResponse = response.data.total_pages || 1;

      setTotalPages(totalPagesFromResponse);
      setCurrentPage(page);

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

      if (isNewSearch) {
        // Only update URL for initial searches
        router.push(`/search?q=${encodeURIComponent(searchString)}`);
      }

      // Remove the timeout to improve image loading speed
      onSearch(searchResults, isNewSearch);
      onLoading?.(false);

      if (searchResults.length === 0 && isNewSearch) {
        setMessage("No results found...try something else?");
        setAnimateMessage(false);
      } else {
        setMessage("");
      }

      const hasMorePages = page < totalPagesFromResponse;

      const loadMoreFn = hasMorePages
        ? async (): Promise<void> => {
            const nextPage = page + 1;
            await fetchSearchResults(searchString, nextPage, false);
          }
        : async (): Promise<void> => {};

      onMoreResultsAvailable(hasMorePages, loadMoreFn);

      return { results: searchResults, totalPages: totalPagesFromResponse };
    } catch (error) {
      console.error(`Error fetching search results: ${error}`);
      onLoading?.(false);
      setMessage("Error fetching results. Please try again.");
      setAnimateMessage(false);
      onMoreResultsAvailable(false, async (): Promise<void> => {});
      return { results: [], totalPages: 0 };
    }
  };

  const handleSearch = async (searchString: string) => {
    setCurrentSearchTerm(searchString);
    setCurrentPage(1);

    onSearch([], true);

    await fetchSearchResults(searchString, 1, true);
  };

  useEffect(() => {
    if (searchParams.has("q")) {
      const searchQuery = searchParams.get("q") as string;

      setSearch(searchQuery);
      setCurrentSearchTerm(searchQuery);
      handleSearch(searchQuery);
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
