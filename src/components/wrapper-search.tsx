"use client";

import React, { useState } from "react";

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
  const [loadMoreFn, setLoadMoreFn] = useState<(() => Promise<void>) | null>(
    null,
  );

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
    const sortedResults = sortSearchResults(results);

    // If it's a new search, replace results, otherwise append them
    setSearchResults(
      isNewSearch ? sortedResults : [...searchResults, ...sortedResults],
    );
  };

  // Handle more results availability
  const handleMoreResultsAvailable = (
    hasMore: boolean,
    loadMoreFunction: () => Promise<void>,
  ) => {
    setHasMoreResults(hasMore);
    setLoadMoreFn(() => loadMoreFunction);
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

      {!loading && searchResults.length > 0 && (
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

          {hasMoreResults && loadMoreFn && (
            <LoadMoreButton loading={loading} onLoadMore={loadMoreFn} />
          )}
        </>
      )}
    </>
  );
}
