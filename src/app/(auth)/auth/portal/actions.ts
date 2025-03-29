"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/src/utils/supabase/server";
import { rateLimit } from "@/src/utils/upstash/rate-limit";

type SignUpResponse = {
  error: string | null;
  success: boolean;
  redirectTo?: string;
};

export async function handleAuth(formData: FormData): Promise<SignUpResponse> {
  const email = formData.get("email") as string;

  if (!email) {
    return {
      error: "Oops! No email? Do you go to the movies and watch the side wall?",
      success: false,
    };
  }

  try {
    // Rate Limit Check
    const { success: rateLimiter } = await rateLimit.limit(email.toLowerCase());

    if (!rateLimiter) {
      return {
        error:
          "Woah! You're faster than post-credit scenes in Marvel movies. Try again in a bit, please?",
        success: false,
      };
    }

    const supabase = await createClient();

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
        shouldCreateUser: true,
      },
    });

    if (authError) {
      console.error("Supabase auth error:", authError);

      if (authError.message.includes("Invalid email")) {
        return {
          error:
            "That email looks more fictional than Wakanda. Please enter a real email address!",
          success: false,
        };
      }

      if (authError.message.includes("rate limit")) {
        return {
          error:
            "You're sending emails faster than John Wick reloads! Please wait a few minutes before trying again.",
          success: false,
        };
      }

      return {
        error:
          "Plot twist! Something went wrong with our authentication system. Try again in a bit?",
        success: false,
      };
    }

    revalidatePath("/");

    // Instead of redirecting directly, return success with redirect path
    return {
      error: null,
      success: true,
      redirectTo: "/auth/check-email",
    };
  } catch (error) {
    console.error("Unexpected error during authentication:", error);
    return {
      error: "An unexpected error occurred. Please try again later.",
      success: false,
    };
  }
}
