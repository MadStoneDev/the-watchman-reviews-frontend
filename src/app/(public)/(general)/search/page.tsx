import type { Metadata } from "next";
import React, { Suspense } from "react";

import { User } from "@supabase/supabase-js";
import { MediaCollection } from "@/src/lib/types";
import { createClient } from "@/src/utils/supabase/server";

import SearchWrapper from "@/src/components/wrapper-search";
import SearchSkeletonBoundary from "@/src/components/search-skeleton-boundary";

export const metadata: Metadata = {
  title: "Search - Just Reel",
  description:
    "Helping you make informed viewing choices. Get detailed content analysis of movies and TV shows, including" +
    " themes, language, and values.",
};

const fetchCollections = async (user: string | null) => {
  // Supabase
  const supabase = await createClient();

  let cleanOwnedCollections: MediaCollection[] = [];
  let cleanSharedCollections: MediaCollection[] = [];

  if (user) {
    try {
      const { data: ownedCollections } = await supabase
        .from("collections")
        .select("*")
        .eq("owner", user);

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
        .eq("user_id", user);

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
            id: collection.id,
            title: collection.title || "Untitled Shared Collection",
            owner: collection.owner,
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
  const { data: userData } = await supabase.auth.getClaims();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData?.claims?.sub)
    .single();

  const isUser = !!userData;

  let ownedCollections: MediaCollection[] = [];
  let sharedCollections: MediaCollection[] = [];

  if (isUser) {
    const { cleanOwnedCollections, cleanSharedCollections } =
      await fetchCollections(userData.claims.sub);
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
            isUser={isUser}
            profile={profile}
            ownedCollections={ownedCollections}
            sharedCollections={sharedCollections}
          />
        </Suspense>
      </section>
    </>
  );
}
