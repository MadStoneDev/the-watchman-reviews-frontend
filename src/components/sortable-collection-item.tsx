"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CollectionItem from "./collection-item";
import { MediaItem } from "@/src/lib/types";

interface SortableCollectionItemProps {
  item: MediaItem & { collectionEntryId?: string };
  collectionId: string;
  isOwner: boolean;
  onDelete: () => void;
  onWatchToggle?: () => void;
}

export default function SortableCollectionItem({
  item,
  collectionId,
  isOwner,
  onDelete,
  onWatchToggle,
}: SortableCollectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.collectionEntryId?.toString() || item.id.toString(), // Changed this line
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <CollectionItem
        data={item}
        collectionId={collectionId}
        isOwner={isOwner}
        onDelete={onDelete}
        onWatchToggle={onWatchToggle}
        dragHandleProps={listeners}
        dragAttributes={attributes}
      />
    </div>
  );
}
