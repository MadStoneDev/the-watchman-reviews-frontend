import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import { getActivityFeed } from "@/src/app/actions/activity-feed";

import BrowseNavigation from "@/src/components/browse-navigation";
import ActivityFeed from "@/src/components/activity-feed";

export const revalidate = 0; // Always fresh

export default async function FeedPage() {
  const supabase = await createClient();

  // Get current user
  const { data: user, error } = await supabase.auth.getClaims();

  if (error || !user) {
    redirect("/auth/portal");
  }

  const currentUserId = user.claims.sub;

  // Get current user's profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("id", currentUserId)
    .single();

  if (profileError || !profile) {
    redirect("/auth/portal");
  }

  // Get initial feed data
  const result = await getActivityFeed(1, 20);
  const activities = result.activities || [];

  return (
    <>
      <BrowseNavigation
        items={[
          { label: "Account", href: "/me" },
          {
            label: "Collections",
            href: "/me/collections",
            textColor: "hover:text-indigo-500",
            bgColor: "bg-indigo-500",
          },
        ]}
        profileId={profile.id}
        currentUserId={currentUserId}
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
