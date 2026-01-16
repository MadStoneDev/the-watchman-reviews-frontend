import React from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import {
  getAchievementDefinitions,
  getUserAchievements,
  getAchievementStats,
  backfillUserAchievements,
} from "@/src/app/actions/achievements";

import BrowseNavigation from "@/src/components/browse-navigation";
import { AchievementGrid } from "@/src/components/achievement-badge";
import { IconTrophy } from "@tabler/icons-react";

export const revalidate = 60;

export default async function AchievementsPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const supabase = await createClient();

  // Get current user
  const { data: user } = await supabase.auth.getClaims();
  const currentUserId = user?.claims.sub || null;

  // Get profile for this username
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("username", username)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  const isOwnProfile = currentUserId === profile.id;

  // Backfill achievements for the current user (checks existing activity and awards any earned achievements)
  // This ensures users who had activity before achievements were implemented get credit
  if (isOwnProfile && currentUserId) {
    await backfillUserAchievements(currentUserId);
  }

  // Fetch achievements data
  const [definitionsResult, userAchievementsResult, statsResult] = await Promise.all([
    getAchievementDefinitions(),
    getUserAchievements(profile.id),
    getAchievementStats(profile.id),
  ]);

  const definitions = definitionsResult.achievements || [];
  const userAchievements = userAchievementsResult.achievements || [];
  const stats = statsResult.stats;

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
      <BrowseNavigation
        items={[
          {
            label: isOwnProfile ? "Account" : "Profile",
            href: `/${profile.username}`,
          },
          {
            label: "Collections",
            href: `/${profile.username}/collections`,
            textColor: "hover:text-indigo-500",
            bgColor: "bg-indigo-500",
          },
        ]}
        profileId={profile.id}
        currentUserId={currentUserId || ""}
      />

      <section className="mt-6 lg:mt-8 mb-6 transition-all duration-300 ease-in-out">
        <h1 className="text-2xl sm:3xl md:text-4xl font-bold">
          {isOwnProfile ? "My Achievements" : `${username}'s Achievements`}
        </h1>

        {/* Stats Summary */}
        {stats && (
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-neutral-800 rounded-lg px-4 py-2">
              <IconTrophy size={20} className="text-amber-400" />
              <span className="font-semibold">{stats.unlocked}</span>
              <span className="text-neutral-400">/ {stats.total} Unlocked</span>
            </div>
            {Object.entries(stats.byCategory).map(([category, data]) => (
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
              <h2 className="text-xl font-semibold mb-4 capitalize">
                {categoryLabels[category] || category}
              </h2>
              <AchievementGrid
                achievements={achievements}
                userAchievements={userAchievementsMap}
                showLocked={true}
              />
            </section>
          );
        })}
      </div>
    </>
  );
}
