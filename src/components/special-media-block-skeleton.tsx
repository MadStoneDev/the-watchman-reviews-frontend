"use client";

import React from "react";

interface SpecialMediaBlockSkeletonProps {
  isActive?: boolean;
}

export default function SpecialMediaBlockSkeleton({
  isActive = false,
}: SpecialMediaBlockSkeletonProps) {
  return (
    <article
      className={`relative w-full ${
        isActive
          ? "min-w-auto md:min-w-auto sm:lg:min-w-[650px] max-w-full md:max-w-full sm:lg:max-w-[999px]"
          : "min-w-[10px] max-w-[40px]"
      } h-auto md:h-auto sm:lg:h-[430px] duration-700 overflow-hidden transition-all ease-in-out`}
    >
      {/* Back Row - Info Panel Skeleton */}
      <div
        className={`pt-0 md:pt-0 sm:lg:pt-12 ${
          isActive ? "flex" : "absolute hidden"
        } flex-col w-full h-full overflow-hidden z-0`}
      >
        <div
          className="flex-grow relative flex w-full bg-transparent md:bg-transparent sm:lg:bg-neutral-800 rounded-2xl border-[1px] border-transparent md:border-transparent sm:lg:border-neutral-50/30 overflow-hidden"
          style={{ backdropFilter: "blur(5px)" }}
        >
          {/* Fake Column for Poster Space */}
          <div className="w-[40%] md:w-[40%] sm:lg:min-w-[324px]" />

          {/* Information Column Skeleton */}
          {isActive && (
            <div className="flex w-[60%] md:w-[60%] sm:lg:w-auto pl-4 md:pl-4 sm:lg:pl-4 pr-0 md:pr-0 sm:lg:pr-8 py-8 flex-col gap-6 justify-center animate-pulse">
              {/* Card Header Skeleton */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-neutral-700 rounded" />
                  <div className="w-16 h-3 bg-neutral-700 rounded" />
                </div>

                <div className="w-3/4 h-6 bg-neutral-700 rounded" />

                <div className="flex gap-3 items-center">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 bg-neutral-700 rounded-full"
                      />
                    ))}
                  </div>
                  <div className="w-[1px] h-4 bg-neutral-600" />
                  <div className="w-8 h-3 bg-neutral-700 rounded" />
                  <div className="w-[1px] h-4 bg-neutral-600" />
                  <div className="w-10 h-3 bg-neutral-700 rounded" />
                </div>
              </div>

              {/* Overview Skeleton */}
              <div className="flex-grow flex flex-col gap-2">
                <div className="w-full h-3 bg-neutral-700 rounded" />
                <div className="w-full h-3 bg-neutral-700 rounded" />
                <div className="w-4/5 h-3 bg-neutral-700 rounded" />
                <div className="w-3/5 h-3 bg-neutral-700 rounded" />
              </div>

              {/* CTA Button Skeleton */}
              <div className="w-28 h-9 bg-neutral-700 rounded-lg" />
            </div>
          )}
        </div>
      </div>

      {/* Front Row - Poster Skeleton */}
      <div
        className={`pointer-events-none ${
          isActive ? "absolute" : "relative"
        } top-0 left-0 right-0 h-full z-10`}
      >
        <div className="flex flex-nowrap w-full h-full z-10">
          <div
            className={`${
              isActive
                ? "px-0 sm:px-8 md:px-0 lg:px-8 pb-0 md:pb-0 sm:lg:pb-8"
                : "pt-12"
            } w-full`}
          >
            <div
              className={`relative w-full min-w-[40px] max-w-[40%] md:max-w-[40%] sm:lg:max-w-[260px] h-full rounded-lg overflow-hidden shadow-2xl`}
            >
              <div className="w-full h-full bg-neutral-800 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
