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
  IconMovie,
} from "@tabler/icons-react";

import { MediaImage } from "@/src/components/ui/media-image";
import { MediaCollection, MediaSearchResult } from "@/src/lib/types";
import { createClient } from "@/src/utils/supabase/client";

interface MediaBlockProps {
  data: MediaSearchResult;
  userId: string | undefined;
  isUser?: boolean;
  username?: string;
  admin?: boolean;
  ownedCollections?: MediaCollection[];
  sharedCollections?: MediaCollection[];
  reelDeckItems?: Array<{
    media_id: string;
    media_type: "movie" | "tv";
    status: string;
    tmdb_id: string | undefined;
  }>;
}

export default function MediaBlock({
  data,
  userId,
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

  const [optimisticReelDeck, setOptimisticReelDeck] = useState<{
    action: "add" | "remove" | null;
    tmdbId: string;
  } | null>(null);

  const [reelDeckUpdating, setReelDeckUpdating] = useState(false);
  const [loading, setLoading] = useState(false);

  // Memoize computed values
  const reelDeckStatus = useMemo(() => {
    if (optimisticReelDeck?.tmdbId === data.tmdbId.toString()) {
      return optimisticReelDeck.action === "add" ? "watching" : null;
    }

    const item = reelDeckItems.find(
      (item) =>
        item.tmdb_id &&
        item.tmdb_id.toString() === data.tmdbId.toString() &&
        item.media_type === data.mediaType,
    );
    return item?.status || null;
  }, [reelDeckItems, data.tmdbId, data.mediaType, optimisticReelDeck]);

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

  // ✅ UPDATED: View details with API
  const handleViewDetails = async () => {
    try {
      setLoading(true);

      // Use the API to ensure media exists and get DB ID
      const response = await fetch("/api/media/ensure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdb_id: data.tmdbId,
          media_type: data.mediaType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to load media");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to load media");
      }

      // Navigate to media page
      const path =
        data.mediaType === "movie"
          ? `/movies/${result.media_id}`
          : `/series/${result.media_id}`;

      router.push(path);
    } catch (err) {
      console.error("Error navigating to details:", err);
      toast.error("Failed to load media details");
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED: Add to reel deck with API
  const handleAddToReelDeck = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isUser || !username) return;

    const toastId = toast.loading("Adding to Reel Deck...");

    setOptimisticReelDeck({
      action: "add",
      tmdbId: data.tmdbId.toString(),
    });

    try {
      setReelDeckUpdating(true);

      const response = await fetch("/api/media/ensure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdb_id: data.tmdbId,
          media_type: data.mediaType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create media record");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create media record");
      }

      const { error } = await supabase.from("reel_deck").insert({
        user_id: userId,
        media_id: result.media_id,
        media_type: data.mediaType,
        status: "watching",
      });

      if (error) throw error;

      toast.success("Added to Reel Deck", { id: toastId });

      // ✅ Keep optimistic state - it's now the source of truth
      // The optimistic state correctly shows it's added
      // No need to clear it or wait for refresh
    } catch (error) {
      console.error("Error adding to reel deck:", error);
      setOptimisticReelDeck(null); // Only revert on error
      toast.error("Failed to add to Reel Deck", { id: toastId });
    } finally {
      setReelDeckUpdating(false);
    }
  };

  const handleRemoveFromReelDeck = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isUser || !username) return;

    const toastId = toast.loading("Removing from Reel Deck...");

    setOptimisticReelDeck({
      action: "remove",
      tmdbId: data.tmdbId.toString(),
    });

    try {
      setReelDeckUpdating(true);

      const tableName = data.mediaType === "movie" ? "movies" : "series";
      const { data: mediaRecord } = await supabase
        .from(tableName)
        .select("id")
        .eq("tmdb_id", data.tmdbId)
        .maybeSingle();

      if (!mediaRecord) {
        throw new Error("Media not found");
      }

      const { error } = await supabase
        .from("reel_deck")
        .delete()
        .eq("user_id", userId)
        .eq("media_id", mediaRecord.id)
        .eq("media_type", data.mediaType);

      if (error) throw error;

      toast.success("Removed from Reel Deck", { id: toastId });

      // ✅ Keep optimistic state - it's now the source of truth
      // The optimistic state correctly shows it's removed
      // No need to clear it or wait for refresh
    } catch (error) {
      console.error("Error removing from reel deck:", error);
      setOptimisticReelDeck(null); // Only revert on error
      toast.error("Failed to remove from Reel Deck", { id: toastId });
    } finally {
      setReelDeckUpdating(false);
    }
  };

  // Load collection status
  const loadCollectionStatus = async () => {
    setLoadingCollections(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoadingCollections(false);
        return;
      }

      const { data: userCollections } = await supabase
        .from("collections")
        .select("id")
        .or(`creator_id.eq.${user.id},editors.cs.{${user.id}}`);

      if (!userCollections || userCollections.length === 0) {
        setLoadingCollections(false);
        return;
      }

      const collectionIds = userCollections.map((c) => c.id);

      const { data: existingEntries } = await supabase
        .from("medias_collections")
        .select("collection_id, media_id")
        .eq("media_type", data.mediaType)
        .in("collection_id", collectionIds);

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

  // ✅ UPDATED: Add to collections using API
  const handleAddToCollections = async () => {
    if (selectedCollections.length === 0) return;

    setAddingToCollections(true);
    const toastId = toast.loading(
      `Adding to ${selectedCollections.length} collection${
        selectedCollections.length > 1 ? "s" : ""
      }...`,
    );

    try {
      // Ensure media exists and get database ID
      const response = await fetch("/api/media/ensure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdb_id: data.tmdbId,
          media_type: data.mediaType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create media record");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create media record");
      }

      const mediaDbId = result.media_id;

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
    <article className="group relative flex flex-col bg-neutral-900 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-all overflow-hidden hover:shadow-lg hover:shadow-black/20">
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
                {data.mediaType === "tv" && !reelDeckStatus && (
                  <button
                    onClick={handleAddToReelDeck}
                    disabled={reelDeckUpdating}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-lime-400 text-neutral-900 hover:bg-lime-500 disabled:bg-lime-400/30 disabled:cursor-not-allowed rounded-lg font-medium text-sm transition-colors"
                    title="Add to Reel Deck"
                  >
                    {reelDeckUpdating ? (
                      <IconLoader2 size={16} className="animate-spin" />
                    ) : (
                      <IconDeviceTv size={18} />
                    )}
                  </button>
                )}

                {/* In Reel Deck indicator */}
                {data.mediaType === "tv" && reelDeckStatus && (
                  <button
                    className="group/deck flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-lime-400/20 hover:bg-red-800/20 text-lime-400 hover:text-red-600 rounded-lg font-medium text-sm border border-lime-400/30 hover:border-red-600/30 transition-all duration-200"
                    onClick={handleRemoveFromReelDeck}
                    disabled={reelDeckUpdating}
                  >
                    {reelDeckUpdating ? (
                      <IconLoader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <IconCheck
                          size={18}
                          className={`group-hover/deck:hidden`}
                        />
                        <IconX
                          size={18}
                          className={`hidden group-hover/deck:block`}
                        />
                      </>
                    )}
                  </button>
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
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-neutral-500 text-neutral-900 hover:bg-neutral-600 disabled:bg-neutral-500/50 disabled:cursor-not-allowed rounded-lg font-medium text-sm transition-colors"
              title="More info"
            >
              {loading ? (
                <IconLoader2 size={18} className="animate-spin" />
              ) : (
                <IconBubbleText size={18} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <button
          onClick={handleViewDetails}
          disabled={loading}
          className="w-full text-left group-hover:text-lime-400 transition-colors disabled:cursor-not-allowed"
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

          <div className={`flex gap-1 items-center`}>
            {data.mediaType === "movie" ? (
              <IconMovie size={14} />
            ) : (
              <IconDeviceTv size={14} />
            )}
            <span>{data.mediaType === "movie" ? "Movie" : "TV Series"}</span>
          </div>

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
