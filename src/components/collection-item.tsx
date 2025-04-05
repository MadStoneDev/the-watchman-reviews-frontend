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
  IconLineHeight,
  IconUsersGroup,
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
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

export default function CollectionItem({
  data,
  collectionId,
  isOwner = false,
  onDelete,
  onWatchToggle,
  dragHandleProps,
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
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const userId = userData.user.id;

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
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const userId = userData.user.id;

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
      ].filter(Boolean);

      if (isWatchedByAll) {
        await supabase
          .from("media_watches")
          .delete()
          .eq("collection_id", collectionId)
          .eq("media_id", data.id)
          .eq("media_type", data.mediaType)
          .in("user_id", allUserIds);
      } else {
        const { data: existingWatches } = await supabase
          .from("media_watches")
          .select("user_id")
          .eq("collection_id", collectionId)
          .eq("media_id", data.id)
          .eq("media_type", data.mediaType)
          .in("user_id", allUserIds);

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
      }

      setIsWatchedByAll(!isWatchedByAll);
      setIsWatched(!isWatchedByAll);

      if (onWatchToggle) onWatchToggle();
    } catch (error) {
      console.error("Error toggling watch-all status:", error);
    } finally {
      setIsUpdatingWatch(false);
    }
  };

  return (
    <div
      className={`flex items-center p-3 border ${
        isWatched
          ? "bg-lime-800 hover:bg-lime-700 border-lime-400 hover:border-lime-500"
          : "border-neutral-800 hover:border-neutral-600"
      } rounded transition-all duration-300 ease-in-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag Handle */}
      <div
        className={`cursor-grab active:cursor-grabbing mr-2 ${
          isWatched
            ? "text-neutral-50/50 hover:text-neutral-50"
            : "text-neutral-500" + " hover:text-neutral-300"
        } transition-all duration-300 ease-in-out`}
        {...dragHandleProps}
      >
        <IconLineHeight size={20} />
      </div>

      {/* Image */}
      <div
        className={`h-20 w-14 shrink-0 mr-3 bg-neutral-800 rounded overflow-hidden flex items-center justify-center`}
      >
        {data.posterPath && !imageError ? (
          <Image
            src={
              data.posterPath.startsWith("http")
                ? data.posterPath
                : `https://image.tmdb.org/t/p/w92${data.posterPath}`
            }
            alt={data.title}
            width={100}
            height={200}
            className={`object-cover object-center w-full h-full ${
              isWatched ? "opacity-80" : "opacity-100"
            }`}
            onError={() => setImageError(true)}
          />
        ) : data.mediaType === "movie" ? (
          <IconChairDirector size={20} className="text-neutral-500" />
        ) : (
          <IconDeviceTv size={20} className="text-neutral-500" />
        )}
      </div>

      {/* Content */}
      <div className="flex-grow">
        <Link
          href={`https://www.themoviedb.org/${data.mediaType}/${data.tmdbId}`}
          target="_blank"
          className={`text-base font-medium hover:text-lime-400 transition-all duration-300 ease-in-out ${
            isWatched ? "text-lime-400/50" : ""
          }`}
        >
          {data.title}
        </Link>
        {data.releaseYear && (
          <div
            className={`${
              isWatched ? "text-neutral-50/30" : "text-neutral-600"
            } text-sm`}
          >
            {data.releaseYear}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div
        className={`flex items-center gap-2 ${
          isHovered ? "opacity-100" : "md:opacity-0"
        }`}
      >
        {/* Watch Toggle Button */}
        <button
          onClick={handleWatchToggle}
          disabled={isUpdatingWatch}
          className={`p-2 transition-colors ${
            isUpdatingWatch ? "opacity-50 cursor-not-allowed" : ""
          } text-neutral-50 hover:text-lime-400`}
          title={isWatched ? "Mark as unwatched" : "Mark as watched"}
        >
          <IconEye size={20} />
        </button>

        {/* Watch All Toggle Button (for owners only) */}
        {isOwner && (
          <button
            onClick={handleWatchAllToggle}
            disabled={isUpdatingWatch}
            className={`p-2 transition-colors ${
              isUpdatingWatch ? "opacity-50 cursor-not-allowed" : ""
            } text-neutral-50 hover:text-lime-400`}
            title={
              isWatchedByAll
                ? "Mark as unwatched by all"
                : "Mark as watched by all"
            }
          >
            <IconUsersGroup size={20} />
          </button>
        )}

        {/* Delete Button */}
        {isOwner && (
          <button
            onClick={onDelete}
            className={`p-2 text-neutral-50 hover:bg-red-700 rounded-full transition-all duration-300 ease-in-out`}
            title="Remove from collection"
          >
            <IconTrash size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
