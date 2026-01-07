import React from "react";
import ReelDeckGridSkeleton from "@/src/components/reel-deck-grid-skeleton";

export default function NextUpLoading() {
  return (
    <div className="flex gap-6 mt-6 lg:mt-8 mb-6">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Back Link Skeleton */}
        <div className="h-5 w-32 bg-neutral-800 rounded animate-pulse mb-6" />

        {/* Header Skeleton */}
        <section className="mb-8">
          <div className="h-10 w-48 bg-neutral-800 rounded animate-pulse mb-2" />
          <div className="h-5 w-96 bg-neutral-800 rounded animate-pulse" />
        </section>

        {/* Grid Skeleton */}
        <ReelDeckGridSkeleton count={24} />
      </div>

      {/* Sidebar Skeleton */}
      {/*<aside className="hidden lg:block w-64 flex-shrink-0">*/}
      {/*  <div className="sticky top-24 space-y-6">*/}
      {/*    /!* Type Filter Skeleton *!/*/}
      {/*    <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4">*/}
      {/*      <div className="h-5 w-16 bg-neutral-800 rounded animate-pulse mb-4" />*/}
      {/*      <div className="space-y-2">*/}
      {/*        {[1, 2, 3].map((i) => (*/}
      {/*          <div*/}
      {/*            key={i}*/}
      {/*            className="h-10 bg-neutral-800 rounded animate-pulse"*/}
      {/*          />*/}
      {/*        ))}*/}
      {/*      </div>*/}
      {/*    </div>*/}
      
      {/*    /!* Sort Options Skeleton *!/*/}
      {/*    <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4">*/}
      {/*      <div className="h-5 w-20 bg-neutral-800 rounded animate-pulse mb-4" />*/}
      {/*      <div className="space-y-2">*/}
      {/*        {[1, 2, 3, 4].map((i) => (*/}
      {/*          <div*/}
      {/*            key={i}*/}
      {/*            className="h-9 bg-neutral-800 rounded animate-pulse"*/}
      {/*          />*/}
      {/*        ))}*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</aside>*/}
    </div>
  );
}
