import React from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import BrowseNavigation from "@/src/components/browse-navigation";
import ReelDeckGrid from "@/src/components/reel-deck-grid";
import { getSeriesEpisodeCount } from "@/src/utils/tmdb-utils";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

interface UpcomingPageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{
    sort?: string;
  }>;
}

type SortOption = "next-episode" | "title-asc" | "title-desc" | "rating";

export default async function UpcomingPage({
  params,
  searchParams,
}: UpcomingPageProps) {
  const { username } = await params;
  const { sort: sortOption = "next-episode" } = await searchParams;
  const supabase = await createClient();

  // Get current user
  const { data: user } = await supabase.auth.getClaims();
  const currentUserId = user?.claims?.sub || null;

  if (!currentUserId) {
    redirect("/auth/portal");
  }

  // Get profile for the username in the URL
  const { data: urlProfile } = await supabase
    .from("profiles")
    .select()
    .eq("username", username)
    .single();

  if (!urlProfile) {
    notFound();
  }

  // Check if this is the current user's profile
  const isCurrentUser = currentUserId === urlProfile?.id;

  // Only allow users to view their own reel deck
  if (!isCurrentUser) {
    const { data: ownProfile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", currentUserId)
      .single();

    if (ownProfile?.username) {
      redirect(`/${ownProfile.username}/reel-deck/upcoming`);
    }
    notFound();
  }

  // Fetch all reel deck items (only TV shows have upcoming episodes)
  const { data: reelDeckItems } = await supabase
    .from("reel_deck")
    .select("*")
    .eq("user_id", currentUserId)
    .eq("media_type", "tv")
    .order("last_watched_at", { ascending: false });

  // Fetch full media details for each item
  const seriesWithDetails = [];
  const today = new Date().toISOString().split("T")[0];

  if (reelDeckItems) {
    for (const item of reelDeckItems) {
      const { data: series } = await supabase
        .from("series")
        .select("*")
        .eq("id", item.media_id)
        .single();

      if (series) {
        // Get episode watch progress for this series
        const { data: episodeWatches } = await supabase
          .from("episode_watches")
          .select("*")
          .eq("user_id", currentUserId)
          .eq("series_id", item.media_id);

        // Get total episodes
        const totalEpisodes = await getSeriesEpisodeCount(
          series.id,
          series.tmdb_id,
        );

        // Get the next upcoming episode
        const { data: nextUpcomingEpisode } = await supabase
          .from("episodes")
          .select("air_date")
          .eq("series_id", series.id)
          .not("air_date", "is", null)
          .gt("air_date", today)
          .order("air_date", { ascending: true })
          .limit(1)
          .single();

        // Count aired episodes
        const { count: airedEpisodesCount } = await supabase
          .from("episodes")
          .select("*", { count: "exact", head: true })
          .eq("series_id", series.id)
          .not("air_date", "is", null)
          .lte("air_date", today);

        const watchedEpisodes = episodeWatches?.length || 0;
        const airedCount = airedEpisodesCount ?? 0;

        const isCompleted =
          item.status === "completed" ||
          (watchedEpisodes >= totalEpisodes &&
            totalEpisodes > 0 &&
            !nextUpcomingEpisode);

        const isCaughtUp = watchedEpisodes >= airedCount && airedCount > 0;

        // Only include shows that are caught up and have upcoming episodes
        if (!isCompleted && isCaughtUp && nextUpcomingEpisode) {
          seriesWithDetails.push({
            ...series,
            reelDeckItem: item,
            watchedEpisodes,
            totalEpisodes,
            nextUpcomingEpisodeDate: nextUpcomingEpisode.air_date,
          });
        }
      }
    }
  }

  // Apply sorting
  seriesWithDetails.sort((a, b) => {
    switch (sortOption as SortOption) {
      case "next-episode":
        const aDate = a.nextUpcomingEpisodeDate;
        const bDate = b.nextUpcomingEpisodeDate;

        if (!aDate && !bDate) return 0;
        if (!aDate) return 1;
        if (!bDate) return -1;
        return new Date(aDate).getTime() - new Date(bDate).getTime();

      case "title-asc":
        return a.title.localeCompare(b.title);

      case "title-desc":
        return b.title.localeCompare(a.title);

      case "rating":
        const aRating = a.vote_average || 0;
        const bRating = b.vote_average || 0;
        return bRating - aRating;

      default:
        return 0;
    }
  });

  return (
    <>
      <BrowseNavigation
        items={[
          {
            label: `${urlProfile.id === currentUserId ? "Account" : "Profile"}`,
            href: `/${urlProfile.username}`,
          },
          {
            label: "Collections",
            href: `/${urlProfile.username}/collections`,
            color: `indigo-500`,
          },
        ]}
        profileId={urlProfile.id}
        currentUserId={currentUserId || ""}
      />

      <div className="flex gap-6 mt-14 lg:mt-20 mb-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Back Link */}
          <Link
            href={`/${username}/reel-deck`}
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-lime-400 mb-6 transition-colors"
          >
            <IconArrowLeft size={20} />
            <span>Back to Reel Deck</span>
          </Link>

          <section className="mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Upcoming
            </h1>
            <p className="text-neutral-400 mt-2">
              Shows you're caught up on with future episodes coming
            </p>
          </section>

          {/* Media Grid */}
          {seriesWithDetails.length === 0 ? (
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-12 text-center">
              <div className="max-w-md mx-auto">
                <h2 className="text-xl font-semibold mb-2">
                  No upcoming shows
                </h2>
                <p className="text-neutral-400 mb-6">
                  All your shows have aired content to catch up on or have ended
                </p>
                <Link
                  href="/search"
                  className="inline-flex px-6 py-3 bg-lime-400 text-neutral-900 hover:bg-lime-500 rounded-lg font-medium transition-colors"
                >
                  Browse Media
                </Link>
              </div>
            </div>
          ) : (
            <ReelDeckGrid
              items={seriesWithDetails}
              username={username}
              userId={currentUserId}
            />
          )}
        </div>

        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Sort Options */}
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
              <h3 className="font-semibold mb-4">Sort By</h3>
              <div className="space-y-2">
                <Link
                  href={`/${username}/reel-deck/upcoming`}
                  className={`block px-3 py-2 rounded-lg transition-colors text-sm ${
                    sortOption === "next-episode"
                      ? "bg-lime-400 text-neutral-900 font-medium"
                      : "text-neutral-300 hover:bg-neutral-800"
                  }`}
                >
                  Next Episode
                </Link>
                <Link
                  href={`/${username}/reel-deck/upcoming?sort=title-asc`}
                  className={`block px-3 py-2 rounded-lg transition-colors text-sm ${
                    sortOption === "title-asc"
                      ? "bg-lime-400 text-neutral-900 font-medium"
                      : "text-neutral-300 hover:bg-neutral-800"
                  }`}
                >
                  Title (A-Z)
                </Link>
                <Link
                  href={`/${username}/reel-deck/upcoming?sort=title-desc`}
                  className={`block px-3 py-2 rounded-lg transition-colors text-sm ${
                    sortOption === "title-desc"
                      ? "bg-lime-400 text-neutral-900 font-medium"
                      : "text-neutral-300 hover:bg-neutral-800"
                  }`}
                >
                  Title (Z-A)
                </Link>
                <Link
                  href={`/${username}/reel-deck/upcoming?sort=rating`}
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
          </div>
        </aside>
      </div>
    </>
  );
}
