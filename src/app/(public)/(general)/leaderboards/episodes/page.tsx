import React from "react";
import type { Metadata } from "next";
import { createClient } from "@/src/utils/supabase/server";
import {
  getLeaderboard,
  type TimePeriod,
  type LeaderboardScope,
} from "@/src/app/actions/leaderboards";

import LeaderboardTabs from "@/src/components/leaderboard-tabs";
import LeaderboardTable from "@/src/components/leaderboard-table";
import LeaderboardUserRank from "@/src/components/leaderboard-user-rank";

export const metadata: Metadata = {
  title: "Episodes Leaderboard | JustReel",
  description: "See who's watched the most TV show episodes on JustReel.",
};

export const revalidate = 300; // Revalidate every 5 minutes

export default async function EpisodesLeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; scope?: string }>;
}) {
  const { period: periodParam, scope: scopeParam } = await searchParams;

  const period = (["all_time", "weekly", "monthly"].includes(periodParam || "")
    ? periodParam
    : "all_time") as TimePeriod;

  const scope = (["global", "friends"].includes(scopeParam || "")
    ? scopeParam
    : "global") as LeaderboardScope;

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getClaims();
  const currentUserId = userData?.claims?.sub;

  const result = await getLeaderboard("episodes", period, scope, 1, 50);

  return (
    <>
      <section className="mt-6 lg:mt-8 mb-6 transition-all duration-300 ease-in-out">
        <h1 className="text-2xl sm:3xl md:text-4xl font-bold">
          Episodes Watched
        </h1>
        <p className="text-neutral-400 mt-1">
          Who's watched the most TV show episodes
        </p>
      </section>

      <LeaderboardTabs
        currentType="episodes"
        currentPeriod={period}
        currentScope={scope}
        isLoggedIn={!!currentUserId}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <LeaderboardTable
            entries={result.entries || []}
            type="episodes"
            currentUserId={currentUserId}
          />
        </div>

        {result.userRank && (
          <div className="order-first lg:order-last">
            <LeaderboardUserRank userRank={result.userRank} type="episodes" />
          </div>
        )}
      </div>
    </>
  );
}
