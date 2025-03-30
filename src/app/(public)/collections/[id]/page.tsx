import React from "react";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import CollectionBlock from "@/src/components/collections-block";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();

  // Get the collection details
  const { data: collection, error: collectionError } = await supabase
    .from("collections")
    .select("title")
    .eq("id", id)
    .single();

  if (collectionError || !collection) {
    return {
      title: `Collection | The Watchman Reviews`,
      description: `Collections on The Watchman Reviews`,
    };
  }

  return {
    title: `${collection.title} | The Watchman Reviews`,
    description: `${collection.title} collection on The Watchman Reviews`,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();

  let userId = null;

  if (user && user.user) {
    userId = user.user.id;
  }

  // Check if collection exists
  const { data: collection, error: collectionError } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .single();

  if (collectionError || !collection) {
    notFound();
  }

  const isOwner = collection.owner === userId;
  // Determine access type for UI
  let accessType: "owner" | "shared" | "public" = "owner";

  if (!isOwner) {
    const isPublic = collection.is_public;

    const { data: sharedWithUser } = await supabase
      .from("shared_collection")
      .select("id")
      .eq("collection_id", id)
      .eq("user_id", userId);

    accessType =
      sharedWithUser && sharedWithUser.length > 0 ? "shared" : "public";

    if (!isPublic && (!sharedWithUser || sharedWithUser.length === 0)) {
      return (
        <div className="flex-grow flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Thou Shalt Not Pass!</h1>
          <p className="text-2xl font-semibold mb-2">
            Did someone send you here?
          </p>
          <p className="text-neutral-400 mb-8">
            If they did, they didn't give you a key.
          </p>
        </div>
      );
    }
  }

  // Get all media items in this collection
  const { data: mediaItems, error: mediaError } = await supabase
    .from("media_collection")
    .select("*")
    .eq("collection_id", id);

  if (mediaError) {
    console.error("Error fetching media items:", mediaError);
  }

  return (
    <section
      className={`mt-14 lg:mt-20 mb-6 transition-all duration-300 ease-in-out`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className={`max-w-64 text-2xl sm:3xl md:text-4xl font-bold`}>
          {collection.title}
        </h1>
      </div>

      <div className="mt-4 text-sm text-neutral-400 flex items-center gap-2">
        <p>{mediaItems?.length || 0} items in collection</p>

        {/* Show appropriate badge based on access type */}
        {accessType === "shared" && (
          <span className="px-2 py-0.5 bg-neutral-700 text-xs rounded-full">
            Shared with you
          </span>
        )}
        {accessType === "public" && (
          <span className="px-2 py-0.5 bg-blue-800/50 text-blue-400 text-xs rounded-full">
            Public collection
          </span>
        )}
      </div>

      <CollectionBlock
        initialItems={mediaItems || []}
        collectionId={id}
        isOwner={isOwner}
      />
    </section>
  );
}
