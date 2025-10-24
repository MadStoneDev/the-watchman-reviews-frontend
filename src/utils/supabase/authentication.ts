import { createClient } from "./client";

export const signInWithGoogle = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.error(error);
    return;
  }

  return data;
};

export const signInWithTwitch = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "twitch",
    options: {
      redirectTo: "https://justreel.app/auth/callback",
    },
  });
};
