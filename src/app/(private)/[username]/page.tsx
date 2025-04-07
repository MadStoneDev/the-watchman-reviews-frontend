import React from "react";
import { redirect, notFound } from "next/navigation";

import { createClient } from "@/src/utils/supabase/server";

import BrowseNavigation from "@/src/components/browse-navigation";
import EditableUsername from "@/src/components/editable-username";
import { lookupProfileRole } from "@/src/data/lookup-profile-role";
import MediaPreferenceBlock from "@/src/components/media-preference-block";

export default async function PrivatePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: user, error } = await supabase.auth.getUser();

  // If no user is found, redirect to auth portal
  if (error || !user || !user.user) {
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

  return (
    <>
      <BrowseNavigation
        items={[
          { label: "Account", href: `/${profileData.username}` },
          {
            label: "Collections",
            href: `/${profileData.username}/collections`,
          },
        ]}
      />

      <section
        className={`mt-14 lg:mt-20 mb-6 transition-all duration-300 ease-in-out`}
      >
        <EditableUsername
          username={profileData.username}
          lastUsernameChange={profileData.last_username_change}
          daysSinceLastChange={
            daysSinceLastChange !== null ? daysSinceLastChange : 999
          }
          profileId={profileData.id}
          currentUserId={user.user.id}
        />
      </section>

      {profileData?.role > 9 && <MediaPreferenceBlock />}
    </>
  );
}
