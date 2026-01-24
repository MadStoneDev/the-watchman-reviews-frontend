"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  IconPlayerPlay,
  IconMovie,
  IconTrophy,
  IconUsers,
  IconUserPlus,
} from "@tabler/icons-react";
import { createClient } from "@/src/utils/supabase/client";
import FollowButton from "./follow-button";
import type { PublicProfile, PublicStats } from "@/src/app/actions/public-profiles";

interface PublicProfileHeaderProps {
  profile: PublicProfile;
  stats: PublicStats;
  isOwnProfile: boolean;
  isFollowing: boolean;
  currentUserId?: string;
}

export default function PublicProfileHeader({
  profile,
  stats,
  isOwnProfile,
  isFollowing,
  currentUserId,
}: PublicProfileHeaderProps) {
  const supabase = createClient();

  const getAvatarUrl = () => {
    if (profile.avatar_path) {
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(profile.avatar_path);
      return data.publicUrl;
    }
    return null;
  };

  const avatarUrl = getAvatarUrl();
  const memberSince = formatDistanceToNow(new Date(profile.created_at), {
    addSuffix: true,
  });

  return (
    <div className="bg-neutral-800 rounded-xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <div className="shrink-0">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={profile.username}
              width={120}
              height={120}
              className="rounded-full aspect-square object-cover"
            />
          ) : (
            <div className="w-[120px] h-[120px] rounded-full bg-lime-400 flex items-center justify-center text-neutral-900 text-5xl font-bold">
              {profile.username[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-grow text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {profile.username}
            </h1>

            {!isOwnProfile && currentUserId && (
              <FollowButton
                targetUserId={profile.id}
                targetUsername={profile.username}
                initialStatus={{
                  isFollowing: isFollowing,
                  isFollowedBy: false,
                  isMutual: false,
                }}
              />
            )}

            {isOwnProfile && (
              <Link
                href="/settings"
                className="px-4 py-2 rounded-lg bg-neutral-700 text-white hover:bg-neutral-600 transition-colors text-sm"
              >
                Edit Profile
              </Link>
            )}
          </div>

          {profile.bio && (
            <p className="text-neutral-300 mb-4 max-w-xl">{profile.bio}</p>
          )}

          <p className="text-sm text-neutral-500">
            Joined {memberSince}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-neutral-700/50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <IconPlayerPlay size={20} className="text-lime-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {stats.episodes_watched.toLocaleString()}
          </div>
          <div className="text-xs text-neutral-400">Episodes</div>
        </div>

        <div className="bg-neutral-700/50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <IconMovie size={20} className="text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {stats.currently_watching.toLocaleString()}
          </div>
          <div className="text-xs text-neutral-400">Currently Watching</div>
        </div>

        <div className="bg-neutral-700/50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <IconMovie size={20} className="text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {stats.up_to_date.toLocaleString()}
          </div>
          <div className="text-xs text-neutral-400">Up to Date</div>
        </div>

        <div className="bg-neutral-700/50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <IconTrophy size={20} className="text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {stats.achievements_count.toLocaleString()}
          </div>
          <div className="text-xs text-neutral-400">Achievements</div>
        </div>

        <div className="bg-neutral-700/50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <IconUsers size={20} className="text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {stats.followers_count.toLocaleString()}
          </div>
          <div className="text-xs text-neutral-400">Followers</div>
        </div>

        <div className="bg-neutral-700/50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <IconUserPlus size={20} className="text-rose-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {stats.following_count.toLocaleString()}
          </div>
          <div className="text-xs text-neutral-400">Following</div>
        </div>
      </div>
    </div>
  );
}
