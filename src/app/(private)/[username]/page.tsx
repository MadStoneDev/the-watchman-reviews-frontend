import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import BrowseNavigation from "@/src/components/browse-navigation";

export default async function PrivatePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();
  const { data: user, error } = await supabase.auth.getUser();

  // If no user is found, redirect to auth portal
  if (error || !user || !user.user) {
    redirect("/auth/portal");
  }

  return (
    <>
      <BrowseNavigation
        items={[
          { label: "Account", href: `/${username}` },
          { label: "Lists", href: `/${username}/lists` },
        ]}
      />

      <section
        className={`mt-14 lg:mt-20 mb-6 transition-all duration-300 ease-in-out`}
      >
        <h1 className={`max-w-64 text-2xl sm:3xl md:text-4xl font-bold`}>
          What's cooking, good lookin'?
        </h1>
        <p className={`mt-6 text-sm text-neutral-400 italic`}>
          Lots!! I'm working on it, I promise!
        </p>
      </section>
    </>
  );
}
