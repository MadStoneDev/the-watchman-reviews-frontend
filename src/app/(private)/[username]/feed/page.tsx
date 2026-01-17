import React from "react";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import { getActivityFeed } from "@/src/app/actions/activity-feed";

import BrowseNavigation from "@/src/components/browse-navigation";
import ActivityFeed from "@/src/components/activity-feed";

export const revalidate = 0; // Always fresh

export default async function FeedPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const supabase = await createClient();

  // Get current user
  const { data: user, error } = await supabase.auth.getClaims();

  if (error || !user) {
    redirect("/auth/portal");
  }

  // Get profile for this username
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("username", username)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  // Only the profile owner can view their feed
  if (profile.id !== user.claims.sub) {
    redirect(`/${username}`);
  }

  // Get initial feed data
  const result = await getActivityFeed(1, 20);
  const activities = result.activities || [];

  return (
    <>
      <BrowseNavigation
        items={[
          { label: "Account", href: `/${username}` },
          {
            label: "Collections",
            href: `/${username}/collections`,
            textColor: "hover:text-indigo-500",
            bgColor: "bg-indigo-500",
          },
        ]}
        profileId={profile.id}
        currentUserId={user.claims.sub}
      />

      <section className="mt-6 lg:mt-8 mb-6 transition-all duration-300 ease-in-out">
        <h1 className="text-2xl sm:3xl md:text-4xl font-bold">
          Activity Feed
        </h1>
        <p className="text-neutral-400 mt-1">
          See what the people you follow are watching
        </p>
      </section>

      <ActivityFeed initialActivities={activities} />
    </>
  );
}
