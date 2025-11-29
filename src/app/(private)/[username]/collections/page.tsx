import React from "react";
import { createClient } from "@/src/utils/supabase/server";
import BrowseNavigation from "@/src/components/browse-navigation";
import UserCollections from "@/src/components/user-collections-block";
import { MediaCollection } from "@/src/lib/types";

export default async function UserCollectionsPage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;

  // Supabase
  const supabase = await createClient();

  // Get current user
  const { data: user } = await supabase.auth.getClaims();
  const currentUserId = user?.claims.sub || null;

  // Get profile for the username in the URL
  const { data: urlProfile } = await supabase
    .from("profiles")
    .select()
    .eq("username", username)
    .single();

  if (!urlProfile) {
    return <div>User not found</div>;
  }

  // Check if this is the current user's profile
  const isCurrentUser = currentUserId === urlProfile?.id;
  let currentUserProfile = isCurrentUser ? urlProfile : null;

  if (user && !isCurrentUser) {
    const { data: profile } = await supabase
      .from("profiles")
      .select()
      .eq("id", currentUserId)
      .single();

    currentUserProfile = profile;
  }

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
            color: `indigo-500`,
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

// ✅ SERVER-SIDE: Helper function to fetch all collections
async function fetchAllCollections(
  supabase: any,
  userId: string,
  currentUserId: string | null,
  isCurrentUser: boolean,
): Promise<MediaCollection[]> {
  console.time("🎬 Total Collections Fetch (Server)");

  let allCollections: MediaCollection[] = [];

  // 1. Owned Collections
  console.time("📦 Owned Collections Query");
  const ownedQuery = isCurrentUser
    ? supabase.from("collections").select("*").eq("owner", userId)
    : supabase
        .from("collections")
        .select("*")
        .eq("owner", userId)
        .eq("is_public", true);

  const { data: ownedCollections } = await ownedQuery;
  console.timeEnd("📦 Owned Collections Query");
  console.log("📦 Found collections:", ownedCollections?.length || 0);

  if (ownedCollections && ownedCollections.length > 0) {
    const ownedCollectionIds = ownedCollections.map((c: any) => c.id);

    console.time("🖼️ Owned Collection Posters");
    const { posterMap, countMap } = await fetchCollectionPosters(
      supabase,
      ownedCollectionIds,
    );
    console.timeEnd("🖼️ Owned Collection Posters");

    allCollections = ownedCollections.map((collection: any) => ({
      id: collection.id,
      title: collection.title || "Untitled Collection",
      owner: collection.owner,
      is_public: collection.is_public,
      shared: false,
      backdrop_path: posterMap.get(collection.id) || null,
      item_count: countMap.get(collection.id) || 0,
    }));
  }

  // 2. Shared Collections (only for current user)
  if (isCurrentUser && currentUserId) {
    console.time("🤝 Shared Collections Query");

    const { data: sharedData } = await supabase
      .from("shared_collection")
      .select("collection_id")
      .eq("user_id", currentUserId);

    console.timeEnd("🤝 Shared Collections Query");
    console.log("🤝 Found shared collections:", sharedData?.length || 0);

    const sharedCollectionIds =
      sharedData?.map((item: any) => item.collection_id) || [];

    if (sharedCollectionIds.length > 0) {
      console.time("🤝 Shared Collections Details");

      const { data: sharedCollections } = await supabase
        .from("collections")
        .select("*")
        .in("id", sharedCollectionIds);

      console.timeEnd("🤝 Shared Collections Details");

      if (sharedCollections && sharedCollections.length > 0) {
        console.time("🖼️ Shared Collection Posters");
        const { posterMap, countMap } = await fetchCollectionPosters(
          supabase,
          sharedCollectionIds,
        );
        console.timeEnd("🖼️ Shared Collection Posters");

        const sharedCollectionsData = sharedCollections.map(
          (collection: any) => ({
            id: collection.id,
            title: collection.title || "Untitled Shared Collection",
            owner: collection.owner,
            is_public: collection.is_public,
            shared: true,
            backdrop_path: posterMap.get(collection.id) || null,
            item_count: countMap.get(collection.id) || 0,
          }),
        );

        allCollections = [...allCollections, ...sharedCollectionsData];
      }
    }
  }

  console.timeEnd("🎬 Total Collections Fetch (Server)");
  return allCollections;
}

// ✅ SERVER-SIDE: Fetch collection posters
async function fetchCollectionPosters(
  supabase: any,
  collectionIds: string[],
): Promise<{
  posterMap: Map<string, string>;
  countMap: Map<string, number>;
}> {
  console.time("  ⏱️ fetchCollectionPosters");

  if (collectionIds.length === 0) {
    console.timeEnd("  ⏱️ fetchCollectionPosters");
    return { posterMap: new Map(), countMap: new Map() };
  }

  // Get all media items
  console.time("  📊 Media Items Query");
  const { data: mediaItems } = await supabase
    .from("medias_collections")
    .select("collection_id, media_id, media_type, position")
    .in("collection_id", collectionIds)
    .order("position", { ascending: true });

  console.timeEnd("  📊 Media Items Query");
  console.log("  📊 Media items found:", mediaItems?.length || 0);

  // Count items per collection
  const countMap = new Map<string, number>();
  collectionIds.forEach((id) => countMap.set(id, 0));

  mediaItems?.forEach((item: any) => {
    const currentCount = countMap.get(item.collection_id) || 0;
    countMap.set(item.collection_id, currentCount + 1);
  });

  // Get first media item per collection
  const firstMediaPerCollection = new Map<string, (typeof mediaItems)[0]>();
  mediaItems?.forEach((item: any) => {
    if (!firstMediaPerCollection.has(item.collection_id)) {
      firstMediaPerCollection.set(item.collection_id, item);
    }
  });

  // Separate by type
  const movieIds: string[] = [];
  const seriesIds: string[] = [];
  const mediaTypeMap = new Map<
    string,
    { collectionId: string; type: string }
  >();

  firstMediaPerCollection.forEach((item, collectionId) => {
    if (item.media_type === "movie") {
      movieIds.push(item.media_id);
      mediaTypeMap.set(item.media_id, { collectionId, type: "movie" });
    } else if (item.media_type === "tv") {
      seriesIds.push(item.media_id);
      mediaTypeMap.set(item.media_id, { collectionId, type: "tv" });
    }
  });

  const posterMap = new Map<string, string>();

  // Fetch movie backdrops
  if (movieIds.length > 0) {
    console.time("  🎬 Movies Query");
    const { data: movies } = await supabase
      .from("movies")
      .select("id, backdrop_path")
      .in("id", movieIds);
    console.timeEnd("  🎬 Movies Query");

    movies?.forEach((movie: any) => {
      const mediaInfo = mediaTypeMap.get(movie.id);
      if (mediaInfo && movie.backdrop_path) {
        posterMap.set(mediaInfo.collectionId, movie.backdrop_path);
      }
    });
  }

  // Fetch series backdrops
  if (seriesIds.length > 0) {
    console.time("  📺 Series Query");
    const { data: series } = await supabase
      .from("series")
      .select("id, backdrop_path")
      .in("id", seriesIds);
    console.timeEnd("  📺 Series Query");

    series?.forEach((show: any) => {
      const mediaInfo = mediaTypeMap.get(show.id);
      if (mediaInfo && show.backdrop_path) {
        posterMap.set(mediaInfo.collectionId, show.backdrop_path);
      }
    });
  }

  console.timeEnd("  ⏱️ fetchCollectionPosters");
  return { posterMap, countMap };
}
