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
  title: "Shows Completed Leaderboard | JustReel",
  description: "See who's completed the most TV series on JustReel.",
};

export const revalidate = 300; // Revalidate every 5 minutes

export default async function ShowsLeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ scope?: string }>;
}) {
  const { scope: scopeParam } = await searchParams;

  const scope = (["global", "friends"].includes(scopeParam || "")
    ? scopeParam
    : "global") as LeaderboardScope;

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getClaims();
  const currentUserId = userData?.claims?.sub;

  const result = await getLeaderboard("shows", "all_time", scope, 1, 50);

  return (
    <>
      <section className="mt-6 lg:mt-8 mb-6 transition-all duration-300 ease-in-out">
        <h1 className="text-2xl sm:3xl md:text-4xl font-bold">
          Shows Completed
        </h1>
        <p className="text-neutral-400 mt-1">
          Who's finished the most TV series
        </p>
      </section>

      <LeaderboardTabs
        currentType="shows"
        currentPeriod="all_time"
        currentScope={scope}
        isLoggedIn={!!currentUserId}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <LeaderboardTable
            entries={result.entries || []}
            type="shows"
            currentUserId={currentUserId}
          />
        </div>

        {result.userRank && (
          <div className="order-first lg:order-last">
            <LeaderboardUserRank userRank={result.userRank} type="shows" />
          </div>
        )}
      </div>
    </>
  );
}
