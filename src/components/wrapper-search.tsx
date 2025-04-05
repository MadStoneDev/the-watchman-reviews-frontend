"use client";

import React, { useState, useCallback } from "react";

import { Popcorn } from "lucide-react";

import { User } from "@supabase/supabase-js";
import SearchForm from "@/src/components/search-form";
import MediaBlock from "@/src/components/media-block";
import LoadMoreButton from "@/src/components/load-more-button";

import { Tables } from "@/database.types";
import { MediaCollection, MediaSearchResult } from "@/src/lib/types";

type Profile = Tables<`profiles`>;

export default function SearchWrapper({
  admin = false,
  user,
  profile,
  ownedCollections = [],
  sharedCollections = [],
}: {
  admin?: boolean;
  user?: User | null;
  profile?: Profile | null;
  ownedCollections?: MediaCollection[];
  sharedCollections?: MediaCollection[];
}) {
  // States
  const [searchResults, setSearchResults] = useState<MediaSearchResult[]>([]);
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const [loadMoreFunction, setLoadMoreFunction] = useState<
    null | (() => Promise<void>)
  >(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Start Searching!");
  const [animateMessage, setAnimateMessage] = useState(false);

  // Functions
  const sortSearchResults = (results: MediaSearchResult[]) => {
    if (!results.length) return results;
    return [...results].sort((a, b) => (a.popularity > b.popularity ? -1 : 1));
  };

  // Handle search results
  const handleSearch = (results: MediaSearchResult[], isNewSearch: boolean) => {
    console.log(
      `Handling search results. isNewSearch: ${isNewSearch}, results count: ${results.length}`,
    );

    if (isNewSearch && results.length === 0) {
      // For new search with no results yet, just clear the results
      setSearchResults([]);
      return;
    }

    const sortedResults = sortSearchResults(results);

    // If it's a new search, replace results, otherwise append them
    setSearchResults((prev) =>
      isNewSearch ? sortedResults : [...prev, ...sortedResults],
    );
  };

  // Handle more results availability - use useCallback to ensure function stability
  const handleMoreResultsAvailable = useCallback(
    (hasMore: boolean, loadMoreFn: () => Promise<void>) => {
      console.log(`More results available: ${hasMore}`);
      setHasMoreResults(hasMore);

      if (hasMore && loadMoreFn) {
        console.log("Setting load more function");
        setLoadMoreFunction(() => async () => {
          console.log("Load more function triggered");
          setLoading(true);
          try {
            await loadMoreFn();
          } finally {
            setLoading(false);
          }
        });
      } else {
        setLoadMoreFunction(null);
      }
    },
    [],
  );

  // Function to handle load more button click
  const handleLoadMore = async () => {
    console.log("Load more requested");
    if (loadMoreFunction) {
      await loadMoreFunction();
    } else {
      console.error("Load more function is not available");
    }
  };

  return (
    <>
      <SearchForm
        onSearch={handleSearch}
        onLoading={setLoading}
        setMessage={setMessage}
        setAnimateMessage={setAnimateMessage}
        onMoreResultsAvailable={handleMoreResultsAvailable}
      />

      {message && searchResults.length === 0 && (
        <section
          className={`flex flex-col gap-3 justify-center items-center min-h-[200px] ${
            animateMessage ? "animate-pulse" : ""
          } text-neutral-200`}
        >
          <Popcorn size={40} strokeWidth={1.5} />
          <p className={`text-sm italic`}>{message}</p>
        </section>
      )}

      {searchResults.length > 0 && (
        <>
          <section
            className={`grid ${
              admin
                ? "grid-cols-1"
                : "grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
            } gap-x-5 gap-y-5 transition-all duration-300 ease-in-out`}
          >
            {searchResults.map((item, index) => (
              <MediaBlock
                key={`${item.tmdbId}-${item.mediaType}-${index}`}
                data={item}
                user={user}
                username={profile?.username || ""}
                admin={admin}
                ownedCollections={ownedCollections}
                sharedCollections={sharedCollections}
              />
            ))}
          </section>

          {hasMoreResults && loadMoreFunction && (
            <LoadMoreButton loading={loading} onLoadMore={handleLoadMore} />
          )}
        </>
      )}
    </>
  );
}
