﻿import type { Metadata } from "next";
import React, { Suspense } from "react";

import { User } from "@supabase/supabase-js";
import { MediaCollection } from "@/src/lib/types";
import { createClient } from "@/src/utils/supabase/server";

import SearchWrapper from "@/src/components/wrapper-search";
import SearchSkeletonBoundary from "@/src/components/search-skeleton-boundary";

export const metadata: Metadata = {
  title: "Search - The Watchman Reviews",
  description:
    "Helping you make informed viewing choices. Get detailed content analysis of movies and TV shows, including" +
    " themes, language, and values.",
};

const fetchCollections = async (user: User | null) => {
  // Supabase
  const supabase = await createClient();

  // Get Collections
  let cleanOwnedCollections: MediaCollection[] = [];
  let cleanSharedCollections: MediaCollection[] = [];

  if (user) {
    try {
      const { data: ownedCollections } = await supabase
        .from("collections")
        .select("*")
        .eq("owner", user.id);

      // Clean owned collections
      if (ownedCollections) {
        cleanOwnedCollections = ownedCollections.map((collection) => ({
          id: collection.id,
          title: collection.title || "Untitled Collection",
          owner: collection.owner,
          is_public: collection.is_public,
          shared: false,
        }));
      }
    } catch (error) {
      console.error("Error fetching owned collections:", error);
    }

    try {
      const { data: sharedCollectionsIds } = await supabase
        .from("shared_collection")
        .select("collection_id")
        .eq("user_id", user.id);

      if (sharedCollectionsIds && sharedCollectionsIds.length > 0) {
        const collectionIds = sharedCollectionsIds.map(
          (item) => item.collection_id,
        );

        const { data: sharedCollections } = await supabase
          .from("collections")
          .select("*")
          .in("id", collectionIds);

        // Clean shared collections
        if (sharedCollections) {
          cleanSharedCollections = sharedCollections.map((collection) => ({
            id: collection.collection_id,
            title: collection.collection_id || "Untitled Shared Collection",
            owner: collection.user_id,
            is_public: collection.is_public,
            shared: true,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching shared collections:", error);
    }
  }

  return { cleanOwnedCollections, cleanSharedCollections };
};

export default async function SearchPage() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  const user = userData?.user || null;
  let ownedCollections: MediaCollection[] = [];
  let sharedCollections: MediaCollection[] = [];

  if (user) {
    const { cleanOwnedCollections, cleanSharedCollections } =
      await fetchCollections(user);
    ownedCollections = cleanOwnedCollections;
    sharedCollections = cleanSharedCollections;
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
          <SearchWrapper
            user={user}
            ownedCollections={ownedCollections}
            sharedCollections={sharedCollections}
          />
        </Suspense>
      </section>
    </>
  );
}
