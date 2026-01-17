import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import { IconFolder, IconMoodEmpty } from "@tabler/icons-react";
import {
  getPublicProfile,
  getPublicStats,
  getPublicCollections,
} from "@/src/app/actions/public-profiles";

import PublicProfileHeader from "@/src/components/public-profile-header";
import PrivateProfileNotice from "@/src/components/private-profile-notice";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `${username}'s Collections | JustReel`,
    description: `Browse ${username}'s public collections on JustReel`,
  };
}

export const revalidate = 60;

export default async function PublicCollectionsPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const profileResult = await getPublicProfile(username);

  if (!profileResult.success || !profileResult.profile) {
    notFound();
  }

  const profile = profileResult.profile;
  const isOwnProfile = profileResult.isOwnProfile || false;
  const isFollowing = profileResult.isFollowing || false;
  const canView = profileResult.canView || false;

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getClaims();
  const currentUserId = userData?.claims?.sub;

  if (!canView) {
    return (
      <div className="mt-6 lg:mt-8">
        <PrivateProfileNotice
          profile={profile}
          isFollowing={isFollowing}
          currentUserId={currentUserId}
        />
      </div>
    );
  }

  const statsResult = await getPublicStats(profile.id);
  const collectionsResult = await getPublicCollections(profile.id, 1, 50);

  const stats = statsResult.stats || {
    episodes_watched: 0,
    shows_started: 0,
    shows_completed: 0,
    achievements_count: 0,
    followers_count: 0,
    following_count: 0,
  };

  const collections = collectionsResult.collections || [];

  return (
    <>
      <section className="mt-6 lg:mt-8 transition-all duration-300 ease-in-out">
        <PublicProfileHeader
          profile={profile}
          stats={stats}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          currentUserId={currentUserId}
        />
      </section>

      {/* Navigation tabs */}
      <nav className="mt-8 flex gap-4 border-b border-neutral-700 pb-4">
        <Link
          href={`/u/${username}`}
          className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 font-medium transition-colors"
        >
          Activity
        </Link>
        <Link
          href={`/u/${username}/collections`}
          className="px-4 py-2 rounded-lg bg-lime-400 text-neutral-900 font-medium"
        >
          Collections
        </Link>
        <Link
          href={`/u/${username}/achievements`}
          className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 font-medium transition-colors"
        >
          Achievements
        </Link>
      </nav>

      {/* Collections */}
      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">Public Collections</h2>

        {collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
            <IconMoodEmpty size={48} className="mb-4" />
            <p className="text-lg">No public collections</p>
            <p className="text-sm mt-1">
              This user hasn't made any collections public yet
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.id}`}
                className="block bg-neutral-800 rounded-xl p-4 hover:bg-neutral-700 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <IconFolder size={24} className="text-indigo-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-white truncate">
                      {collection.name}
                    </h3>
                    {collection.description && (
                      <p className="text-sm text-neutral-400 mt-1 line-clamp-2">
                        {collection.description}
                      </p>
                    )}
                    <p className="text-xs text-neutral-500 mt-2">
                      {collection.item_count} item
                      {collection.item_count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
