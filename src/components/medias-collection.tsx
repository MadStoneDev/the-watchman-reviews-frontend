"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/src/utils/supabase/client";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";

import { Tables } from "@/database.types";
import { MediaItem } from "@/src/lib/types";

import SortableCollectionItem from "@/src/components/sortable-collection-item";
import AddMediaForm from "@/src/components/add-media-form";

type Collection = Tables<"collections">;

interface MediasCollectionProps {
  collection: Collection;
  initialMedias: MediaItem[];
  itemCount: number;
  isOwner: boolean;
}

// Helper function
function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = array.slice();
  newArray.splice(
    to < 0 ? newArray.length + to : to,
    0,
    newArray.splice(from, 1)[0],
  );
  return newArray;
}

export default function MediasCollection({
  collection,
  initialMedias,
  itemCount,
  isOwner,
}: MediasCollectionProps) {
  const [medias, setMedias] = useState<MediaItem[]>(initialMedias);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Helps distinguish between click and drag
      },
    }),
  );

  const refetchMedias = async () => {
    setLoading(true);
    try {
      const { data: mediaEntries } = await supabase
        .from("medias_collections")
        .select("*")
        .eq("collection_id", collection.id)
        .order("position", { ascending: true }); // Remove the second order

      if (mediaEntries && mediaEntries.length > 0) {
        const movieIds = mediaEntries
          .filter((item) => item.media_type === "movie")
          .map((item) => item.media_id);
        const seriesIds = mediaEntries
          .filter((item) => item.media_type === "tv")
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
                collectionEntryId: entry?.id,
                mediaId: movie.id,
                position: entry?.position ?? 0, // Add position here
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
                (e) => e.media_id === series.id && e.media_type === "tv",
              );

              return {
                id: series.id,
                title: series.title,
                overview: series.overview,
                posterPath: series.poster_path,
                backdropPath: series.backdrop_path,
                tmdbId: series.tmdb_id,
                mediaType: "tv",
                releaseYear: series.release_year,
                collectionEntryId: entry?.id,
                mediaId: series.id,
                position: entry?.position ?? 0, // Add position here
              };
            });

            mediaItems.push(...seriesItems);
          }
        }

        // Sort by position after combining movies and series
        const sortedMediaItems = mediaItems.sort(
          (a, b) => (a.position ?? 0) - (b.position ?? 0),
        );
        setMedias(sortedMediaItems);
      } else {
        setMedias([]);
      }
    } catch (error) {
      console.error("Error fetching medias:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = medias.findIndex(
        (item) => item.collectionEntryId?.toString() === active.id,
      );
      const newIndex = medias.findIndex(
        (item) => item.collectionEntryId?.toString() === over.id,
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newMedias = arrayMove(medias, oldIndex, newIndex);
        setMedias(newMedias);

        // Update positions in database
        await updatePositions(newMedias);
      }
    }
  };

  const updatePositions = async (reorderedMedias: MediaItem[]) => {
    try {
      for (let index = 0; index < reorderedMedias.length; index++) {
        const item = reorderedMedias[index];
        await supabase
          .from("medias_collections")
          .update({ position: index })
          .eq("id", item.collectionEntryId);
      }
    } catch (error) {
      console.error("Error updating positions:", error);
    }
  };

  const handleDelete = async (collectionEntryId: string) => {
    try {
      const { error } = await supabase
        .from("medias_collections")
        .delete()
        .eq("id", collectionEntryId);

      if (error) throw error;

      await refetchMedias();
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  };

  return (
    <div className="my-8">
      {isOwner && (
        <div className="mb-6">
          <AddMediaForm
            collectionId={collection.id}
            onMediaAdded={refetchMedias}
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : medias.length === 0 ? (
        <div className="text-center py-8 text-neutral-500">
          {isOwner
            ? "No media in this collection yet. Add some above!"
            : "This collection is empty."}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={medias.map(
              (m) => m.collectionEntryId?.toString() || m.id.toString(),
            )}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {medias.map((media) => (
                <SortableCollectionItem
                  key={media.collectionEntryId || media.id}
                  item={media}
                  collectionId={collection.id}
                  isOwner={isOwner}
                  onDelete={() => handleDelete(media.collectionEntryId!)}
                  onWatchToggle={refetchMedias}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
