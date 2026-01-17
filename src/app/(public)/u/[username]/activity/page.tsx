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

import PublicProfileHeader from "@/src/components/public-profile-header";
import PrivateProfileNotice from "@/src/components/private-profile-notice";
import ActivityFeed from "@/src/components/activity-feed";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `${username}'s Activity | JustReel`,
    description: `See ${username}'s recent activity on JustReel`,
  };
}

export const revalidate = 60;

export default async function PublicActivityPage({
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
  const activityResult = await getPublicActivity(profile.id, 1, 20);

  const stats = statsResult.stats || {
    episodes_watched: 0,
    shows_started: 0,
    shows_completed: 0,
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

      {/* Navigation tabs */}
      <nav className="mt-8 flex gap-4 border-b border-neutral-700 pb-4">
        <Link
          href={`/u/${username}`}
          className="px-4 py-2 rounded-lg bg-lime-400 text-neutral-900 font-medium"
        >
          Activity
        </Link>
        <Link
          href={`/u/${username}/collections`}
          className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 font-medium transition-colors"
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

      {/* Activity Feed */}
      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">All Activity</h2>
        <ActivityFeed
          userId={profile.id}
          initialActivities={activityResult.activities || []}
        />
      </section>
    </>
  );
}
