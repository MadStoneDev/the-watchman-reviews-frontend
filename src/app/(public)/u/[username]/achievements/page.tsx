import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import { IconTrophy } from "@tabler/icons-react";
import {
  getPublicProfile,
  getPublicStats,
} from "@/src/app/actions/public-profiles";
import {
  getAchievementDefinitions,
  getUserAchievements,
  getAchievementStats,
} from "@/src/app/actions/achievements";

import PublicProfileHeader from "@/src/components/public-profile-header";
import PrivateProfileNotice from "@/src/components/private-profile-notice";
import { AchievementGrid } from "@/src/components/achievement-badge";
import AnimatedTabContent from "@/src/components/animated-tab-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `${username}'s Achievements | JustReel`,
    description: `Browse ${username}'s achievements on JustReel`,
  };
}

export const revalidate = 60;

export default async function PublicAchievementsPage({
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

  // Fetch data in parallel
  const [statsResult, definitionsResult, userAchievementsResult, achievementStatsResult] =
    await Promise.all([
      getPublicStats(profile.id),
      getAchievementDefinitions(),
      getUserAchievements(profile.id),
      getAchievementStats(profile.id),
    ]);

  const stats = statsResult.stats || {
    episodes_watched: 0,
    currently_watching: 0,
    up_to_date: 0,
    achievements_count: 0,
    followers_count: 0,
    following_count: 0,
  };

  const definitions = definitionsResult.achievements || [];
  const userAchievements = userAchievementsResult.achievements || [];
  const achievementStats = achievementStatsResult.stats;

  // Create a map for easy lookup
  const userAchievementsMap = new Map(
    userAchievements.map((ua) => [ua.achievement_id, { unlocked_at: ua.unlocked_at }])
  );

  // Group definitions by category
  const categorizedAchievements = definitions.reduce((acc, def) => {
    if (!acc[def.category]) {
      acc[def.category] = [];
    }
    acc[def.category].push(def);
    return acc;
  }, {} as Record<string, typeof definitions>);

  const categoryLabels: Record<string, string> = {
    watching: "Watching",
    social: "Social",
    engagement: "Engagement",
    special: "Special",
  };

  const categoryOrder = ["watching", "social", "engagement", "special"];

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
          className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 font-medium transition-colors whitespace-nowrap"
        >
          Collections
        </Link>
        <Link
          href={`/u/${profile.username}/achievements`}
          className="px-4 py-2 rounded-lg bg-lime-400 text-neutral-900 font-medium whitespace-nowrap"
        >
          Achievements
        </Link>
      </nav>

      {/* Achievements Content */}
      <AnimatedTabContent tabIndex={2}>
        <section className="mt-8 mb-6">
          <h2 className="text-2xl font-bold">{profile.username}'s Achievements</h2>

          {/* Stats Summary */}
          {achievementStats && (
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-neutral-800 rounded-lg px-4 py-2">
                <IconTrophy size={20} className="text-amber-400" />
                <span className="font-semibold">{achievementStats.unlocked}</span>
                <span className="text-neutral-400">/ {achievementStats.total} Unlocked</span>
              </div>
              {Object.entries(achievementStats.byCategory).map(([category, data]) => (
                <div
                  key={category}
                  className="flex items-center gap-2 bg-neutral-800/50 rounded-lg px-3 py-1.5 text-sm"
                >
                  <span className="text-neutral-400 capitalize">{category}:</span>
                  <span className="font-medium">
                    {data.unlocked}/{data.total}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Achievements by Category */}
        <div className="space-y-8 pb-8">
          {categoryOrder.map((category) => {
            const achievements = categorizedAchievements[category];
            if (!achievements || achievements.length === 0) return null;

            return (
              <section key={category}>
                <h3 className="text-xl font-semibold mb-4 capitalize">
                  {categoryLabels[category] || category}
                </h3>
                <AchievementGrid
                  achievements={achievements}
                  userAchievements={userAchievementsMap}
                  showLocked={true}
                />
              </section>
            );
          })}
        </div>
      </AnimatedTabContent>
    </>
  );
}
