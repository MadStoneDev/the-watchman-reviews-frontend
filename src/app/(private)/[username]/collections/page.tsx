import React from "react";
import { createClient } from "@/src/utils/supabase/server";
import BrowseNavigation from "@/src/components/browse-navigation";
import UserCollections from "@/src/components/user-collections-block";
import { MediaCollection } from "@/src/lib/types";
import { Tables } from "@/src/types/supabase";

// ISR: Revalidate every 5 minutes for cached performance
export const revalidate = 300;

// Use generated type for collection_summaries view
type CollectionSummary = Tables<"collection_summaries">;

export default async function UserCollectionsPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  // Supabase
  const supabase = await createClient();

  // Get current user
  const { data: user } = await supabase.auth.getClaims();
  const currentUserId = user?.claims.sub || null;

  // OPTIMIZATION: Parallel profile queries - fetch both profiles at once
  const [urlProfileResult, currentProfileResult] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, username, created_at, settings, last_username_change, role, avatar_path, profile_visibility",
      )
      .eq("username", username)
      .single(),
    user && currentUserId
      ? supabase
          .from("profiles")
          .select(
            "id, username, created_at, settings, last_username_change, role, avatar_path, profile_visibility",
          )
          .eq("id", currentUserId)
          .single()
      : Promise.resolve({ data: null, error: null }),
  ]);

  const urlProfile = urlProfileResult.data;
  if (!urlProfile) {
    return <div>User not found</div>;
  }

  // Check if this is the current user's profile
  const isCurrentUser = currentUserId === urlProfile?.id;
  const currentUserProfile = isCurrentUser
    ? urlProfile
    : currentProfileResult.data;

  // ✅ SERVER-SIDE: Fetch all collections data
  const collectionsData = await fetchAllCollections(
    supabase,
    urlProfile.id,
    currentUserId,
    isCurrentUser,
  );

  return (
    <>
      <BrowseNavigation
        items={[
          {
            label: `${urlProfile.id === currentUserId ? "Account" : "Profile"}`,
            href: `/${urlProfile.username}`,
          },
          {
            label: "Collections",
            href: `/${urlProfile.username}/collections`,
            textColor: `text-indigo-500`, bgColor: `bg-indigo-500`,
          },
        ]}
        profileId={urlProfile.id}
        currentUserId={currentUserId || ""}
      />

      <section className="mt-6 lg:mt-8 mb-6 transition-all duration-300 ease-in-out">
        <h1 className="max-w-3xl text-2xl sm:3xl md:text-4xl font-bold">
          {isCurrentUser ? "My Collections" : `${username}'s Collections`}
        </h1>
      </section>

      <UserCollections
        initialCollections={collectionsData}
        userProfile={urlProfile}
        currentUserProfile={currentUserProfile}
        isCurrentUser={isCurrentUser}
      />
    </>
  );
}

// ✅ OPTIMIZED: Helper function to fetch all collections
async function fetchAllCollections(
  supabase: any,
  userId: string,
  currentUserId: string | null,
  isCurrentUser: boolean,
): Promise<MediaCollection[]> {
  let allCollections: MediaCollection[] = [];

  // OPTIMIZATION: Fetch owned and shared collections in parallel
  const [ownedResult, sharedResult] = await Promise.all([
    // 1. Owned Collections
    isCurrentUser
      ? supabase
          .from("collections")
          .select("id, title, owner, is_public")
          .eq("owner", userId)
      : supabase
          .from("collections")
          .select("id, title, owner, is_public")
          .eq("owner", userId)
          .eq("is_public", true),

    // 2. Shared Collections (only for current user) - OPTIMIZATION: Use JOIN
    isCurrentUser && currentUserId
      ? supabase
          .from("shared_collection")
          .select(
            `
            collection_id,
            collections!inner (
              id,
              title,
              owner,
              is_public
            )
          `,
          )
          .eq("user_id", currentUserId)
      : Promise.resolve({ data: [] }),
  ]);

  const ownedCollections = ownedResult.data || [];
  const sharedCollections = sharedResult.data || [];

  // Get all collection IDs for fetching summaries
  const ownedIds = ownedCollections.map((c: any) => c.id);
  const sharedIds = sharedCollections.map((s: any) => s.collection_id);
  const allIds = [...ownedIds, ...sharedIds];

  if (allIds.length === 0) {
    return [];
  }

  // OPTIMIZATION: Use collection_summaries view instead of fetching all media items
  const { data: summaries } = await supabase
    .from("collection_summaries")
    .select("*")
    .in("collection_id", allIds);

  // Create maps for fast lookup
  const summaryMap = new Map<string, CollectionSummary>(
    (summaries || []).map((s: any) => [s.collection_id!, s]),
  );

  // Map owned collections
  allCollections = ownedCollections.map((collection: any) => {
    const summary = summaryMap.get(collection.id);
    return {
      id: collection.id,
      title: collection.title || "Untitled Collection",
      owner: collection.owner,
      is_public: collection.is_public,
      shared: false,
      backdrop_path: summary?.first_media_type
        ? null // Will be fetched below
        : null,
      item_count: summary?.item_count || 0,
      _firstMediaId: summary?.first_media_id,
      _firstMediaType: summary?.first_media_type,
    };
  });

  // Map shared collections - OPTIMIZATION: Already have collection data from JOIN
  const sharedCollectionsData = sharedCollections.map((item: any) => {
    const collection = item.collections;
    const summary = summaryMap.get(item.collection_id);
    return {
      id: collection.id,
      title: collection.title || "Untitled Shared Collection",
      owner: collection.owner,
      is_public: collection.is_public,
      shared: true,
      backdrop_path: summary?.first_media_type ? null : null,
      item_count: summary?.item_count || 0,
      _firstMediaId: summary?.first_media_id,
      _firstMediaType: summary?.first_media_type,
    };
  });

  allCollections = [...allCollections, ...sharedCollectionsData];

  // OPTIMIZATION: Fetch backdrops only for first media items
  const posterMap = await fetchFirstPosters(supabase, allCollections);

  // Add backdrops to collections
  return allCollections.map((col) => ({
    ...col,
    backdrop_path: posterMap.get(col.id) || null,
  }));
}

// ✅ OPTIMIZED: Fetch only first poster for each collection
async function fetchFirstPosters(
  supabase: any,
  collections: any[],
): Promise<Map<string, string>> {
  const posterMap = new Map<string, string>();

  // Separate by media type
  const movieIds: string[] = [];
  const seriesIds: string[] = [];
  const mediaTypeMap = new Map<
    string,
    { collectionId: string; type: string }
  >();

  collections.forEach((col) => {
    if (!col._firstMediaId || !col._firstMediaType) return;

    if (col._firstMediaType === "movie") {
      movieIds.push(col._firstMediaId);
      mediaTypeMap.set(col._firstMediaId, {
        collectionId: col.id,
        type: "movie",
      });
    } else if (col._firstMediaType === "tv") {
      seriesIds.push(col._firstMediaId);
      mediaTypeMap.set(col._firstMediaId, {
        collectionId: col.id,
        type: "tv",
      });
    }
  });

  // OPTIMIZATION: Fetch movie and series backdrops in parallel
  const [moviesResult, seriesResult] = await Promise.all([
    movieIds.length > 0
      ? supabase.from("movies").select("id, backdrop_path").in("id", movieIds)
      : Promise.resolve({ data: [] }),
    seriesIds.length > 0
      ? supabase.from("series").select("id, backdrop_path").in("id", seriesIds)
      : Promise.resolve({ data: [] }),
  ]);

  // Map backdrops to collections
  moviesResult.data?.forEach((movie: any) => {
    const mediaInfo = mediaTypeMap.get(movie.id);
    if (mediaInfo && movie.backdrop_path) {
      posterMap.set(mediaInfo.collectionId, movie.backdrop_path);
    }
  });

  seriesResult.data?.forEach((show: any) => {
    const mediaInfo = mediaTypeMap.get(show.id);
    if (mediaInfo && show.backdrop_path) {
      posterMap.set(mediaInfo.collectionId, show.backdrop_path);
    }
  });

  return posterMap;
}
