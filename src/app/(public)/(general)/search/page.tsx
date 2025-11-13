import type { Metadata } from "next";
import React, { Suspense } from "react";

import { MediaCollection } from "@/src/lib/types";
import { createClient } from "@/src/utils/supabase/server";
import { measureQuery, startTimer, logTimer } from "@/src/utils/perf";

import SearchWrapper from "@/src/components/wrapper-search";
import SearchSkeletonBoundary from "@/src/components/search-skeleton-boundary";

export const metadata: Metadata = {
  title: "Search | JustReel",
  description:
    "Helping you make informed viewing choices. Get detailed content analysis of movies and TV shows, including themes, language, and values.",
};

// New type for reel deck items
export interface ReelDeckItem {
  media_id: string;
  media_type: "movie" | "tv";
  status: string;
}

export default async function SearchPage() {
  const pageStart = startTimer();
  const supabase = await createClient();

  // Auth call
  const { data: userData } = await measureQuery("🔐 Auth getClaims", () =>
    supabase.auth.getClaims(),
  );

  const userId = userData?.claims?.sub;
  const isUser = !!userData;

  // Parallel queries
  const parallelStart = startTimer();
  const [profileResult, ownedResult, sharedResult, reelDeckResult] =
    await Promise.all([
      // Profile query
      measureQuery("👤 Profile query", async () => {
        if (!userId) return { data: null, error: null };
        return supabase.from("profiles").select("*").eq("id", userId).single();
      }),

      // Owned collections
      measureQuery("📦 Owned collections", async () => {
        if (!userId) return { data: null, error: null };
        return supabase.from("collections").select("*").eq("owner", userId);
      }),

      // Shared collections
      measureQuery("🤝 Shared collections", async () => {
        if (!userId) return { data: null, error: null };
        return supabase
          .from("shared_collection")
          .select(
            `
          collection_id,
          collections:collection_id (
            id,
            title,
            owner,
            is_public
          )
        `,
          )
          .eq("user_id", userId);
      }),

      // ✅ NEW: Reel deck items
      measureQuery("🎬 Reel deck items", async () => {
        if (!userId) return { data: null, error: null };
        return supabase
          .from("reel_deck")
          .select("media_id, media_type, status")
          .eq("user_id", userId);
      }),
    ]);

  logTimer("⚡ Total parallel queries", parallelStart);

  // Extract data
  const profile = profileResult.data;

  // Process collections
  let ownedCollections: MediaCollection[] = [];
  let sharedCollections: MediaCollection[] = [];
  let reelDeckItems: ReelDeckItem[] = [];

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

  if (reelDeckResult.data) {
    reelDeckItems = reelDeckResult.data;
  }

  logTimer("📊 Total server-side data fetch", pageStart);

  return (
    <section className="mt-0 md:mt-14 lg:mt-20 mb-10 flex flex-col gap-5 transition-all duration-300 ease-in-out">
      <h1 className="max-w-60 text-2xl sm:3xl md:text-4xl font-bold">Search</h1>

      <Suspense fallback={<SearchSkeletonBoundary />}>
        <SearchWrapper
          isUser={isUser}
          profile={profile}
          ownedCollections={ownedCollections}
          sharedCollections={sharedCollections}
          reelDeckItems={reelDeckItems}
        />
      </Suspense>
    </section>
  );
}
