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
  title: "Achievements Leaderboard | JustReel",
  description: "See who's earned the most achievement points on JustReel.",
};

export const revalidate = 300; // Revalidate every 5 minutes

export default async function AchievementsLeaderboardPage({
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

  const result = await getLeaderboard("achievements", "all_time", scope, 1, 50);

  return (
    <>
      <section className="mt-6 lg:mt-8 mb-6 transition-all duration-300 ease-in-out">
        <h1 className="text-2xl sm:3xl md:text-4xl font-bold">
          Achievement Points
        </h1>
        <p className="text-neutral-400 mt-1">
          Who's earned the most achievement points (Bronze: 10, Silver: 25, Gold: 50, Platinum: 100)
        </p>
      </section>

      <LeaderboardTabs
        currentType="achievements"
        currentPeriod="all_time"
        currentScope={scope}
        isLoggedIn={!!currentUserId}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <LeaderboardTable
            entries={result.entries || []}
            type="achievements"
            currentUserId={currentUserId}
          />
        </div>

        {result.userRank && (
          <div className="order-first lg:order-last">
            <LeaderboardUserRank userRank={result.userRank} type="achievements" />
          </div>
        )}
      </div>
    </>
  );
}
