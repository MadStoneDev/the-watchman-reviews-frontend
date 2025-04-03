"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/src/utils/supabase/client";

import { IconSquarePlus } from "@tabler/icons-react";

import { Tables } from "@/database.types";
import { MediaCollection } from "@/src/lib/types";
import { UserCollectionRow } from "@/src/components/user-collection-row";

type Profile = Tables<`profiles`>;

interface UserCollectionsProps {
  userProfile: Profile;
  currentUserProfile: Profile | null;
  isCurrentUser: boolean;
}

export default function UserCollectionsBlock({
  userProfile,
  currentUserProfile,
  isCurrentUser,
}: UserCollectionsProps) {
  // States
  const [collections, setCollections] = useState<MediaCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Supabase
  const supabase = createClient();

  // Functions
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
        const newCollection: MediaCollection = {
          id: data[0].id,
          title: data[0].title || "New Collection",
          owner: data[0].owner,
          is_public: data[0].is_public,
          shared: false,
        };

        setCollections([...collections, newCollection]);
      }
    } catch (err) {
      console.error("Error creating collection:", err);
    }
  };

  const updateCollection = async (id: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from("collections")
        .update({ title: newTitle })
        .eq("id", id);

      if (error) throw error;

      setCollections(
        collections.map((col) =>
          col.id === id ? { ...col, title: newTitle } : col,
        ),
      );
    } catch (err) {
      console.error("Error updating collection:", err);
    }
  };

  const deleteCollection = async (id: string) => {
    try {
      await supabase.from("shared_collection").delete().eq("collection_id", id);

      await supabase
        .from("medias_collections")
        .delete()
        .eq("collection_id", id);

      const { error } = await supabase
        .from("collections")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setCollections(collections.filter((col) => col.id !== id));
    } catch (err) {
      console.error("Error deleting collection:", err);
    }
  };

  // Effects
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        setError(null);

        let allCollections: MediaCollection[] = [];

        // 1. Owned Collections
        let ownedCollectionsQuery;

        if (isCurrentUser) {
          ownedCollectionsQuery = supabase
            .from("collections")
            .select("*")
            .eq("owner", userProfile.id);
        } else {
          ownedCollectionsQuery = supabase
            .from("collections")
            .select("*")
            .eq("owner", userProfile.id)
            .eq("is_public", true);
        }

        const { data: ownedCollections, error: ownedError } =
          await ownedCollectionsQuery;

        if (ownedError) {
          throw new Error(ownedError.message);
        }

        const cleanOwnedCollections: MediaCollection[] = (
          ownedCollections || []
        ).map((collection) => ({
          id: collection.id,
          title: collection.title || "Untitled Collection",
          owner: collection.owner,
          is_public: collection.is_public,
          shared: false,
        }));

        allCollections = [...cleanOwnedCollections];

        // 2. If this is the current user, fetch shared collections
        if (isCurrentUser && currentUserProfile) {
          const { data: sharedData, error: sharedError } = await supabase
            .from("shared_collection")
            .select("collection_id")
            .eq("user_id", currentUserProfile.id);

          if (sharedError) {
            throw new Error(sharedError.message);
          }

          const sharedCollectionIds =
            sharedData?.map((item) => item.collection_id) || [];

          if (sharedCollectionIds.length > 0) {
            const { data: sharedCollections, error: collectionsError } =
              await supabase
                .from("collections")
                .select("*")
                .in("id", sharedCollectionIds);

            if (collectionsError) {
              throw new Error(collectionsError.message);
            }

            const cleanSharedCollections: MediaCollection[] = (
              sharedCollections || []
            ).map((collection) => ({
              id: collection.id,
              title: collection.title || "Untitled Shared Collection",
              owner: collection.owner,
              is_public: collection.is_public,
              shared: true,
            }));

            allCollections = [...allCollections, ...cleanSharedCollections];
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
    };

    fetchCollections();
  }, [userProfile.id, isCurrentUser, currentUserProfile, supabase]);

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
          className="p-2 flex justify-center items-center gap-1 w-full hover:bg-lime-400 border hover:border-lime-400 hover:text-neutral-900 opacity-70 hover:opacity-100 transition-all duration-300 ease-in-out rounded"
        >
          <IconSquarePlus size={32} />
          <span>Create a new collection</span>
        </button>
      )}

      {collections.length === 0 ? (
        <div className="mt-8 text-center text-neutral-500">
          {isCurrentUser
            ? "You don't have any collections yet. Create one to get started!"
            : "This user doesn't have a ny public collections."}
        </div>
      ) : (
        <section className="my-4 space-y-2">
          {collections.map((collection) => (
            <UserCollectionRow
              key={collection.id}
              collection={collection}
              onUpdate={updateCollection}
              onDelete={deleteCollection}
              currentUserId={currentUserProfile?.id}
            />
          ))}
        </section>
      )}
    </div>
  );
}
