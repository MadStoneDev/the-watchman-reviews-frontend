"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type {
  LeaderboardType,
  TimePeriod,
  LeaderboardScope,
} from "@/src/app/actions/leaderboards";

interface LeaderboardTabsProps {
  currentType: LeaderboardType;
  currentPeriod: TimePeriod;
  currentScope: LeaderboardScope;
  isLoggedIn?: boolean;
}

export default function LeaderboardTabs({
  currentType,
  currentPeriod,
  currentScope,
  isLoggedIn = false,
}: LeaderboardTabsProps) {
  const pathname = usePathname();

  const types: { value: LeaderboardType; label: string; href: string }[] = [
    { value: "episodes", label: "Episodes", href: "/leaderboards/episodes" },
    { value: "shows", label: "Shows", href: "/leaderboards/shows" },
    { value: "achievements", label: "Achievements", href: "/leaderboards/achievements" },
  ];

  const periods: { value: TimePeriod; label: string }[] = [
    { value: "all_time", label: "All Time" },
    { value: "monthly", label: "Monthly" },
    { value: "weekly", label: "Weekly" },
  ];

  const scopes: { value: LeaderboardScope; label: string }[] = [
    { value: "global", label: "Global" },
    { value: "friends", label: "Friends" },
  ];

  const buildUrl = (
    type?: LeaderboardType,
    period?: TimePeriod,
    scope?: LeaderboardScope
  ) => {
    const t = type || currentType;
    const p = period || currentPeriod;
    const s = scope || currentScope;

    const base = `/leaderboards/${t}`;
    const params = new URLSearchParams();

    if (p !== "all_time") {
      params.set("period", p);
    }
    if (s !== "global") {
      params.set("scope", s);
    }

    const queryString = params.toString();
    return queryString ? `${base}?${queryString}` : base;
  };

  return (
    <div className="space-y-4">
      {/* Type tabs */}
      <div className="flex flex-wrap gap-2">
        {types.map(({ value, label, href }) => (
          <Link
            key={value}
            href={buildUrl(value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentType === value
                ? "bg-lime-400 text-neutral-900"
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Period and Scope tabs */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Period filter (only for episodes and comments) */}
        {(currentType === "episodes" || currentType === "comments") && (
          <div className="flex gap-1 bg-neutral-800 rounded-lg p-1">
            {periods.map(({ value, label }) => (
              <Link
                key={value}
                href={buildUrl(undefined, value)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  currentPeriod === value
                    ? "bg-neutral-700 text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Scope filter */}
        {isLoggedIn && (
          <div className="flex gap-1 bg-neutral-800 rounded-lg p-1">
            {scopes.map(({ value, label }) => (
              <Link
                key={value}
                href={buildUrl(undefined, undefined, value)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  currentScope === value
                    ? "bg-neutral-700 text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
