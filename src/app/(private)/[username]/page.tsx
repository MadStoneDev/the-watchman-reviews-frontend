import React from "react";
import { redirect, notFound } from "next/navigation";

import { createClient } from "@/src/utils/supabase/server";
import { checkFollowStatus, getFollowCounts } from "@/src/app/actions/follows";
import { getAchievementStats } from "@/src/app/actions/achievements";

import BrowseNavigation from "@/src/components/browse-navigation";
import EditableUsername from "@/src/components/editable-username";
import FollowButton from "@/src/components/follow-button";
import FollowCountsDisplay from "@/src/components/follow-counts";
import AchievementsLink from "@/src/components/achievements-link";
import RecommendationsSection from "@/src/components/recommendations-section";
import { MediaCollection } from "@/src/lib/types";

export default async function PrivatePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: user, error } = await supabase.auth.getClaims();

  // If no user is found, redirect to auth portal
  if (error || !user) {
    redirect("/auth/portal");
  }

  // Check if the username exists in public.profiles
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  // If username doesn't exist in profiles, show 404 page
  if (profileError || !profileData) {
    notFound();
  }

  // Calculate days since last username change
  let daysSinceLastChange = null;

  if (profileData.last_username_change) {
    const lastChangeDate = new Date(profileData.last_username_change);
    const currentDate = new Date();

    // Calculate the difference in days
    daysSinceLastChange = Math.floor(
      (currentDate.getTime() - lastChangeDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );
  }

  // Get follow data and achievements
  const isOwnProfile = profileData.id === user.claims.sub;
  const [followStatusResult, followCountsResult, achievementStatsResult] = await Promise.all([
    isOwnProfile
      ? Promise.resolve({ success: true, status: { isFollowing: false, isFollowedBy: false, isMutual: false } })
      : checkFollowStatus(profileData.id),
    getFollowCounts(profileData.id),
    getAchievementStats(profileData.id),
  ]);

  const followStatus = followStatusResult.status || {
    isFollowing: false,
    isFollowedBy: false,
    isMutual: false,
  };
  const followCounts = followCountsResult.counts || {
    followers: 0,
    following: 0,
  };
  const achievementStats = achievementStatsResult.stats || {
    unlocked: 0,
    total: 0,
  };

  // Get collections for recommendations (only for own profile)
  let ownedCollections: MediaCollection[] = [];
  let sharedCollections: MediaCollection[] = [];

  if (isOwnProfile) {
    const [ownedResult, sharedResult] = await Promise.all([
      supabase
        .from("collections")
        .select("*")
        .eq("owner", user.claims.sub),
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
  }

  return (
    <>
      <BrowseNavigation
        items={[
          {
            label: `${
              profileData.id === user.claims.sub ? "Account" : "Profile"
            }`,
            href: `/${profileData.username}`,
          },
          {
            label: "Collections",
            href: `/${profileData.username}/collections`,
            textColor: `hover:text-indigo-500`, bgColor: `bg-indigo-500`,
          },
        ]}
        profileId={profileData.id}
        currentUserId={user.claims.sub}
      />

      <section
        className={`mt-6 lg:mt-8 mb-6 transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <EditableUsername
              username={profileData.username}
              lastUsernameChange={profileData.last_username_change}
              daysSinceLastChange={
                daysSinceLastChange !== null ? daysSinceLastChange : 999
              }
              profileId={profileData.id}
              currentUserId={user.claims.sub}
            />
            {!isOwnProfile && (
              <FollowButton
                targetUserId={profileData.id}
                targetUsername={profileData.username}
                initialStatus={followStatus}
              />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <FollowCountsDisplay
              username={profileData.username}
              counts={followCounts}
            />
            <AchievementsLink
              username={profileData.username}
              unlockedCount={achievementStats.unlocked}
              totalCount={achievementStats.total}
            />
          </div>
        </div>
      </section>

      {/* Recommendations Section - Only for own profile */}
      {isOwnProfile && (
        <RecommendationsSection
          username={profileData.username}
          userId={user.claims.sub}
          userRole={profileData.role || 0}
          ownedCollections={ownedCollections}
          sharedCollections={sharedCollections}
        />
      )}
    </>
  );
}
