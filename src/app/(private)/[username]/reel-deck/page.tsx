import React from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import BrowseNavigation from "@/src/components/browse-navigation";
import ReelDeckGrid from "@/src/components/reel-deck-grid";
import ReelDeckFilters from "@/src/components/reel-deck-filters";
import { getSeriesEpisodeCount } from "@/src/utils/tmdb-utils";

interface ReelDeckPageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{
    status?: string;
    type?: string;
    sort?: string; // Add sort parameter
  }>;
}

// Sorting options type
type SortOption =
  | "last-watched"
  | "recently-aired"
  | "type-movies-first"
  | "type-tv-first"
  | "title-asc"
  | "title-desc"
  | "rating"
  | "added-date";

export default async function ReelDeckPage({
  params,
  searchParams,
}: ReelDeckPageProps) {
  const { username } = await params;
  const {
    status: filterStatus,
    type: filterType,
    sort: sortOption = "last-watched", // Default to last watched
  } = await searchParams;
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

  // Fetch reel deck items with filters
  let query = supabase
    .from("reel_deck")
    .select("*")
    .eq("user_id", currentUserId)
    .order("last_watched_at", { ascending: false });

  // Apply status filter
  if (filterStatus) {
    query = query.eq("status", filterStatus);
  }

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

          // For "recently aired" sorting, get the latest episode air date
          let latestEpisodeAirDate = null;
          if (sortOption === "recently-aired") {
            const { data: latestEpisode } = await supabase
              .from("episodes")
              .select("air_date")
              .eq("series_id", series.id)
              .not("air_date", "is", null)
              .order("air_date", { ascending: false })
              .limit(1)
              .single();

            latestEpisodeAirDate = latestEpisode?.air_date || null;
          }

          seriesWithDetails.push({
            ...series,
            reelDeckItem: item,
            watchedEpisodes: episodeWatches?.length || 0,
            totalEpisodes: totalEpisodes,
            latestEpisodeAirDate, // Add this for sorting
          });
        }
      }
    }
  }

  // Combine and sort based on selected option
  const allMediaWithDetails = [...moviesWithDetails, ...seriesWithDetails];

  // Apply sorting
  allMediaWithDetails.sort((a, b) => {
    switch (sortOption as SortOption) {
      case "last-watched":
        // Sort by last watched or added date (default behavior)
        const aTime = a.reelDeckItem.last_watched_at || a.reelDeckItem.added_at;
        const bTime = b.reelDeckItem.last_watched_at || b.reelDeckItem.added_at;
        return new Date(bTime).getTime() - new Date(aTime).getTime();

      case "recently-aired":
        // Sort by most recent air date (movies by release date, TV by latest episode)
        const aAirDate =
          "latestEpisodeAirDate" in a
            ? a.latestEpisodeAirDate || a.first_air_date || a.release_year
            : a.release_date || a.release_year;
        const bAirDate =
          "latestEpisodeAirDate" in b
            ? b.latestEpisodeAirDate || b.first_air_date || b.release_year
            : b.release_date || b.release_year;

        if (!aAirDate && !bAirDate) return 0;
        if (!aAirDate) return 1;
        if (!bAirDate) return -1;
        return new Date(bAirDate).getTime() - new Date(aAirDate).getTime();

      case "type-movies-first":
        // Movies first, then TV shows, then by last watched within each type
        if (a.reelDeckItem.media_type !== b.reelDeckItem.media_type) {
          return a.reelDeckItem.media_type === "movie" ? -1 : 1;
        }
        const aTimeType1 =
          a.reelDeckItem.last_watched_at || a.reelDeckItem.added_at;
        const bTimeType1 =
          b.reelDeckItem.last_watched_at || b.reelDeckItem.added_at;
        return new Date(bTimeType1).getTime() - new Date(aTimeType1).getTime();

      case "type-tv-first":
        // TV shows first, then movies, then by last watched within each type
        if (a.reelDeckItem.media_type !== b.reelDeckItem.media_type) {
          return a.reelDeckItem.media_type === "tv" ? -1 : 1;
        }
        const aTimeType2 =
          a.reelDeckItem.last_watched_at || a.reelDeckItem.added_at;
        const bTimeType2 =
          b.reelDeckItem.last_watched_at || b.reelDeckItem.added_at;
        return new Date(bTimeType2).getTime() - new Date(aTimeType2).getTime();

      case "title-asc":
        // Sort alphabetically A-Z
        return a.title.localeCompare(b.title);

      case "title-desc":
        // Sort alphabetically Z-A
        return b.title.localeCompare(a.title);

      case "rating":
        // Sort by rating (highest first)
        const aRating = a.vote_average || 0;
        const bRating = b.vote_average || 0;
        return bRating - aRating;

      case "added-date":
        // Sort by when added to reel deck (newest first)
        return (
          new Date(b.reelDeckItem.added_at).getTime() -
          new Date(a.reelDeckItem.added_at).getTime()
        );

      default:
        // Fallback to last watched
        const aDefault =
          a.reelDeckItem.last_watched_at || a.reelDeckItem.added_at;
        const bDefault =
          b.reelDeckItem.last_watched_at || b.reelDeckItem.added_at;
        return new Date(bDefault).getTime() - new Date(aDefault).getTime();
    }
  });

  // Count all items (for base counts regardless of type filter)
  const { data: allReelDeckItems } = await supabase
    .from("reel_deck")
    .select("*")
    .eq("user_id", currentUserId);

  // Calculate counts by status (all types)
  const statusCounts = {
    all: allReelDeckItems?.length || 0,
    watching:
      allReelDeckItems?.filter((item) => item.status === "watching").length ||
      0,
    completed:
      allReelDeckItems?.filter((item) => item.status === "completed").length ||
      0,
    paused:
      allReelDeckItems?.filter((item) => item.status === "paused").length || 0,
    plan_to_watch:
      allReelDeckItems?.filter((item) => item.status === "plan_to_watch")
        .length || 0,
  };

  // Calculate counts by type (within current status)
  const currentStatusItems = filterStatus
    ? allReelDeckItems?.filter((item) => item.status === filterStatus) || []
    : allReelDeckItems || [];

  const typeCounts = {
    all: currentStatusItems.length,
    movie: currentStatusItems.filter((item) => item.media_type === "movie")
      .length,
    tv: currentStatusItems.filter((item) => item.media_type === "tv").length,
  };

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

      <div className="flex gap-6 mt-14 lg:mt-20 mb-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <section className="mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              My Reel Deck
            </h1>
            <p className="text-neutral-400 mt-2">
              Track what you're watching, have watched, and want to watch
            </p>
          </section>

          {/* Media Grid */}
          {allMediaWithDetails.length === 0 ? (
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-12 text-center">
              <div className="max-w-md mx-auto">
                <h2 className="text-xl font-semibold mb-2">No items found</h2>
                <p className="text-neutral-400 mb-6">
                  {filterStatus || filterType
                    ? "Try adjusting your filters or clear them to see all items"
                    : "Start adding movies and TV shows to track your watching progress!"}
                </p>
                <div className="flex gap-3 justify-center">
                  {(filterStatus ||
                    filterType ||
                    sortOption !== "last-watched") && (
                    <a
                      href={`/${username}/reel-deck`}
                      className="inline-flex px-6 py-3 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 rounded-lg font-medium transition-colors"
                    >
                      Clear Filters
                    </a>
                  )}
                  <a
                    href="/search"
                    className="inline-flex px-6 py-3 bg-lime-400 text-neutral-900 hover:bg-lime-500 rounded-lg font-medium transition-colors"
                  >
                    Browse Media
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <ReelDeckGrid
              items={allMediaWithDetails}
              username={username}
              userId={currentUserId}
            />
          )}
        </div>

        {/* Floating Sidebar Filters */}
        <ReelDeckFilters
          username={username}
          filterStatus={filterStatus}
          filterType={filterType}
          sortOption={sortOption as SortOption} // Pass sort option
          statusCounts={statusCounts}
          typeCounts={typeCounts}
        />
      </div>
    </>
  );
}
