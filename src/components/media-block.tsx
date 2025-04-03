"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { createClient } from "@/src/utils/supabase/client";

import {
  IconChairDirector,
  IconDeviceTv,
  IconSquarePlus,
  IconCheck,
  IconX,
} from "@tabler/icons-react";

import { User } from "@supabase/supabase-js";
import { MediaCollection, MediaSearchResult } from "@/src/lib/types";
import { Share } from "lucide-react";

interface MediaBlockProps {
  data: MediaSearchResult;
  user?: User | null;
  admin?: boolean;
  ownedCollections?: MediaCollection[];
  sharedCollections?: MediaCollection[];
}

export default function MediaBlock({
  data,
  user,
  admin = false,
  ownedCollections = [],
  sharedCollections = [],
}: MediaBlockProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCollections, setShowCollections] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

  const [alreadyInCollections, setAlreadyInCollections] = useState<string[]>(
    [],
  );

  const [existsInDb, setExistsInDb] = useState(false);
  const [mediaDbId, setMediaDbId] = useState<string | null>(null);

  // Supabase
  const supabase = createClient();

  const handleShowCollections = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const mediaType = data.mediaType;
      const tmdbId = data.tmdbId;
      let dbMediaId: string | null = null;

      // Check if this media already exists in the database
      if (mediaType === "movie") {
        const { data: movieData } = await supabase
          .from("movies")
          .select("id")
          .eq("tmdb_id", tmdbId)
          .single();

        if (movieData) {
          dbMediaId = movieData.id;
          setExistsInDb(true);
          setMediaDbId(dbMediaId);
        }
      } else if (mediaType === "tv") {
        const { data: seriesData } = await supabase
          .from("series")
          .select("id")
          .eq("tmdb_id", tmdbId)
          .single();

        if (seriesData) {
          dbMediaId = seriesData.id;
          setExistsInDb(true);
          setMediaDbId(dbMediaId);
        }
      }

      const allCollections: MediaCollection[] = [
        ...ownedCollections,
        ...sharedCollections,
      ];

      let existingInCollections: string[] = [];

      if (dbMediaId && allCollections.length > 0) {
        const collectionIds = allCollections.map((item) => item.id);

        // Check if media is already in any collection
        const { data: existingEntries } = await supabase
          .from("medias_collections")
          .select("collection_id")
          .eq("media_id", dbMediaId)
          .eq("media_type", mediaType)
          .in("collection_id", collectionIds);

        if (existingEntries && existingEntries.length > 0) {
          existingInCollections = existingEntries.map(
            (entry) => entry.collection_id,
          );
          setAlreadyInCollections(existingInCollections);
        }
      }

      setShowCollections(true);
    } catch (err) {
      console.error("Error loading collections:", err);
      setError(
        err instanceof Error ? err.message : "Error loading collections",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionToggle = (collectionId: string) => {
    if (selectedCollections.includes(collectionId)) {
      setSelectedCollections(
        selectedCollections.filter((id) => id !== collectionId),
      );
    } else {
      setSelectedCollections([...selectedCollections, collectionId]);
    }
  };

  const addToCollections = async () => {
    if (!user || selectedCollections.length === 0) return;

    try {
      setLoading(true);
      setError(null);

      const mediaType = data.mediaType;
      const releaseYear = data.releaseYear || "";

      // If the media doesn't exist in the database, create it
      if (!existsInDb) {
        if (mediaType === "movie") {
          // Insert new movie into movies table
          const { data: newMovie, error: movieError } = await supabase
            .from("movies")
            .insert({
              title: data.title,
              overview: data.overview || "",
              poster_path: data.posterPath,
              backdrop_path: data.backdropPath,
              tmdb_id: data.tmdbId,
              media_type: mediaType,
              tmdb_rating: data.tmdbRating,
              release_year: releaseYear.toString(),
            })
            .select("id")
            .single();

          if (movieError) throw movieError;
        } else if (mediaType === "tv") {
          // Insert new series into series table
          const { data: newSeries, error: seriesError } = await supabase
            .from("series")
            .insert({
              title: data.title,
              overview: data.overview || "",
              poster_path: data.posterPath,
              backdrop_path: data.backdropPath,
              tmdb_id: data.tmdbId,
              media_type: mediaType,
              tmdb_rating: data.tmdbRating,
              release_year: releaseYear.toString(),
            })
            .select("id")
            .single();

          if (seriesError) throw seriesError;
        }
      }

      // For each selected collection, add an entry in medias_collections
      const collectionEntries = selectedCollections.map((collectionId) => ({
        collection_id: collectionId,
        media_id: mediaDbId,
        media_type: mediaType,
      }));

      const { error: collectionError } = await supabase
        .from("medias_collections")
        .insert(collectionEntries);

      if (collectionError) throw collectionError;

      // Close the collections panel
      setShowCollections(false);
      setSelectedCollections([]);

      // Update the list of collections this media is already in
      setAlreadyInCollections([
        ...alreadyInCollections,
        ...selectedCollections,
      ]);
    } catch (err) {
      console.error("Error adding to collections:", err);
      setError(
        err instanceof Error ? err.message : "Error adding item to collections",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <article>
      <div className="aspect-[2/3] bg-neutral-800 rounded overflow-hidden relative group/media">
        {data.posterPath ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${data.posterPath}`}
            alt={data.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 30vw, 20vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {data.mediaType === "movie" ? (
              <IconChairDirector size={40} className="text-neutral-600" />
            ) : (
              <IconDeviceTv size={40} className="text-neutral-600" />
            )}
          </div>
        )}

        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/media:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
          <div className="w-full">
            <h3 className="text-base font-semibold">{data.title}</h3>
            {data.releaseYear && (
              <p className="text-sm text-neutral-400">{data.releaseYear}</p>
            )}
          </div>

          {user &&
            (ownedCollections.length > 0 || sharedCollections.length > 0) &&
            !showCollections && (
              <div
                className={`mt-2 flex items-center gap-2 transition-all duration-300 ease-in-out`}
              >
                <button
                  onClick={handleShowCollections}
                  className={`p-2 flex items-center gap-1 bg-lime-500/80 hover:bg-lime-500 rounded text-xs text-black transition-all duration-300 ease-in-out`}
                  disabled={loading}
                >
                  <IconSquarePlus size={20} />
                  <span>Add to Collection</span>
                </button>
              </div>
            )}
        </div>
      </div>

      {showCollections && (
        <section
          className={`absolute top-0 right-0 bottom-0 left-0 p-3 grid place-content-center bg-neutral-800`}
        >
          <div className={`flex flex-col gap-2 max-w-md`}>
            {/* Header */}
            <div className={`flex justify-between items-center`}>
              <h2 className={`text-sm font-semibold`}>
                Add <span className={`text-lime-400`}>{data.title}</span> to
                Collections
              </h2>

              <button
                onClick={() => {
                  setShowCollections(false);
                  setSelectedCollections([]);
                }}
                className="text-neutral-400 hover:text-white"
              >
                <IconX size={16} />
              </button>
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-500/20 p-2 rounded mb-2">
                {error}
              </div>
            )}

            {/* Collections */}
            <div className={"flex flex-col gap-2 max-h-44 overflow-y-auto"}>
              <h3 className={`text-xs italic`}>Owned Collections</h3>
              {ownedCollections.length === 0 ? (
                <p className="text-xs text-neutral-400">
                  You don't own any collections yet.
                </p>
              ) : (
                <ul className="space-y-1">
                  {ownedCollections.map((collection) => {
                    const isAlreadyInCollection = alreadyInCollections.includes(
                      collection.id,
                    );

                    return (
                      <li key={collection.id} className="flex items-center">
                        {isAlreadyInCollection ? (
                          <div className="flex items-center gap-2 w-full text-xs py-1 px-2 bg-neutral-700 rounded">
                            <IconCheck size={16} className="text-lime-400" />
                            <span>{collection.title}</span>
                            <span className="ml-auto text-[10px] text-neutral-400">
                              Already added
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              handleCollectionToggle(collection.id)
                            }
                            className={`flex items-center gap-2 w-full text-xs py-1 px-2 hover:bg-neutral-700 rounded transition-colors ${
                              selectedCollections.includes(collection.id)
                                ? "bg-neutral-700 text-lime-400"
                                : ""
                            }`}
                          >
                            {selectedCollections.includes(collection.id) ? (
                              <IconCheck size={14} />
                            ) : (
                              <IconSquarePlus size={14} />
                            )}
                            <span>{collection.title}</span>
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}

              <h3 className={`mt-4 text-xs italic`}>Shared Collections</h3>
              {sharedCollections.length === 0 ? (
                <p className="text-xs text-neutral-400">
                  You don't own any collections yet.
                </p>
              ) : (
                <ul className="space-y-1">
                  {sharedCollections.map((collection) => {
                    const isAlreadyInCollection = alreadyInCollections.includes(
                      collection.id,
                    );

                    return (
                      <li key={collection.id} className="flex items-center">
                        {isAlreadyInCollection ? (
                          <div className="flex items-center gap-2 w-full text-xs py-1 px-2 bg-neutral-700 rounded">
                            <IconCheck size={16} className="text-lime-400" />
                            <span>{collection.title}</span>
                            <span className="ml-auto text-[10px] text-neutral-400">
                              Already added
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              handleCollectionToggle(collection.id)
                            }
                            className={`flex items-center gap-2 w-full text-xs py-1 px-2 hover:bg-neutral-700 rounded transition-colors ${
                              selectedCollections.includes(collection.id)
                                ? "bg-neutral-700 text-lime-400"
                                : ""
                            }`}
                          >
                            {selectedCollections.includes(collection.id) ? (
                              <IconCheck size={14} />
                            ) : (
                              <IconSquarePlus size={14} />
                            )}
                            <span>{collection.title}</span>
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <button
              onClick={addToCollections}
              disabled={loading || selectedCollections.length === 0}
              className={`w-full mt-2 py-1 rounded text-xs flex items-center justify-center gap-1 ${
                loading || selectedCollections.length === 0
                  ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                  : "bg-lime-500 text-black hover:bg-lime-400"
              }`}
            >
              {loading ? (
                "Adding..."
              ) : (
                <>
                  <IconCheck size={14} />
                  <span>
                    Add to{" "}
                    {selectedCollections.length === 1
                      ? "Collection"
                      : `${selectedCollections.length} Collections`}
                  </span>
                </>
              )}
            </button>
          </div>
        </section>
      )}
    </article>
  );
}
