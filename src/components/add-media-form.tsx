"use client";

import React, { useState } from "react";
import Image from "next/image";
import { createClient } from "@/src/utils/supabase/client";
import {
  IconSearch,
  IconPlus,
  IconX,
  IconChairDirector,
  IconDeviceTv,
} from "@tabler/icons-react";

interface AddMediaFormProps {
  collectionId: string;
  onMediaAdded: () => void;
}

interface SearchResult {
  id: number;
  title: string;
  name?: string;
  poster_path?: string;
  release_date?: string;
  first_air_date?: string;
  media_type: "movie" | "tv";
}

export default function AddMediaForm({
  collectionId,
  onMediaAdded,
}: AddMediaFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);

  const supabase = createClient();

  const MEDIA_REFRESH_INTERVAL_DAYS = 30;

  const needsRefresh = (lastFetched: string | null): boolean => {
    if (!lastFetched) return true;

    const lastFetchedDate = new Date(lastFetched);
    const daysSinceLastFetch =
      (Date.now() - lastFetchedDate.getTime()) / (1000 * 60 * 60 * 24);

    return daysSinceLastFetch >= MEDIA_REFRESH_INTERVAL_DAYS;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    try {
      // ✅ Use our secure API route
      const response = await fetch(
        `/api/tmdb/search?query=${encodeURIComponent(
          searchQuery,
        )}&page=1&language=en-US`,
      );

      const data = await response.json();
      const filtered =
        data.results?.filter(
          (result: any) =>
            result.media_type === "movie" || result.media_type === "tv",
        ) || [];

      setSearchResults(filtered);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCollection = async (result: SearchResult) => {
    setAddingId(result.id);
    try {
      const mediaType = result.media_type;
      const tableName = mediaType === "movie" ? "movies" : "series";
      const tmdbId = result.id;

      // Check if media exists and get last_fetched
      const { data: existingMedia } = await supabase
        .from(tableName)
        .select("id, last_fetched")
        .eq("tmdb_id", tmdbId)
        .maybeSingle();

      let mediaId: string;

      if (existingMedia) {
        mediaId = existingMedia.id;

        // Check if needs refresh (older than 30 days)
        const shouldRefresh = needsRefresh(existingMedia.last_fetched);

        if (shouldRefresh) {
          console.log(
            `${mediaType} data is stale (>30 days), refreshing...`,
          );

          // Fetch updated data from TMDB
          // ✅ Use our secure API route
          const tmdbEndpoint =
            mediaType === "movie"
              ? `/api/tmdb/movie/${tmdbId}`
              : `/api/tmdb/tv/${tmdbId}`;

          const tmdbResponse = await fetch(`${tmdbEndpoint}?language=en-US`);

          if (tmdbResponse.ok) {
            const tmdbData = await tmdbResponse.json();

            if (mediaType === "movie") {
              // Update movie with fresh data
              await supabase
                .from("movies")
                .update({
                  title: tmdbData.title,
                  overview: tmdbData.overview || "",
                  poster_path: tmdbData.poster_path,
                  backdrop_path: tmdbData.backdrop_path,
                  release_year: tmdbData.release_date
                    ? new Date(tmdbData.release_date).getFullYear().toString()
                    : "",
                  runtime: tmdbData.runtime || null,
                  popularity: tmdbData.popularity
                    ? parseInt(tmdbData.popularity)
                    : null,
                  tmdb_popularity: tmdbData.popularity
                    ? String(tmdbData.popularity)
                    : null, // STRING field
                  last_fetched: new Date().toISOString(),
                })
                .eq("id", mediaId);
            } else {
              // Update series with fresh data
              await supabase
                .from("series")
                .update({
                  title: tmdbData.name,
                  overview: tmdbData.overview || "",
                  poster_path: tmdbData.poster_path,
                  backdrop_path: tmdbData.backdrop_path,
                  release_year: tmdbData.first_air_date
                    ? new Date(tmdbData.first_air_date).getFullYear().toString()
                    : "",
                  first_air_date: tmdbData.first_air_date || null,
                  last_air_date: tmdbData.last_air_date || null,
                  status: tmdbData.status || null,
                  last_fetched: new Date().toISOString(),
                })
                .eq("id", mediaId);
            }

            console.log(`${mediaType} data refreshed successfully`);
          } else {
            console.warn(
              `Failed to refresh ${mediaType} data, using cached data`,
            );
          }
        } else {
          console.log(
            `${mediaType} data is fresh (<30 days), using cached data`,
          );
        }
      } else {
        // Media doesn't exist, create it with full data from TMDB
        console.log(`${mediaType} not in database, creating new record...`);

        // ✅ Use our secure API route
        const tmdbEndpoint =
          mediaType === "movie"
            ? `/api/tmdb/movie/${tmdbId}`
            : `/api/tmdb/tv/${tmdbId}`;

        const tmdbResponse = await fetch(`${tmdbEndpoint}?language=en-US`);

        if (!tmdbResponse.ok) {
          throw new Error(`Failed to fetch ${mediaType} details`);
        }

        const tmdbData = await tmdbResponse.json();

        if (mediaType === "movie") {
          // Upsert movie record with complete data
          const { data: newMovie, error: movieError } = await supabase
            .from("movies")
            .upsert(
              {
                tmdb_id: tmdbData.id,
                title: tmdbData.title,
                overview: tmdbData.overview || "",
                poster_path: tmdbData.poster_path,
                backdrop_path: tmdbData.backdrop_path,
                release_year: tmdbData.release_date
                  ? new Date(tmdbData.release_date).getFullYear().toString()
                  : "",
                runtime: tmdbData.runtime || null,
                popularity: tmdbData.popularity
                  ? parseInt(tmdbData.popularity)
                  : null,
                tmdb_popularity: tmdbData.popularity
                  ? String(tmdbData.popularity)
                  : null,
                last_fetched: new Date().toISOString(),
              },
              {
                onConflict: "tmdb_id",
                ignoreDuplicates: false,
              },
            )
            .select("id")
            .single();

          if (movieError) throw movieError;
          mediaId = newMovie.id;
        } else {
          // Upsert series record with complete data
          const { data: newSeries, error: seriesError } = await supabase
            .from("series")
            .upsert(
              {
                tmdb_id: tmdbData.id,
                title: tmdbData.name,
                overview: tmdbData.overview || "",
                poster_path: tmdbData.poster_path,
                backdrop_path: tmdbData.backdrop_path,
                release_year: tmdbData.first_air_date
                  ? new Date(tmdbData.first_air_date).getFullYear().toString()
                  : "",
                first_air_date: tmdbData.first_air_date || null,
                last_air_date: tmdbData.last_air_date || null,
                status: tmdbData.status || null,
                last_fetched: new Date().toISOString(),
              },
              {
                onConflict: "tmdb_id",
                ignoreDuplicates: false,
              },
            )
            .select("id")
            .single();

          if (seriesError) throw seriesError;
          mediaId = newSeries.id;
        }
      }

      // Get the next position for the collection
      const { data: positionData } = await supabase
        .from("medias_collections")
        .select("position")
        .eq("collection_id", collectionId)
        .order("position", { ascending: false })
        .limit(1);

      const nextPosition =
        positionData && positionData[0] ? positionData[0].position + 1 : 0;

      // Add to collection
      const { error: collectionError } = await supabase
        .from("medias_collections")
        .insert([
          {
            collection_id: collectionId,
            media_id: mediaId,
            media_type: mediaType,
            position: nextPosition,
          },
        ]);

      if (collectionError) throw collectionError;

      setSearchQuery("");
      setSearchResults([]);
      setHasSearched(false);
      onMediaAdded();
    } catch (error) {
      console.error("Error adding to collection:", error);
      alert("Failed to add media to collection");
    } finally {
      setAddingId(null);
    }
  };

  const closeForm = () => {
    setIsOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
  };

  return (
    <div
      className={`flex flex-col items-stretch gap-4 transition-all duration-300 ease-in-out`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? "max-h-0 border-0" : "p-4 w-full max-h-[999px] border-2"
        } float-right border-dashed border-neutral-700 hover:border-lime-400 rounded-lg" +
              " text-neutral-400 hover:text-lime-400 transition-all flex items-center justify-center gap-2 group overflow-hidden`}
      >
        <IconPlus
          size={24}
          className="group-hover:scale-110 transition-transform"
        />
        <span className="text-lg font-medium">Add Media to Collection</span>
      </button>

      {/* Expandable Form */}
      <div
        className={`w-full transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-[999px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="relative bg-neutral-900 rounded-lg border border-neutral-800">
          <form
            onSubmit={handleSearch}
            className={`p-4 flex gap-2 ${
              searchResults.length > 0 && "mb-4"
            } transition-all duration-300 ease-in-out`}
          >
            <div className="grow relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHasSearched(false);
                }}
                placeholder="Search for movies or TV shows..."
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-hidden focus:border-lime-400 transition-colors"
                autoFocus={isOpen}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                    setHasSearched(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                >
                  <IconX size={18} />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading || !searchQuery.trim()}
              className="px-4 py-2 bg-lime-400 text-neutral-900 rounded-lg hover:bg-lime-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <IconSearch size={20} />
              {isLoading ? "Searching..." : "Search"}
            </button>
          </form>

          {/* Toggle Button */}
          <button
            onClick={() => setIsOpen(false)}
            className={`p-1 absolute -top-4 -right-4 flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-700 hover:border-lime-400 rounded-full text-neutral-400 hover:text-lime-400 transition-all duration-300 ease-in-out`}
          >
            <IconX
              size={24}
              className="group-hover:scale-110 transition-transform"
            />
          </button>

          {searchResults.length > 0 && (
            <div className="p-4 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-[500px] overflow-y-auto">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="group relative bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 hover:border-neutral-700 transition-all"
                >
                  {/* Poster */}
                  <div className="relative aspect-2/3 bg-neutral-800">
                    {result.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w342${result.poster_path}`}
                        alt={result.title || result.name || ""}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        {result.media_type === "movie" ? (
                          <IconChairDirector
                            size={48}
                            className="text-neutral-700"
                          />
                        ) : (
                          <IconDeviceTv
                            size={48}
                            className="text-neutral-700"
                          />
                        )}
                      </div>
                    )}

                    {/* Media Type Badge */}
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-neutral-900/80 backdrop-blur-xs rounded-sm text-xs font-medium">
                      {result.media_type === "movie" ? "Movie" : "TV"}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <h3 className="text-sm font-medium line-clamp-2 mb-1">
                      {result.title || result.name}
                    </h3>
                    {(result.release_date || result.first_air_date) && (
                      <p className="text-xs text-neutral-500 mb-2">
                        {result.release_date?.split("-")[0] ||
                          result.first_air_date?.split("-")[0]}
                      </p>
                    )}
                    <button
                      onClick={() => addToCollection(result)}
                      disabled={addingId === result.id}
                      className="w-full px-3 py-2 bg-lime-400 text-neutral-900 text-sm font-medium rounded-sm hover:bg-lime-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1"
                    >
                      <IconPlus size={16} />
                      {addingId === result.id ? "Adding..." : "Add"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasSearched && searchResults.length === 0 && !isLoading && (
            <div className="text-center py-8 text-neutral-500">
              No results found for "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
