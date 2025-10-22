"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { createClient } from "@/src/utils/supabase/client";

import {
  IconTrash,
  IconDeviceTv,
  IconChairDirector,
  IconEye,
  IconEyeOff,
  IconUsersGroup,
  IconGripVertical,
  IconExternalLink,
} from "@tabler/icons-react";

import { MediaItem } from "@/src/lib/types";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";

interface CollectionMediaItemProps {
  data: MediaItem & {
    collectionEntryId?: string;
  };
  collectionId: string;
  isOwner?: boolean;
  onDelete: () => void;
  onWatchToggle?: () => void;
  dragHandleProps?: any;
  dragAttributes?: any;
}

export default function CollectionItem({
  data,
  collectionId,
  isOwner = false,
  onDelete,
  onWatchToggle,
  dragHandleProps,
  dragAttributes,
}: CollectionMediaItemProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isWatchedByAll, setIsWatchedByAll] = useState(false);
  const [isUpdatingWatch, setIsUpdatingWatch] = useState(false);

  const supabase = createClient();

  // Check if this media is marked as watched by the current user
  useEffect(() => {
    const checkWatchStatus = async () => {
      const { data: userData } = await supabase.auth.getClaims();
      if (!userData) return;

      const userId = userData.claims.sub;

      const { data: watchData } = await supabase
        .from("media_watches")
        .select("id")
        .eq("collection_id", collectionId)
        .eq("media_id", data.id)
        .eq("media_type", data.mediaType)
        .eq("user_id", userId);

      setIsWatched(watchData !== null && watchData.length > 0);

      if (isOwner) {
        const { data: sharedData } = await supabase
          .from("shared_collection")
          .select("user_id")
          .eq("collection_id", collectionId);

        const { data: collectionData } = await supabase
          .from("collections")
          .select("owner")
          .eq("id", collectionId)
          .single();

        const allUserIds = [
          collectionData?.owner,
          ...(sharedData?.map((item) => item.user_id) || []),
        ].filter(Boolean);

        const { data: watchesData, count } = await supabase
          .from("media_watches")
          .select("id", { count: "exact" })
          .eq("collection_id", collectionId)
          .eq("media_id", data.id)
          .eq("media_type", data.mediaType)
          .in("user_id", allUserIds);

        setIsWatchedByAll(count === allUserIds.length);
      }
    };

    checkWatchStatus();
  }, [collectionId, data.id, data.mediaType, isOwner, supabase]);

  const handleWatchToggle = async () => {
    setIsUpdatingWatch(true);
    try {
      const { data: userData } = await supabase.auth.getClaims();
      if (!userData) return;

      const userId = userData.claims.sub;

      if (isWatched) {
        await supabase
          .from("media_watches")
          .delete()
          .eq("collection_id", collectionId)
          .eq("media_id", data.id)
          .eq("media_type", data.mediaType)
          .eq("user_id", userId);
      } else {
        await supabase.from("media_watches").insert({
          collection_id: collectionId,
          media_id: data.id,
          media_type: data.mediaType,
          user_id: userId,
          watched_at: new Date().toISOString(),
        });
      }

      setIsWatched(!isWatched);

      if (onWatchToggle) onWatchToggle();
    } catch (error) {
      console.error("Error toggling watch status:", error);
    } finally {
      setIsUpdatingWatch(false);
    }
  };

  const handleWatchAllToggle = async () => {
    if (!isOwner) return;

    setIsUpdatingWatch(true);
    try {
      const { data: sharedData } = await supabase
        .from("shared_collection")
        .select("user_id")
        .eq("collection_id", collectionId);

      const { data: collectionData } = await supabase
        .from("collections")
        .select("owner")
        .eq("id", collectionId)
        .single();

      const allUserIds = [
        collectionData?.owner,
        ...(sharedData?.map((item) => item.user_id) || []),
      ].filter(Boolean) as string[];

      if (isWatchedByAll) {
        await supabase
          .from("media_watches")
          .delete()
          .eq("collection_id", collectionId)
          .eq("media_id", data.id)
          .eq("media_type", data.mediaType)
          .in("user_id", allUserIds);

        setIsWatchedByAll(false);
        setIsWatched(false);
      } else {
        const { data: existingWatches } = await supabase
          .from("media_watches")
          .select("user_id")
          .eq("collection_id", collectionId)
          .eq("media_id", data.id)
          .eq("media_type", data.mediaType);

        const existingUserIds =
          existingWatches?.map((watch) => watch.user_id) || [];
        const usersToAdd = allUserIds.filter(
          (id) => !existingUserIds.includes(id),
        );

        if (usersToAdd.length > 0) {
          const watchRecords = usersToAdd.map((userId) => ({
            collection_id: collectionId,
            media_id: data.id,
            media_type: data.mediaType,
            user_id: userId,
            watched_at: new Date().toISOString(),
          }));

          await supabase.from("media_watches").insert(watchRecords);
        }

        setIsWatchedByAll(true);
        setIsWatched(true);
      }

      if (onWatchToggle) onWatchToggle();
    } catch (error) {
      console.error("Error toggling watch-all status:", error);
    } finally {
      setIsUpdatingWatch(false);
    }
  };

  return (
    <div
      className="group relative bg-neutral-900 h-full rounded-lg overflow-hidden border border-neutral-800 hover:border-neutral-700 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Watched Overlay */}
      {isWatched && (
        <div className="absolute inset-0 bg-lime-500/10 z-10 pointer-events-none" />
      )}

      {/* Drag Handle - Top Left */}
      <div
        className="absolute top-2 left-2 z-20 p-1.5 bg-neutral-900/80 backdrop-blur-sm rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        {...dragHandleProps}
        {...dragAttributes}
      >
        <IconGripVertical size={16} className="text-neutral-400" />
      </div>

      {/* Watch Status Badge - Top Right */}
      {isWatched && (
        <div className="absolute top-2 right-2 z-20 px-2 py-1 bg-lime-500 rounded-full flex items-center gap-1">
          <IconEye size={14} className="text-neutral-900" />
          <span className="text-xs font-medium text-neutral-900">Watched</span>
        </div>
      )}

      {/* Poster Image */}
      <div className="relative aspect-[2/3] bg-neutral-800">
        {data.posterPath && !imageError ? (
          <Image
            src={
              data.posterPath.startsWith("http")
                ? data.posterPath
                : `https://image.tmdb.org/t/p/w342${data.posterPath}`
            }
            alt={data.title}
            fill
            className={`object-cover ${
              isWatched ? "opacity-60" : "opacity-100"
            } transition-opacity`}
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {data.mediaType === "movie" ? (
              <IconChairDirector size={48} className="text-neutral-700" />
            ) : (
              <IconDeviceTv size={48} className="text-neutral-700" />
            )}
          </div>
        )}

        {/* Hover Overlay with Actions */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent flex flex-col justify-end p-3 transition-opacity ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex justify-between items-center gap-2 mb-2">
            {/* Watch Toggle */}
            <button
              onClick={handleWatchToggle}
              disabled={isUpdatingWatch}
              className={`py-2 px-3 rounded-lg transition-colors ${
                isWatched
                  ? "bg-lime-500 text-neutral-900 hover:bg-lime-400"
                  : "bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700"
              } ${isUpdatingWatch ? "opacity-50 cursor-not-allowed" : ""}`}
              title={isWatched ? "Mark as unwatched" : "Mark as watched"}
            >
              {isWatched ? (
                <IconEyeOff size={18} className="mx-auto" />
              ) : (
                <IconEye size={18} className="mx-auto" />
              )}
            </button>

            {/* Watch All Toggle (Owner Only) */}
            {isOwner && (
              <button
                onClick={handleWatchAllToggle}
                disabled={isUpdatingWatch}
                className={`py-2 px-3 rounded-lg transition-colors ${
                  isWatchedByAll
                    ? "bg-lime-500 text-neutral-900 hover:bg-lime-400"
                    : "bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700"
                } ${isUpdatingWatch ? "opacity-50 cursor-not-allowed" : ""}`}
                title={isWatchedByAll ? "Unwatch for all" : "Watch for all"}
              >
                <IconUsersGroup size={18} />
              </button>
            )}

            {/* Delete Button (Owner Only) */}
            {isOwner && (
              <button
                onClick={onDelete}
                className="py-2 px-3 bg-red-600/80 text-neutral-50 hover:bg-red-600 rounded-lg transition-colors"
                title="Remove from collection"
              >
                <IconTrash size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <Link
          href={`https://www.themoviedb.org/${data.mediaType}/${data.tmdbId}`}
          target="_blank"
          className="group/link flex items-start gap-1 mb-1"
        >
          <h3
            className={`text-sm font-medium line-clamp-2 group-hover/link:text-lime-400 transition-colors ${
              isWatched ? "text-neutral-400" : "text-neutral-100"
            }`}
          >
            {data.title}
          </h3>
          <IconExternalLink
            size={14}
            className="text-neutral-600 group-hover/link:text-lime-400 transition-colors shrink-0 mt-0.5"
          />
        </Link>
        {data.releaseYear && (
          <p
            className={`text-xs ${
              isWatched ? "text-neutral-600" : "text-neutral-500"
            }`}
          >
            {data.releaseYear}
          </p>
        )}
      </div>
    </div>
  );
}
