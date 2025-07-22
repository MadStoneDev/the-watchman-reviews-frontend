import React from "react";

import { createClient } from "@/src/utils/supabase/server";
import BrowseNavigation from "@/src/components/browse-navigation";
import UserCollections from "@/src/components/user-collections-block";

export default async function UserCollectionsPage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;

  const startTime = Date.now();
  let loading = true;

  // Supabase
  const supabase = await createClient();

  // Get current user
  const { data: user } = await supabase.auth.getClaims();

  // Get profile for the username in the URL
  const { data: urlProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  // If profile doesn't exist, could handle this better with a 404 page
  if (!urlProfile) {
    return <div>User not found</div>;
  }

  // Check if this is the current user's profile
  const isCurrentUser = user?.claims.sub === urlProfile?.id;
  let currentUserProfile = isCurrentUser ? urlProfile : null;

  if (user && !isCurrentUser) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.claims.sub)
      .single();

    currentUserProfile = profile;
  }

  loading = false;

  return (
    <>
      <BrowseNavigation
        items={[
          { label: "Account", href: `/${username}` },
          { label: "Collections", href: `/${username}/collections` },
        ]}
      />

      <section
        className={`mt-14 lg:mt-20 transition-all duration-300 ease-in-out`}
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
