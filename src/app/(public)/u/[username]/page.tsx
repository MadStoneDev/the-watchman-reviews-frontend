import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import {
  getPublicProfile,
  getPublicStats,
  getPublicActivity,
} from "@/src/app/actions/public-profiles";
import { IconLock, IconMoodEmpty } from "@tabler/icons-react";

import PublicProfileHeader from "@/src/components/public-profile-header";
import PrivateProfileNotice from "@/src/components/private-profile-notice";
import ActivityFeed from "@/src/components/activity-feed";
import AnimatedTabContent from "@/src/components/animated-tab-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const result = await getPublicProfile(username);

  if (!result.success || !result.profile) {
    return {
      title: "Profile Not Found | JustReel",
    };
  }

  const profile = result.profile;
  const isPrivate = profile.profile_visibility === "private";

  return {
    title: `${profile.username} | JustReel`,
    description: isPrivate
      ? `${profile.username}'s profile on JustReel`
      : `Follow ${profile.username} on JustReel and see what they're watching`,
    openGraph: {
      type: "profile",
      username: profile.username,
    },
    robots: isPrivate ? { index: false } : {},
  };
}

export const revalidate = 60; // Revalidate every minute

export default async function PublicProfilePage({
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

  // Get current user ID
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getClaims();
  const currentUserId = userData?.claims?.sub;

  // If profile is not viewable, show private notice
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

  // Get stats and activity
  const statsResult = await getPublicStats(profile.id);
  const activityResult = await getPublicActivity(profile.id, 1, 10);

  const stats = statsResult.stats || {
    episodes_watched: 0,
    currently_watching: 0,
    up_to_date: 0,
    achievements_count: 0,
    followers_count: 0,
    following_count: 0,
  };

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
          className="px-4 py-2 rounded-lg bg-lime-400 text-neutral-900 font-medium whitespace-nowrap"
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

      {/* Recent Activity */}
      <AnimatedTabContent tabIndex={0}>
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          {activityResult.hidden ? (
            <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
              <IconLock size={48} className="mb-4" />
              <p className="text-lg">Activity is hidden</p>
              <p className="text-sm mt-1">
                {profile.username} has chosen to keep their activity private
              </p>
            </div>
          ) : (activityResult.activities || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
              <IconMoodEmpty size={48} className="mb-4" />
              <p className="text-lg">No activity yet</p>
              <p className="text-sm mt-1">
                {profile.username} does not have any activity to show
              </p>
            </div>
          ) : (
            <ActivityFeed
              userId={profile.id}
              initialActivities={activityResult.activities || []}
            />
          )}
        </section>
      </AnimatedTabContent>
    </>
  );
}
