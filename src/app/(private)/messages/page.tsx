import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import { getConversations } from "@/src/app/actions/messaging";

import ConversationList from "@/src/components/conversation-list";

export const revalidate = 0; // Always fresh

export default async function MessagesPage() {
  const supabase = await createClient();

  // Get current user
  const { data: user, error } = await supabase.auth.getClaims();

  if (error || !user) {
    redirect("/auth/portal");
  }

  // Get initial conversations
  const result = await getConversations(1, 50);
  const conversations = result.conversations || [];

  return (
    <>
      <section className="mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
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
