"use server";

import { createClient } from "@/src/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { MediaItem } from "@/src/lib/types";

/**
 * Get all media items in a collection with proper sorting
 */
export async function getCollectionMedias(collectionId: string) {
  try {
    const supabase = await createClient();

    // Get media entries with position
    const { data: mediaEntries, error: entriesError } = await supabase
      .from("medias_collections")
      .select("*")
      .eq("collection_id", collectionId)
      .order("position", { ascending: true });

    if (entriesError) throw entriesError;

    if (!mediaEntries || mediaEntries.length === 0) {
      return { success: true, medias: [] };
    }

    // Separate movies and series
    const movieIds = mediaEntries
      .filter((item) => item.media_type === "movie")
      .map((item) => item.media_id);

    const seriesIds = mediaEntries
      .filter((item) => item.media_type === "tv")
      .map((item) => item.media_id);

    const mediaItems: MediaItem[] = [];

    // Fetch movies
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
            releaseYear: movie.release_year
              ? parseInt(movie.release_year)
              : undefined,
            collectionEntryId: entry?.id,
            mediaId: movie.id,
            position: entry?.position ?? 0,
          };
        });

        mediaItems.push(...movieItems);
      }
    }

    // Fetch series
    if (seriesIds.length > 0) {
      const { data: series } = await supabase
        .from("series")
        .select("*")
        .in("id", seriesIds);

      if (series) {
        const seriesItems: MediaItem[] = series.map((s) => {
          const entry = mediaEntries.find(
            (e) => e.media_id === s.id && e.media_type === "tv",
          );

          return {
            id: s.id,
            title: s.title,
            overview: s.overview,
            posterPath: s.poster_path,
            backdropPath: s.backdrop_path,
            tmdbId: s.tmdb_id,
            mediaType: "tv",
            releaseYear: s.release_year ? parseInt(s.release_year) : undefined,
            collectionEntryId: entry?.id,
            mediaId: s.id,
            position: entry?.position ?? 0,
          };
        });

        mediaItems.push(...seriesItems);
      }
    }

    // Sort by position
    const sortedMediaItems = mediaItems.sort(
      (a, b) => (a.position ?? 0) - (b.position ?? 0),
    );

    return {
      success: true,
      medias: sortedMediaItems,
    };
  } catch (error) {
    console.error("Error fetching collection medias:", error);
    return {
      success: false,
      medias: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Update positions of media items in a collection
 */
export async function updateCollectionPositions(
  collectionId: string,
  mediaItems: Array<{ collectionEntryId: string; position: number }>,
) {
  try {
    const supabase = await createClient();

    // Verify user has permission
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const { data: collection } = await supabase
      .from("collections")
      .select("creator_id, editors")
      .eq("id", collectionId)
      .single();

    if (!collection) {
      return {
        success: false,
        error: "Collection not found",
      };
    }

    const isCreator = collection.creator_id === user.id;
    const isEditor = collection.editors?.includes(user.id);

    if (!isCreator && !isEditor) {
      return {
        success: false,
        error: "You don't have permission to edit this collection",
      };
    }

    // Update positions
    for (const item of mediaItems) {
      await supabase
        .from("medias_collections")
        .update({ position: item.position })
        .eq("id", item.collectionEntryId);
    }

    // Revalidate the collection page
    revalidatePath(`/collections/${collectionId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating positions:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Delete a media item from a collection
 */
export async function deleteFromCollection(
  collectionEntryId: string,
  collectionId: string,
) {
  try {
    const supabase = await createClient();

    // Verify user has permission
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const { data: collection } = await supabase
      .from("collections")
      .select("creator_id, editors")
      .eq("id", collectionId)
      .single();

    if (!collection) {
      return {
        success: false,
        error: "Collection not found",
      };
    }

    const isCreator = collection.creator_id === user.id;
    const isEditor = collection.editors?.includes(user.id);

    if (!isCreator && !isEditor) {
      return {
        success: false,
        error: "You don't have permission to edit this collection",
      };
    }

    // Delete the entry
    const { error } = await supabase
      .from("medias_collections")
      .delete()
      .eq("id", collectionEntryId);

    if (error) throw error;

    // Revalidate the collection page
    revalidatePath(`/collections/${collectionId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting from collection:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
