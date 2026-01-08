"use client";

import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";

import { Tables } from "@/database.types";
import { MediaItem } from "@/src/lib/types";

import SortableCollectionItem from "@/src/components/sortable-collection-item";
import AddMediaForm from "@/src/components/add-media-form";

import {
  getCollectionMedias,
  updateCollectionPositions,
  deleteFromCollection,
} from "@/src/app/actions/collections";

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
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Helps distinguish between click and drag
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // 250ms hold before drag starts on mobile
        tolerance: 5, // Allow 5px movement during the delay
      },
    }),
  );

  const handleWatchToggle = (mediaId: string) => {
    // Implement if needed
  };

  const refetchMedias = async () => {
    startTransition(async () => {
      const result = await getCollectionMedias(collection.id);

      if (result.success) {
        setMedias(result.medias);
      } else {
        toast.error("Failed to refresh collection");
      }
    });
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

        // Update local state immediately (optimistic update)
        setMedias(newMedias);

        // Show loading toast
        const toastId = toast.loading("Updating order...");

        // Update server
        startTransition(async () => {
          const updates = newMedias.map((item, index) => ({
            collectionEntryId: item.collectionEntryId!,
            position: index,
          }));

          const result = await updateCollectionPositions(
            collection.id,
            updates,
          );

          if (result.success) {
            toast.success("Order updated", { id: toastId });
          } else {
            // Revert on error
            setMedias(initialMedias);
            toast.error("Failed to update order", { id: toastId });
          }
        });
      }
    }
  };

  const handleDelete = async (collectionEntryId: string) => {
    if (!confirm("Remove from collection?")) return;

    const toastId = toast.loading("Removing...");

    startTransition(async () => {
      const result = await deleteFromCollection(
        collectionEntryId,
        collection.id,
      );

      if (result.success) {
        toast.success("Removed from collection", { id: toastId });
        await refetchMedias();
      } else {
        toast.error(result.error || "Failed to remove", { id: toastId });
      }
    });
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

      {isPending && medias.length === 0 ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400"></div>
          <p className="mt-2 text-neutral-400">Loading...</p>
        </div>
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
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {medias.map((media) => (
                <SortableCollectionItem
                  key={media.collectionEntryId || media.id}
                  item={media}
                  collectionId={collection.id}
                  isOwner={isOwner}
                  onDelete={() => handleDelete(media.collectionEntryId!)}
                  onWatchToggle={() => handleWatchToggle(media.id.toString())}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
