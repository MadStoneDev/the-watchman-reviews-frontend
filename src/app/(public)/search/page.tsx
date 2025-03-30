import type { Metadata } from "next";
import React, { Suspense } from "react";

import SearchWrapper from "@/src/components/wrapper-search";
import SearchSkeletonBoundary from "@/src/components/search-skeleton-boundary";

import { createClient } from "@/src/utils/supabase/server";

export const metadata: Metadata = {
  title: "Search - The Watchman Reviews",
  description:
    "Guiding families and groups to make informed viewing choices. Get detailed content analysis of movies and TV shows, including themes, language, and values.",
};

export default async function SearchPage() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  const user = userData?.user || null;
  let collections: string[] = [];

  if (user) {
    try {
      // Fetch owned collections
      const { data: ownedCollections, error: ownedError } = await supabase
        .from("collections")
        .select("id")
        .eq("owner", user.id);

      if (ownedError) {
        console.error("Error fetching owned collections:", ownedError);
      }

      // Get collection IDs from owned collections
      const ownedIds = ownedCollections?.map((item) => item.id) || [];

      // Fetch shared collections
      const { data: sharedCollections, error: sharedError } = await supabase
        .from("shared_collection")
        .select("collection_id")
        .eq("user_id", user.id);

      if (sharedError) {
        console.error("Error fetching shared collections:", sharedError);
      }

      // Get collection IDs from shared collections
      const sharedIds =
        sharedCollections?.map((item) => item.collection_id) || [];

      // Combine all collection IDs
      collections = [...ownedIds, ...sharedIds];
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  }

  return (
    <>
      <section
        className={`mt-0 md:mt-14 lg:mt-20 mb-10 flex flex-col gap-5 transition-all duration-300 ease-in-out`}
      >
        <h1 className={`max-w-60 text-2xl sm:3xl md:text-4xl font-bold`}>
          Search
        </h1>

        <Suspense fallback={<SearchSkeletonBoundary />}>
          <SearchWrapper user={user} collections={collections} />
        </Suspense>
      </section>
    </>
  );
}
