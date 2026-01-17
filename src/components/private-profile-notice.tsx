"use client";

import React from "react";
import Image from "next/image";
import { IconLock, IconUserPlus } from "@tabler/icons-react";
import { createClient } from "@/src/utils/supabase/client";
import FollowButton from "./follow-button";
import type { PublicProfile, ProfileVisibility } from "@/src/app/actions/public-profiles";

interface PrivateProfileNoticeProps {
  profile: PublicProfile;
  isFollowing: boolean;
  currentUserId?: string;
}

export default function PrivateProfileNotice({
  profile,
  isFollowing,
  currentUserId,
}: PrivateProfileNoticeProps) {
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

  const getMessage = () => {
    if (profile.profile_visibility === "private") {
      return "This profile is private";
    }
    if (profile.profile_visibility === "followers_only") {
      return "This profile is only visible to followers";
    }
    return "This profile is not accessible";
  };

  const getSubMessage = () => {
    if (profile.profile_visibility === "followers_only" && !currentUserId) {
      return "Log in and follow this user to see their profile";
    }
    if (profile.profile_visibility === "followers_only" && !isFollowing) {
      return "Follow this user to see their profile";
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Avatar */}
      <div className="relative mb-6">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={profile.username}
            width={100}
            height={100}
            className="rounded-full aspect-square object-cover opacity-50"
          />
        ) : (
          <div className="w-[100px] h-[100px] rounded-full bg-neutral-700 flex items-center justify-center text-neutral-500 text-4xl font-bold">
            {profile.username[0].toUpperCase()}
          </div>
        )}
        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center border-4 border-neutral-900">
          <IconLock size={20} className="text-neutral-500" />
        </div>
      </div>

      {/* Username */}
      <h1 className="text-2xl font-bold text-white mb-2">
        @{profile.username}
      </h1>

      {/* Message */}
      <p className="text-neutral-400 mb-2">{getMessage()}</p>

      {/* Sub message */}
      {getSubMessage() && (
        <p className="text-sm text-neutral-500 mb-6">{getSubMessage()}</p>
      )}

      {/* Follow button for followers_only profiles */}
      {profile.profile_visibility === "followers_only" &&
        currentUserId &&
        !isFollowing && (
          <FollowButton
            targetUserId={profile.id}
            targetUsername={profile.username}
            initialStatus={{
              isFollowing: false,
              isFollowedBy: false,
              isMutual: false,
            }}
          />
        )}

      {/* Login prompt for non-logged-in users */}
      {!currentUserId && profile.profile_visibility === "followers_only" && (
        <a
          href="/auth/portal"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-lime-400 text-neutral-900 font-medium hover:bg-lime-300 transition-colors"
        >
          <IconUserPlus size={20} />
          Log in to follow
        </a>
      )}
    </div>
  );
}
