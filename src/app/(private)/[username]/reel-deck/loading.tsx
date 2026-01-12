import React from "react";
import ReelDeckGridSkeleton from "@/src/components/reel-deck-grid-skeleton";

export default function ReelDeckLoading() {
  return (
    <div className="mt-6 lg:mt-8 mb-6">
      {/* Page Header */}
      <section className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="h-10 w-64 bg-neutral-800 rounded-sm animate-pulse mb-2" />
            <div className="h-5 w-96 bg-neutral-800 rounded-sm animate-pulse" />
          </div>

          {/* Type Filter Skeleton */}
          {/*<div className="flex gap-2">*/}
          {/*  <div className="h-10 w-20 bg-neutral-800 rounded-lg animate-pulse" />*/}
          {/*  <div className="h-10 w-28 bg-neutral-800 rounded-lg animate-pulse" />*/}
          {/*  <div className="h-10 w-28 bg-neutral-800 rounded-lg animate-pulse" />*/}
          {/*</div>*/}
        </div>
      </section>

      {/* Next Up Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="h-8 w-32 bg-neutral-800 rounded-sm animate-pulse mb-2" />
            <div className="h-4 w-64 bg-neutral-800 rounded-sm animate-pulse" />
          </div>
          {/*<div className="h-5 w-32 bg-neutral-800 rounded-sm animate-pulse" />*/}
        </div>
        <ReelDeckGridSkeleton count={12} />
      </section>

      {/* Upcoming Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="h-8 w-32 bg-neutral-800 rounded-sm animate-pulse mb-2" />
            <div className="h-4 w-72 bg-neutral-800 rounded-sm animate-pulse" />
          </div>
          <div className="h-5 w-32 bg-neutral-800 rounded-sm animate-pulse" />
        </div>
        <ReelDeckGridSkeleton count={12} />
      </section>

      {/* Completed Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="h-8 w-32 bg-neutral-800 rounded-sm animate-pulse mb-2" />
            <div className="h-4 w-48 bg-neutral-800 rounded-sm animate-pulse" />
          </div>
          <div className="h-5 w-32 bg-neutral-800 rounded-sm animate-pulse" />
        </div>
        <ReelDeckGridSkeleton count={12} />
      </section>
    </div>
  );
}
