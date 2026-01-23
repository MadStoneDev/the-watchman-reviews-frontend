import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import BrowseNavigation from "@/src/components/browse-navigation";
import ReelDeckGrid from "@/src/components/reel-deck-grid";
import { getSeriesEpisodeCount } from "@/src/utils/tmdb-utils";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

interface CompletedPageProps {
  searchParams: Promise<{
    type?: string;
    sort?: string;
  }>;
}

type SortOption =
  | "last-watched"
  | "title-asc"
  | "title-desc"
  | "rating"
  | "added-date";

export default async function CompletedPage({
  searchParams,
}: CompletedPageProps) {
  const { type: filterType, sort: sortOption = "last-watched" } =
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
          // Only include completed movies
          if (item.status === "completed") {
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

          const watchedEpisodes = episodeWatches?.length || 0;
          const isCompleted =
            item.status === "completed" ||
            (watchedEpisodes >= totalEpisodes &&
              totalEpisodes > 0 &&
              !nextUpcomingEpisode);

          // Only include completed shows
          if (isCompleted) {
            seriesWithDetails.push({
              ...series,
              reelDeckItem: item,
              watchedEpisodes,
              totalEpisodes,
              watchedAiredEpisodes: watchedEpisodes,
              airedEpisodesCount: totalEpisodes, // For completed, all episodes are watched
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
      case "last-watched":
        const aTime = a.reelDeckItem.last_watched_at || a.reelDeckItem.added_at;
        const bTime = b.reelDeckItem.last_watched_at || b.reelDeckItem.added_at;
        return new Date(bTime).getTime() - new Date(aTime).getTime();

      case "added-date":
        return (
          new Date(b.reelDeckItem.added_at).getTime() -
          new Date(a.reelDeckItem.added_at).getTime()
        );

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

      <div className="flex gap-6 mt-6 lg:mt-8 mb-6">
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
              Completed
            </h1>
            <p className="text-neutral-400 mt-2">
              Movies and shows you've finished watching
            </p>
          </section>

          {/* Media Grid */}
          {allMediaWithDetails.length === 0 ? (
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-12 text-center">
              <div className="max-w-md mx-auto">
                <h2 className="text-xl font-semibold mb-2">
                  No completed content
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
