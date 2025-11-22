"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/src/utils/supabase/server";
import { rateLimit } from "@/src/utils/upstash/rate-limit";

type AuthResponse = {
  error: string | null;
  success: boolean;
  redirectTo?: string;
};

async function verifyRecaptcha(token: string, ip?: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error("reCAPTCHA secret key not configured");
    return false;
  }

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
          ...(ip && { remoteip: ip }),
        }),
      },
    );

    const data = await response.json();

    // reCAPTCHA v3 returns a score from 0.0 to 1.0
    // 1.0 is very likely a good interaction, 0.0 is very likely a bot
    const threshold = 0.5;

    return data.success && data.score >= threshold;
  } catch (error) {
    console.error("reCAPTCHA verification failed:", error);
    return false;
  }
}

export async function handleAuth(formData: FormData): Promise<AuthResponse> {
  const email = formData.get("email") as string;
  const recaptchaToken = formData.get("recaptcha-token") as string;

  if (!email) {
    return {
      error: "Oops! No email? Do you go to the movies and watch the side wall?",
      success: false,
    };
  }

  // if (!recaptchaToken) {
  //   return {
  //     error: "Security check failed. Please refresh the page and try again.",
  //     success: false,
  //   };
  // }

  try {
    // if (process.env.RECAPTCHA_SECRET_KEY) {
    //   // First check: reCAPTCHA verification
    //   const isHuman = await verifyRecaptcha(recaptchaToken);
    //
    //   if (!isHuman) {
    //     return {
    //       error:
    //         "🤖 Beep boop! Our robot detector thinks you might be a bot. Please try again.",
    //       success: false,
    //     };
    //   }
    // }

    // Second check: Rate limiting by email
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

    return {
      error: null,
      success: true,
    };
  } catch (error) {
    console.error("Unexpected error during authentication:", error);
    return {
      error: "An unexpected error occurred. Please try again later.",
      success: false,
    };
  }
}

export async function verifyOtp(formData: FormData): Promise<AuthResponse> {
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;
  const recaptchaToken = formData.get("recaptcha-token") as string;

  if (!email || !otp) {
    return {
      error: "Missing email or verification code",
      success: false,
    };
  }

  // if (process.env.RECAPTCHA_SECRET_KEY && !recaptchaToken) {
  //   return {
  //     error: "Security check failed. Please refresh the page and try again.",
  //     success: false,
  //   };
  // }

  try {
    // if (process.env.RECAPTCHA_SECRET_KEY) {
    //   // Verify reCAPTCHA for OTP verification too
    //   const isHuman = await verifyRecaptcha(recaptchaToken);
    //
    //   if (!isHuman) {
    //     return {
    //       error: "🤖 Security check failed. Please try again.",
    //       success: false,
    //     };
    //   }
    // }

    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) {
      console.error("OTP verification error:", error);

      if (error.message.includes("Invalid OTP")) {
        return {
          error: "That code isn't right. Double-check and try again.",
          success: false,
        };
      }

      if (error.message.includes("expired")) {
        return {
          error: "This code has expired. Please request a new one.",
          success: false,
        };
      }

      return {
        error: "Verification failed. Please try again.",
        success: false,
      };
    }

    revalidatePath("/");

    // Redirect to user profile after successful verification
    return {
      error: null,
      success: true,
      redirectTo: "/me",
    };
  } catch (error) {
    console.error("Unexpected error during OTP verification:", error);
    return {
      error: "An unexpected error occurred. Please try again later.",
      success: false,
    };
  }
}
