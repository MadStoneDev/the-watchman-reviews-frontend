import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import { getConversations } from "@/src/app/actions/messaging";

import BrowseNavigation from "@/src/components/browse-navigation";
import ConversationList from "@/src/components/conversation-list";

export const revalidate = 0; // Always fresh

export default async function MessagesPage() {
  const supabase = await createClient();

  // Get current user
  const { data: user, error } = await supabase.auth.getClaims();

  if (error || !user) {
    redirect("/auth/portal");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("id", user.claims.sub)
    .single();

  if (!profile) {
    redirect("/auth/portal");
  }

  // Get initial conversations
  const result = await getConversations(1, 50);
  const conversations = result.conversations || [];

  return (
    <>
      <BrowseNavigation
        items={[
          { label: "Account", href: `/${profile.username}` },
          {
            label: "Collections",
            href: `/${profile.username}/collections`,
            textColor: "hover:text-indigo-500",
            bgColor: "bg-indigo-500",
          },
        ]}
        profileId={profile.id}
        currentUserId={user.claims.sub}
      />

      <section className="mt-6 lg:mt-8 mb-6 transition-all duration-300 ease-in-out">
        <h1 className="text-2xl sm:3xl md:text-4xl font-bold">
          Messages
        </h1>
        <p className="text-neutral-400 mt-1">
          Your conversations with mutual followers
        </p>
      </section>

      <ConversationList
        currentUserId={user.claims.sub}
        initialConversations={conversations}
      />
    </>
  );
}
