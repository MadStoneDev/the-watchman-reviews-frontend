﻿import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";

export default async function MeRedirectPage() {
  const supabase = await createClient();
  const { data: user, error } = await supabase.auth.getUser();

  // If no user is found, redirect to auth portal
  if (error || !user || !user.user) {
    redirect("/auth/portal");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.user.id)
    .single();

  if (!profile) {
    redirect("/auth/portal");
  }

  // Redirect to the user's personal page
  redirect(`/${profile.username}`);
}
