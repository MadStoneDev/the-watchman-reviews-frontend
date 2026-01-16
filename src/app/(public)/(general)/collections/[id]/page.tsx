import React from "react";
import { notFound } from "next/navigation";

import { createClient } from "@/src/utils/supabase/server";

import MediasCollection from "@/src/components/medias-collection";
import BrowseNavigation from "@/src/components/browse-navigation";

import { MediaItem } from "@/src/lib/types";

const fetchCollection = async (id: string) => {
  const supabase = await createClient();

  const { data: collection } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .single();

  return collection;
};

// ✅ OPTIMIZED: Single query with conditional logic
const fetchInitialMedia = async (id: string): Promise<MediaItem[]> => {
  const supabase = await createClient();

  // Get entries with position info
  const { data: mediaEntries } = await supabase
    .from("medias_collections")
    .select("id, media_id, media_type, position")
    .eq("collection_id", id)
    .order("position", { ascending: true });

  if (!mediaEntries || mediaEntries.length === 0) {
    return [];
  }

  // Separate and fetch in parallel
  const movieIds = mediaEntries
    .filter((item) => item.media_type === "movie")
    .map((item) => item.media_id);
  const seriesIds = mediaEntries
    .filter((item) => item.media_type === "tv")
    .map((item) => item.media_id);

  const [moviesResult, seriesResult] = await Promise.all([
    movieIds.length > 0
      ? supabase
          .from("movies")
          .select("id, title, overview, poster_path, backdrop_path, tmdb_id, release_year")
          .in("id", movieIds)
      : Promise.resolve({ data: null }),
    seriesIds.length > 0
      ? supabase
          .from("series")
          .select("id, title, overview, poster_path, backdrop_path, tmdb_id, release_year")
          .in("id", seriesIds)
      : Promise.resolve({ data: null }),
  ]);

  // Create lookup maps for O(1) access
  const movieMap = new Map(
    moviesResult.data?.map((m) => [m.id, m]) || []
  );
  const seriesMap = new Map(
    seriesResult.data?.map((s) => [s.id, s]) || []
  );

  // Build media items in order
  const mediaItems = mediaEntries.map((entry): MediaItem | null => {
    if (entry.media_type === "movie") {
      const movie = movieMap.get(entry.media_id);
      if (!movie) return null;

      return {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        tmdbId: movie.tmdb_id,
        mediaType: "movie",
        releaseYear: movie.release_year,
        collectionEntryId: entry.id,
        mediaId: movie.id,
        position: entry.position ?? 0,
      };
    } else {
      const series = seriesMap.get(entry.media_id);
      if (!series) return null;

      return {
        id: series.id,
        title: series.title,
        overview: series.overview,
        posterPath: series.poster_path,
        backdropPath: series.backdrop_path,
        tmdbId: series.tmdb_id,
        mediaType: "tv",
        releaseYear: series.release_year,
        collectionEntryId: entry.id,
        mediaId: series.id,
        position: entry.position ?? 0,
      };
    }
  }).filter((item): item is MediaItem => item !== null);

  return mediaItems;
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
      title: `Collection | JustReel`,
      description: `Collections on JustReel`,
    };
  }

  return {
    title: `${collection.title} | JustReel`,
    description: `${collection.title} collection on JustReel`,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // ✅ OPTIMIZED: Fetch everything in parallel
  const [collection, userResult, initialMedias, mediaCountResult] =
    await Promise.all([
      fetchCollection(id),
      supabase.auth.getClaims(),
      fetchInitialMedia(id),
      supabase
        .from("medias_collections")
        .select("*", { count: "exact", head: true })
        .eq("collection_id", id),
    ]);

  if (!collection) {
    notFound();
  }

  const user = userResult.data;
  const userId = user?.claims?.sub || null;
  const itemCount = mediaCountResult.count || 0;

  // Fetch profile and access checks in parallel
  let profile = null;
  let accessType: "owner" | "shared" | "public" | "none" = "none";
  const isOwner = collection.owner === userId;

  if (isOwner) {
    accessType = "owner";
  }

  const accessChecks = [];

  if (user && userId) {
    accessChecks.push(
      supabase.from("profiles").select("*").eq("id", userId).single(),
    );
  }

  if (!isOwner && userId) {
    accessChecks.push(
      supabase
        .from("shared_collection")
        .select("id")
        .eq("collection_id", id)
        .eq("user_id", userId)
        .single(),
    );
  }

  if (accessChecks.length > 0) {
    const results = await Promise.all(accessChecks);

    if (user && userId) {
      profile = results[0]?.data;
    }

    if (!isOwner) {
      const isPublic = collection.is_public;
      accessType = isPublic ? "public" : "none";

      if (!isOwner && userId && results.length > 1) {
        const sharedWithUser = results[1]?.data;
        if (sharedWithUser) accessType = "shared";
      }
    }
  } else if (!isOwner) {
    accessType = collection.is_public ? "public" : "none";
  }

  if (accessType === "none") {
    return (
      <div className="grow flex flex-col items-center justify-center px-4 text-center">
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

  return (
    <>
      {user && profile && (
        <BrowseNavigation
          items={[
            { label: "Account", href: `/${profile.username}` },
            {
              label: "Collections",
              href: `/${profile.username}/collections`,
              textColor: `hover:text-indigo-500`, bgColor: `bg-indigo-500`,
            },
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
        initialMedias={initialMedias}
        itemCount={itemCount}
        isOwner={isOwner}
      />
    </>
  );
}
