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
  const [hasSearched, setHasSearched] = useState(false); // Track if search was submitted
  const [addingId, setAddingId] = useState<number | null>(null);

  const supabase = createClient();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(true); // Mark that a search has been submitted
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
          searchQuery,
        )}&include_adult=false&language=en-US&page=1`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
          },
        },
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

      // Check if media already exists in our database
      const { data: existingMedia } = await supabase
        .from(tableName)
        .select("id")
        .eq("tmdb_id", result.id)
        .single();

      let mediaId: number;

      if (existingMedia) {
        mediaId = existingMedia.id;
      } else {
        // Insert new media
        const mediaData = {
          tmdb_id: result.id,
          title: result.title || result.name,
          poster_path: result.poster_path,
          release_year:
            result.release_date?.split("-")[0] ||
            result.first_air_date?.split("-")[0],
        };

        const { data: newMedia, error: insertError } = await supabase
          .from(tableName)
          .insert([mediaData])
          .select("id")
          .single();

        if (insertError) throw insertError;
        mediaId = newMedia.id;
      }

      // Get the highest position in the collection
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

      // Reset and refresh
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

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-4 border-2 border-dashed border-neutral-700 hover:border-lime-400 rounded-lg text-neutral-400 hover:text-lime-400 transition-all flex items-center justify-center gap-2 group"
      >
        <IconPlus
          size={24}
          className="group-hover:scale-110 transition-transform"
        />
        <span className="text-lg font-medium">Add Media to Collection</span>
      </button>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-neutral-900 rounded-lg border border-neutral-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Add Media</h3>
        <button
          onClick={closeForm}
          className="p-1 text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          <IconX size={20} />
        </button>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-grow relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setHasSearched(false); // Reset when typing
            }}
            placeholder="Search for movies or TV shows..."
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-lime-400 transition-colors"
            autoFocus
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

      {searchResults.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[500px] overflow-y-auto p-1">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="group relative bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 hover:border-neutral-700 transition-all"
            >
              {/* Poster */}
              <div className="relative aspect-[2/3] bg-neutral-800">
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
                      <IconDeviceTv size={48} className="text-neutral-700" />
                    )}
                  </div>
                )}

                {/* Media Type Badge */}
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-neutral-900/80 backdrop-blur-sm rounded text-xs font-medium">
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
                  className="w-full px-3 py-2 bg-lime-400 text-neutral-900 text-sm font-medium rounded hover:bg-lime-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1"
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
  );
}
