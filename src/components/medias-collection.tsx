"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { createClient } from "@/src/utils/supabase/client";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import CollectionItem from "./collection-item";
import {
  IconSquarePlus,
  IconShare,
  IconCheck,
  IconX,
  IconChevronDown,
  IconChevronUp,
  IconTrash,
  IconArrowsSort,
} from "@tabler/icons-react";

import { MediaCollection, MediaItem } from "@/src/lib/types";

// Extend MediaItem to include collection-specific properties
interface CollectionMediaItem extends MediaItem {
  collectionEntryId?: string;
  position?: number;
  isWatched?: boolean; // Track watched status for sorting
}

type MediasCollectionProps = {
  collection: MediaCollection;
  initialMedias?: MediaItem[];
  isOwner?: boolean;
  itemCount?: number;
};

type SharedUser = {
  id: string;
  username: string;
  accessLevel: number;
};

export default function MediasCollection({
  collection,
  initialMedias = [],
  isOwner = false,
  itemCount = 0,
}: MediasCollectionProps) {
  const [currentItemCount, setCurrentItemCount] = useState(itemCount);
  const [items, setItems] = useState<CollectionMediaItem[]>([]);

  const [loading, setLoading] = useState(!initialMedias.length);
  const [isShareExpanded, setIsShareExpanded] = useState(false);
  const [showShareForm, setShowShareForm] = useState(false);
  const [username, setUsername] = useState("");
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
  const [loadingSharedUsers, setLoadingSharedUsers] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [watchedItems, setWatchedItems] = useState<Set<string>>(new Set());

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [message, setMessage] = useState("");

  // Supabase
  const supabase = createClient();

  // Effects
  useEffect(() => {
    setCurrentItemCount(itemCount);
  }, [itemCount]);

  useEffect(() => {
    if (initialMedias.length > 0 && items.length === 0) {
      setItems(
        initialMedias.map((item) => ({
          ...item,
          isWatched: false,
        })),
      );
    }
  }, [initialMedias, items.length]);

  useEffect(() => {
    const fetchMediaItems = async () => {
      if (items.length > 0) return; // Already loaded

      setLoading(true);

      try {
        // Get current user
        const { data: userData } = await supabase.auth.getUser();
        const currentUserId = userData?.user?.id;

        // Fetch media entries with position
        const { data: mediaEntries } = await supabase
          .from("medias_collections")
          .select("*")
          .eq("collection_id", collection.id)
          .order("position", { ascending: true })
          .order("created_at", { ascending: false });

        if (mediaEntries && mediaEntries.length > 0) {
          const movieIds = mediaEntries
            .filter((item) => item.media_type === "movie")
            .map((item) => item.media_id);
          const seriesIds = mediaEntries
            .filter((item) => item.media_type === "tv")
            .map((item) => item.media_id);

          const mediaItems: CollectionMediaItem[] = [];

          // Fetch all watched items for the current user in this collection
          const watchedItemsSet = new Set<string>();
          if (currentUserId) {
            const { data: watchedData } = await supabase
              .from("media_watches")
              .select("media_id, media_type")
              .eq("collection_id", collection.id)
              .eq("user_id", currentUserId);

            if (watchedData) {
              watchedData.forEach((item) => {
                watchedItemsSet.add(item.media_id);
              });
              setWatchedItems(watchedItemsSet);
            }
          }

          // Process movies
          if (movieIds.length > 0) {
            const { data: movies } = await supabase
              .from("movies")
              .select("*")
              .in("id", movieIds);

            if (movies) {
              const movieItems: CollectionMediaItem[] = movies.map((movie) => {
                const entry = mediaEntries.find(
                  (e) => e.media_id === movie.id && e.media_type === "movie",
                );

                return {
                  id: movie.id,
                  title: movie.title,
                  overview: movie.overview,
                  posterPath: movie.poster_path,
                  backdropPath: movie.backdrop_path,
                  tmdbId: movie.tmdb_id,
                  mediaType: "movie",
                  releaseYear: movie.release_year,
                  collectionEntryId: entry?.id,
                  position: entry?.position,
                  isWatched: watchedItemsSet.has(movie.id),
                };
              });

              mediaItems.push(...movieItems);
            }
          }

          // Process series
          if (seriesIds.length > 0) {
            const { data: series } = await supabase
              .from("series")
              .select("*")
              .in("id", seriesIds);

            if (series) {
              const seriesItems: CollectionMediaItem[] = series.map(
                (series) => {
                  const entry = mediaEntries.find(
                    (e) => e.media_id === series.id && e.media_type === "tv",
                  );

                  return {
                    id: series.id,
                    title: series.title,
                    overview: series.overview,
                    posterPath: series.poster_path,
                    backdropPath: series.backdrop_path,
                    tmdbId: series.tmdb_id,
                    mediaType: "tv",
                    releaseYear: series.release_year,
                    collectionEntryId: entry?.id,
                    position: entry?.position,
                    isWatched: watchedItemsSet.has(series.id),
                  };
                },
              );

              mediaItems.push(...seriesItems);
            }
          }

          // Sort items - unwatched first, then by position
          const sortedItems = [...mediaItems].sort((a, b) => {
            // First sort by watched status
            if (a.isWatched !== b.isWatched) {
              return a.isWatched ? 1 : -1; // Unwatched items first
            }

            // Then sort by position
            if (a.position !== undefined && b.position !== undefined) {
              return a.position - b.position;
            }

            return 0;
          });

          setItems(sortedItems);
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error("Error fetching media items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaItems();
  }, [collection.id, supabase]);

  useEffect(() => {
    const fetchSharedUsers = async () => {
      if (!isShareExpanded || !isOwner) return;

      setLoadingSharedUsers(true);
      try {
        // Get all users this collection is shared with
        const { data: sharedWithData, error: sharedError } = await supabase
          .from("shared_collection")
          .select("user_id, access_level")
          .eq("collection_id", collection.id);

        if (sharedError) throw sharedError;

        if (sharedWithData && sharedWithData.length > 0) {
          // Get profile info for all shared users
          const userIds = sharedWithData.map((item) => item.user_id);

          const { data: profiles, error: profilesError } = await supabase
            .from("profiles")
            .select("id, username")
            .in("id", userIds);

          if (profilesError) throw profilesError;

          if (profiles) {
            const sharedUsersData = profiles.map((profile) => {
              const sharedData = sharedWithData.find(
                (item) => item.user_id === profile.id,
              );
              return {
                id: profile.id,
                username: profile.username,
                accessLevel: sharedData?.access_level || 0,
              };
            });

            setSharedUsers(sharedUsersData);
          }
        } else {
          setSharedUsers([]);
        }
      } catch (error) {
        console.error("Error fetching shared users:", error);
      } finally {
        setLoadingSharedUsers(false);
      }
    };

    fetchSharedUsers();
  }, [isShareExpanded, isOwner, collection.id, supabase]);

  // Functions
  const handleDeleteItem = async (item: CollectionMediaItem) => {
    if (!item.collectionEntryId) {
      console.error("Collection entry ID is missing, cannot delete item");
      return;
    }

    try {
      // Delete from medias_collections table
      const { error } = await supabase
        .from("medias_collections")
        .delete()
        .eq("id", item.id);

      if (error) {
        console.error("Error deleting item:", error);
        return;
      }

      // Update UI
      setItems(
        items.filter((i) => i.collectionEntryId !== item.collectionEntryId),
      );
      setCurrentItemCount((prev) => prev - 1);
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      // Get current user for checking
      const { data: userData } = await supabase.auth.getUser();
      const currentUserId = userData?.user?.id;

      if (!currentUserId) {
        setStatus("error");
        setMessage("You must be logged in to share collections.");
        return;
      }

      // Find the user by username (case insensitive)
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, username")
        .ilike("username", username.trim())
        .single();

      if (profileError || !profile) {
        setStatus("error");
        setMessage("User not found. Please check the username.");
        return;
      }

      // Don't allow sharing with oneself
      if (profile.id === currentUserId) {
        setStatus("error");
        setMessage("You can't share a collection with yourself.");
        return;
      }

      // Check if already shared with this user
      const { data: existingShare, error: existingError } = await supabase
        .from("shared_collection")
        .select("*")
        .eq("collection_id", collection.id)
        .eq("user_id", profile.id)
        .single();

      if (existingShare) {
        setStatus("error");
        setMessage(`Collection already shared with ${profile.username}.`);
        return;
      }

      // Add to shared_collection table
      const { error: shareError } = await supabase
        .from("shared_collection")
        .insert({
          collection_id: collection.id,
          user_id: profile.id,
          access_level: 0, // Default to View Only
        });

      if (shareError) {
        setStatus("error");
        setMessage("Failed to share collection. Please try again.");
        console.error("Share error:", shareError);
        return;
      }

      // Success
      setStatus("success");
      setMessage(`Collection shared with ${profile.username}!`);

      // Add to shared users list
      setSharedUsers([
        ...sharedUsers,
        {
          id: profile.id,
          username: profile.username,
          accessLevel: 0,
        },
      ]);

      // Reset form after delay
      setTimeout(() => {
        setUsername("");
        setStatus("idle");
        setMessage("");
        setShowShareForm(false);
      }, 3000);
    } catch (err) {
      console.error("Share error:", err);
      setStatus("error");
      setMessage("An unexpected error occurred. Please try again.");
    }
  };

  const handleAccessLevelChange = async (userId: string, newLevel: number) => {
    try {
      const { error } = await supabase
        .from("shared_collection")
        .update({ access_level: newLevel })
        .eq("collection_id", collection.id)
        .eq("user_id", userId);

      if (error) throw error;

      // Update local state
      setSharedUsers(
        sharedUsers.map((user) =>
          user.id === userId ? { ...user, accessLevel: newLevel } : user,
        ),
      );
    } catch (error) {
      console.error("Error updating access level:", error);
    }
  };

  const handleRemoveSharing = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("shared_collection")
        .delete()
        .eq("collection_id", collection.id)
        .eq("user_id", userId);

      if (error) throw error;

      // Update local state
      setSharedUsers(sharedUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error removing shared user:", error);
    }
  };

  const handleWatchToggle = (item: CollectionMediaItem) => {
    // Update the local state to reflect watched status change
    // This is called from CollectionItem when watch status changes

    // Clone the current items array
    const updatedItems = [...items];

    // Find the item that was toggled
    const index = updatedItems.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      // Update its watched status
      const newIsWatched = !updatedItems[index].isWatched;
      updatedItems[index] = {
        ...updatedItems[index],
        isWatched: newIsWatched,
      };

      // Update watched items set
      const newWatchedItems = new Set(watchedItems);
      if (newIsWatched) {
        newWatchedItems.add(item.id);
      } else {
        newWatchedItems.delete(item.id);
      }
      setWatchedItems(newWatchedItems);

      // Resort items - unwatched first, then by position
      const sortedItems = [...updatedItems].sort((a, b) => {
        // First sort by watched status
        if (a.isWatched !== b.isWatched) {
          return a.isWatched ? 1 : -1; // Unwatched items first
        }

        // Then sort by position
        if (a.position !== undefined && b.position !== undefined) {
          return a.position - b.position;
        }

        return 0;
      });

      setItems(sortedItems);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // Log drag operation details
    console.log(
      `Moving item from position ${sourceIndex} to ${destinationIndex}`,
    );

    const newItems = Array.from(items);
    const [removed] = newItems.splice(sourceIndex, 1);
    newItems.splice(destinationIndex, 0, removed);

    const unwatchedItems = newItems.filter((item) => !item.isWatched);
    const watchedItems = newItems.filter((item) => item.isWatched);

    const updatedItems = [
      ...unwatchedItems.map((item, index) => ({
        ...item,
        position: index,
      })),
      ...watchedItems.map((item, index) => ({
        ...item,
        position: unwatchedItems.length + index,
      })),
    ];

    // Log the items being updated in UI
    console.log(
      "Updated items for UI:",
      updatedItems.map((item) => ({
        id: item.id,
        title: item.title,
        position: item.position,
        collectionEntryId: item.collectionEntryId,
      })),
    );

    // Update UI state
    setItems(updatedItems);
    setIsSavingOrder(true);

    try {
      const updates = updatedItems
        .map((item) => ({
          id: item.collectionEntryId,
          position: item.position,
        }))
        .filter((item) => item.id);

      // Log the updates that will be sent to database
      console.log("Updates for database:", updates);

      // Check if any items are missing collectionEntryId
      const missingIds = updatedItems.filter((item) => !item.collectionEntryId);
      if (missingIds.length > 0) {
        console.error("Some items are missing collectionEntryId:", missingIds);
      }

      const batchSize = 20;
      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize);
        console.log(
          `Processing batch ${i / batchSize + 1}, items: ${batch.length}`,
        );

        for (const update of batch) {
          console.log(
            `Updating item with id ${update.id} to position ${update.position}`,
          );

          const { data, error } = await supabase
            .from("medias_collections")
            .update({ position: update.position })
            .eq("id", update.id);

          if (error) {
            console.error(`Error updating item ${update.id}:`, error);
          } else {
            console.log(`Successfully updated item ${update.id}`);
          }
        }
      }
    } catch (error) {
      console.error("Error saving new order:", error);
    } finally {
      setIsSavingOrder(false);
    }
  };

  return (
    <div className="my-4">
      {/* Sharing Accordion - only visible to owner */}
      {isOwner && (
        <div className="mb-4 border border-neutral-700 rounded overflow-hidden">
          <button
            onClick={() => setIsShareExpanded(!isShareExpanded)}
            className="w-full p-4 flex items-center justify-between bg-neutral-800 hover:bg-neutral-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <IconShare size={18} />
              <span className="font-medium">Sharing Options</span>
            </div>
            {isShareExpanded ? (
              <IconChevronUp size={18} />
            ) : (
              <IconChevronDown size={18} />
            )}
          </button>

          {isShareExpanded && (
            <div className="p-4 bg-neutral-800/50">
              {/* Shared Users List */}
              <div className="mb-4">
                <h3 className="font-medium mb-2">Shared With</h3>
                {loadingSharedUsers ? (
                  <p className="text-sm text-neutral-400">
                    Loading shared users...
                  </p>
                ) : sharedUsers.length === 0 ? (
                  <p className="text-sm text-neutral-400">
                    This collection isn't shared with anyone yet.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {sharedUsers.map((user) => (
                      <li
                        key={user.id}
                        className="p-3 bg-neutral-800 rounded flex items-center justify-between"
                      >
                        <span className="font-medium">{user.username}</span>
                        <div className="flex items-center gap-2">
                          <select
                            value={user.accessLevel}
                            onChange={(e) =>
                              handleAccessLevelChange(
                                user.id,
                                parseInt(e.target.value),
                              )
                            }
                            className="p-1 text-sm bg-neutral-700 border border-neutral-600 rounded focus:outline-none focus:border-lime-400"
                          >
                            <option value={0}>View Items Only</option>
                            <option value={1}>View and Add Items</option>
                            <option value={2}>
                              View, Add and Delete Items
                            </option>
                          </select>
                          <button
                            onClick={() => handleRemoveSharing(user.id)}
                            className="p-1 text-neutral-400 hover:text-red-400"
                            title="Remove sharing"
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Add New Share Form */}
              {!showShareForm ? (
                <button
                  onClick={() => setShowShareForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded transition-colors"
                >
                  <IconShare size={18} />
                  <span>Share with User</span>
                </button>
              ) : (
                <div className="p-4 bg-neutral-700 rounded">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Share Collection</h3>
                    <button
                      onClick={() => {
                        setShowShareForm(false);
                        setUsername("");
                        setStatus("idle");
                        setMessage("");
                      }}
                      className="text-neutral-400 hover:text-white"
                    >
                      <IconX size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleShare} className="flex flex-col gap-3">
                    <div>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        className="w-full p-2 bg-neutral-600 border border-neutral-500 rounded focus:outline-none focus:border-lime-400"
                        disabled={status === "loading" || status === "success"}
                      />
                    </div>

                    {message && (
                      <div
                        className={`py-2 px-3 rounded text-sm ${
                          status === "error"
                            ? "bg-red-900/20 text-red-400"
                            : status === "success"
                              ? "bg-lime-500/20 text-lime-400"
                              : ""
                        }`}
                      >
                        {message}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={
                        !username.trim() ||
                        status === "loading" ||
                        status === "success"
                      }
                      className={`p-2 rounded flex items-center justify-center gap-2 ${
                        !username.trim() ||
                        status === "loading" ||
                        status === "success"
                          ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                          : "bg-lime-500 text-black hover:bg-lime-400"
                      }`}
                    >
                      {status === "loading" ? (
                        "Sharing..."
                      ) : status === "success" ? (
                        <>
                          <IconCheck size={18} />
                          Shared!
                        </>
                      ) : (
                        "Share"
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Item Count - moved below sharing block */}
      <div className="mb-4 text-sm text-neutral-400 flex items-center justify-between">
        <p>{currentItemCount} items in collection</p>

        {isSavingOrder && (
          <p className="text-neutral-400 animate-pulse flex items-center gap-1">
            <IconArrowsSort size={14} />
            <span>Saving order...</span>
          </p>
        )}
      </div>

      {/* Collection Items */}
      <section className={`flex flex-col gap-2`}>
        {loading ? (
          // Loading state
          <div className="flex flex-col items-center justify-center p-8 text-neutral-400">
            <p>Loading collection items...</p>
          </div>
        ) : items.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center p-8 text-neutral-400 border border-dashed border-neutral-700 rounded">
            <p className="mb-4">This collection is empty</p>
            {isOwner && (
              <Link
                href={`/search`}
                className="p-2 flex justify-center items-center gap-1 border hover:border-lime-400 hover:text-lime-400 opacity-70 hover:opacity-100 transition-all duration-300 ease-in-out rounded"
              >
                <IconSquarePlus size={20} />
                <span>Add media</span>
              </Link>
            )}
          </div>
        ) : (
          // Collection items with drag and drop
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable-media-items">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                      isDragDisabled={!isOwner}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={snapshot.isDragging ? "opacity-70" : ""}
                        >
                          <CollectionItem
                            data={item}
                            collectionId={collection.id}
                            onDelete={() => handleDeleteItem(item)}
                            isOwner={isOwner}
                            onWatchToggle={() => handleWatchToggle(item)}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

        {isOwner && items.length > 0 && (
          <Link
            href={`/search`}
            className="mt-4 p-2 flex justify-center items-center gap-1 w-full border hover:border-lime-400 hover:text-lime-400 opacity-70 hover:opacity-100 transition-all duration-300 ease-in-out rounded"
          >
            <IconSquarePlus size={20} />
            <span>Add more</span>
          </Link>
        )}
      </section>
    </div>
  );
}
