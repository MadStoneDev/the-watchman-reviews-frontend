"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconChairDirector,
  IconDeviceTv,
  IconPlayerPlay,
  IconPlayerPause,
  IconCircleCheck,
  IconClock,
  IconCalendar,
} from "@tabler/icons-react";

interface ReelDeckItem {
  id: string;
  added_at: string | null;
  last_watched_at: string | null;
  media_id: string;
  media_type: string;
  status: string | null;
  user_id: string;
}

interface MediaWithReelDeck {
  id: string;
  title: string;
  poster_path: string | null;
  release_year: string | null;
  tmdb_id: number;
  reelDeckItem: ReelDeckItem;
}

interface ReelDeckGridProps {
  items: MediaWithReelDeck[];
  username: string;
}

const STATUS_CONFIG = {
  watching: {
    label: "Watching",
    icon: IconPlayerPlay,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/50",
  },
  completed: {
    label: "Completed",
    icon: IconCircleCheck,
    color: "text-lime-400",
    bgColor: "bg-lime-400/10",
    borderColor: "border-lime-400/50",
  },
  paused: {
    label: "On Hold",
    icon: IconPlayerPause,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    borderColor: "border-orange-400/50",
  },
  plan_to_watch: {
    label: "Plan to Watch",
    icon: IconClock,
    color: "text-neutral-400",
    bgColor: "bg-neutral-400/10",
    borderColor: "border-neutral-400/50",
  },
};

export default function ReelDeckGrid({ items, username }: ReelDeckGridProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((item) => {
        const statusConfig =
          STATUS_CONFIG[
            item.reelDeckItem.status as keyof typeof STATUS_CONFIG
          ] || STATUS_CONFIG.watching;
        const StatusIcon = statusConfig.icon;
        const isMovie = item.reelDeckItem.media_type === "movie";
        const detailUrl = isMovie ? `/movies/${item.id}` : `/series/${item.id}`;

        return (
          <article
            key={item.id}
            className="group relative bg-neutral-900 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-all overflow-hidden"
          >
            {/* Poster */}
            <Link href={detailUrl} className="block">
              <div className="relative aspect-[2/3] bg-neutral-800">
                {item.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {isMovie ? (
                      <IconChairDirector
                        size={48}
                        className="text-neutral-600"
                      />
                    ) : (
                      <IconDeviceTv size={48} className="text-neutral-600" />
                    )}
                  </div>
                )}

                {/* Status Badge */}
                <div
                  className={`absolute top-2 left-2 px-2 py-1 rounded-md flex items-center gap-1.5 ${statusConfig.bgColor} ${statusConfig.borderColor} border backdrop-blur-sm`}
                >
                  <StatusIcon size={14} className={statusConfig.color} />
                  <span className={`text-xs font-medium ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </div>

                {/* Media Type Badge */}
                <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-neutral-900/80 backdrop-blur-sm border border-neutral-800">
                  <span className="text-xs font-medium text-neutral-400">
                    {isMovie ? "Movie" : "TV"}
                  </span>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>

            {/* Content */}
            <div className="p-3">
              <Link href={detailUrl}>
                <h3 className="text-sm font-medium line-clamp-2 mb-1 group-hover:text-lime-400 transition-colors">
                  {item.title}
                </h3>
              </Link>

              {/* Meta Info */}
              <div className="space-y-1">
                {item.release_year && (
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <IconCalendar size={14} />
                    <span>{item.release_year}</span>
                  </div>
                )}

                {/* Last Watched */}
                {item.reelDeckItem.last_watched_at && (
                  <p className="text-xs text-neutral-500">
                    Updated {formatDate(item.reelDeckItem.last_watched_at)}
                  </p>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
