import React from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import BrowseNavigation from "@/src/components/browse-navigation";
import ReelDeckGrid from "@/src/components/reel-deck-grid";
import { getSeriesEpisodeCount } from "@/src/utils/tmdb-utils";
import Link from "next/link";

interface ReelDeckPageProps {
  params: Promise<{ username: string }>;
}

export default async function ReelDeckPage({ params }: ReelDeckPageProps) {
  const { username } = await params;
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
      redirect(`/${ownProfile.username}/reel-deck`);
    }
    notFound();
  }

  // Fetch all reel deck items
  const { data: reelDeckItems } = await supabase
    .from("reel_deck")
    .select("*")
    .eq("user_id", currentUserId)
    .order("last_watched_at", { ascending: false });

  // Fetch full media details for each item
  const moviesWithDetails = [];
  const seriesWithDetails = [];
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  if (reelDeckItems) {
    for (const item of reelDeckItems) {
      if (item.media_type === "movie") {
        const { data: movie } = await supabase
          .from("movies")
          .select("*")
          .eq("id", item.media_id)
          .single();

        if (movie) {
          moviesWithDetails.push({
            ...movie,
            reelDeckItem: item,
          });
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

          // Get total episodes (will fetch from TMDB if needed)
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

          seriesWithDetails.push({
            ...series,
            reelDeckItem: item,
            watchedEpisodes: episodeWatches?.length || 0,
            totalEpisodes: totalEpisodes,
            latestAiredEpisodeDate: latestAiredEpisode?.air_date || null,
            nextUpcomingEpisodeDate: nextUpcomingEpisode?.air_date || null,
            airedEpisodesCount: airedEpisodesCount || 0,
          });
        }
      }
    }
  }

  // Combine all media
  const allMediaWithDetails = [...moviesWithDetails, ...seriesWithDetails];

  // Categorize into Next Up, Upcoming, and Completed
  const nextUpItems: typeof allMediaWithDetails = [];
  const upcomingItems: typeof allMediaWithDetails = [];
  const completedItems: typeof allMediaWithDetails = [];

  allMediaWithDetails.forEach((item) => {
    // Check if completed
    const isCompleted =
      item.reelDeckItem.status === "completed" ||
      ("watchedEpisodes" in item &&
        "totalEpisodes" in item &&
        item.watchedEpisodes >= item.totalEpisodes &&
        item.totalEpisodes > 0 &&
        !item.nextUpcomingEpisodeDate); // No future episodes

    if (isCompleted) {
      completedItems.push(item);
      return;
    }

    // For TV shows
    if ("watchedEpisodes" in item) {
      const isCaughtUp =
        item.watchedEpisodes >= (item.airedEpisodesCount || 0) &&
        item.airedEpisodesCount > 0;

      if (isCaughtUp && item.nextUpcomingEpisodeDate) {
        // Caught up on aired episodes, but has upcoming episodes
        upcomingItems.push(item);
      } else {
        // Has unwatched aired episodes
        nextUpItems.push(item);
      }
    } else {
      // Movies that aren't completed go to Next Up
      nextUpItems.push(item);
    }
  });

  // Sort Next Up by latest aired episode (most recent first)
  nextUpItems.sort((a, b) => {
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
  });

  // Sort Upcoming by next episode air date (soonest first)
  upcomingItems.sort((a, b) => {
    const aDate =
      "nextUpcomingEpisodeDate" in a ? a.nextUpcomingEpisodeDate : null;
    const bDate =
      "nextUpcomingEpisodeDate" in b ? b.nextUpcomingEpisodeDate : null;

    if (!aDate && !bDate) return 0;
    if (!aDate) return 1;
    if (!bDate) return -1;
    return new Date(aDate).getTime() - new Date(bDate).getTime();
  });

  // Sort Completed by last watched date (most recent first)
  completedItems.sort((a, b) => {
    const aTime = a.reelDeckItem.last_watched_at || a.reelDeckItem.added_at;
    const bTime = b.reelDeckItem.last_watched_at || b.reelDeckItem.added_at;
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });

  // Limit items for preview (show first 12 items)
  const nextUpPreview = nextUpItems.slice(0, 12);
  const upcomingPreview = upcomingItems.slice(0, 12);
  const completedPreview = completedItems.slice(0, 12);

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
          },
        ]}
        profileId={urlProfile.id}
        currentUserId={currentUserId || ""}
      />

      <div className="mt-14 lg:mt-20 mb-6">
        {/* Page Header */}
        <section className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            My Reel Deck
          </h1>
          <p className="text-neutral-400 mt-2">
            Track what you're watching, have watched, and want to watch
          </p>
        </section>

        {/* Next Up Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold">Next Up</h2>
            {nextUpItems.length > 12 && (
              <Link
                href={`/${username}/reel-deck/next-up`}
                className="text-lime-400 hover:text-lime-500 text-sm font-medium transition-colors"
              >
                View All ({nextUpItems.length})
              </Link>
            )}
          </div>
          {nextUpPreview.length === 0 ? (
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-8 text-center">
              <p className="text-neutral-400">
                No unwatched content. Check out your upcoming shows or browse
                for new content!
              </p>
            </div>
          ) : (
            <ReelDeckGrid
              items={nextUpPreview}
              username={username}
              userId={currentUserId}
            />
          )}
        </section>

        {/* Upcoming Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold">Upcoming</h2>
            {upcomingItems.length > 12 && (
              <Link
                href={`/${username}/reel-deck/upcoming`}
                className="text-lime-400 hover:text-lime-500 text-sm font-medium transition-colors"
              >
                View All ({upcomingItems.length})
              </Link>
            )}
          </div>
          {upcomingPreview.length === 0 ? (
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-8 text-center">
              <p className="text-neutral-400">
                No upcoming episodes. All your shows have aired content to catch
                up on!
              </p>
            </div>
          ) : (
            <ReelDeckGrid
              items={upcomingPreview}
              username={username}
              userId={currentUserId}
            />
          )}
        </section>

        {/* Completed Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold">Completed</h2>
            {completedItems.length > 12 && (
              <Link
                href={`/${username}/reel-deck/completed`}
                className="text-lime-400 hover:text-lime-500 text-sm font-medium transition-colors"
              >
                View All ({completedItems.length})
              </Link>
            )}
          </div>
          {completedPreview.length === 0 ? (
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-8 text-center">
              <p className="text-neutral-400">
                No completed content yet. Keep watching!
              </p>
            </div>
          ) : (
            <ReelDeckGrid
              items={completedPreview}
              username={username}
              userId={currentUserId}
            />
          )}
        </section>
      </div>
    </>
  );
}
