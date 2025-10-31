"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
  IconMovie,
  IconDeviceTv,
  IconAdjustmentsHorizontal,
  IconArrowsSort,
} from "@tabler/icons-react";

interface ReelDeckFiltersProps {
  username: string;
  filterStatus?: string;
  filterType?: string;
  sortOption?: string;
  statusCounts: {
    all: number;
    watching: number;
    completed: number;
    paused: number;
    plan_to_watch: number;
  };
  typeCounts: {
    all: number;
    movie: number;
    tv: number;
  };
}

const STORAGE_KEY = "reel-deck-sort-preference";

export default function ReelDeckFilters({
  username,
  filterStatus,
  filterType,
  sortOption = "last-watched",
  statusCounts,
  typeCounts,
}: ReelDeckFiltersProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Load saved sort preference on mount
  useEffect(() => {
    // Only apply saved preference if no sort parameter in URL
    if (!searchParams?.get("sort")) {
      const savedSort = localStorage.getItem(STORAGE_KEY);
      if (savedSort && savedSort !== "last-watched") {
        // Apply saved preference
        const params = new URLSearchParams(searchParams?.toString() || "");
        params.set("sort", savedSort);
        router.replace(`${pathname}?${params.toString()}`);
      }
    }
  }, []);

  // Helper to build URLs with filters and save sort preference
  const buildFilterUrl = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams?.toString() || "");

    // Update or remove parameters
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);

        // Save sort preference to localStorage
        if (key === "sort") {
          localStorage.setItem(STORAGE_KEY, value);
        }
      } else {
        params.delete(key);

        // Clear sort preference if removing sort
        if (key === "sort") {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    });

    return `${pathname}?${params.toString()}`;
  };

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-24 space-y-6">
        {/* Status Filter */}
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
          <div className="flex items-center gap-2 mb-4">
            <IconAdjustmentsHorizontal size={20} className="text-lime-400" />
            <h3 className="font-semibold">Status</h3>
          </div>

          <div className="space-y-2">
            <Link
              href={buildFilterUrl({ status: undefined })}
              className={`block px-3 py-2 rounded-lg transition-colors ${
                !filterStatus
                  ? "bg-lime-400 text-neutral-900 font-medium"
                  : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>All</span>
                <span className="text-sm">{statusCounts.all}</span>
              </div>
            </Link>

            <Link
              href={buildFilterUrl({ status: "watching" })}
              className={`block px-3 py-2 rounded-lg transition-colors ${
                filterStatus === "watching"
                  ? "bg-lime-400 text-neutral-900 font-medium"
                  : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>Watching</span>
                <span className="text-sm">{statusCounts.watching}</span>
              </div>
            </Link>

            <Link
              href={buildFilterUrl({ status: "completed" })}
              className={`block px-3 py-2 rounded-lg transition-colors ${
                filterStatus === "completed"
                  ? "bg-lime-400 text-neutral-900 font-medium"
                  : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>Completed</span>
                <span className="text-sm">{statusCounts.completed}</span>
              </div>
            </Link>

            <Link
              href={buildFilterUrl({ status: "paused" })}
              className={`block px-3 py-2 rounded-lg transition-colors ${
                filterStatus === "paused"
                  ? "bg-lime-400 text-neutral-900 font-medium"
                  : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>Paused</span>
                <span className="text-sm">{statusCounts.paused}</span>
              </div>
            </Link>

            <Link
              href={buildFilterUrl({ status: "plan_to_watch" })}
              className={`block px-3 py-2 rounded-lg transition-colors ${
                filterStatus === "plan_to_watch"
                  ? "bg-lime-400 text-neutral-900 font-medium"
                  : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>Plan to Watch</span>
                <span className="text-sm">{statusCounts.plan_to_watch}</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Type Filter */}
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
          <div className="flex items-center gap-2 mb-4">
            <IconMovie size={20} className="text-lime-400" />
            <h3 className="font-semibold">Type</h3>
          </div>

          <div className="space-y-2">
            <Link
              href={buildFilterUrl({ type: undefined })}
              className={`block px-3 py-2 rounded-lg transition-colors ${
                !filterType
                  ? "bg-lime-400 text-neutral-900 font-medium"
                  : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>All</span>
                <span className="text-sm">{typeCounts.all}</span>
              </div>
            </Link>

            <Link
              href={buildFilterUrl({ type: "movie" })}
              className={`block px-3 py-2 rounded-lg transition-colors ${
                filterType === "movie"
                  ? "bg-lime-400 text-neutral-900 font-medium"
                  : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <IconMovie size={16} />
                  <span>Movies</span>
                </div>
                <span className="text-sm">{typeCounts.movie}</span>
              </div>
            </Link>

            <Link
              href={buildFilterUrl({ type: "tv" })}
              className={`block px-3 py-2 rounded-lg transition-colors ${
                filterType === "tv"
                  ? "bg-lime-400 text-neutral-900 font-medium"
                  : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <IconDeviceTv size={16} />
                  <span>TV Shows</span>
                </div>
                <span className="text-sm">{typeCounts.tv}</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Sort Options */}
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
          <div className="flex items-center gap-2 mb-4">
            <IconArrowsSort size={20} className="text-lime-400" />
            <h3 className="font-semibold">Sort By</h3>
          </div>

          <div className="space-y-2">
            <Link
              href={buildFilterUrl({ sort: "last-watched" })}
              className={`block px-3 py-2 rounded-lg transition-colors text-sm ${
                sortOption === "last-watched"
                  ? "bg-lime-400 text-neutral-900 font-medium"
                  : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              Last Watched
            </Link>

            <Link
              href={buildFilterUrl({ sort: "recently-aired" })}
              className={`block px-3 py-2 rounded-lg transition-colors text-sm ${
                sortOption === "recently-aired"
                  ? "bg-lime-400 text-neutral-900 font-medium"
                  : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              Recently Aired
            </Link>

            <Link
              href={buildFilterUrl({ sort: "added-date" })}
              className={`block px-3 py-2 rounded-lg transition-colors text-sm ${
                sortOption === "added-date"
                  ? "bg-lime-400 text-neutral-900 font-medium"
                  : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              Recently Added
            </Link>

            <Link
              href={buildFilterUrl({ sort: "type-movies-first" })}
              className={`block px-3 py-2 rounded-lg transition-colors text-sm ${
                sortOption === "type-movies-first"
                  ? "bg-lime-400 text-neutral-900 font-medium"
                  : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              Movies First
            </Link>

            <Link
              href={buildFilterUrl({ sort: "type-tv-first" })}
              className={`block px-3 py-2 rounded-lg transition-colors text-sm ${
                sortOption === "type-tv-first"
                  ? "bg-lime-400 text-neutral-900 font-medium"
                  : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              TV Shows First
            </Link>

            <Link
              href={buildFilterUrl({ sort: "title-asc" })}
              className={`block px-3 py-2 rounded-lg transition-colors text-sm ${
                sortOption === "title-asc"
                  ? "bg-lime-400 text-neutral-900 font-medium"
                  : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              Title (A-Z)
            </Link>

            <Link
              href={buildFilterUrl({ sort: "title-desc" })}
              className={`block px-3 py-2 rounded-lg transition-colors text-sm ${
                sortOption === "title-desc"
                  ? "bg-lime-400 text-neutral-900 font-medium"
                  : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              Title (Z-A)
            </Link>

            <Link
              href={buildFilterUrl({ sort: "rating" })}
              className={`block px-3 py-2 rounded-lg transition-colors text-sm ${
                sortOption === "rating"
                  ? "bg-lime-400 text-neutral-900 font-medium"
                  : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              Highest Rated
            </Link>
          </div>
        </div>

        {/* Clear All Filters */}
        {(filterStatus || filterType || sortOption !== "last-watched") && (
          <Link
            href={`/${username}/reel-deck`}
            className="block text-center px-4 py-2 text-sm text-neutral-400 hover:text-lime-400 transition-colors"
            onClick={() => localStorage.removeItem(STORAGE_KEY)}
          >
            Clear all filters
          </Link>
        )}
      </div>
    </aside>
  );
}
