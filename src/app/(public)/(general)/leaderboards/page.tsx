import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { IconPlayerPlay, IconMovie, IconTrophy } from "@tabler/icons-react";
import { getLeaderboardStats } from "@/src/app/actions/leaderboards";

export const metadata: Metadata = {
  title: "Leaderboards | JustReel",
  description:
    "See who's watching the most TV shows and earning the most achievements on JustReel.",
};

export const revalidate = 300; // Revalidate every 5 minutes

export default async function LeaderboardsPage() {
  const statsResult = await getLeaderboardStats();
  const stats = statsResult.stats;

  const leaderboardTypes = [
    {
      id: "episodes",
      name: "Episodes Watched",
      description: "Who's watched the most episodes",
      icon: <IconPlayerPlay size={32} />,
      color: "bg-lime-400",
      textColor: "text-lime-400",
      href: "/leaderboards/episodes",
      stat: stats?.totalEpisodesWatched.toLocaleString() || "0",
      statLabel: "total episodes watched",
    },
    {
      id: "shows",
      name: "Shows Completed",
      description: "Who's finished the most series",
      icon: <IconMovie size={32} />,
      color: "bg-cyan-400",
      textColor: "text-cyan-400",
      href: "/leaderboards/shows",
      stat: stats?.totalShowsCompleted.toLocaleString() || "0",
      statLabel: "shows completed",
    },
    {
      id: "achievements",
      name: "Achievements",
      description: "Who's earned the most achievement points",
      icon: <IconTrophy size={32} />,
      color: "bg-amber-400",
      textColor: "text-amber-400",
      href: "/leaderboards/achievements",
      stat: stats?.totalAchievementsUnlocked.toLocaleString() || "0",
      statLabel: "achievements unlocked",
    },
  ];

  return (
    <>
      <section className="mt-6 lg:mt-8 mb-8 transition-all duration-300 ease-in-out">
        <h1 className="text-2xl sm:3xl md:text-4xl font-bold">Leaderboards</h1>
        <p className="text-neutral-400 mt-2">
          See how you stack up against other viewers
        </p>
      </section>

      {/* Stats overview */}
      {stats && (
        <section className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-neutral-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-lime-400">
              {stats.activeUsers.toLocaleString()}
            </div>
            <div className="text-sm text-neutral-400">Active Users</div>
          </div>
          <div className="bg-neutral-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {stats.totalEpisodesWatched.toLocaleString()}
            </div>
            <div className="text-sm text-neutral-400">Episodes Watched</div>
          </div>
          <div className="bg-neutral-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {stats.totalShowsCompleted.toLocaleString()}
            </div>
            <div className="text-sm text-neutral-400">Shows Completed</div>
          </div>
          <div className="bg-neutral-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">
              {stats.totalAchievementsUnlocked.toLocaleString()}
            </div>
            <div className="text-sm text-neutral-400">Achievements Unlocked</div>
          </div>
        </section>
      )}

      {/* Leaderboard categories */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {leaderboardTypes.map((type) => (
          <Link
            key={type.id}
            href={type.href}
            className="block bg-neutral-800 rounded-xl p-6 hover:bg-neutral-700 transition-colors group"
          >
            <div
              className={`w-16 h-16 rounded-xl ${type.color} flex items-center justify-center text-neutral-900 mb-4 group-hover:scale-110 transition-transform`}
            >
              {type.icon}
            </div>
            <h2 className={`text-xl font-bold mb-1 ${type.textColor}`}>
              {type.name}
            </h2>
            <p className="text-neutral-400 text-sm mb-4">{type.description}</p>
            <div className="text-sm">
              <span className="text-white font-medium">{type.stat}</span>{" "}
              <span className="text-neutral-500">{type.statLabel}</span>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
