import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import AdminEmailSender from "@/src/components/admin-email-sender";

export default async function AdminEmailSenderPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/portal");
  }

  // Get user profile to check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role < 10) {
    redirect("/");
  }

  // Get all users for recipient selection
  const { data: users } = await supabase
    .from("profiles")
    .select("id, username")
    .order("username", { ascending: true });

  // Get previous sent emails for history
  const { data: sentEmails } = await supabase
    .from("sent_emails")
    .select(
      "id, subject, recipient_type, recipient_count, sent_at, greeting, message, sign_off, founder_name, cta_text, cta_url, changelog",
    )
    .order("sent_at", { ascending: false })
    .limit(20);

  return (
    <section className="m-3 lg:m-6 transition-all duration-300 ease-in-out">
      <h1 className="mb-2 text-2xl sm:text-3xl md:text-4xl font-bold">
        Email Sender
      </h1>
      <p className="text-neutral-400 mb-8">
        Send manual emails to users. Only admins can access this page.
      </p>

      <AdminEmailSender users={users || []} sentEmails={sentEmails || []} />
    </section>
  );
}
