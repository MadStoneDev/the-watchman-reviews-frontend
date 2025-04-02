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

import { MediaItem, Genre } from "@/src/types/media";
import { User } from "@supabase/supabase-js";

// Helper function to format the date
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "" : date.getFullYear().toString();
};

interface MediaBlockProps {
  data: MediaItem;
  movieGenres: Genre[];
  seriesGenres: Genre[];
  admin?: boolean;
  user?: User | null;
  collections?: string[];
}

export default function MediaBlock({
  data,
  movieGenres,
  seriesGenres,
  admin = false,
  user,
  collections = [],
}: MediaBlockProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCollections, setShowCollections] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [collectionsData, setCollectionsData] = useState<
    Array<{ id: string; title: string }>
  >([]);

  // We'll track which collections this media is already in
  const [alreadyInCollections, setAlreadyInCollections] = useState<string[]>(
    [],
  );

  const supabase = createClient();

  const handleShowCollections = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Get available collections for this user
      if (collections.length > 0) {
        const { data: collectionsInfo, error: collectionError } = await supabase
          .from("collections")
          .select("id, title")
          .in("id", collections);

        if (collectionError) throw collectionError;

        if (collectionsInfo) {
          setCollectionsData(collectionsInfo);
        }

        // Check if this media is already in any collections
        // First check if the movie/series exists in our database
        const mediaType = data.mediaType;
        const tmdbId = data.id;

        let mediaId: string | null = null;

        if (mediaType === "movie") {
          const { data: movieData } = await supabase
            .from("movies")
            .select("id")
            .eq("tmdb_id", tmdbId)
            .single();

          if (movieData) {
            mediaId = movieData.id;
          }
        } else if (mediaType === "tv") {
          const { data: seriesData } = await supabase
            .from("series")
            .select("id")
            .eq("tmdb_id", tmdbId)
            .single();

          if (seriesData) {
            mediaId = seriesData.id;
          }
        }

        // If we found the media in our database, check which collections it's in
        if (mediaId) {
          const { data: existingEntries } = await supabase
            .from("medias_collections")
            .select("collection_id")
            .eq("media_id", mediaId)
            .eq("media_type", mediaType);

          if (existingEntries && existingEntries.length > 0) {
            const collectionIds = existingEntries.map(
              (entry) => entry.collection_id,
            );
            setAlreadyInCollections(collectionIds);
          }
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

      // Prepare media data from TMDB
      const mediaType = data.mediaType;
      const releaseYear = data.releaseYear || null;

      // Check if the movie/series already exists in our database
      let mediaId: string | null = null;

      if (mediaType === "movie") {
        const { data: existingMovie } = await supabase
          .from("movies")
          .select("id")
          .eq("tmdb_id", data.id)
          .single();

        if (existingMovie) {
          mediaId = existingMovie.id;
        } else {
          // Insert new movie into movies table
          const { data: newMovie, error: movieError } = await supabase
            .from("movies")
            .insert({
              title: data.title,
              poster_path: data.posterPath,
              overview: data.overview || "",
              release_year: releaseYear,
              tmdb_id: data.id,
            })
            .select("id")
            .single();

          if (movieError) throw movieError;
          if (newMovie) mediaId = newMovie.id;
        }
      } else if (mediaType === "tv") {
        const { data: existingSeries } = await supabase
          .from("series")
          .select("id")
          .eq("tmdb_id", data.id)
          .single();

        if (existingSeries) {
          mediaId = existingSeries.id;
        } else {
          // Insert new series into series table
          const { data: newSeries, error: seriesError } = await supabase
            .from("series")
            .insert({
              title: data.title,
              poster_path: data.posterPath,
              overview: data.overview || "",
              release_year: releaseYear,
              tmdb_id: data.id,
            })
            .select("id")
            .single();

          if (seriesError) throw seriesError;
          if (newSeries) mediaId = newSeries.id;
        }
      }

      if (!mediaId) {
        throw new Error("Failed to create or find media record");
      }

      // For each selected collection, add an entry in medias_collections
      const collectionEntries = selectedCollections.map((collectionId) => ({
        collection_id: collectionId,
        media_id: mediaId,
        media_type: mediaType,
      }));

      // Add to medias_collections table
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

          <div className="flex items-center gap-2 mt-2 transition-opacity">
            {user && collections.length > 0 && !showCollections && (
              <button
                onClick={handleShowCollections}
                className="flex items-center gap-1 text-xs bg-lime-500/80 text-black px-2 py-1 rounded hover:bg-lime-500 transition-colors"
                disabled={loading}
              >
                <IconSquarePlus size={14} />
                <span>Add to Collection</span>
              </button>
            )}
            <Link
              href={`https://www.themoviedb.org/${data.mediaType}/${data.id}`}
              target="_blank"
              className="flex items-center gap-1 text-xs bg-neutral-700/90 text-white px-2 py-1 rounded hover:bg-neutral-700 transition-colors"
            >
              <span>View on TMDB</span>
            </Link>
          </div>
        </div>
      </div>

      {showCollections && (
        <div className="bg-neutral-800 rounded mt-2 p-3">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold">Add to Collections</h4>
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

          <div className="max-h-40 overflow-y-auto">
            {collectionsData.length === 0 ? (
              <p className="text-xs text-neutral-400">
                You don't have any collections yet.
              </p>
            ) : (
              <ul className="space-y-1">
                {collectionsData.map((collection) => {
                  const isAlreadyInCollection = alreadyInCollections.includes(
                    collection.id,
                  );

                  return (
                    <li key={collection.id} className="flex items-center">
                      {isAlreadyInCollection ? (
                        <div className="flex items-center gap-2 w-full text-xs py-1 px-2 bg-neutral-700 rounded">
                          <IconCheck size={14} className="text-lime-400" />
                          <span>{collection.title}</span>
                          <span className="ml-auto text-[10px] text-neutral-400">
                            Already added
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleCollectionToggle(collection.id)}
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
            disabled={
              loading ||
              selectedCollections.length === 0 ||
              collectionsData.length === 0
            }
            className={`w-full mt-2 py-1 rounded text-xs flex items-center justify-center gap-1 ${
              loading ||
              selectedCollections.length === 0 ||
              collectionsData.length === 0
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
      )}
    </article>
  );
}
