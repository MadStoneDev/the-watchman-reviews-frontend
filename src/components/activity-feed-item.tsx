"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  IconPlayerPlay,
  IconMovie,
  IconCheck,
  IconMessage,
  IconTrophy,
} from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { createClient } from "@/src/utils/supabase/client";
import type { ActivityFeedItem as ActivityItem, ActivityType } from "@/src/app/actions/activity-feed";

interface ActivityFeedItemProps {
  activity: ActivityItem;
}

export default function ActivityFeedItem({ activity }: ActivityFeedItemProps) {
  const supabase = createClient();
  const router = useRouter();

  const getIcon = () => {
    switch (activity.activity_type) {
      case "episode_watched":
        return <IconPlayerPlay size={20} className="text-lime-400" />;
      case "series_started":
        return <IconMovie size={20} className="text-cyan-400" />;
      case "series_completed":
        return <IconCheck size={20} className="text-emerald-400" />;
      case "comment_posted":
        return <IconMessage size={20} className="text-indigo-400" />;
      case "achievement_unlocked":
        return <IconTrophy size={20} className="text-amber-400" />;
      default:
        return <IconPlayerPlay size={20} className="text-neutral-400" />;
    }
  };

  const getAvatarUrl = () => {
    if (activity.user.avatar_path) {
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(activity.user.avatar_path);
      return data.publicUrl;
    }
    return null;
  };

  const getActivityText = (): { action: string; detail?: string } => {
    const { activity_type, data } = activity;

    switch (activity_type) {
      case "episode_watched":
        return {
          action: "watched",
          detail: data.series_name
            ? `${data.series_name} S${data.season_number}E${data.episode_number}${data.episode_name ? ` "${data.episode_name}"` : ""}`
            : `Episode`,
        };
      case "series_started":
        return {
          action: "started watching",
          detail: data.series_name || "a new series",
        };
      case "series_completed":
        return {
          action: "completed",
          detail: data.series_name || "a series",
        };
      case "comment_posted":
        return {
          action: "commented",
          detail: data.comment_preview
            ? `"${data.comment_preview}${data.comment_preview.length >= 100 ? "..." : ""}"`
            : undefined,
        };
      case "achievement_unlocked":
        return {
          action: "unlocked",
          detail: data.achievement_name || "an achievement",
        };
      default:
        return { action: "did something" };
    }
  };

  const getLink = (): string | null => {
    const { activity_type, data, series_id } = activity;

    switch (activity_type) {
      case "episode_watched":
      case "series_started":
      case "series_completed":
        return series_id ? `/series/${series_id}` : null;
      case "comment_posted":
        if (data.media_type && data.media_id) {
          return `/${data.media_type}s/${data.media_id}`;
        }
        return null;
      case "achievement_unlocked":
        return `/u/${activity.user.username}/achievements`;
      default:
        return null;
    }
  };

  const getTierColor = (tier?: string): string => {
    switch (tier) {
      case "bronze":
        return "text-orange-400";
      case "silver":
        return "text-neutral-300";
      case "gold":
        return "text-amber-400";
      case "platinum":
        return "text-cyan-400";
      default:
        return "text-neutral-400";
    }
  };

  const avatarUrl = getAvatarUrl();
  const { action, detail } = getActivityText();
  const link = getLink();
  const timeAgo = formatDistanceToNow(new Date(activity.created_at), {
    addSuffix: true,
  });

  const handleCardClick = () => {
    if (link) {
      router.push(link);
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <article
      className={`group p-4 flex items-start gap-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors ${link ? "cursor-pointer" : ""}`}
      onClick={handleCardClick}
    >
      {/* Avatar */}
      <Link
        href={`/u/${activity.user.username}`}
        className="shrink-0"
        onClick={handleLinkClick}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={activity.user.username}
            width={40}
            height={40}
            className="rounded-full aspect-square object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-lime-400 flex items-center justify-center text-neutral-900 text-lg font-bold">
            {activity.user.username[0].toUpperCase()}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex-grow min-w-0">
        <div className="flex items-start gap-2">
          <div className="flex-grow">
            <p className="text-sm">
              <Link
                href={`/u/${activity.user.username}`}
                className="font-medium text-lime-400 hover:underline"
                onClick={handleLinkClick}
              >
                {activity.user.username}
              </Link>{" "}
              <span className="text-neutral-300">{action}</span>{" "}
              {detail && (
                <span
                  className={
                    activity.activity_type === "achievement_unlocked"
                      ? getTierColor(activity.data.achievement_tier)
                      : "text-white font-medium"
                  }
                >
                  {detail}
                </span>
              )}
            </p>
            <p className="text-xs text-neutral-500 mt-1">{timeAgo}</p>
          </div>

          {/* Activity Type Icon */}
          <div className="shrink-0 w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">
            {getIcon()}
          </div>
        </div>

        {/* Series Poster for watching activities */}
        {activity.data.series_poster && (
          <div className="mt-3">
            <Image
              src={`https://image.tmdb.org/t/p/w92${activity.data.series_poster}`}
              alt={activity.data.series_name || "Series"}
              width={46}
              height={69}
              className="rounded"
            />
          </div>
        )}
      </div>
    </article>
  );
}
