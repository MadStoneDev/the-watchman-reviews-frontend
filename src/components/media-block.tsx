"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  IconSquarePlus,
  IconCheck,
  IconX,
  IconPlaylistAdd,
  IconLoader2,
  IconDeviceTv,
  IconBubbleText,
} from "@tabler/icons-react";

import { MediaImage } from "@/src/components/ui/media-image";
import { MediaCollection, MediaSearchResult } from "@/src/lib/types";
import { createClient } from "@/src/utils/supabase/client";

interface MediaBlockProps {
  data: MediaSearchResult;
  isUser?: boolean;
  username?: string;
  admin?: boolean;
  ownedCollections?: MediaCollection[];
  sharedCollections?: MediaCollection[];
  reelDeckItems?: Array<{
    tmdb_id: string;
    media_id: string;
    media_type: "movie" | "tv";
    status: string;
  }>;
}

export default function MediaBlock({
  data,
  isUser,
  username = "",
  ownedCollections = [],
  sharedCollections = [],
  reelDeckItems = [],
}: MediaBlockProps) {
  const router = useRouter();
  const supabase = createClient();

  // Collections state
  const [showCollections, setShowCollections] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [alreadyInCollections, setAlreadyInCollections] = useState<string[]>(
    [],
  );
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [addingToCollections, setAddingToCollections] = useState(false);

  // Memoize computed values
  const reelDeckStatus = useMemo(() => {
    console.log(reelDeckItems);
    console.log(data);
    const item = reelDeckItems.find(
      (item) =>
        item.tmdb_id.toString() === data.tmdbId.toString() &&
        item.media_type === data.mediaType,
    );
    return item?.status || null;
  }, [reelDeckItems, data.tmdbId, data.mediaType]);

  const allCollections = useMemo(
    () => [...ownedCollections, ...sharedCollections],
    [ownedCollections, sharedCollections],
  );

  // Load collection status when modal opens
  useEffect(() => {
    if (showCollections && isUser) {
      loadCollectionStatus();
    }
  }, [showCollections, isUser]);

  // OPTIMIZED: Simple, instant navigation
  const handleViewDetails = () => {
    const path =
      data.mediaType === "movie"
        ? `/movies/${data.tmdbId}`
        : `/series/${data.tmdbId}`;

    // Navigate immediately - the page will handle data fetching
    router.push(path);
  };

  // Add to reel deck
  const handleAddToReelDeck = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isUser || !username) return;

    router.push(
      `/${username}/reel-deck?add=${data.tmdbId}&type=${data.mediaType}`,
    );
  };

  // Load collection status
  const loadCollectionStatus = async () => {
    setLoadingCollections(true);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoadingCollections(false);
        return;
      }

      // Get user's collections
      const { data: userCollections } = await supabase
        .from("collections")
        .select("id")
        .or(`creator_id.eq.${user.id},editors.cs.{${user.id}}`);

      if (!userCollections || userCollections.length === 0) {
        setLoadingCollections(false);
        return;
      }

      const collectionIds = userCollections.map((c) => c.id);

      // Check which already have this media using TMDB ID
      const { data: existingEntries } = await supabase
        .from("medias_collections")
        .select("collection_id, media_id")
        .eq("media_type", data.mediaType)
        .in("collection_id", collectionIds);

      // We need to check if any existing entries match this TMDB ID
      // This requires getting the media records to compare TMDB IDs
      if (existingEntries && existingEntries.length > 0) {
        const mediaIds = existingEntries.map((e) => e.media_id);

        const tableName = data.mediaType === "movie" ? "movies" : "series";
        const { data: mediaRecords } = await supabase
          .from(tableName)
          .select("id, tmdb_id")
          .in("id", mediaIds)
          .eq("tmdb_id", data.tmdbId);

        if (mediaRecords && mediaRecords.length > 0) {
          const matchingMediaIds = new Set(mediaRecords.map((m) => m.id));
          const matchingCollectionIds = existingEntries
            .filter((e) => matchingMediaIds.has(e.media_id))
            .map((e) => e.collection_id);

          setAlreadyInCollections(matchingCollectionIds);
        }
      }
    } catch (error) {
      console.error("Error loading collection status:", error);
      toast.error("Failed to load collections");
    } finally {
      setLoadingCollections(false);
    }
  };

  // Collection toggle
  const handleCollectionToggle = (collectionId: string) => {
    setSelectedCollections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId],
    );
  };

  // Add to collections
  const handleAddToCollections = async () => {
    if (selectedCollections.length === 0) return;

    setAddingToCollections(true);
    const toastId = toast.loading(
      `Adding to ${selectedCollections.length} collection${
        selectedCollections.length > 1 ? "s" : ""
      }...`,
    );

    try {
      // First, ensure the media exists in our database
      const tableName = data.mediaType === "movie" ? "movies" : "series";

      // Check if media exists by TMDB ID
      let { data: existingMedia } = await supabase
        .from(tableName)
        .select("id")
        .eq("tmdb_id", data.tmdbId)
        .maybeSingle();

      let mediaDbId: string;

      if (!existingMedia) {
        // Create the media record
        const mediaRecord = {
          tmdb_id: data.tmdbId,
          title: data.title,
          overview: data.overview || "",
          poster_path: data.posterPath,
          backdrop_path: data.backdropPath,
          release_year: data.releaseYear || null,
          popularity: data.popularity
            ? parseInt(data.popularity.toString())
            : null,
          tmdb_popularity: data.popularity ? String(data.popularity) : null,
          last_fetched: new Date().toISOString(),
        };

        const { data: newMedia, error: createError } = await supabase
          .from(tableName)
          .insert(mediaRecord)
          .select("id")
          .single();

        if (createError) throw createError;
        mediaDbId = newMedia.id;
      } else {
        mediaDbId = existingMedia.id;
      }

      // Get the highest position for each collection
      const positionPromises = selectedCollections.map(async (collectionId) => {
        const { data: posData } = await supabase
          .from("medias_collections")
          .select("position")
          .eq("collection_id", collectionId)
          .order("position", { ascending: false })
          .limit(1)
          .maybeSingle();

        return {
          collectionId,
          nextPosition: posData ? posData.position + 1 : 0,
        };
      });

      const positions = await Promise.all(positionPromises);

      // Create entries
      const entries = positions.map(({ collectionId, nextPosition }) => ({
        collection_id: collectionId,
        media_id: mediaDbId,
        media_type: data.mediaType,
        position: nextPosition,
      }));

      const { error } = await supabase
        .from("medias_collections")
        .upsert(entries, {
          onConflict: "collection_id,media_id,media_type",
          ignoreDuplicates: true,
        });

      if (error) throw error;

      toast.success(
        `Added to ${selectedCollections.length} collection${
          selectedCollections.length > 1 ? "s" : ""
        }`,
        { id: toastId },
      );

      setAlreadyInCollections((prev) => [...prev, ...selectedCollections]);
      setSelectedCollections([]);
      setShowCollections(false);
    } catch (error) {
      console.error("Error adding to collections:", error);
      toast.error("Failed to add to collections", { id: toastId });
    } finally {
      setAddingToCollections(false);
    }
  };

  return (
    <article className="group relative bg-neutral-900 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-all overflow-hidden hover:shadow-lg hover:shadow-black/20">
      {/* Poster */}
      <div
        onClick={handleViewDetails}
        className="relative aspect-[2/3] bg-neutral-800 overflow-hidden cursor-pointer"
      >
        <MediaImage
          src={data.posterPath}
          alt={data.title}
          mediaType={data.mediaType}
          size="md"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Action Buttons Overlay - Only show on hover and for users */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-2 right-2 flex gap-2">
            {isUser && (
              <>
                {/* Add to Reel Deck */}
                {!reelDeckStatus && (
                  <button
                    onClick={handleAddToReelDeck}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-lime-400 text-neutral-900 hover:bg-lime-500 rounded-lg font-medium text-sm transition-colors"
                    title="Add to Reel Deck"
                  >
                    <IconDeviceTv size={18} />
                  </button>
                )}

                {/* In Reel Deck indicator */}
                {reelDeckStatus && (
                  <div className="group/deck flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-lime-400/20 hover:bg-red-800/20 text-lime-400 hover:text-red-600 rounded-lg font-medium text-sm border border-lime-400/30 hover:border-red-600/30 transition-all duration-200">
                    <IconCheck
                      size={18}
                      className={`group-hover/deck:hidden`}
                    />
                    <IconX
                      size={18}
                      className={`hidden group-hover/deck:block`}
                    />
                  </div>
                )}

                {/* Add to Collection */}
                {allCollections.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCollections(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-500 text-neutral-900 hover:bg-indigo-600 rounded-lg font-medium text-sm transition-colors"
                    title="Add to collection"
                  >
                    <IconPlaylistAdd size={20} />
                  </button>
                )}
              </>
            )}

            {/* More Info Button */}
            <button
              onClick={handleViewDetails}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-neutral-500 text-neutral-900 hover:bg-neutral-600 rounded-lg font-medium text-sm transition-colors"
              title="Add to Reel Deck"
            >
              <IconBubbleText size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <button
          onClick={handleViewDetails}
          className="w-full text-left group-hover:text-lime-400 transition-colors"
        >
          <h3 className="text-sm font-medium line-clamp-2 mb-2 leading-tight">
            {data.title}
          </h3>
        </button>

        {/* Meta Info */}
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          {data.releaseYear && (
            <>
              <span>{data.releaseYear}</span>
              <span>•</span>
            </>
          )}
          <span>{data.mediaType === "movie" ? "Movie" : "TV Series"}</span>
          {data.tmdbRating && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <img src="/tmdb-logo.svg" className="w-4 h-4" alt="TMDB" />
                <span>{data.tmdbRating.toFixed(1)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Collections Modal */}
      {showCollections && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-neutral-800 rounded-lg shadow-xl border border-neutral-700 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-neutral-700 p-6">
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

            {/* Collections List */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingCollections ? (
                <div className="flex items-center justify-center py-8">
                  <IconLoader2
                    size={24}
                    className="animate-spin text-neutral-400"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Owned Collections */}
                  {ownedCollections.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-neutral-400 mb-2">
                        Your Collections
                      </h3>
                      <ul className="space-y-2">
                        {ownedCollections.map((collection) => {
                          const isInCollection = alreadyInCollections.includes(
                            collection.id,
                          );
                          const isSelected = selectedCollections.includes(
                            collection.id,
                          );

                          return (
                            <li key={collection.id}>
                              {isInCollection ? (
                                <div className="flex items-center gap-3 w-full py-2 px-3 bg-neutral-700 border border-neutral-600 rounded-lg">
                                  <IconCheck
                                    size={18}
                                    className="text-lime-400 shrink-0"
                                  />
                                  <span className="text-sm flex-1">
                                    {collection.title}
                                  </span>
                                  <span className="text-xs text-neutral-400">
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
                                      : "bg-neutral-700 border-neutral-600 hover:border-neutral-500"
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

                  {/* Shared Collections */}
                  {sharedCollections.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-neutral-400 mb-2">
                        Shared with You
                      </h3>
                      <ul className="space-y-2">
                        {sharedCollections.map((collection) => {
                          const isInCollection = alreadyInCollections.includes(
                            collection.id,
                          );
                          const isSelected = selectedCollections.includes(
                            collection.id,
                          );

                          return (
                            <li key={collection.id}>
                              {isInCollection ? (
                                <div className="flex items-center gap-3 w-full py-2 px-3 bg-neutral-700 border border-neutral-600 rounded-lg">
                                  <IconCheck
                                    size={18}
                                    className="text-lime-400 shrink-0"
                                  />
                                  <span className="text-sm flex-1">
                                    {collection.title}
                                  </span>
                                  <span className="text-xs text-neutral-400">
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
                                      : "bg-neutral-700 border-neutral-600 hover:border-neutral-500"
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

                  {/* No collections message */}
                  {allCollections.length === 0 && (
                    <p className="text-sm text-neutral-400 text-center py-8">
                      You don't have any collections yet.
                      {username && (
                        <Link
                          href={`/${username}/collections`}
                          className="block mt-2 text-lime-400 hover:text-lime-300"
                        >
                          Create one now
                        </Link>
                      )}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-neutral-700 p-6">
              <button
                onClick={handleAddToCollections}
                disabled={
                  addingToCollections ||
                  selectedCollections.length === 0 ||
                  loadingCollections
                }
                className={`w-full py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                  addingToCollections ||
                  selectedCollections.length === 0 ||
                  loadingCollections
                    ? "bg-neutral-700 text-neutral-500 cursor-not-allowed"
                    : "bg-lime-400 text-neutral-900 hover:bg-lime-500"
                }`}
              >
                {addingToCollections ? (
                  <>
                    <IconLoader2 size={18} className="animate-spin" />
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
          </div>
        </div>
      )}
    </article>
  );
}
