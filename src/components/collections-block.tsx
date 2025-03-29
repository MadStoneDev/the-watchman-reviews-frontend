"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { createClient } from "@/src/utils/supabase/client";

import CollectionItem from "./collection-item";
import { IconSquarePlus } from "@tabler/icons-react";

type MediaItem = {
  id: string;
  collection_id: string;
  media_id: string;
  media_type: string;
  title: string;
  poster_path: string | null;
  release_year: string | null;
};

type CollectionBlockProps = {
  initialItems?: MediaItem[];
  collectionId: string;
};

export default function CollectionBlock({
  initialItems = [],
  collectionId,
}: CollectionBlockProps) {
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const supabase = createClient();

  const handleDeleteItem = async (id: string) => {
    try {
      // Delete from database
      const { error } = await supabase
        .from("media_collection")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting item:", error);
        return;
      }

      // Update UI
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  return (
    <section className={`my-4 flex flex-col gap-2`}>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-neutral-400 border border-dashed border-neutral-700 rounded">
          <p className="mb-4">This collection is empty</p>
          <Link
            href={`/search`}
            className="p-2 flex justify-center items-center gap-1 border hover:border-lime-400 hover:text-lime-400 opacity-70 hover:opacity-100 transition-all duration-300 ease-in-out rounded"
          >
            <IconSquarePlus size={20} />
            <span>Add media</span>
          </Link>
        </div>
      ) : (
        <>
          {items.map((item) => (
            <CollectionItem
              key={item.id}
              id={item.id}
              title={item.title}
              imageUrl={item.poster_path ? item.poster_path : undefined}
              mediaId={item.media_id}
              mediaType={item.media_type}
              releaseYear={item.release_year || undefined}
              onDelete={() => handleDeleteItem(item.id)}
            />
          ))}

          <Link
            href={`/search`}
            className="p-2 flex justify-center items-center gap-1 w-full border hover:border-lime-400 hover:text-lime-400 opacity-70 hover:opacity-100 transition-all duration-300 ease-in-out rounded"
          >
            <IconSquarePlus size={20} />
            <span>Add more</span>
          </Link>
        </>
      )}
    </section>
  );
}
