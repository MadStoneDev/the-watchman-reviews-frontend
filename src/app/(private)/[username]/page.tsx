import React from "react";
import { redirect, notFound } from "next/navigation";

import { createClient } from "@/src/utils/supabase/server";
import { checkFollowStatus, getFollowCounts } from "@/src/app/actions/follows";

import BrowseNavigation from "@/src/components/browse-navigation";
import EditableUsername from "@/src/components/editable-username";
import FollowButton from "@/src/components/follow-button";
import FollowCountsDisplay from "@/src/components/follow-counts";

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

  // Get follow data
  const isOwnProfile = profileData.id === user.claims.sub;
  const [followStatusResult, followCountsResult] = await Promise.all([
    isOwnProfile
      ? Promise.resolve({ success: true, status: { isFollowing: false, isFollowedBy: false, isMutual: false } })
      : checkFollowStatus(profileData.id),
    getFollowCounts(profileData.id),
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
          {
            label: "Followers",
            href: `/${profileData.username}/followers`,
            textColor: `hover:text-amber-400`, bgColor: `bg-amber-400`,
          },
          {
            label: "Following",
            href: `/${profileData.username}/following`,
            textColor: `hover:text-cyan-400`, bgColor: `bg-cyan-400`,
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
          <FollowCountsDisplay
            username={profileData.username}
            counts={followCounts}
          />
        </div>
      </section>
    </>
  );
}
