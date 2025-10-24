﻿"use client";

import React, { useState, useCallback } from "react";

import { Popcorn } from "lucide-react";

import SearchForm from "@/src/components/search-form";
import MediaBlock from "@/src/components/media-block";
import LoadMoreButton from "@/src/components/load-more-button";

import { Tables } from "@/database.types";
import { MediaCollection, MediaSearchResult } from "@/src/lib/types";

type Profile = Tables<`profiles`>;

export default function SearchWrapper({
  admin = false,
  isUser,
  profile,
  ownedCollections = [],
  sharedCollections = [],
}: {
  admin?: boolean;
  isUser?: boolean;
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

  const handleSearch = (results: MediaSearchResult[], isNewSearch: boolean) => {
    if (isNewSearch && results.length === 0) {
      setSearchResults([]);
      return;
    }

    const sortedResults = sortSearchResults(results);

    setSearchResults((prev) =>
      isNewSearch ? sortedResults : [...prev, ...sortedResults],
    );
  };

  const handleMoreResultsAvailable = useCallback(
    (hasMore: boolean, loadMoreFn: () => Promise<void>) => {
      setHasMoreResults(hasMore);

      if (hasMore && loadMoreFn) {
        setLoadMoreFunction(() => async () => {
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

  const handleLoadMore = async () => {
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
                isUser={isUser}
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
