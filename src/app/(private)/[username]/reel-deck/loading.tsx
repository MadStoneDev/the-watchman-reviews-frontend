import React from "react";
import ReelDeckGridSkeleton from "@/src/components/reel-deck-grid-skeleton";

export default function ReelDeckLoading() {
  return (
    <div className="mt-14 lg:mt-20 mb-6">
      {/* Page Header */}
      <section className="mb-8">
        <div className="h-10 w-64 bg-neutral-800 rounded animate-pulse mb-2" />
        <div className="h-5 w-96 bg-neutral-800 rounded animate-pulse" />
      </section>

      {/* Next Up Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="h-8 w-32 bg-neutral-800 rounded animate-pulse" />
          <div className="h-5 w-24 bg-neutral-800 rounded animate-pulse" />
        </div>
        <ReelDeckGridSkeleton count={12} />
      </section>

      {/* Upcoming Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="h-8 w-32 bg-neutral-800 rounded animate-pulse" />
          <div className="h-5 w-24 bg-neutral-800 rounded animate-pulse" />
        </div>
        <ReelDeckGridSkeleton count={12} />
      </section>

      {/* Completed Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="h-8 w-32 bg-neutral-800 rounded animate-pulse" />
          <div className="h-5 w-24 bg-neutral-800 rounded animate-pulse" />
        </div>
        <ReelDeckGridSkeleton count={12} />
      </section>
    </div>
  );
}
