import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { createClient } from "@/src/utils/supabase/server";

export const metadata: Metadata = {
  title: "JustReel - The best way to track, collaborate and discuss Movies and TV Shows",
  description:
    "The best way to track, collaborate and discuss Movies and TV Shows. Keep track of what you're watching, discover new content, and share with friends.",
};

export default async function Home() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getClaims();
  const isLoggedIn = !!user?.claims?.sub;

  return (
    <>
      <section
        className={`mt-6 lg:mt-8 mb-6 transition-all duration-300 ease-in-out`}
      >
        <h1 className={`max-w-64 text-2xl sm:3xl md:text-4xl font-bold`}>
          What to Watch Next?
        </h1>
        <p className={`mt-6 max-w-72 text-base font-semibold text-neutral-400`}>
          With JustReel, you can now track shows, make friends and discuss your
          favourite episodes!
        </p>
      </section>

      {/* CTA for non-logged-in users */}
      {!isLoggedIn && (
        <section className="mb-12">
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-8 text-center">
            <h2 className="text-xl font-bold mb-3">
              Start Tracking Your Shows
            </h2>
            <p className="text-neutral-400 mb-6 max-w-md mx-auto">
              Sign in to track what you're watching, get AI-powered recommendations,
              and connect with fellow movie and TV enthusiasts.
            </p>
            <Link
              href="/auth/portal"
              className="inline-block px-6 py-3 bg-lime-400 hover:bg-lime-300 text-neutral-900 font-semibold rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
