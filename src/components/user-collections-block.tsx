"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/src/utils/supabase/client";

import { IconSquarePlus } from "@tabler/icons-react";
import { UserCollectionRow } from "@/src/components/user-collection-row";

import { Tables } from "@/database.types";
import { MediaCollection } from "@/src/lib/types";

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

        // Get first media item for each owned collection
        // Get first media item for each owned collection
        const ownedCollectionIds = ownedCollections?.map((c) => c.id) || [];
        const { posterMap: ownedPostersMap, countMap: ownedCountMap } =
          await fetchCollectionPosters(ownedCollectionIds);

        const cleanOwnedCollections: MediaCollection[] = (
          ownedCollections || []
        ).map((collection) => ({
          id: collection.id,
          title: collection.title || "Untitled Collection",
          owner: collection.owner,
          is_public: collection.is_public,
          shared: false,
          backdrop_path: ownedPostersMap.get(collection.id) || null,
          item_count: ownedCountMap.get(collection.id) || 0,
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

            // Get first media item for each shared collection
            const { posterMap: sharedPostersMap, countMap: sharedCountMap } =
              await fetchCollectionPosters(sharedCollectionIds);

            const cleanSharedCollections: MediaCollection[] = (
              sharedCollections || []
            ).map((collection) => ({
              id: collection.id,
              title: collection.title || "Untitled Shared Collection",
              owner: collection.owner,
              is_public: collection.is_public,
              shared: true,
              backdrop_path: sharedPostersMap.get(collection.id) || null,
              item_count: sharedCountMap.get(collection.id) || 0,
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

    const fetchCollectionPosters = async (
      collectionIds: string[],
    ): Promise<{
      posterMap: Map<string, string>;
      countMap: Map<string, number>;
    }> => {
      if (collectionIds.length === 0) {
        return { posterMap: new Map(), countMap: new Map() };
      }

      // Get all media items from collections (ordered by position)
      const { data: mediaItems, error } = await supabase
        .from("medias_collections")
        .select("collection_id, media_id, media_type, position")
        .in("collection_id", collectionIds)
        .order("position", { ascending: true });

      if (error) {
        console.error("Error fetching media items:", error);
        return { posterMap: new Map(), countMap: new Map() };
      }

      // Count items per collection
      const countMap = new Map<string, number>();
      collectionIds.forEach((id) => countMap.set(id, 0));

      mediaItems?.forEach((item) => {
        const currentCount = countMap.get(item.collection_id) || 0;
        countMap.set(item.collection_id, currentCount + 1);
      });

      // Get only the first item per collection for poster
      const firstMediaPerCollection = new Map<string, (typeof mediaItems)[0]>();
      mediaItems?.forEach((item) => {
        if (!firstMediaPerCollection.has(item.collection_id)) {
          firstMediaPerCollection.set(item.collection_id, item);
        }
      });

      // Separate movie and TV IDs
      const movieIds: number[] = [];
      const seriesIds: number[] = [];
      const mediaTypeMap = new Map<
        Number,
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

      // Fetch movie posters
      if (movieIds.length > 0) {
        const { data: movies } = await supabase
          .from("movies")
          .select("id, backdrop_path, tmdb_id")
          .in("id", movieIds);

        for (const movie of movies || []) {
          const mediaInfo = mediaTypeMap.get(movie.id);
          if (!mediaInfo) continue;

          if (movie.backdrop_path) {
            posterMap.set(mediaInfo.collectionId, movie.backdrop_path);
          } else if (movie.tmdb_id) {
            const backdropPath = await fetchAndUpdateBackdrop(
              movie.tmdb_id,
              "movie",
              movie.id,
            );
            if (backdropPath) {
              posterMap.set(mediaInfo.collectionId, backdropPath);
            }
          }
        }
      }

      // Fetch series posters
      if (seriesIds.length > 0) {
        const { data: series } = await supabase
          .from("series")
          .select("id, backdrop_path, tmdb_id")
          .in("id", seriesIds);

        for (const show of series || []) {
          const mediaInfo = mediaTypeMap.get(show.id);
          if (!mediaInfo) continue;

          if (show.backdrop_path) {
            posterMap.set(mediaInfo.collectionId, show.backdrop_path);
          } else if (show.tmdb_id) {
            const backdropPath = await fetchAndUpdateBackdrop(
              show.tmdb_id,
              "tv",
              show.id,
            );
            if (backdropPath) {
              posterMap.set(mediaInfo.collectionId, backdropPath);
            }
          }
        }
      }

      return { posterMap, countMap };
    };

    // Helper function to fetch backdrop from TMDB and update database
    const fetchAndUpdateBackdrop = async (
      tmdbId: number,
      mediaType: "movie" | "tv",
      recordId: number,
    ): Promise<string | null> => {
      try {
        // ✅ Use our secure API route
        const endpoint =
          mediaType === "movie"
            ? `/api/tmdb/movie/${tmdbId}`
            : `/api/tmdb/tv/${tmdbId}`;

        const response = await fetch(`${endpoint}?language=en-US`);

        if (!response.ok) {
          throw new Error(`TMDB API error: ${response.status}`);
        }

        const data = await response.json();
        const backdropPath = data.backdrop_path;

        if (backdropPath) {
          // Update the database with the fetched backdrop_path
          const tableName = mediaType === "movie" ? "movies" : "series";
          await supabase
            .from(tableName)
            .update({ backdrop_path: backdropPath })
            .eq("id", recordId);

          return backdropPath;
        }

        return null;
      } catch (error) {
        console.error(`Error fetching backdrop from TMDB:`, error);
        return null;
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
        <section className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
