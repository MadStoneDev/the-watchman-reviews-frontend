﻿import React, { Suspense } from "react";
import type { Metadata } from "next";
import SearchWrapper from "@/src/components/wrapper-search";
import SearchSkeletonBoundary from "@/src/components/search-skeleton-boundary";

export const metadata: Metadata = {
  title: "Admin Search - The Watchman Reviews",
  description:
    "Guiding families and groups to make informed viewing choices. Get detailed content analysis of movies and TV shows, including themes, language, and values.",
};
export default function AdminSearchPage() {
  return (
    <>
      <section
        className={`mt-0 md:mt-14 lg:mt-20 mb-10 flex flex-col gap-5 transition-all duration-300 ease-in-out`}
      >
        <h1 className={`text-2xl sm:3xl md:text-4xl font-bold`}>
          Admin Search
        </h1>

        <Suspense fallback={<SearchSkeletonBoundary />}>
          <SearchWrapper admin={true} />
        </Suspense>
      </section>
    </>
  );
}
