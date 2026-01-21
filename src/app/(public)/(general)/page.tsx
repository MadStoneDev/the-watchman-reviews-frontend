import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { createClient } from "@/src/utils/supabase/server";
import RecommendationsSection from "@/src/components/recommendations-section";
import { MediaCollection } from "@/src/lib/types";

export const metadata: Metadata = {
  title: "JustReel | Guarding Your Screen, Guiding Your Choices",
  description:
    "Guiding families and groups to make informed viewing choices. Get detailed content analysis of movies and TV shows, including themes, language, and values.",
};

export default async function Home() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getClaims();
  const isLoggedIn = !!user?.claims?.sub;
  const userId = user?.claims?.sub;

  // Get user data for logged-in users
  let username = null;
  let ownedCollections: MediaCollection[] = [];
  let sharedCollections: MediaCollection[] = [];

  if (isLoggedIn && userId) {
    const [profileResult, ownedResult, sharedResult] = await Promise.all([
      supabase
        .from("profiles")
        .select("username")
        .eq("id", userId)
        .single(),
      supabase
        .from("collections")
        .select("*")
        .eq("owner", userId),
      supabase
        .from("shared_collection")
        .select(`
          collection_id,
          collections:collection_id (
            id,
            title,
            owner,
            is_public
          )
        `)
        .eq("user_id", userId),
    ]);

    username = profileResult.data?.username;

    if (ownedResult.data) {
      ownedCollections = ownedResult.data.map((collection) => ({
        id: collection.id,
        title: collection.title || "Untitled Collection",
        owner: collection.owner,
        is_public: collection.is_public,
        shared: false,
      }));
    }

    if (sharedResult.data) {
      sharedCollections = sharedResult.data
        .map((item: any) => item.collections)
        .filter(Boolean)
        .map((collection: any) => ({
          id: collection.id,
          title: collection.title || "Untitled Shared Collection",
          owner: collection.owner,
          is_public: collection.is_public,
          shared: true,
        }));
    }
  }

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

      {/* Recommendations Section - Only for logged-in users */}
      {isLoggedIn && username ? (
        <RecommendationsSection
          username={username}
          userId={userId}
          ownedCollections={ownedCollections}
          sharedCollections={sharedCollections}
        />
      ) : (
        <section className="mb-12">
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-8 text-center">
            <h2 className="text-xl font-bold mb-3">
              Get Personalized Recommendations
            </h2>
            <p className="text-neutral-400 mb-6 max-w-md mx-auto">
              Sign in to get AI-powered movie and TV show recommendations based
              on your unique watching patterns.
            </p>
            <Link
              href="/auth/portal"
              className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-900 font-semibold rounded-lg transition-colors"
            >
              Sign In to Get Started
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
