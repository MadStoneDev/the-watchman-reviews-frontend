import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import BrowseNavigation from "@/src/components/browse-navigation";
import ReelDeckGrid from "@/src/components/reel-deck-grid";
import { getSeriesEpisodeCount } from "@/src/utils/tmdb-utils";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

interface NextUpPageProps {
  searchParams: Promise<{
    type?: string;
    sort?: string;
  }>;
}

type SortOption = "latest-aired" | "title-asc" | "title-desc" | "rating";

export default async function NextUpPage({
  searchParams,
}: NextUpPageProps) {
  const { type: filterType, sort: sortOption = "latest-aired" } =
    await searchParams;
  const supabase = await createClient();

  // Get current user
  const { data: user } = await supabase.auth.getClaims();
  const currentUserId = user?.claims?.sub || null;

  if (!currentUserId) {
    redirect("/auth/portal");
  }

  // Get current user's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("id", currentUserId)
    .single();

  if (!profile) {
    redirect("/auth/portal");
  }

  const today = new Date().toISOString().split("T")[0];

  // Fetch all reel deck items
  let query = supabase
    .from("reel_deck")
    .select("*")
    .eq("user_id", currentUserId)
    .order("last_watched_at", { ascending: false });

  // Apply media type filter
  if (filterType) {
    query = query.eq("media_type", filterType);
  }

  const { data: reelDeckItems } = await query;

  // Fetch full media details for each item
  const moviesWithDetails = [];
  const seriesWithDetails = [];

  if (reelDeckItems) {
    for (const item of reelDeckItems) {
      if (item.media_type === "movie") {
        const { data: movie } = await supabase
          .from("movies")
          .select("*")
          .eq("id", item.media_id)
          .single();

        if (movie) {
          // Only include movies that aren't completed
          if (item.status !== "completed") {
            moviesWithDetails.push({
              ...movie,
              reelDeckItem: item,
            });
          }
        }
      } else if (item.media_type === "tv") {
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

          // Get the latest aired episode
          const { data: latestAiredEpisode } = await supabase
            .from("episodes")
            .select("air_date")
            .eq("series_id", series.id)
            .not("air_date", "is", null)
            .lte("air_date", today)
            .order("air_date", { ascending: false })
            .limit(1)
            .single();

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

          const isCaughtUp =
            watchedEpisodes >= (airedCount || 0) && airedCount > 0;

          // Only include shows with unwatched aired content
          if (!isCompleted && !isCaughtUp) {
            seriesWithDetails.push({
              ...series,
              reelDeckItem: item,
              watchedEpisodes,
              totalEpisodes,
              watchedAiredEpisodes: watchedEpisodes, // Same as watchedEpisodes for this query
              airedEpisodesCount: airedCount,
              latestAiredEpisodeDate: latestAiredEpisode?.air_date || null,
              hasUpcomingEpisodes: !!nextUpcomingEpisode,
              nextUpcomingEpisodeDate: nextUpcomingEpisode?.air_date || null,
              seriesStatus: series.status || null,
            });
          }
        }
      }
    }
  }

  // Combine and sort
  const allMediaWithDetails = [...moviesWithDetails, ...seriesWithDetails];

  // Apply sorting
  allMediaWithDetails.sort((a, b) => {
    switch (sortOption as SortOption) {
      case "latest-aired":
        const aDate =
          "latestAiredEpisodeDate" in a
            ? a.latestAiredEpisodeDate || a.first_air_date || a.release_year
            : a.release_date || a.release_year;
        const bDate =
          "latestAiredEpisodeDate" in b
            ? b.latestAiredEpisodeDate || b.first_air_date || b.release_year
            : b.release_date || b.release_year;

        if (!aDate && !bDate) return 0;
        if (!aDate) return 1;
        if (!bDate) return -1;
        return new Date(bDate).getTime() - new Date(aDate).getTime();

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

  // Count all items for type filter
  const typeCounts = {
    all: allMediaWithDetails.length,
    movie: allMediaWithDetails.filter(
      (item) => item.reelDeckItem.media_type === "movie",
    ).length,
    tv: allMediaWithDetails.filter(
      (item) => item.reelDeckItem.media_type === "tv",
    ).length,
  };

  return (
    <>
      <BrowseNavigation
        items={[
          {
            label: "Account",
            href: "/me",
          },
          {
            label: "Collections",
            href: "/me/collections",
            textColor: `hover:text-indigo-500`, bgColor: `bg-indigo-500`,
          },
        ]}
        profileId={profile.id}
        currentUserId={currentUserId || ""}
      />

      <div className="mt-6 lg:mt-8 mb-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Back Link */}
          <Link
            href="/me/reel-deck"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-lime-400 mb-6 transition-colors"
          >
            <IconArrowLeft size={20} />
            <span>Back to Reel Deck</span>
          </Link>

          <section className="mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Next Up
            </h1>
            <p className="text-neutral-400 mt-2">
              Content with unwatched episodes that have already aired
            </p>
          </section>

          {/* Media Grid */}
          {allMediaWithDetails.length === 0 ? (
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-12 text-center">
              <div className="max-w-md mx-auto">
                <h2 className="text-xl font-semibold mb-2">
                  No unwatched content
                </h2>
              </div>
            </div>
          ) : (
            <ReelDeckGrid
              items={allMediaWithDetails}
              username="me"
              userId={currentUserId}
            />
          )}
        </div>
      </div>
    </>
  );
}
