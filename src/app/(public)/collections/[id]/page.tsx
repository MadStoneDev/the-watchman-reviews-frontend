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

  // Check if collection exists and user has access
  const { data: collection, error: collectionError } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .single();

  if (collectionError || !collection) {
    notFound();
  }

  // Get all media items in this collection
  const { data: mediaItems, error: mediaError } = await supabase
    .from("media_collection")
    .select("*")
    .eq("collection_id", id);

  if (mediaError) {
    // Handle error gracefully
    console.error("Error fetching media items:", mediaError);
  }

  return (
    <section
      className={`mt-14 lg:mt-20 mb-6 transition-all duration-300 ease-in-out`}
    >
      <h1 className={`max-w-64 text-2xl sm:3xl md:text-4xl font-bold`}>
        {collection.title}
      </h1>

      <div className="mt-4 text-sm text-neutral-400">
        <p>{mediaItems?.length || 0} items in collection</p>
      </div>

      <CollectionBlock initialItems={mediaItems || []} collectionId={id} />
    </section>
  );
}
