"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { IconSearch } from "@tabler/icons-react";
import { MediaSearchResult } from "@/src/lib/types";
import { perfLog, startTimer, logTimer } from "@/src/utils/perf";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  const cleanSearchTerm = (term: string): string => {
    let cleaned = term.replace(/[^\w\s]/g, "");
    cleaned = cleaned.replace(/\s+/g, " ");
    cleaned = cleaned.trim();
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

    const fetchStart = startTimer();
    perfLog(
      `🔍 ${
        isNewSearch ? "New search" : "Load more"
      }: "${searchString}" (page ${page})`,
    );

    onLoading?.(true);

    if (isNewSearch) {
      setMessage("Searching...");
      setAnimateMessage(true);
    } else {
      setMessage("Loading more results...");
      setAnimateMessage(true);
    }

    try {
      const apiStart = startTimer();
      const response = await fetch(
        `/api/tmdb/search?query=${cleanSearchTerm(
          searchString,
        )}&page=${page}&language=en-US`,
      );
      logTimer("📡 TMDB API response", apiStart);

      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }

      const parseStart = startTimer();
      const data = await response.json();
      logTimer("🔄 JSON parse", parseStart);

      const totalPagesFromResponse = data.total_pages || 1;
      setTotalPages(totalPagesFromResponse);
      setCurrentPage(page);

      const mapStart = startTimer();
      const searchResults: MediaSearchResult[] = data.results
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
      logTimer("🗺️  Map results", mapStart);

      if (isNewSearch) {
        router.push(`/search?q=${encodeURIComponent(searchString)}`);
      }

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

      logTimer("✅ Total fetch operation", fetchStart);
      perfLog(
        `📊 Results: ${searchResults.length} items, page ${page}/${totalPagesFromResponse}`,
      );

      return { results: searchResults, totalPages: totalPagesFromResponse };
    } catch (error) {
      console.error(`Error fetching search results:`, error);
      onLoading?.(false);
      setMessage("Error fetching results. Please try again.");
      setAnimateMessage(false);
      onMoreResultsAvailable(false, async (): Promise<void> => {});
      logTimer("❌ Fetch failed", fetchStart);
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
    perfLog("🎯 SearchForm mounted");

    if (searchParams.has("q")) {
      const searchQuery = searchParams.get("q") as string;
      perfLog(`🔄 Auto-search triggered: "${searchQuery}"`);

      setSearch(searchQuery);
      setCurrentSearchTerm(searchQuery);
      handleSearch(searchQuery);
    }
  }, []);

  return (
    <section className="flex flex-row gap-3 transition-all duration-300 ease-in-out">
      <Input
        type="search"
        placeholder="Search"
        className="outline-none ring-none border-none bg-neutral-800 hover:bg-neutral-600 focus:bg-neutral-600 transition-all duration-300 ease-in-out"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyUp={(e) => e.key === "Enter" && handleSearch(search)}
      />

      <Button
        type="button"
        variant={"secondary"}
        onClick={async () => await handleSearch(search)}
        className="flex items-center gap-1 bg-lime-400 hover:bg-lime-400 hover:scale-110 text-neutral-900 transition-all duration-300 ease-in-out"
      >
        <IconSearch size={20} strokeWidth={1.5} />
        <p className="hidden sm:block">Search</p>
      </Button>
    </section>
  );
};
