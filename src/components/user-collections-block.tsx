"use client";

import React, { useState } from "react";
import { createClient } from "@/src/utils/supabase/client";

import { IconSquarePlus } from "@tabler/icons-react";
import { UserCollectionRow } from "@/src/components/user-collection-row";

import { Tables } from "@/database.types";
import { MediaCollection } from "@/src/lib/types";

type Profile = Tables<`profiles`>;

interface UserCollectionsProps {
  initialCollections: MediaCollection[];
  userProfile: Profile;
  currentUserProfile: Profile | null;
  isCurrentUser: boolean;
}

export default function UserCollectionsBlock({
  initialCollections,
  userProfile,
  currentUserProfile,
  isCurrentUser,
}: UserCollectionsProps) {
  const [collections, setCollections] =
    useState<MediaCollection[]>(initialCollections);
  const supabase = createClient();

  const createNewCollection = async () => {
    try {
      if (!currentUserProfile) return;

      // Use the user's default_collection_privacy setting
      const defaultPrivacy =
        (currentUserProfile.settings as { default_collection_privacy?: string })
          ?.default_collection_privacy || "private";
      const isPublic = defaultPrivacy === "public";

      const newCollection = {
        title: "New Collection",
        owner: currentUserProfile.id,
        is_public: isPublic,
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

  const toggleVisibility = async (id: string, isPublic: boolean) => {
    try {
      const { error } = await supabase
        .from("collections")
        .update({ is_public: isPublic })
        .eq("id", id);

      if (error) throw error;

      setCollections(
        collections.map((col) =>
          col.id === id ? { ...col, is_public: isPublic } : col,
        ),
      );
    } catch (err) {
      console.error("Error toggling collection visibility:", err);
    }
  };

  return (
    <div className="my-4">
      {isCurrentUser && (
        <button
          onClick={createNewCollection}
          className="p-2 flex justify-center items-center gap-1 w-full hover:bg-indigo-500 border hover:border-indigo-500 hover:text-neutral-900 opacity-70 hover:opacity-100 transition-all duration-300 ease-in-out rounded-sm"
        >
          <IconSquarePlus size={32} />
          <span>Create a new collection</span>
        </button>
      )}

      {collections.length === 0 ? (
        <div className="mt-8 text-center text-neutral-500">
          {isCurrentUser
            ? "You don't have any collections yet. Create one to get started!"
            : `${userProfile.username} doesn't have any public collections.`}
        </div>
      ) : (
        <section className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {collections.map((collection) => (
            <UserCollectionRow
              key={collection.id}
              collection={collection}
              onUpdate={updateCollection}
              onDelete={deleteCollection}
              onToggleVisibility={isCurrentUser ? toggleVisibility : undefined}
              currentUserId={currentUserProfile?.id}
            />
          ))}
        </section>
      )}
    </div>
  );
}
