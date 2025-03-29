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

  // Check if user is authenticated
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user || !user.user) {
    redirect("/auth/portal");
  }

  const userId = user.user.id;

  // Check if collection exists
  const { data: collection, error: collectionError } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .single();

  if (collectionError || !collection) {
    console.error("Collection not found:", collectionError);
    notFound();
  }

  // Check if user has access (owner or shared)
  const isOwner = collection.user_id === userId;

  // For quick testing, comment out this block to allow access to all collections
  // regardless of ownership status
  if (!isOwner) {
    // Check if collection is shared with user
    try {
      const { data: sharedAccess, error: sharedError } = await supabase
        .from("shared_collection")
        .select("*")
        .eq("collection_id", id)
        .eq("user_id", userId);

      if (sharedError) {
        console.error("Shared access check error:", sharedError);
      }

      // Properly handle null case and check array length
      const hasAccess = !!sharedAccess && sharedAccess.length > 0;

      if (!hasAccess) {
        console.log(
          "No shared access found for user",
          userId,
          "on collection",
          id,
        );
        notFound();
      }
    } catch (err) {
      console.error("Error checking shared access:", err);
      notFound();
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
        {!isOwner && (
          <span className="px-2 py-0.5 bg-neutral-700 text-xs rounded-full">
            Shared with you
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
