import React from "react";

interface ReelDeckGridSkeletonProps {
  count?: number;
}

export default function ReelDeckGridSkeleton({
  count = 12,
}: ReelDeckGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <article
          key={index}
          className="relative bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden animate-pulse"
        >
          {/* Poster Skeleton */}
          <div className="relative aspect-2/3 bg-neutral-800">
            {/* Status Badge Skeleton */}
            <div className="absolute top-0 left-0 right-0 bg-neutral-700 h-10" />

            {/* Progress Bar Skeleton (for some items) */}
            {index % 2 === 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-neutral-800 p-3 border-t border-neutral-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-3 w-16 bg-neutral-700 rounded-sm" />
                  <div className="h-3 w-8 bg-neutral-700 rounded-sm" />
                </div>
                <div className="w-full bg-neutral-700 rounded-full h-2" />
                <div className="h-2 w-24 bg-neutral-700 rounded-sm mx-auto mt-2" />
              </div>
            )}
          </div>

          {/* Content Skeleton */}
          <div className="p-3 space-y-2">
            {/* Title */}
            <div className="space-y-1.5">
              <div className="h-4 bg-neutral-800 rounded-sm w-full" />
              <div className="h-4 bg-neutral-800 rounded-sm w-3/4" />
            </div>

            {/* Meta Info */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="h-3 w-12 bg-neutral-800 rounded-sm" />
                <div className="h-3 w-1 bg-neutral-800 rounded-sm" />
                <div className="h-3 w-16 bg-neutral-800 rounded-sm" />
              </div>
              <div className="h-2.5 w-24 bg-neutral-800 rounded-sm" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
