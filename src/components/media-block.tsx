"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { createClient } from "@/src/utils/supabase/client";

import {
  IconChairDirector,
  IconDeviceTv,
  IconSquarePlus,
  IconCheck,
  IconX,
  IconExternalLink,
  IconPlaylistAdd,
  IconBubbleText,
} from "@tabler/icons-react";

import { MediaCollection, MediaSearchResult } from "@/src/lib/types";

interface MediaBlockProps {
  data: MediaSearchResult;
  isUser?: boolean;
  username?: string;
  admin?: boolean;
  ownedCollections?: MediaCollection[];
  sharedCollections?: MediaCollection[];
  reelDeckItems?: Array<{
    media_id: string;
    media_type: "movie" | "tv";
    status: string;
  }>;
}

export default function MediaBlock({
  data,
  isUser,
  username = "",
  admin = false,
  ownedCollections = [],
  sharedCollections = [],
  reelDeckItems = [],
}: MediaBlockProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const [isHovered, setIsHovered] = useState(false);

  const [reelDeckStatus, setReelDeckStatus] = useState<string | null>(null);

  const [showCollections, setShowCollections] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [alreadyInCollections, setAlreadyInCollections] = useState<string[]>(
    [],
  );

  const [existsInDb, setExistsInDb] = useState(false);
  const [mediaDbId, setMediaDbId] = useState<string | null>(null);

  const supabase = createClient();

  const MEDIA_REFRESH_INTERVAL_DAYS = 30;

  const needsRefresh = (lastFetched: string | null): boolean => {
    if (!lastFetched) return true;

    const lastFetchedDate = new Date(lastFetched);
    const daysSinceLastFetch =
      (Date.now() - lastFetchedDate.getTime()) / (1000 * 60 * 60 * 24);

    return daysSinceLastFetch >= MEDIA_REFRESH_INTERVAL_DAYS;
  };

  // Handle navigation to detail page
  const handleViewDetails = async () => {
    try {
      setLoading(true);
      const mediaType = data.mediaType;
      const tmdbId = data.tmdbId;
      let dbMediaId: string | null = null;

      if (mediaType === "movie") {
        // Check if movie exists and get last_fetched
        const { data: movieData } = await supabase
          .from("movies")
          .select("id, last_fetched")
          .eq("tmdb_id", tmdbId)
          .maybeSingle();

        if (movieData) {
          dbMediaId = movieData.id;

          // Check if movie needs refresh (older than 30 days)
          const shouldRefresh = needsRefresh(movieData.last_fetched);

          if (shouldRefresh) {
            // ✅ Fetch updated data from our secure API route
            const tmdbResponse = await fetch(
              `/api/tmdb/movie/${tmdbId}?language=en-US`,
            );

            if (tmdbResponse.ok) {
              const tmdbMovie = await tmdbResponse.json();

              // Update movie record with fresh data
              await supabase
                .from("movies")
                .update({
                  title: tmdbMovie.title,
                  overview: tmdbMovie.overview || "",
                  poster_path: tmdbMovie.poster_path,
                  backdrop_path: tmdbMovie.backdrop_path,
                  release_year: tmdbMovie.release_date
                    ? new Date(tmdbMovie.release_date).getFullYear().toString()
                    : "",
                  runtime: tmdbMovie.runtime || null,
                  popularity: tmdbMovie.popularity
                    ? parseInt(tmdbMovie.popularity)
                    : null,
                  tmdb_popularity: tmdbMovie.popularity
                    ? String(tmdbMovie.popularity)
                    : null, // STRING field
                  last_fetched: new Date().toISOString(),
                })
                .eq("id", dbMediaId);
            } else {
              console.warn(
                `Failed to refresh movie data from TMDB, using cached data`,
              );
            }
          } else {
            //
          }
        } else {
          // ✅ Movie doesn't exist, fetch from our secure API route
          const tmdbResponse = await fetch(
            `/api/tmdb/movie/${tmdbId}?language=en-US`,
          );

          if (!tmdbResponse.ok) {
            throw new Error("Failed to fetch movie details from TMDB");
          }

          const tmdbMovie = await tmdbResponse.json();

          // Upsert movie record with complete data
          const { data: newMovie, error: movieError } = await supabase
            .from("movies")
            .upsert(
              {
                tmdb_id: tmdbMovie.id,
                title: tmdbMovie.title,
                overview: tmdbMovie.overview || "",
                poster_path: tmdbMovie.poster_path,
                backdrop_path: tmdbMovie.backdrop_path,
                release_year: tmdbMovie.release_date
                  ? new Date(tmdbMovie.release_date).getFullYear().toString()
                  : "",
                runtime: tmdbMovie.runtime || null,
                popularity: tmdbMovie.popularity
                  ? parseInt(tmdbMovie.popularity)
                  : null,
                tmdb_popularity: tmdbMovie.popularity
                  ? String(tmdbMovie.popularity)
                  : null, // STRING field
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
          dbMediaId = newMovie.id;
        }

        // Navigate to movie page
        router.push(`/movies/${dbMediaId}`);
      } else if (mediaType === "tv") {
        // Check if series exists and get last_fetched
        const { data: seriesData } = await supabase
          .from("series")
          .select("id, last_fetched")
          .eq("tmdb_id", tmdbId)
          .maybeSingle();

        if (seriesData) {
          dbMediaId = seriesData.id;

          // Check if series needs refresh (older than 30 days)
          const shouldRefresh = needsRefresh(seriesData.last_fetched);

          if (shouldRefresh) {
            // ✅ Fetch updated data from our secure API route
            const tmdbResponse = await fetch(
              `/api/tmdb/tv/${tmdbId}?language=en-US`,
            );

            if (tmdbResponse.ok) {
              const tmdbSeries = await tmdbResponse.json();

              // Update series record with fresh data
              await supabase
                .from("series")
                .update({
                  title: tmdbSeries.name,
                  overview: tmdbSeries.overview || "",
                  poster_path: tmdbSeries.poster_path,
                  backdrop_path: tmdbSeries.backdrop_path,
                  release_year: tmdbSeries.first_air_date
                    ? new Date(tmdbSeries.first_air_date)
                        .getFullYear()
                        .toString()
                    : "",
                  first_air_date: tmdbSeries.first_air_date || null,
                  last_air_date: tmdbSeries.last_air_date || null,
                  status: tmdbSeries.status || null,
                  last_fetched: new Date().toISOString(),
                })
                .eq("id", dbMediaId);
            } else {
              console.warn(
                `Failed to refresh series data from TMDB, using cached data`,
              );
            }
          } else {
            //
          }
        } else {
          // ✅ Series doesn't exist, fetch from our secure API route
          const tmdbResponse = await fetch(
            `/api/tmdb/tv/${tmdbId}?language=en-US`,
          );

          if (!tmdbResponse.ok) {
            throw new Error("Failed to fetch series details from TMDB");
          }

          const tmdbSeries = await tmdbResponse.json();

          // Upsert series record with complete data
          const { data: newSeries, error: seriesError } = await supabase
            .from("series")
            .upsert(
              {
                tmdb_id: tmdbSeries.id,
                title: tmdbSeries.name,
                overview: tmdbSeries.overview || "",
                poster_path: tmdbSeries.poster_path,
                backdrop_path: tmdbSeries.backdrop_path,
                release_year: tmdbSeries.first_air_date
                  ? new Date(tmdbSeries.first_air_date).getFullYear().toString()
                  : "",
                first_air_date: tmdbSeries.first_air_date || null,
                last_air_date: tmdbSeries.last_air_date || null,
                status: tmdbSeries.status || null,
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
          dbMediaId = newSeries.id;
        }

        // Navigate to series page
        router.push(`/series/${dbMediaId}`);
      }
    } catch (err) {
      console.error("Error navigating to details:", err);
      setError(err instanceof Error ? err.message : "Error loading details");
    } finally {
      setLoading(false);
    }
  };

  const getReelDeckStatus = () => {
    if (!mediaDbId) return null;

    const reelDeckItem = reelDeckItems.find(
      (item) =>
        item.media_id === mediaDbId && item.media_type === data.mediaType,
    );

    return reelDeckItem?.status || null;
  };

  const handleShowCollections = async () => {
    if (!isUser) return;

    try {
      setLoading(true);
      setError(null);

      const mediaType = data.mediaType;
      const tmdbId = data.tmdbId;
      let dbMediaId: string | null = null;

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
    if (!isUser || selectedCollections.length === 0) return;

    try {
      setLoading(true);
      setError(null);

      const mediaType = data.mediaType;
      const releaseYear = data.releaseYear || "";
      let mediaId = mediaDbId;

      // If the media doesn't exist in the database, create it
      if (!existsInDb) {
        if (mediaType === "movie") {
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
          mediaId = newMovie.id;
          setMediaDbId(newMovie.id);
          setExistsInDb(true);
        } else if (mediaType === "tv") {
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
          mediaId = newSeries.id;
          setMediaDbId(newSeries.id);
          setExistsInDb(true);
        }
      }

      if (!mediaId) {
        throw new Error("Failed to get or create media record");
      }

      const collectionEntries = selectedCollections.map((collectionId) => ({
        collection_id: collectionId,
        media_id: mediaId,
        media_type: mediaType,
      }));

      const { error: collectionError } = await supabase
        .from("medias_collections")
        .insert(collectionEntries);

      if (collectionError) throw collectionError;

      setShowCollections(false);
      setSelectedCollections([]);
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
            : "Failed to add to collections",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReelDeckToggle = async () => {
    if (!isUser) return;

    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const mediaType = data.mediaType;
      const tmdbId = data.tmdbId;
      const releaseYear = data.releaseYear || "";
      let dbMediaId = mediaDbId;

      // Check if media exists in database
      if (!dbMediaId) {
        if (mediaType === "movie") {
          const { data: movieData } = await supabase
            .from("movies")
            .select("id")
            .eq("tmdb_id", tmdbId)
            .maybeSingle();

          if (movieData) {
            dbMediaId = movieData.id;
            setMediaDbId(dbMediaId);
            setExistsInDb(true);
          }
        } else if (mediaType === "tv") {
          const { data: seriesData } = await supabase
            .from("series")
            .select("id")
            .eq("tmdb_id", tmdbId)
            .maybeSingle();

          if (seriesData) {
            dbMediaId = seriesData.id;
            setMediaDbId(dbMediaId);
            setExistsInDb(true);
          }
        }
      }

      // If media doesn't exist, create it
      if (!dbMediaId) {
        if (mediaType === "movie") {
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
          dbMediaId = newMovie.id;
          setMediaDbId(newMovie.id);
          setExistsInDb(true);
        } else if (mediaType === "tv") {
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
          dbMediaId = newSeries.id;
          setMediaDbId(newSeries.id);
          setExistsInDb(true);
        }
      }

      if (!dbMediaId) {
        throw new Error("Failed to get or create media record");
      }

      // Check if already in reel deck
      const currentStatus = reelDeckItems.find(
        (item) => item.media_id === dbMediaId && item.media_type === mediaType,
      )?.status;

      if (currentStatus) {
        // Remove from reel deck
        const { error } = await supabase
          .from("reel_deck")
          .delete()
          .eq("user_id", user.id)
          .eq("media_id", dbMediaId)
          .eq("media_type", mediaType);

        if (error) throw error;
        setReelDeckStatus(null);
      } else {
        // Add to reel deck with "watching" status
        const { error: insertError } = await supabase.from("reel_deck").insert({
          user_id: user.id,
          media_id: dbMediaId,
          media_type: mediaType,
          status: "watching",
        });

        if (insertError) throw insertError;
        setReelDeckStatus("watching");
      }
    } catch (error: unknown) {
      console.error("Error toggling reel deck:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update reel deck",
      );
    } finally {
      setLoading(false);
    }
  };

  // Update reel deck status when mediaDbId changes
  useEffect(() => {
    if (mediaDbId) {
      setReelDeckStatus(getReelDeckStatus());
    }
  }, [mediaDbId, reelDeckItems]);

  return (
    <article
      className={`group/media relative bg-neutral-900 h-full rounded-lg overflow-hidden border border-neutral-800 hover:border-neutral-700 transition-all duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] bg-neutral-800">
        {data.posterPath && !imageError ? (
          <Image
            src={`https://image.tmdb.org/t/p/w342${data.posterPath}`}
            alt={data.title}
            fill
            className="object-cover transition-opacity"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {data.mediaType === "movie" ? (
              <IconChairDirector size={48} className="text-neutral-700" />
            ) : (
              <IconDeviceTv size={48} className="text-neutral-700" />
            )}
          </div>
        )}

        {/* Hover Overlay with Actions */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent flex flex-col justify-end p-2 transition-opacity ${
            isHovered ? "opacity-100" : "lg:opacity-0"
          }`}
        >
          <div className="flex justify-between items-center gap-2 mb-2 z-30">
            {/* View Details Button */}
            <button
              onClick={handleViewDetails}
              disabled={loading}
              className="flex-1 py-1 px-3 bg-neutral-700/80 text-neutral-200 hover:bg-neutral-700 rounded-lg transition-colors flex items-center justify-center gap-1"
              title="View details"
            >
              <IconBubbleText size={24} />
            </button>

            {/* Add to Reel Deck Button */}
            {isUser && data.mediaType === "series" && (
              <button
                onClick={handleReelDeckToggle}
                disabled={loading}
                className={`flex-1 py-1 px-3 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                  reelDeckStatus
                    ? "bg-lime-400 text-neutral-900 hover:bg-lime-500"
                    : "bg-red-500 text-neutral-200 hover:bg-red-600"
                }`}
                title={
                  reelDeckStatus ? "Remove from Reel Deck" : "Add to Reel Deck"
                }
              >
                {reelDeckStatus ? (
                  <IconCheck size={24} />
                ) : (
                  <IconDeviceTv size={24} />
                )}
              </button>
            )}

            {/* Add to Collection Button */}
            {isUser && (
              <button
                onClick={handleShowCollections}
                disabled={loading}
                className="flex-1 py-1 px-3 bg-lime-400 text-neutral-900 hover:bg-lime-500 rounded-lg transition-colors flex items-center justify-center gap-1"
                title="Add to collection"
              >
                <IconPlaylistAdd size={24} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <Link
          href={`https://www.themoviedb.org/${data.mediaType}/${data.tmdbId}`}
          target="_blank"
          className="group/link flex items-start justify-between gap-1 mb-1"
        >
          <h3 className="text-sm font-medium line-clamp-2 text-neutral-100 group-hover/link:text-lime-400 transition-colors">
            {data.title}
          </h3>
          <IconExternalLink
            size={18}
            className="text-neutral-600 group-hover/link:text-lime-400 transition-colors shrink-0 mt-0.5"
          />
        </Link>
        <div className="flex items-center justify-between text-xs text-neutral-500">
          {data.releaseYear && <p>{data.releaseYear}</p>}
          {data.tmdbRating && (
            <div className="flex items-center gap-1">
              <img src="/tmdb-logo.svg" className="w-4 h-4" alt="TMDB" />
              <p>{data.tmdbRating.toFixed(1)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Collections Modal */}
      {showCollections && (
        <section className="fixed p-3 top-0 left-0 grid place-content-center w-dvw h-dvh bg-neutral-800/70 z-50">
          <div className="p-6 flex flex-col gap-4 w-full md:w-[500px] max-w-md bg-neutral-900 rounded-lg shadow-lg shadow-neutral-900 border border-neutral-800">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-neutral-800 pb-4">
              <div>
                <h2 className="text-lg font-semibold mb-1">
                  Add to Collection
                </h2>
                <p className="text-sm text-neutral-400 line-clamp-1">
                  {data.title}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowCollections(false);
                  setSelectedCollections([]);
                }}
                className="text-neutral-400 hover:text-white transition-colors p-1"
              >
                <IconX size={20} />
              </button>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/20 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Collections List */}
            <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
              {/* Owned Collections */}
              <div>
                <h3 className="text-sm font-medium text-neutral-400 mb-2">
                  Your Collections
                </h3>
                {ownedCollections.length === 0 ? (
                  <p className="text-sm text-neutral-500">
                    You don't have any collections yet.{" "}
                    {username && (
                      <Link
                        href={`/${username}/collections`}
                        className="text-lime-400 hover:text-lime-300 transition-colors"
                      >
                        Create one now?
                      </Link>
                    )}
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {ownedCollections.map((collection) => {
                      const isAlreadyInCollection =
                        alreadyInCollections.includes(collection.id);
                      const isSelected = selectedCollections.includes(
                        collection.id,
                      );

                      return (
                        <li key={collection.id}>
                          {isAlreadyInCollection ? (
                            <div className="flex items-center gap-3 w-full py-2 px-3 bg-neutral-800 border border-neutral-700 rounded-lg">
                              <IconCheck
                                size={18}
                                className="text-lime-400 shrink-0"
                              />
                              <span className="text-sm flex-1">
                                {collection.title}
                              </span>
                              <span className="text-xs text-neutral-500">
                                Added
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                handleCollectionToggle(collection.id)
                              }
                              className={`flex items-center gap-3 w-full py-2 px-3 rounded-lg border transition-all ${
                                isSelected
                                  ? "bg-lime-400/10 border-lime-400 text-lime-400"
                                  : "bg-neutral-800 border-neutral-700 hover:border-neutral-600"
                              }`}
                            >
                              {isSelected ? (
                                <IconCheck size={18} className="shrink-0" />
                              ) : (
                                <IconSquarePlus
                                  size={18}
                                  className="shrink-0"
                                />
                              )}
                              <span className="text-sm flex-1 text-left">
                                {collection.title}
                              </span>
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Shared Collections */}
              {sharedCollections.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">
                    Shared with You
                  </h3>
                  <ul className="space-y-2">
                    {sharedCollections.map((collection) => {
                      const isAlreadyInCollection =
                        alreadyInCollections.includes(collection.id);
                      const isSelected = selectedCollections.includes(
                        collection.id,
                      );

                      return (
                        <li key={collection.id}>
                          {isAlreadyInCollection ? (
                            <div className="flex items-center gap-3 w-full py-2 px-3 bg-neutral-800 border border-neutral-700 rounded-lg">
                              <IconCheck
                                size={18}
                                className="text-lime-400 shrink-0"
                              />
                              <span className="text-sm flex-1">
                                {collection.title}
                              </span>
                              <span className="text-xs text-neutral-500">
                                Added
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                handleCollectionToggle(collection.id)
                              }
                              className={`flex items-center gap-3 w-full py-2 px-3 rounded-lg border transition-all ${
                                isSelected
                                  ? "bg-lime-400/10 border-lime-400 text-lime-400"
                                  : "bg-neutral-800 border-neutral-700 hover:border-neutral-600"
                              }`}
                            >
                              {isSelected ? (
                                <IconCheck size={18} className="shrink-0" />
                              ) : (
                                <IconSquarePlus
                                  size={18}
                                  className="shrink-0"
                                />
                              )}
                              <span className="text-sm flex-1 text-left">
                                {collection.title}
                              </span>
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* Add Button */}
            <button
              onClick={addToCollections}
              disabled={loading || selectedCollections.length === 0}
              className={`w-full py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                loading || selectedCollections.length === 0
                  ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                  : "bg-lime-400 text-neutral-900 hover:bg-lime-500"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-neutral-900 border-t-transparent rounded-full"></div>
                  <span>Adding...</span>
                </>
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
