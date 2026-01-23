import React from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/src/utils/supabase/server";
import { getFollowCounts } from "@/src/app/actions/follows";
import { getAchievementStats } from "@/src/app/actions/achievements";

import BrowseNavigation from "@/src/components/browse-navigation";
import EditableUsername from "@/src/components/editable-username";
import FollowCountsDisplay from "@/src/components/follow-counts";
import AchievementsLink from "@/src/components/achievements-link";
import RecommendationsSection from "@/src/components/recommendations-section";
import { MediaCollection } from "@/src/lib/types";

export default async function MyAccountPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: user, error } = await supabase.auth.getClaims();

  if (error || !user) {
    redirect("/auth/portal");
  }

  // Get the current user's profile
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.claims.sub)
    .single();

  if (profileError || !profileData) {
    redirect("/auth/portal");
  }

  // Calculate days since last username change
  let daysSinceLastChange = null;

  if (profileData.last_username_change) {
    const lastChangeDate = new Date(profileData.last_username_change);
    const currentDate = new Date();
    daysSinceLastChange = Math.floor(
      (currentDate.getTime() - lastChangeDate.getTime()) / (1000 * 60 * 60 * 24),
    );
  }

  // Get follow counts and achievements
  const [followCountsResult, achievementStatsResult] = await Promise.all([
    getFollowCounts(profileData.id),
    getAchievementStats(profileData.id),
  ]);

  const followCounts = followCountsResult.counts || {
    followers: 0,
    following: 0,
  };
  const achievementStats = achievementStatsResult.stats || {
    unlocked: 0,
    total: 0,
  };

  // Get collections for recommendations
  const [ownedResult, sharedResult] = await Promise.all([
    supabase.from("collections").select("*").eq("owner", user.claims.sub),
    supabase
      .from("shared_collection")
      .select(`
        collection_id,
        collections:collection_id (
          id,
          title,
          owner,
          is_public
        )
      `)
      .eq("user_id", user.claims.sub),
  ]);

  let ownedCollections: MediaCollection[] = [];
  let sharedCollections: MediaCollection[] = [];

  if (ownedResult.data) {
    ownedCollections = ownedResult.data.map((collection) => ({
      id: collection.id,
      title: collection.title || "Untitled Collection",
      owner: collection.owner,
      is_public: collection.is_public,
      shared: false,
    }));
  }

  if (sharedResult.data) {
    sharedCollections = sharedResult.data
      .map((item: any) => item.collections)
      .filter(Boolean)
      .map((collection: any) => ({
        id: collection.id,
        title: collection.title || "Untitled Shared Collection",
        owner: collection.owner,
        is_public: collection.is_public,
        shared: true,
      }));
  }

  return (
    <>
      <BrowseNavigation
        items={[
          {
            label: "Account",
            href: "/me",
          },
          {
            label: "Collections",
            href: "/me/collections",
            textColor: "hover:text-indigo-500",
            bgColor: "bg-indigo-500",
          },
        ]}
        profileId={profileData.id}
        currentUserId={user.claims.sub}
      />

      <section className="mt-6 lg:mt-8 mb-6 transition-all duration-300 ease-in-out">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <EditableUsername
              username={profileData.username}
              lastUsernameChange={profileData.last_username_change}
              daysSinceLastChange={daysSinceLastChange !== null ? daysSinceLastChange : 999}
              profileId={profileData.id}
              currentUserId={user.claims.sub}
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <FollowCountsDisplay
              username={profileData.username}
              counts={followCounts}
              basePath="/me"
            />
            <AchievementsLink
              username={profileData.username}
              unlockedCount={achievementStats.unlocked}
              totalCount={achievementStats.total}
              basePath="/me"
            />
          </div>
        </div>
      </section>

      <RecommendationsSection
        username={profileData.username}
        userId={user.claims.sub}
        userRole={profileData.role || 0}
        ownedCollections={ownedCollections}
        sharedCollections={sharedCollections}
      />
    </>
  );
}
