"use client";

import Link from "next/link";
import React, { useState } from "react";

import CollectionItem from "./collection-item";
import { IconSquarePlus } from "@tabler/icons-react";

type MediaItem = {
  id: string;
  title: string;
  imageUrl?: string;
};

export default function CollectionBlock() {
  // Example state for collection items
  const [items, setItems] = useState<MediaItem[]>([
    { id: "1", title: "The Batman", imageUrl: "/batman.jpg" },
    { id: "2", title: "Dune", imageUrl: "/dune.jpg" },
    { id: "3", title: "Oppenheimer" },
  ]);

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <section className={`my-4 flex flex-col gap-2`}>
      {items.map((item) => (
        <CollectionItem
          key={item.id}
          title={item.title}
          imageUrl={item.imageUrl}
          onDelete={() => handleDeleteItem(item.id)}
        />
      ))}

      <Link
        href={`/search`}
        className="p-2 flex justify-center items-center gap-1 w-full border hover:border-lime-400 hover:text-lime-400 opacity-70 hover:opacity-100 transition-all duration-300 ease-in-out rounded"
      >
        <IconSquarePlus size={32} />
        <span>Add more</span>
      </Link>
    </section>
  );
}
