import React from "react";
import { notFound } from "next/navigation";

import { createClient } from "@/src/utils/supabase/server";

import MediasCollection from "@/src/components/medias-collection";
import BrowseNavigation from "@/src/components/browse-navigation";

import { MediaItem } from "@/src/lib/types";

const fetchCollection = async (id: string) => {
  // Supabase
  const supabase = await createClient();

  const { data: collection } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .single();

  return collection;
};

// This function will only be used for initial SSR rendering
// The client component will handle further data fetching
const fetchInitialMedia = async (id: string) => {
  // Supabase
  const supabase = await createClient();

  const { data: mediaEntries } = await supabase
    .from("medias_collections")
    .select("*")
    .eq("collection_id", id)
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  if (mediaEntries && mediaEntries.length > 0) {
    const movieIds = mediaEntries
      .filter((item) => item.media_type === "movie")
      .map((item) => item.media_id);
    const seriesIds = mediaEntries
      .filter((item) => item.media_type === "series")
      .map((item) => item.media_id);

    const mediaItems: MediaItem[] = [];

    if (movieIds.length > 0) {
      const { data: movies } = await supabase
        .from("movies")
        .select("*")
        .in("id", movieIds);

      if (movies) {
        const movieItems: MediaItem[] = movies.map((movie) => {
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
            collectionEntryId: entry?.id, // Add this for deletion reference
            mediaId: movie.id,
          };
        });

        mediaItems.push(...movieItems);
      }
    }

    if (seriesIds.length > 0) {
      const { data: series } = await supabase
        .from("series")
        .select("*")
        .in("id", seriesIds);

      if (series) {
        const seriesItems: MediaItem[] = series.map((series) => {
          const entry = mediaEntries.find(
            (e) => e.media_id === series.id && e.media_type === "series",
          );

          return {
            id: series.id,
            title: series.title,
            overview: series.overview,
            posterPath: series.poster_path,
            backdropPath: series.backdrop_path,
            tmdbId: series.tmdb_id,
            mediaType: "series",
            releaseYear: series.release_year,
            collectionEntryId: entry?.id, // Add this for deletion reference
            mediaId: series.id,
          };
        });

        mediaItems.push(...seriesItems);
      }
    }

    return mediaItems;
  }

  return [];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const collection = await fetchCollection(id);

  if (!collection) {
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

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Supabase
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();

  let userId = null;

  if (user && user.user) {
    userId = user.user.id;
  }

  // Check if collection exists
  const collection = await fetchCollection(id);

  if (!collection) {
    notFound();
  }

  // Fetch initial media for SSR
  // This provides better initial page load and SEO
  const initialMedias = await fetchInitialMedia(id);

  let profile = null;

  if (user && user.user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.user.id)
      .single();
    profile = data;
  }

  const isOwner = collection.owner === userId;
  let accessType: "owner" | "shared" | "public" | "none" = "owner";

  if (!isOwner) {
    const isPublic = collection.is_public;
    accessType = isPublic ? "public" : "none";

    const { data: sharedWithUser } = await supabase
      .from("shared_collection")
      .select("id")
      .eq("collection_id", id)
      .eq("user_id", userId);

    if (sharedWithUser && sharedWithUser.length > 0) accessType = "shared";

    if (accessType === "none") {
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

  const { count: mediaCount, error: countError } = await supabase
    .from("medias_collections")
    .select("*", { count: "exact", head: true })
    .eq("collection_id", id);

  const itemCount = mediaCount || 0;

  return (
    <>
      {user && profile && (
        <BrowseNavigation
          items={[
            { label: "Account", href: `/${profile.username}` },
            { label: "Collections", href: `/${profile.username}/collections` },
          ]}
        />
      )}
      <div
        className={`mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4`}
      >
        <h1 className={`text-2xl sm:3xl md:text-4xl font-bold`}>
          {collection.title}
        </h1>
      </div>

      <div className="mt-4 text-sm text-neutral-400 flex items-center gap-2">
        <p>{itemCount} items in collection</p>

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

      <MediasCollection
        collection={collection}
        initialMedias={initialMedias} // Pass as initialMedias instead of medias
        isOwner={isOwner}
      />
    </>
  );
}
