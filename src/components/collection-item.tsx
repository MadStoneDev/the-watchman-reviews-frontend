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
  IconGripVertical,
  IconExternalLink,
  IconBubbleText,
  IconCopyX,
  IconCopyCheck,
  IconSquareX,
  IconSquareCheck,
} from "@tabler/icons-react";

import { MediaItem } from "@/src/lib/types";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  // Hooks
  const router = useRouter();

  // States
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isWatchedByAll, setIsWatchedByAll] = useState(false);
  const [isUpdatingWatch, setIsUpdatingWatch] = useState(false);

  const supabase = createClient();

  const MEDIA_REFRESH_INTERVAL_DAYS = 30;

  // Functions
  const handleViewDetails = async () => {
    try {
      setLoading(true);

      // Use the API to ensure media exists and get DB ID
      const response = await fetch("/api/media/ensure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdb_id: data.tmdbId,
          media_type: data.mediaType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to load media");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to load media");
      }

      // Navigate to media page
      const path =
        data.mediaType === "movie"
          ? `/movies/${result.media_id}`
          : `/series/${result.media_id}`;

      router.push(path);
    } catch (err) {
      console.error("Error navigating to details:", err);
      toast.error("Failed to load media details");
    } finally {
      setLoading(false);
    }
  };

  const needsRefresh = (lastFetched: string | null): boolean => {
    if (!lastFetched) return true;

    const lastFetchedDate = new Date(lastFetched);
    const daysSinceLastFetch =
      (Date.now() - lastFetchedDate.getTime()) / (1000 * 60 * 60 * 24);

    return daysSinceLastFetch >= MEDIA_REFRESH_INTERVAL_DAYS;
  };

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
    const previousWatchedState = isWatched;
    setIsWatched(!isWatched);
    setIsUpdatingWatch(true);

    try {
      const { data: userData } = await supabase.auth.getClaims();
      if (!userData) {
        setIsWatched(previousWatchedState);
        return;
      }

      const userId = userData.claims.sub;

      if (previousWatchedState) {
        const { error } = await supabase
          .from("media_watches")
          .delete()
          .eq("collection_id", collectionId)
          .eq("media_id", data.id)
          .eq("media_type", data.mediaType)
          .eq("user_id", userId);

        if (error) throw error;

        setIsWatched(false);
      } else {
        const { data: insertedData, error } = await supabase
          .from("media_watches")
          .upsert({
            collection_id: collectionId,
            media_id: data.id,
            media_type: data.mediaType,
            user_id: userId,
            watched_at: new Date().toISOString(),
          })
          .select();

        if (error) throw error;

        setIsWatched(insertedData && insertedData.length > 0);
      }
    } catch (error) {
      console.error("Error toggling watch status:", error);
      setIsWatched(previousWatchedState);
    } finally {
      setIsUpdatingWatch(false);
    }
  };

  const handleWatchAllToggle = async () => {
    if (!isOwner) return;

    const previousWatchedByAllState = isWatchedByAll;
    const previousWatchedState = isWatched;

    setIsWatchedByAll(!isWatchedByAll);
    setIsWatched(!isWatchedByAll);
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

      if (previousWatchedByAllState) {
        const { error } = await supabase
          .from("media_watches")
          .delete()
          .eq("collection_id", collectionId)
          .eq("media_id", data.id)
          .eq("media_type", data.mediaType)
          .in("user_id", allUserIds);

        if (error) throw error;

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

          const { data: insertedData, error } = await supabase
            .from("media_watches")
            .upsert(watchRecords)
            .select();

          if (error) throw error;

          const totalWatches =
            (existingUserIds.length || 0) + (insertedData?.length || 0);
          setIsWatchedByAll(totalWatches === allUserIds.length);

          const { data: userData } = await supabase.auth.getClaims();
          if (userData) {
            const userId = userData.claims.sub;
            setIsWatched(
              existingUserIds.includes(userId) ||
                insertedData?.some((watch) => watch.user_id === userId) ||
                false,
            );
          }
        } else {
          setIsWatchedByAll(true);
        }
      }
    } catch (error) {
      console.error("Error toggling watch-all status:", error);
      // Revert on error
      setIsWatchedByAll(previousWatchedByAllState);
      setIsWatched(previousWatchedState);
    } finally {
      setIsUpdatingWatch(false);
    }
  };

  return (
    <div
      className={`group relative bg-neutral-900 h-full rounded-lg overflow-hidden border ${
        isWatched
          ? "border-lime-500"
          : "border-neutral-800 hover:border-neutral-700"
      } transition-all duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Watched Overlay */}
      {isWatched && (
        <div className="absolute inset-0 bg-lime-500/20 z-10 pointer-events-none" />
      )}

      <section className={`p-1 flex flex-row items-center justify-between`}>
        {/* Drag Handle - Top Left */}
        <div
          className="relative lg:absolute lg:top-2 lg:left-2 z-20 p-1.5 bg-neutral-900/80 backdrop-blur-xs rounded-sm cursor-grab active:cursor-grabbing opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity"
          {...dragHandleProps}
          {...dragAttributes}
        >
          <IconGripVertical size={16} className="text-neutral-400" />
        </div>

        {/* Watch Status Badge - Top Right */}
        {isWatched && (
          <div className="relative lg:absolute lg:top-2 lg:right-2 z-20 px-2 py-1 bg-lime-500 rounded-full flex items-center gap-1">
            <IconEye size={14} className="text-neutral-900" />
            <span className="text-xs font-medium text-neutral-900">
              Watched
            </span>
          </div>
        )}
      </section>

      {/* Poster Image */}
      <div className="relative aspect-2/3 bg-neutral-800">
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
          className={`absolute inset-0 bg-linear-to-t from-neutral-900 via-neutral-900/20 lg:via-neutral-900/60 to-transparent flex flex-col justify-end p-2 transition-opacity ${
            isHovered ? "opacity-100" : "lg:opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 mb-2 z-30">
            {/* Watch Toggle */}
            <button
              onClick={handleWatchToggle}
              disabled={isUpdatingWatch}
              className={`grow py-2 px-2 lg:px-3 rounded-lg transition-colors flex items-center justify-center ${
                isWatched
                  ? "bg-lime-500 text-neutral-900 hover:bg-lime-400"
                  : "bg-neutral-700/80 text-neutral-200 hover:bg-neutral-700"
              } ${isUpdatingWatch ? "opacity-50 cursor-not-allowed" : ""}`}
              title={isWatched ? "Mark as unwatched" : "Mark as watched"}
            >
              {isWatched ? (
                <IconSquareX
                  size={18}
                  className="scale-90 lg:scale-100"
                />
              ) : (
                <IconSquareCheck
                  size={18}
                  className="scale-90 lg:scale-100"
                />
              )}
            </button>

            {/* Watch All Toggle (Owner Only) */}
            {isOwner && (
              <button
                onClick={handleWatchAllToggle}
                disabled={isUpdatingWatch}
                className={`grow py-2 px-2 lg:px-3 rounded-lg transition-colors flex items-center justify-center ${
                  isWatchedByAll
                    ? "bg-lime-500 text-neutral-900 hover:bg-lime-400"
                    : "bg-neutral-700/80 text-neutral-200 hover:bg-neutral-700"
                } ${isUpdatingWatch ? "opacity-50 cursor-not-allowed" : ""}`}
                title={isWatchedByAll ? "Unwatch for all" : "Watch for all"}
              >
                {isWatchedByAll ? (
                  <IconCopyX
                    size={18}
                    className="scale-90 lg:scale-100"
                  />
                ) : (
                  <IconCopyCheck
                    size={18}
                    className="scale-90 lg:scale-100"
                  />
                )}
              </button>
            )}

            {/* Delete Button (Owner Only) */}
            {isOwner && (
              <button
                onClick={onDelete}
                className="grow py-2 px-2 lg:px-3 bg-red-600/80 text-neutral-50 hover:bg-red-600 rounded-lg transition-colors flex items-center justify-center"
                title="Remove from collection"
              >
                <IconTrash
                  size={18}
                  className="scale-90 lg:scale-100"
                />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <button
          onClick={handleViewDetails}
          disabled={loading}
          className="group/link flex items-start justify-between gap-1 mb-1"
          title="View details"
        >
          <h3
            className={`text-sm font-medium line-clamp-2 group-hover/link:text-lime-400 transition-colors ${
              isWatched ? "text-neutral-400" : "text-neutral-100"
            }`}
          >
            {data.title}
          </h3>
          <IconBubbleText
            size={20}
            className="text-neutral-600 group-hover/link:text-lime-400 transition-colors shrink-0 mt-0.5"
          />
        </button>
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
