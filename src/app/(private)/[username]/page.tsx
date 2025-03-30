import React from "react";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import BrowseNavigation from "@/src/components/browse-navigation";

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
    .select("username")
    .eq("username", username)
    .single();

  // If username doesn't exist in profiles, show 404 page
  if (profileError || !profileData) {
    notFound();
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
        className={`mt-14 lg:mt-20 mb-6 transition-all duration-300 ease-in-out`}
      >
        <h1 className={`text-2xl sm:3xl md:text-4xl font-bold`}>
          Hi {username}!
        </h1>
        <p className={`mt-6 text-sm text-neutral-400 italic`}>
          More coming soon, I promise!
        </p>
      </section>
    </>
  );
}
