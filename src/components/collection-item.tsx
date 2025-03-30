"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";

import {
  IconTrash,
  IconDeviceTv,
  IconChairDirector,
} from "@tabler/icons-react";
import { Popcorn } from "lucide-react";

type CollectionItemProps = {
  id: string;
  title: string;
  imageUrl?: string;
  mediaId: string;
  mediaType: string;
  releaseYear?: string;
  onDelete: () => void;
  isOwner: boolean;
};

export default function CollectionItem({
  id,
  title,
  imageUrl,
  mediaId,
  mediaType,
  releaseYear,
  onDelete,
  isOwner = false,
}: CollectionItemProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const MediaIcon = mediaType === "movie" ? IconChairDirector : IconDeviceTv;

  return (
    <div
      className={`flex items-center p-3 border border-neutral-800 hover:border-neutral-600 rounded transition-all duration-300 ease-in-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-20 w-14 mr-3 bg-neutral-800 rounded overflow-hidden flex items-center justify-center">
        {imageUrl && !imageError ? (
          <Image
            src={
              imageUrl.startsWith("http")
                ? imageUrl
                : `https://image.tmdb.org/t/p/w92${imageUrl}`
            }
            alt={title}
            width={100}
            height={200}
            className={`object-cover object-center w-full h-full`}
            onError={() => setImageError(true)}
          />
        ) : (
          <MediaIcon size={20} className="text-neutral-500" />
        )}
      </div>

      <div className="flex-grow">
        <Link
          href={`https://www.themoviedb.org/${mediaType}/${mediaId}`}
          target="_blank"
          className={`text-base font-medium hover:text-lime-400 transition-all duration-300 ease-in-out`}
        >
          {title}
        </Link>
        {releaseYear && (
          <div className={`text-sm text-neutral-500`}>{releaseYear}</div>
        )}
      </div>

      {isOwner && (
        <button
          onClick={onDelete}
          className={`p-2 text-neutral-400 hover:text-red-500 transition-colors ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          title="Remove from collection"
        >
          <IconTrash size={18} />
        </button>
      )}
    </div>
  );
}
