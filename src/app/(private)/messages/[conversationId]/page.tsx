import React from "react";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/src/utils/supabase/server";
import { getConversation, getMessages } from "@/src/app/actions/messaging";
import { IconArrowLeft } from "@tabler/icons-react";

import ConversationThread from "@/src/components/conversation-thread";

export const revalidate = 0; // Always fresh

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;

  const supabase = await createClient();

  // Get current user
  const { data: user, error } = await supabase.auth.getClaims();

  if (error || !user) {
    redirect("/auth/portal");
  }

  // Get conversation details
  const conversationResult = await getConversation(conversationId);

  if (!conversationResult.success || !conversationResult.conversation) {
    notFound();
  }

  const conversation = conversationResult.conversation;

  // Get initial messages
  const messagesResult = await getMessages(conversationId, 1, 100);
  const messages = messagesResult.messages || [];

  return (
    <div className="flex flex-col h-full">
      {/* Conversation thread */}
      <div className="flex-grow bg-neutral-900 rounded-xl overflow-hidden">
        <ConversationThread
          conversation={conversation}
          currentUserId={user.claims.sub}
          initialMessages={messages}
        />
      </div>
    </div>
  );
}
