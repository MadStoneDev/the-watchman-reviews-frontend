"use client";

import Link from "next/link";
import Image from "next/image";
import FollowButton from "./follow-button";
import type { UserListProfile } from "@/src/lib/types";
import { createClient } from "@/src/utils/supabase/client";

interface UserListItemProps {
  user: UserListProfile;
  currentUserId?: string;
  showFollowButton?: boolean;
}

export default function UserListItem({
  user,
  currentUserId,
  showFollowButton = true,
}: UserListItemProps) {
  const supabase = createClient();
  const isOwnProfile = currentUserId === user.id;

  const getAvatarUrl = () => {
    if (user.avatar_path) {
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(user.avatar_path);
      return data.publicUrl;
    }
    return null;
  };

  const avatarUrl = getAvatarUrl();

  return (
    <article className="group p-3 flex items-center gap-3 hover:bg-neutral-800 rounded-lg transition-colors">
      <Link href={`/${user.username}`} className="shrink-0">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={user.username}
            width={48}
            height={48}
            className="rounded-full aspect-square object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-lime-400 flex items-center justify-center text-neutral-900 text-xl font-bold">
            {user.username[0].toUpperCase()}
          </div>
        )}
      </Link>

      <div className="flex-grow min-w-0">
        <Link
          href={`/${user.username}`}
          className="font-medium hover:text-lime-400 transition-colors block truncate"
        >
          {user.username}
        </Link>
        {user.followStatus?.isFollowedBy && !isOwnProfile && (
          <span className="text-xs text-neutral-500">Follows you</span>
        )}
      </div>

      {showFollowButton && !isOwnProfile && user.followStatus && (
        <FollowButton
          targetUserId={user.id}
          targetUsername={user.username}
          initialStatus={user.followStatus}
          size="sm"
        />
      )}
    </article>
  );
}
