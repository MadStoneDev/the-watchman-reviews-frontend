import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import { IconFolder, IconMoodEmpty, IconLock } from "@tabler/icons-react";
import {
  getPublicProfile,
  getPublicStats,
  getPublicCollections,
} from "@/src/app/actions/public-profiles";

import PublicProfileHeader from "@/src/components/public-profile-header";
import PrivateProfileNotice from "@/src/components/private-profile-notice";
import AnimatedTabContent from "@/src/components/animated-tab-content";

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
    currently_watching: 0,
    up_to_date: 0,
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

      {/* Navigation tabs - use profile.username for canonical URLs */}
      <nav className="mt-8 flex gap-4 border-b border-neutral-700 pb-4 overflow-x-auto">
        <Link
          href={`/u/${profile.username}`}
          className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 font-medium transition-colors whitespace-nowrap"
        >
          Activity
        </Link>
        <Link
          href={`/u/${profile.username}/reel-deck`}
          className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 font-medium transition-colors whitespace-nowrap"
        >
          Reel Deck
        </Link>
        <Link
          href={`/u/${profile.username}/collections`}
          className="px-4 py-2 rounded-lg bg-lime-400 text-neutral-900 font-medium whitespace-nowrap"
        >
          Collections
        </Link>
        <Link
          href={`/u/${profile.username}/achievements`}
          className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 font-medium transition-colors whitespace-nowrap"
        >
          Achievements
        </Link>
      </nav>

      {/* Collections */}
      <AnimatedTabContent tabIndex={1}>
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">Public Collections</h2>

          {collectionsResult.hidden ? (
            <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
              <IconLock size={48} className="mb-4" />
              <p className="text-lg">Collections are hidden</p>
              <p className="text-sm mt-1">
                {profile.username} has chosen to keep their collections private
              </p>
            </div>
          ) : collections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
              <IconMoodEmpty size={48} className="mb-4" />
              <p className="text-lg">No public collections</p>
              <p className="text-sm mt-1">
                {profile.username} does not have any public collections
              </p>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.id}`}
                  className="group relative block h-24 rounded-xl overflow-hidden transition-all hover:scale-[1.02]"
                >
                  {/* Background Image */}
                  {collection.backdrop_path ? (
                    <div
                      className="absolute inset-0 opacity-70 group-hover:opacity-90 transition-opacity"
                      style={{
                        backgroundImage: `url(https://image.tmdb.org/t/p/w780${collection.backdrop_path})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-neutral-800" />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/60 to-transparent" />

                  {/* Content */}
                  <div className="relative z-10 flex items-center gap-3 h-full p-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/30 flex items-center justify-center shrink-0">
                      <IconFolder size={20} className="text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-white truncate">
                        {collection.title}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1">
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
      </AnimatedTabContent>
    </>
  );
}
