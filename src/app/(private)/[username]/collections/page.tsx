import React from "react";

import { createClient } from "@/src/utils/supabase/server";
import BrowseNavigation from "@/src/components/browse-navigation";
import UserCollectionsBlock from "@/src/components/user-collections-block";

export default async function ListsPage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;

  // Get current authenticated user
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get profile for the username in the URL
  const { data: urlProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  // Check if this is the current user's profile
  const isCurrentUser = user?.id === urlProfile?.id;

  // Get the current user's profile if authenticated
  let currentUserProfile = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    currentUserProfile = profile;
  }

  // If profile doesn't exist, could handle this better with a 404 page
  if (!urlProfile) {
    return <div>User not found</div>;
  }

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
        <h1 className={`max-w-60 text-2xl sm:3xl md:text-4xl font-bold`}>
          {isCurrentUser ? "My Collections" : `${username}'s Collections`}
        </h1>
      </section>

      <UserCollectionsBlock
        urlProfile={urlProfile}
        currentUserProfile={currentUserProfile}
        isCurrentUser={isCurrentUser}
      />
    </>
  );
}
