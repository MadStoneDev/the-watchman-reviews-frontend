"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { IconChairDirector } from "@tabler/icons-react";
import { GripVertical } from "lucide-react";

interface SortableMediaItemProps {
  id: string;
  item: any;
  photo?: string;
  title: string;
}

export default function SortableMediaItem({
  id,
  item,
  photo,
  title,
}: SortableMediaItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative flex-shrink-0 w-24 aspect-[2/3] rounded overflow-hidden group cursor-grab"
      {...attributes}
      {...listeners}
    >
      <div className="w-full h-full bg-neutral-800">
        {photo ? (
          <Image
            src={`https://image.tmdb.org/t/p/w200${photo}`}
            alt={title}
            fill
            className="object-cover object-center"
            sizes="100px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <IconChairDirector size={24} className="text-neutral-600" />
          </div>
        )}
      </div>

      {/* Drag handle and title overlay */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between">
        <div className="p-1 flex justify-end">
          <GripVertical className="text-white opacity-70" size={16} />
        </div>
        <div className="p-1 text-white text-xs font-medium line-clamp-2">
          {title}
        </div>
      </div>
    </div>
  );
}
