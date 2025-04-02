"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { createClient } from "@/src/utils/supabase/client";

import {
  IconMovie,
  IconPencil,
  IconSquarePlus,
  IconCheck,
  IconX,
  IconTrash,
  IconCloud,
} from "@tabler/icons-react";

type Profile = {
  id: string;
  username: string;
  created_at: string;
  settings: any | null;
};

type MediaCollection = {
  id: string;
  title: string;
  isOwner: boolean;
  is_public: boolean;
  shared?: boolean;
};

const CollectionItem = ({
  collection,
  onUpdate,
  onDelete,
  isCurrentUser,
}: {
  collection: MediaCollection;
  onUpdate: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
  isCurrentUser: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(collection.title);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Only allow editing if the user is the owner AND the current user
  const canEdit = collection.isOwner && isCurrentUser;

  const handleEdit = () => {
    if (!canEdit) return;
    setEditTitle(collection.title);
    setIsEditing(true);
    setError("");
  };

  const handleDelete = () => {
    if (!canEdit) return;
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(collection.id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);

    // Validate input - only letters, numbers, hyphens, and spaces
    if (!/^[a-zA-Z0-9\- ]*$/.test(e.target.value)) {
      setError("Only letters, numbers, hyphens, and spaces are allowed");
    } else {
      setError("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !error) {
      confirmEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const confirmEdit = () => {
    if (editTitle.trim() && !error) {
      onUpdate(collection.id, editTitle.trim());
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditTitle(collection.title);
    setError("");
  };

  return (
    <article
      className={`flex items-center gap-2 p-2 ${
        isEditing || showDeleteConfirm ? "bg-neutral-100" : ""
      } rounded-md transition-all duration-300 ease-in-out`}
    >
      {showDeleteConfirm ? (
        <>
          <div className="flex-grow px-2 text-red-600">
            <p>Are you sure you want to delete "{collection.title}"?</p>
          </div>
          <div className={`flex gap-4`}>
            <button
              onClick={confirmDelete}
              className="p-1 text-rose-600 hover:bg-rose-100 rounded"
            >
              <IconCheck size={20} />
            </button>
            <button
              onClick={cancelDelete}
              className="p-1 text-neutral-600 hover:bg-neutral-100 rounded"
            >
              <IconX size={20} />
            </button>
          </div>
        </>
      ) : (
        <>
          {collection.shared ? (
            <IconCloud className="text-neutral-300 transition-all duration-300 ease-in-out" />
          ) : (
            <IconMovie
              className={`${
                isEditing ? "text-neutral-600" : "text-neutral-300"
              } transition-all duration-300 ease-in-out`}
            />
          )}

          {isEditing ? (
            <>
              <div className="flex-grow">
                <input
                  type="text"
                  value={editTitle}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className={`w-full p-1 border ${
                    error ? "border-red-500" : "border-neutral-300"
                  } rounded focus:outline-none focus:border-lime-400`}
                  autoFocus
                />
              </div>
              <div className={`flex items-center gap-0`}>
                <button
                  onClick={confirmEdit}
                  disabled={!!error || !editTitle.trim()}
                  className={`p-1 text-lime-600 ${
                    !!error || !editTitle.trim()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-lime-200/70"
                  } rounded`}
                >
                  <IconCheck size={20} />
                </button>
                <button
                  onClick={cancelEdit}
                  className="p-1 text-rose-500 hover:bg-rose-100 rounded"
                >
                  <IconX size={20} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href={`/collections/${collection.id}`}
                className={`flex-grow hover:text-lime-400 transition-all duration-300 ease-in-out`}
              >
                {collection.title}
              </Link>
              {canEdit && (
                <>
                  <button
                    onClick={handleEdit}
                    className="p-1 text-neutral-600 hover:bg-neutral-100 hover:text-lime-400 rounded transition-colors"
                  >
                    <IconPencil size={20} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-1 text-neutral-600 hover:bg-neutral-100 hover:text-red-500 rounded transition-colors"
                  >
                    <IconTrash size={20} />
                  </button>
                </>
              )}
            </>
          )}
        </>
      )}
    </article>
  );
};

interface UserCollectionsBlockProps {
  urlProfile: Profile;
  currentUserProfile: Profile | null;
  isCurrentUser: boolean;
}

export default function UserCollectionsBlock({
  urlProfile,
  currentUserProfile,
  isCurrentUser,
}: UserCollectionsBlockProps) {
  const [collections, setCollections] = useState<MediaCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Fetch collections when component mounts
  useEffect(() => {
    async function fetchCollections() {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch owned collections based on user criteria
        let ownedCollectionsQuery = supabase.from("collections").select("*");

        if (isCurrentUser) {
          // If current user, get all their collections
          ownedCollectionsQuery = ownedCollectionsQuery.eq(
            "owner",
            urlProfile.id,
          );
        } else {
          // If not current user, only get their public collections
          ownedCollectionsQuery = ownedCollectionsQuery
            .eq("owner", urlProfile.id)
            .eq("is_public", true);
        }

        const { data: ownedCollections, error: ownedError } =
          await ownedCollectionsQuery;

        if (ownedError) {
          throw new Error(ownedError.message);
        }

        // Transform owned collections
        const formattedOwnedCollections = (ownedCollections || []).map(
          (collection) => ({
            id: collection.id,
            title: collection.title || "Untitled Collection",
            isOwner: true,
            is_public: collection.is_public,
            shared: false,
          }),
        );

        let allCollections = [...formattedOwnedCollections];

        // 2. Fetch shared collections if this is the current user
        if (isCurrentUser && currentUserProfile) {
          // First get the shared collection IDs for this user
          const { data: sharedData, error: sharedError } = await supabase
            .from("shared_collection")
            .select("collection_id")
            .eq("user_id", currentUserProfile.id);

          if (sharedError) {
            throw new Error(sharedError.message);
          }

          // Extract the collection IDs
          const sharedCollectionIds =
            sharedData?.map((item) => item.collection_id) || [];

          // If there are any shared collections
          if (sharedCollectionIds.length > 0) {
            // Fetch the actual collection data
            const { data: sharedCollections, error: collectionsError } =
              await supabase
                .from("collections")
                .select("*")
                .in("id", sharedCollectionIds);

            if (collectionsError) {
              throw new Error(collectionsError.message);
            }

            // Transform shared collections data
            const formattedSharedCollections = (sharedCollections || []).map(
              (collection) => ({
                id: collection.id,
                title: collection.title || "Untitled Shared Collection",
                isOwner: false,
                is_public: collection.is_public,
                shared: true,
              }),
            );

            allCollections = [...allCollections, ...formattedSharedCollections];
          }
        }

        setCollections(allCollections);
      } catch (err) {
        console.error("Error fetching collections:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load collections",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, [urlProfile.id, isCurrentUser, currentUserProfile, supabase]);

  const updateCollection = async (id: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from("collections")
        .update({ title: newTitle })
        .eq("id", id);

      if (error) throw error;

      // Update local state if successful
      setCollections(
        collections.map((col) =>
          col.id === id ? { ...col, title: newTitle } : col,
        ),
      );
    } catch (err) {
      console.error("Error updating collection:", err);
      // You could add a toast notification here
    }
  };

  const deleteCollection = async (id: string) => {
    try {
      // First, delete any shared_collection references
      await supabase.from("shared_collection").delete().eq("collection_id", id);

      // Then delete any medias_collections entries (using new table)
      await supabase
        .from("medias_collections")
        .delete()
        .eq("collection_id", id);

      // Finally delete the collection itself
      const { error } = await supabase
        .from("collections")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Update local state if successful
      setCollections(collections.filter((col) => col.id !== id));
    } catch (err) {
      console.error("Error deleting collection:", err);
      // You could add a toast notification here
    }
  };

  const createNewCollection = async () => {
    try {
      if (!currentUserProfile) return;

      const newCollection = {
        title: "New Collection",
        owner: currentUserProfile.id,
        is_public: false,
      };

      const { data, error } = await supabase
        .from("collections")
        .insert([newCollection])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        // Add new collection to state
        setCollections([
          ...collections,
          {
            id: data[0].id,
            title: data[0].title || "New Collection",
            isOwner: true,
            is_public: data[0].is_public,
            shared: false,
          },
        ]);
      }
    } catch (err) {
      console.error("Error creating collection:", err);
      // You could add a toast notification here
    }
  };

  if (loading) {
    return <div className="my-4">Loading collections...</div>;
  }

  if (error) {
    return <div className="my-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="my-4">
      {isCurrentUser && (
        <button
          onClick={createNewCollection}
          className="p-2 flex justify-center items-center gap-1 w-full border hover:border-lime-400 hover:text-lime-400 opacity-70 hover:opacity-100 transition-all duration-300 ease-in-out rounded"
        >
          <IconSquarePlus size={32} />
          <span>Create a new collection</span>
        </button>
      )}

      {collections.length === 0 ? (
        <div className="mt-8 text-center text-neutral-500">
          {isCurrentUser
            ? "You don't have any collections yet. Create one to get started!"
            : "This user doesn't have any public collections."}
        </div>
      ) : (
        <section className="my-4 space-y-2">
          {collections.map((collection) => (
            <CollectionItem
              key={collection.id}
              collection={collection}
              onUpdate={updateCollection}
              onDelete={deleteCollection}
              isCurrentUser={isCurrentUser}
            />
          ))}
        </section>
      )}
    </div>
  );
}
