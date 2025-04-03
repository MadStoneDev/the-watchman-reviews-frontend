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
  IconEyeCheck,
  IconEyeCancel,
  IconLineHeight,
} from "@tabler/icons-react";

import { MediaItem } from "@/src/lib/types";

// Extend MediaItem with some collection-specific properties
interface CollectionMediaItemProps {
  data: MediaItem & {
    collectionEntryId?: string;
  };
  collectionId: string; // Need this to track watches for this specific collection
  isOwner?: boolean;
  onDelete: () => void;
  onWatchToggle?: () => void; // Optional callback for parent to update sorting
}

export default function CollectionItem({
  data,
  collectionId,
  isOwner = false,
  onDelete,
  onWatchToggle,
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
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const userId = userData.user.id;

      // Check if this media is watched by the current user
      const { data: watchData } = await supabase
        .from("media_watches")
        .select("id")
        .eq("collection_id", collectionId)
        .eq("media_id", data.id)
        .eq("media_type", data.mediaType)
        .eq("user_id", userId)
        .single();

      setIsWatched(!!watchData);

      // If owner, check if all users with access have watched it
      if (isOwner) {
        // Get all users with access to this collection (owner + shared with)
        const { data: sharedData } = await supabase
          .from("shared_collection")
          .select("user_id")
          .eq("collection_id", collectionId);

        const { data: collectionData } = await supabase
          .from("collections")
          .select("owner")
          .eq("id", collectionId)
          .single();

        // Combine owner and shared users
        const allUserIds = [
          collectionData?.owner,
          ...(sharedData?.map((item) => item.user_id) || []),
        ].filter(Boolean);

        // Count watches for this media
        const { data: watchesData, count } = await supabase
          .from("media_watches")
          .select("id", { count: "exact" })
          .eq("collection_id", collectionId)
          .eq("media_id", data.id)
          .eq("media_type", data.mediaType)
          .in("user_id", allUserIds);

        // Check if all users have watched it
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
        // Delete watch record
        await supabase
          .from("media_watches")
          .delete()
          .eq("collection_id", collectionId)
          .eq("media_id", data.id)
          .eq("media_type", data.mediaType)
          .eq("user_id", userId);
      } else {
        // Add watch record
        await supabase.from("media_watches").insert({
          collection_id: collectionId,
          media_id: data.id,
          media_type: data.mediaType,
          user_id: userId,
          watched_at: new Date().toISOString(),
        });
      }

      // Update local state
      setIsWatched(!isWatched);

      // Notify parent component about the status change (for sorting)
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
      // Get all users with access to this collection
      const { data: sharedData } = await supabase
        .from("shared_collection")
        .select("user_id")
        .eq("collection_id", collectionId);

      const { data: collectionData } = await supabase
        .from("collections")
        .select("owner")
        .eq("id", collectionId)
        .single();

      // Combine owner and shared users
      const allUserIds = [
        collectionData?.owner,
        ...(sharedData?.map((item) => item.user_id) || []),
      ].filter(Boolean);

      if (isWatchedByAll) {
        // Delete watch records for all users
        await supabase
          .from("media_watches")
          .delete()
          .eq("collection_id", collectionId)
          .eq("media_id", data.id)
          .eq("media_type", data.mediaType)
          .in("user_id", allUserIds);
      } else {
        // Add watch records for all users who don't already have one
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

      // Update local state
      setIsWatchedByAll(!isWatchedByAll);
      setIsWatched(!isWatchedByAll); // Update current user's status too

      // Notify parent component
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
          ? "border-neutral-800 bg-neutral-900/50"
          : "border-neutral-800 hover:border-neutral-600"
      } rounded transition-all duration-300 ease-in-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag Handle */}
      <div className="cursor-grab active:cursor-grabbing mr-2 text-neutral-500 hover:text-neutral-300">
        <IconLineHeight size={20} />
      </div>

      {/* Image */}
      <div className="h-20 w-14 mr-3 bg-neutral-800 rounded overflow-hidden flex items-center justify-center">
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
              isWatched ? "opacity-70" : "opacity-100"
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
            isWatched ? "text-neutral-400" : ""
          }`}
        >
          {data.title}
        </Link>
        {data.releaseYear && (
          <div className={`text-sm text-neutral-500`}>{data.releaseYear}</div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Watch Toggle Button */}
        <button
          onClick={handleWatchToggle}
          disabled={isUpdatingWatch}
          className={`p-2 transition-colors ${
            isUpdatingWatch ? "opacity-50 cursor-not-allowed" : ""
          } ${
            isWatched
              ? "text-blue-400 hover:text-blue-300"
              : "text-neutral-400 hover:text-blue-400"
          }`}
          title={isWatched ? "Mark as unwatched" : "Mark as watched"}
        >
          {isWatched ? <IconEyeCheck size={18} /> : <IconEye size={18} />}
        </button>

        {/* Watch All Toggle Button (for owners only) */}
        {isOwner && (
          <button
            onClick={handleWatchAllToggle}
            disabled={isUpdatingWatch}
            className={`p-2 transition-colors ${
              isUpdatingWatch ? "opacity-50 cursor-not-allowed" : ""
            } ${
              isWatchedByAll
                ? "text-blue-400 hover:text-blue-300"
                : "text-neutral-400 hover:text-blue-400"
            }`}
            title={
              isWatchedByAll
                ? "Mark as unwatched by all"
                : "Mark as watched by all"
            }
          >
            {isWatchedByAll ? (
              <IconEyeCancel size={18} />
            ) : (
              <IconEyeOff size={18} />
            )}
          </button>
        )}

        {/* Delete Button */}
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
    </div>
  );
}
