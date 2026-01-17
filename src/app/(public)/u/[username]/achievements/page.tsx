import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import { IconTrophy, IconMoodEmpty } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import {
  getPublicProfile,
  getPublicStats,
  getPublicAchievements,
} from "@/src/app/actions/public-profiles";

import PublicProfileHeader from "@/src/components/public-profile-header";
import PrivateProfileNotice from "@/src/components/private-profile-notice";
import AchievementBadge from "@/src/components/achievement-badge";

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

  const statsResult = await getPublicStats(profile.id);
  const achievementsResult = await getPublicAchievements(profile.id);

  const stats = statsResult.stats || {
    episodes_watched: 0,
    shows_started: 0,
    shows_completed: 0,
    achievements_count: 0,
    followers_count: 0,
    following_count: 0,
  };

  const achievements = achievementsResult.achievements || [];

  // Group achievements by category
  const groupedAchievements = achievements.reduce(
    (acc: Record<string, any[]>, achievement: any) => {
      const category = achievement.achievement?.category || "other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(achievement);
      return acc;
    },
    {}
  );

  const categoryLabels: Record<string, string> = {
    watching: "Watching",
    social: "Social",
    engagement: "Engagement",
    special: "Special",
    other: "Other",
  };

  const categoryOrder = ["watching", "social", "engagement", "special", "other"];

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
          className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 font-medium transition-colors"
        >
          Collections
        </Link>
        <Link
          href={`/u/${username}/achievements`}
          className="px-4 py-2 rounded-lg bg-lime-400 text-neutral-900 font-medium"
        >
          Achievements
        </Link>
      </nav>

      {/* Achievements */}
      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">
          Achievements ({achievements.length})
        </h2>

        {achievements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
            <IconMoodEmpty size={48} className="mb-4" />
            <p className="text-lg">No achievements yet</p>
            <p className="text-sm mt-1">
              This user hasn't unlocked any achievements
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {categoryOrder.map((category) => {
              const categoryAchievements = groupedAchievements[category];
              if (!categoryAchievements || categoryAchievements.length === 0) {
                return null;
              }

              return (
                <div key={category}>
                  <h3 className="text-lg font-medium text-neutral-300 mb-4">
                    {categoryLabels[category]}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryAchievements.map((achievement: any) => (
                      <div
                        key={achievement.id}
                        className="bg-neutral-800 rounded-xl p-4"
                      >
                        <div className="flex items-start gap-3">
                          <AchievementBadge
                            achievement={achievement.achievement}
                            size="md"
                          />
                          <div className="min-w-0">
                            <h4 className="font-medium text-white">
                              {achievement.achievement?.name}
                            </h4>
                            <p className="text-sm text-neutral-400 mt-1">
                              {achievement.achievement?.description}
                            </p>
                            <p className="text-xs text-neutral-500 mt-2">
                              Unlocked{" "}
                              {formatDistanceToNow(
                                new Date(achievement.unlocked_at),
                                { addSuffix: true }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
