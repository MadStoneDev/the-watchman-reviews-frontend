import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import {
  IconMovie,
  IconDeviceTv,
  IconMoodEmpty,
  IconCheck,
} from "@tabler/icons-react";
import {
  getPublicProfile,
  getPublicStats,
  getPublicReelDeck,
  type PublicReelDeckItem,
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
    title: `${username}'s Reel Deck | JustReel`,
    description: `See what ${username} is currently watching on JustReel`,
  };
}

export const revalidate = 60;

export default async function PublicReelDeckPage({
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
  const reelDeckResult = await getPublicReelDeck(profile.id);

  const stats = statsResult.stats || {
    episodes_watched: 0,
    shows_started: 0,
    shows_completed: 0,
    achievements_count: 0,
    followers_count: 0,
    following_count: 0,
  };

  const allItems = reelDeckResult.items || [];

  // Split into currently watching and completed based on actual watch progress
  const watchingItems = allItems.filter((item) => !item.isCompleted);
  const completedItems = allItems.filter((item) => item.isCompleted);

  return (
    <>
      <section className="my-6 lg:my-8 transition-all duration-300 ease-in-out">
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
          className="px-4 py-2 rounded-lg bg-lime-400 text-neutral-900 font-medium whitespace-nowrap"
        >
          Reel Deck
        </Link>
        <Link
          href={`/u/${profile.username}/collections`}
          className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 font-medium transition-colors whitespace-nowrap"
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

      {/* Reel Deck */}
      <AnimatedTabContent tabIndex={1}>
        {allItems.length === 0 ? (
          <section className="mt-8">
            <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
              <IconMoodEmpty size={48} className="mb-4" />
              <p className="text-lg">No items in reel deck</p>
              <p className="text-sm mt-1">
                This user hasn't shared what they're watching
              </p>
            </div>
          </section>
        ) : (
          <>
            {/* Currently Watching */}
            {watchingItems.length > 0 && (
              <section className="mt-8">
                <h2 className="text-xl font-bold mb-4">Currently Watching</h2>
                <ReelDeckGrid items={watchingItems} />
              </section>
            )}

            {/* Completed */}
            {completedItems.length > 0 && (
              <section className="mt-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <IconCheck size={20} className="text-lime-400" />
                  Completed
                </h2>
                <ReelDeckGrid items={completedItems} />
              </section>
            )}
          </>
        )}
      </AnimatedTabContent>
    </>
  );
}

function ReelDeckGrid({ items }: { items: PublicReelDeckItem[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Link
          key={item.id}
          href={
            item.media_type === "movie"
              ? `/movies/${item.media_id}`
              : `/series/${item.media_id}`
          }
          className="group relative block h-24 rounded-xl overflow-hidden transition-all hover:scale-[1.02]"
        >
          {/* Background Image */}
          {item.poster_path ? (
            <div
              className="absolute inset-0 opacity-70 group-hover:opacity-90 transition-opacity"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/w500${item.poster_path})`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-800" />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-transparent" />

          {/* Content */}
          <div className="relative z-10 flex items-center gap-3 h-full p-4">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                item.media_type === "movie"
                  ? "bg-lime-500/30"
                  : "bg-indigo-500/30"
              }`}
            >
              {item.media_type === "movie" ? (
                <IconMovie size={20} className="text-lime-400" />
              ) : (
                <IconDeviceTv size={20} className="text-indigo-400" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-white truncate">{item.title}</h3>
              <p className="text-xs text-neutral-400 mt-1">
                {item.release_year || "Unknown year"}
                {" · "}
                {item.media_type === "movie" ? "Movie" : "TV Show"}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
