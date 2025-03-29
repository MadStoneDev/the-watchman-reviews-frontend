import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";

export default async function MeRedirectPage() {
  const supabase = await createClient();
  const { data: user, error } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.user?.id)
      .single();

    return (
      <div>
        <p>{JSON.stringify(user)}</p>
        <p>{JSON.stringify(profile)}</p>
        {}
      </div>
    );
  } else {
    return (
      <div>
        <p>No user found</p>
      </div>
    );
  }

  // // If no user is found, redirect to auth portal
  // if (error || !user || !user.user) {
  //   redirect("/auth/portal");
  // }
  //
  // // Get the username from user metadata or profile
  // // Adjust this based on where you store the username in your Supabase schema
  // const {data: profile} = await supabase
  // .from("profiles")
  // .select("username")
  // .eq("id", user.user.id)
  // .single();
  //
  // if (!profile) {
  //   redirect("/auth/portal");
  // }
  //
  // // Redirect to the user's personal page
  // redirect(`/${profile.username}`);
}
