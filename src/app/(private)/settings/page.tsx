import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import SettingsContent from "@/src/components/settings-content";
import BrowseNavigation from "@/src/components/browse-navigation";

export default async function SettingsPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: user, error } = await supabase.auth.getClaims();

  if (error || !user) {
    redirect("/auth/portal");
  }

  // Get user profile data
  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.claims.sub)
    .single();

  if (!profileData) {
    redirect("/auth/portal");
  }

  // Get user email from auth
  const { data: authData } = await supabase.auth.getUser();
  const userEmail = authData.user?.email || "";

  // Calculate member since
  const memberSince = new Date(profileData.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

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
          },
          {
            label: "Reel Deck",
            href: `/${profileData.username}/reel-deck`,
          },
        ]}
        profileId={profileData.id}
        currentUserId={user.claims.sub}
      />

      <section
        className={`mt-14 lg:mt-20 mb-6 transition-all duration-300 ease-in-out`}
      >
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        <SettingsContent
          profileData={profileData}
          userEmail={userEmail}
          memberSince={memberSince}
          userId={user.claims.sub}
        />
      </section>
    </>
  );
}
