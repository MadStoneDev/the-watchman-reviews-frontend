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

interface MediaBlockProps {
  data: MediaSearchResult;
  user?: User | null;
  username?: string;
  admin?: boolean;
  ownedCollections?: MediaCollection[];
  sharedCollections?: MediaCollection[];
}

export default function MediaBlock({
  data,
  user,
  username = "",
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

        console.log("Existing entries:");
        console.log(existingEntries);
        console.log(`Media Id: ${dbMediaId}`);
        console.log(`Media Type: ${mediaType}`);
        console.log(`Collection IDs:`);
        console.log(collectionIds);

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
      const tmdbId = data.tmdbId;
      const releaseYear = data.releaseYear || "";

      // We'll store the actual media ID here
      let mediaId = mediaDbId;

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
              release_year: releaseYear.toString(),
            })
            .select("id")
            .single();

          if (movieError) throw movieError;

          // Store the ID directly in our local variable instead of just setting state
          mediaId = newMovie.id;
          // Also update the state for future use
          setMediaDbId(newMovie.id);
          setExistsInDb(true);
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
              release_year: releaseYear.toString(),
            })
            .select("id")
            .single();

          if (seriesError) throw seriesError;

          // Store the ID directly in our local variable
          mediaId = newSeries.id;
          // Also update the state for future use
          setMediaDbId(newSeries.id);
          setExistsInDb(true);
        }
      }

      // Check if we have a valid media ID before proceeding
      if (!mediaId) {
        throw new Error("Failed to get or create media record");
      }

      // For each selected collection, add an entry in medias_collections
      const collectionEntries = selectedCollections.map((collectionId) => ({
        collection_id: collectionId,
        media_id: mediaId, // Use the local variable, not the state variable
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
    } catch (error: unknown) {
      console.error("Error adding to collections:", error);

      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "23505"
      ) {
        setError("This item is already in your collection");
      } else {
        setError(
          error instanceof Error
            ? error.message
            : "Error adding item to collections",
        );
      }
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

        {user && (
          <div
            className={`md:hidden absolute top-3 right-3 flex justify-center items-center gap-2 transition-all duration-300 ease-in-out`}
          >
            <button
              onClick={handleShowCollections}
              className={`p-1 flex justify-center items-center gap-1 w-full bg-lime-500/80 hover:bg-lime-500 rounded text-xs text-neutral-900 transition-all duration-300 ease-in-out`}
              disabled={loading}
            >
              <IconSquarePlus size={24} />
            </button>
          </div>
        )}

        <div
          className={`p-3 hidden md:flex flex-col justify-between absolute inset-0 bg-neutral-900/70 opacity-0 group-hover/media:opacity-100 transition-opacity duration-300`}
        >
          <div className="w-full">
            <h3 className="text-base font-semibold">{data.title}</h3>
            {data.releaseYear && (
              <p className="text-sm text-neutral-400">{data.releaseYear}</p>
            )}
          </div>

          {user && !showCollections && (
            <div
              className={`my-2 flex justify-center items-center gap-2 transition-all duration-300 ease-in-out`}
            >
              <button
                onClick={handleShowCollections}
                className={`p-3 flex justify-center items-center gap-1 w-full bg-lime-400 hover:scale-105 rounded text-xs text-neutral-900 transition-all duration-300 ease-in-out`}
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
          className={`fixed p-3 top-0 left-0 grid place-content-center w-dvw h-dvh bg-neutral-800/70 z-50`}
        >
          <div
            className={`p-4 flex flex-col gap-2 w-full md:w-[400px] max-w-md bg-neutral-900 shadow-lg shadow-neutral-900`}
          >
            {/* Header */}
            <div
              className={`pb-2 flex justify-between items-start border-b border-neutral-700`}
            >
              <h2 className={`max-w-64 text-sm font-semibold`}>
                Add <span className={`text-lime-400`}>{data.title}</span> to
                Collections
              </h2>

              <button
                onClick={() => {
                  setShowCollections(false);
                  setSelectedCollections([]);
                }}
                className={`ml-6 text-neutral-400 hover:text-white`}
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
            <div
              className={"flex flex-col gap-2 max-h-[300px] overflow-y-auto"}
            >
              <h3 className={`text-xs italic`}>Owned Collections</h3>
              {ownedCollections.length === 0 ? (
                <p className="text-xs text-neutral-400">
                  You don't own any collections yet.
                  {username ? (
                    <>
                      {" "}
                      <Link
                        href={`/${username}/collections`}
                        className={`text-lime-400 hover:text-lime-300 transition-all duration-300 ease-in-out`}
                      >
                        Create one now?
                      </Link>
                    </>
                  ) : null}
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
                              <IconCheck size={18} />
                            ) : (
                              <IconSquarePlus size={18} />
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
                  You don't have any shared collections yet.
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
                              <IconCheck size={18} />
                            ) : (
                              <IconSquarePlus size={18} />
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
                  : "bg-lime-400 text-neutral-900 hover:scale-105"
              } transition-all duration-300 ease-in-out`}
            >
              {loading ? (
                "Adding..."
              ) : (
                <>
                  <IconCheck size={18} />
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
