import React from "react";
import { IconArrowLeft } from "@tabler/icons-react";

export default function SeriesProgressLoading() {
  return (
    <div className="mt-6 lg:mt-8 mb-6">
      {/* Back Button Skeleton */}
      <div className="inline-flex items-center gap-2 text-neutral-600 mb-6">
        <IconArrowLeft size={20} />
        <div className="h-5 w-32 bg-neutral-800 rounded animate-pulse" />
      </div>

      {/* Series Header Skeleton */}
      <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden mb-6">
        <div className="flex flex-col md:flex-row gap-6 p-6">
          {/* Poster Skeleton */}
          <div className="w-32 md:w-48 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0 bg-neutral-800 border-2 border-neutral-700 animate-pulse" />

          {/* Series Info Skeleton */}
          <div className="flex-1 space-y-4">
            {/* Title */}
            <div className="h-8 w-3/4 bg-neutral-800 rounded animate-pulse" />

            {/* Meta Info */}
            <div className="flex items-center gap-4">
              <div className="h-5 w-20 bg-neutral-800 rounded animate-pulse" />
              <div className="h-6 w-24 bg-neutral-800 rounded-full animate-pulse" />
            </div>

            {/* Overall Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 w-32 bg-neutral-800 rounded animate-pulse" />
                <div className="h-8 w-16 bg-neutral-800 rounded animate-pulse" />
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden animate-pulse" />
              <div className="h-3 w-48 bg-neutral-800 rounded animate-pulse mt-2" />
            </div>

            {/* Overview */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-neutral-800 rounded animate-pulse" />
              <div className="h-4 w-full bg-neutral-800 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-neutral-800 rounded animate-pulse" />
            </div>

            {/* Link */}
            <div className="h-4 w-40 bg-neutral-800 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Seasons Skeleton */}
      <div className="space-y-4">
        {/* Season 1 */}
        {[1, 2, 3].map((season) => (
          <div
            key={season}
            className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <div className="h-6 w-32 bg-neutral-800 rounded animate-pulse mb-2" />
                  <div className="h-4 w-48 bg-neutral-800 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-32 bg-neutral-800 rounded-lg animate-pulse" />
                  <div className="h-8 w-8 bg-neutral-800 rounded animate-pulse" />
                </div>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
