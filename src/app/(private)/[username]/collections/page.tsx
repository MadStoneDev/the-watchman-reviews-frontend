import React from "react";

import { createClient } from "@/src/utils/supabase/server";
import BrowseNavigation from "@/src/components/browse-navigation";
import UserCollections from "@/src/components/user-collections-block";
import {
  IconChartBar,
  IconHome,
  IconLayout2,
  IconSearch,
} from "@tabler/icons-react";
import MainNavigation from "@/src/components/main-navigation";

export default async function UserCollectionsPage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;
  let loading = true;

  // Supabase
  const supabase = await createClient();

  // Get current user
  const { data: user } = await supabase.auth.getClaims();
  const currentUserId = user?.claims.sub || null; // Extract the ID once

  // Get profile for the username in the URL
  const { data: urlProfile } = await supabase
    .from("profiles")
    .select()
    .eq("username", username)
    .single();

  // If profile doesn't exist, could handle this better with a 404 page
  if (!urlProfile) {
    return <div>User not found</div>;
  }

  // Check if this is the current user's profile
  const isCurrentUser = currentUserId === urlProfile?.id;
  let currentUserProfile = isCurrentUser ? urlProfile : null;

  if (user && !isCurrentUser) {
    const { data: profile } = await supabase
      .from("profiles")
      .select()
      .eq("id", currentUserId)
      .single();

    currentUserProfile = profile;
  }

  loading = false;

  return (
    <>
      <BrowseNavigation
        items={[
          {
            label: `${urlProfile.id === currentUserId ? "Account" : "Profile"}`,
            href: `/${urlProfile.username}`,
          },
          {
            label: "Collections",
            href: `/${urlProfile.username}/collections`,
            color: `indigo-500`,
          },
        ]}
        profileId={urlProfile.id}
        currentUserId={currentUserId || ""}
      />

      <section
        className={`mt-14 lg:mt-20 mb-6 transition-all duration-300 ease-in-out`}
      >
        <h1 className={`max-w-3xl text-2xl sm:3xl md:text-4xl font-bold`}>
          {isCurrentUser ? "My Collections" : `${username}'s Collections`}
        </h1>
      </section>

      {loading ? (
        <div className="my-4">Loading collections...</div>
      ) : (
        <UserCollections
          userProfile={urlProfile}
          currentUserProfile={currentUserProfile}
          isCurrentUser={isCurrentUser}
        />
      )}
    </>
  );
}
