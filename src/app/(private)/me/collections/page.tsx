import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import BrowseNavigation from "@/src/components/browse-navigation";
import UserCollections from "@/src/components/user-collections-block";
import { MediaCollection } from "@/src/lib/types";
import { Tables } from "@/src/types/supabase";

// ISR: Revalidate every 5 minutes for cached performance
export const revalidate = 300;

// Use generated type for collection_summaries view
type CollectionSummary = Tables<"collection_summaries">;

export default async function MyCollectionsPage() {
  const supabase = await createClient();

  // Get current user
  const { data: user, error } = await supabase.auth.getClaims();

  if (error || !user) {
    redirect("/auth/portal");
  }

  const currentUserId = user.claims.sub;

  // Get current user's profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "id, username, created_at, settings, last_username_change, role, avatar_path, profile_visibility",
    )
    .eq("id", currentUserId)
    .single();

  if (profileError || !profile) {
    redirect("/auth/portal");
  }

  // Fetch all collections data
  const collectionsData = await fetchAllCollections(supabase, currentUserId);

  return (
    <>
      <BrowseNavigation
        items={[
          {
            label: "Account",
            href: "/me",
          },
          {
            label: "Collections",
            href: "/me/collections",
            textColor: "hover:text-indigo-500",
            bgColor: "bg-indigo-500",
          },
        ]}
        profileId={profile.id}
        currentUserId={currentUserId}
      />

      <section className="mt-6 lg:mt-8 mb-6 transition-all duration-300 ease-in-out">
        <h1 className="max-w-3xl text-2xl sm:3xl md:text-4xl font-bold">
          My Collections
        </h1>
      </section>

      <UserCollections
        initialCollections={collectionsData}
        userProfile={profile}
        currentUserProfile={profile}
        isCurrentUser={true}
      />
    </>
  );
}

// Helper function to fetch all collections
async function fetchAllCollections(
  supabase: any,
  userId: string,
): Promise<MediaCollection[]> {
  let allCollections: MediaCollection[] = [];

  // Fetch owned and shared collections in parallel
  const [ownedResult, sharedResult] = await Promise.all([
    supabase
      .from("collections")
      .select("id, title, owner, is_public")
      .eq("owner", userId),
    supabase
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
      .eq("user_id", userId),
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

  // Use collection_summaries view
  const { data: summaries } = await supabase
    .from("collection_summaries")
    .select("*")
    .in("collection_id", allIds);

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
      backdrop_path: null,
      item_count: summary?.item_count || 0,
      _firstMediaId: summary?.first_media_id,
      _firstMediaType: summary?.first_media_type,
    };
  });

  // Map shared collections
  const sharedCollectionsData = sharedCollections.map((item: any) => {
    const collection = item.collections;
    const summary = summaryMap.get(item.collection_id);
    return {
      id: collection.id,
      title: collection.title || "Untitled Shared Collection",
      owner: collection.owner,
      is_public: collection.is_public,
      shared: true,
      backdrop_path: null,
      item_count: summary?.item_count || 0,
      _firstMediaId: summary?.first_media_id,
      _firstMediaType: summary?.first_media_type,
    };
  });

  allCollections = [...allCollections, ...sharedCollectionsData];

  // Fetch backdrops
  const posterMap = await fetchFirstPosters(supabase, allCollections);

  return allCollections.map((col) => ({
    ...col,
    backdrop_path: posterMap.get(col.id) || null,
  }));
}

async function fetchFirstPosters(
  supabase: any,
  collections: any[],
): Promise<Map<string, string>> {
  const posterMap = new Map<string, string>();
  const movieIds: string[] = [];
  const seriesIds: string[] = [];
  const mediaTypeMap = new Map<string, { collectionId: string; type: string }>();

  collections.forEach((col) => {
    if (!col._firstMediaId || !col._firstMediaType) return;

    if (col._firstMediaType === "movie") {
      movieIds.push(col._firstMediaId);
      mediaTypeMap.set(col._firstMediaId, { collectionId: col.id, type: "movie" });
    } else if (col._firstMediaType === "tv") {
      seriesIds.push(col._firstMediaId);
      mediaTypeMap.set(col._firstMediaId, { collectionId: col.id, type: "tv" });
    }
  });

  const [moviesResult, seriesResult] = await Promise.all([
    movieIds.length > 0
      ? supabase.from("movies").select("id, backdrop_path").in("id", movieIds)
      : Promise.resolve({ data: [] }),
    seriesIds.length > 0
      ? supabase.from("series").select("id, backdrop_path").in("id", seriesIds)
      : Promise.resolve({ data: [] }),
  ]);

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
