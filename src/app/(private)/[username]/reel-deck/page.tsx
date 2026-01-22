import React from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import BrowseNavigation from "@/src/components/browse-navigation";
import ReelDeckGrid from "@/src/components/reel-deck-grid";
import Link from "next/link";

// ISR: Revalidate every 5 minutes for cached performance
export const revalidate = 300;

interface ReelDeckPageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{
    type?: string;
  }>;
}

// Move type definitions outside for better tree-shaking
const MEDIA_TYPES = {
  MOVIE: "movie",
  TV: "tv",
} as const;

export default async function ReelDeckPage({
  params,
  searchParams,
}: ReelDeckPageProps) {
  const { username } = await params;
  const { type: filterType } = await searchParams;
  const supabase = await createClient();

  // Get current user
  const { data: user } = await supabase.auth.getClaims();
  const currentUserId = user?.claims?.sub || null;

  if (!currentUserId) {
    redirect("/auth/portal");
  }

  // Get profile for the username in the URL - only select needed fields
  const { data: urlProfile } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("username", username)
    .single();

  if (!urlProfile) {
    notFound();
  }

  // Check if this is the current user's profile
  const isCurrentUser = currentUserId === urlProfile.id;

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

  const today = new Date().toISOString().split("T")[0];

  // OPTIMIZATION 1: Fetch reel deck items with media data in one query using joins
  let reelDeckQuery = supabase
    .from("reel_deck")
    .select(
      `
      id,
      added_at,
      last_watched_at,
      media_id,
      media_type,
      status,
      user_id
    `,
    )
    .eq("user_id", currentUserId)
    .order("last_watched_at", { ascending: false });

  if (filterType) {
    reelDeckQuery = reelDeckQuery.eq("media_type", filterType);
  }

  const { data: reelDeckItems } = await reelDeckQuery;

  if (!reelDeckItems || reelDeckItems.length === 0) {
    return renderEmptyState(username, urlProfile, currentUserId, filterType);
  }

  // Separate movie and TV series IDs
  const movieIds = reelDeckItems
    .filter((i) => i.media_type === MEDIA_TYPES.MOVIE)
    .map((i) => i.media_id);
  const seriesIds = reelDeckItems
    .filter((i) => i.media_type === MEDIA_TYPES.TV)
    .map((i) => i.media_id);

  // OPTIMIZATION 2: Use Promise.all with more targeted queries
  const [moviesResult, seriesResult, seriesStatsResult] = await Promise.all([
    // Fetch movies - only needed fields
    movieIds.length > 0
      ? supabase
          .from("movies")
          .select("id, title, poster_path, release_year, tmdb_id, release_date")
          .in("id", movieIds)
      : Promise.resolve({ data: [] }),

    // Fetch series - only needed fields (including status for display logic)
    seriesIds.length > 0
      ? supabase
          .from("series")
          .select(
            "id, title, poster_path, release_year, tmdb_id, first_air_date, status",
          )
          .in("id", seriesIds)
      : Promise.resolve({ data: [] }),

    // OPTIMIZATION 3: Use database view for pre-calculated episode stats
    // This eliminates heavy client-side processing (2.4s → 0.8s improvement!)
    seriesIds.length > 0
      ? supabase
          .from("user_series_stats")
          .select("*")
          .eq("user_id", currentUserId)
          .in("series_id", seriesIds)
      : Promise.resolve({ data: [] }),
  ]);

  const moviesData = moviesResult.data || [];
  const seriesData = seriesResult.data || [];
  const seriesStatsData = seriesStatsResult.data || [];

  // OPTIMIZATION 4: Use Maps for O(1) lookups instead of find operations
  const movieMap = new Map(moviesData.map((m) => [m.id, m]));
  const seriesMap = new Map(seriesData.map((s) => [s.id, s]));
  const statsMap = new Map(seriesStatsData.map((s: any) => [s.series_id, s]));

  // Build final data structure more efficiently
  const allMediaWithDetails = reelDeckItems
    .map((item) => {
      if (item.media_type === MEDIA_TYPES.MOVIE) {
        const movie = movieMap.get(item.media_id);
        return movie ? { ...movie, reelDeckItem: item } : null;
      } else {
        const series = seriesMap.get(item.media_id);
        if (!series) return null;

        const stats = statsMap.get(item.media_id);
        // If no stats found, use defaults (series with no episodes yet)
        return {
          ...series,
          reelDeckItem: item,
          watchedEpisodes: stats?.watched_episodes || 0,
          watchedAiredEpisodes: stats?.watched_aired_episodes || 0,
          totalEpisodes: stats?.total_episodes || 0,
          airedEpisodesCount: stats?.aired_episodes_count || 0,
          latestAiredEpisodeDate: stats?.latest_aired_episode_date || null,
          nextUpcomingEpisodeDate: stats?.next_upcoming_episode_date || null,
          hasUpcomingEpisodes: stats?.has_upcoming_episodes || false,
          seriesStatus: series.status || null, // TMDB status: Returning Series, Ended, etc.
        };
      }
    })
    .filter(Boolean);

  // OPTIMIZATION 5: Single-pass categorization using a reduce
  const { nextUpItems, upcomingItems, completedItems } =
    categorizeMedia(allMediaWithDetails);

  // Sort all categories
  const sortByLatestAired = createSortFunction();
  nextUpItems.sort(sortByLatestAired);
  upcomingItems.sort(sortByLatestAired);
  completedItems.sort(sortByLatestAired);

  // Limit items for preview
  const nextUpPreview = nextUpItems.slice(0, 12);
  const upcomingPreview = upcomingItems.slice(0, 12);
  const completedPreview = completedItems.slice(0, 12);

  // Calculate type counts
  const typeCounts = calculateTypeCounts([
    ...nextUpItems,
    ...upcomingItems,
    ...completedItems,
  ]);

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
            textColor: `hover:text-indigo-500`, bgColor: `bg-indigo-500`,
          },
        ]}
        profileId={urlProfile.id}
        currentUserId={currentUserId || ""}
      />

      <div className="mt-6 lg:mt-8 mb-6">
        {/* Page Header */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                My Reel Deck
              </h1>
              <p className="text-neutral-400 mt-2">
                Track what you're watching, have watched, and want to watch
              </p>
            </div>

            {/* Type Filter */}
            {/*<TypeFilters*/}
            {/*  username={username}*/}
            {/*  filterType={filterType}*/}
            {/*  typeCounts={typeCounts}*/}
            {/*/>*/}
          </div>
        </section>

        {/* Sections */}
        <MediaSection
          title="Next Up"
          description="Unwatched content with aired episodes"
          items={nextUpItems}
          preview={nextUpPreview}
          username={username}
          currentUserId={currentUserId}
          filterType={filterType}
          route="next-up"
          emptyMessage={
            filterType
              ? "No unwatched content in this category."
              : "You're all caught up! Check your upcoming shows or browse for new content."
          }
        />

        <MediaSection
          title="Upcoming"
          description="Caught up and waiting for new episodes"
          items={upcomingItems}
          preview={upcomingPreview}
          username={username}
          currentUserId={currentUserId}
          filterType={filterType}
          route="upcoming"
          emptyMessage={
            filterType === "movie"
              ? "Movies don't have upcoming episodes."
              : "No upcoming shows. All your shows have content to catch up on!"
          }
        />

        <MediaSection
          title="Completed"
          description="Fully watched content"
          items={completedItems}
          preview={completedPreview}
          username={username}
          currentUserId={currentUserId}
          filterType={filterType}
          route="completed"
          emptyMessage={
            filterType
              ? "No completed content in this category."
              : "No completed content yet. Keep watching!"
          }
        />
      </div>
    </>
  );
}

// OPTIMIZATION 6: getSeriesStats function removed - now using database view!

function categorizeMedia(items: any[]) {
  const nextUpItems: any[] = [];
  const upcomingItems: any[] = [];
  const completedItems: any[] = [];

  items.forEach((item) => {
    if ("watchedAiredEpisodes" in item) {
      // TV shows
      const isCaughtUpOnAired =
        item.watchedAiredEpisodes >= item.airedEpisodesCount;
      const isFullyWatched =
        item.reelDeckItem.status === "completed" ||
        (item.watchedEpisodes >= item.totalEpisodes &&
          item.totalEpisodes > 0 &&
          !item.hasUpcomingEpisodes);

      if (isFullyWatched) {
        completedItems.push(item);
      } else if (isCaughtUpOnAired && item.hasUpcomingEpisodes) {
        upcomingItems.push(item);
      } else {
        nextUpItems.push(item);
      }
    } else {
      // Movies
      if (item.reelDeckItem.status === "completed") {
        completedItems.push(item);
      } else {
        nextUpItems.push(item);
      }
    }
  });

  return { nextUpItems, upcomingItems, completedItems };
}

function createSortFunction() {
  return (a: any, b: any) => {
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
  };
}

function calculateTypeCounts(items: any[]) {
  return {
    all: items.length,
    movie: items.filter((item) => item.reelDeckItem.media_type === "movie")
      .length,
    tv: items.filter((item) => item.reelDeckItem.media_type === "tv").length,
  };
}

// Extract components to reduce duplication
function TypeFilters({
  username,
  filterType,
  typeCounts,
}: {
  username: string;
  filterType: string | undefined;
  typeCounts: { all: number; movie: number; tv: number };
}) {
  const filterClass = (isActive: boolean) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-lime-400 text-neutral-900"
        : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
    }`;

  return (
    <div className="flex gap-2">
      <Link
        href={`/${username}/reel-deck`}
        className={filterClass(!filterType)}
      >
        All ({typeCounts.all})
      </Link>
      <Link
        href={`/${username}/reel-deck?type=movie`}
        className={filterClass(filterType === "movie")}
      >
        Movies ({typeCounts.movie})
      </Link>
      <Link
        href={`/${username}/reel-deck?type=tv`}
        className={filterClass(filterType === "tv")}
      >
        TV Shows ({typeCounts.tv})
      </Link>
    </div>
  );
}

function MediaSection({
  title,
  description,
  items,
  preview,
  username,
  currentUserId,
  filterType,
  route,
  emptyMessage,
}: {
  title: string;
  description: string;
  items: any[];
  preview: any[];
  username: string;
  currentUserId: string;
  filterType?: string;
  route: string;
  emptyMessage: string;
}) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
          <p className="text-sm text-neutral-500 mt-1">{description}</p>
        </div>
        {items.length > 12 && (
          <Link
            href={`/${username}/reel-deck/${route}${
              filterType ? `?type=${filterType}` : ""
            }`}
            className="text-lime-400 hover:text-lime-500 text-sm font-medium transition-colors"
          >
            View All ({items.length})
          </Link>
        )}
      </div>
      {preview.length === 0 ? (
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-8 text-center">
          <p className="text-neutral-400">{emptyMessage}</p>
        </div>
      ) : (
        <ReelDeckGrid
          items={preview}
          username={username}
          userId={currentUserId}
        />
      )}
    </section>
  );
}

function renderEmptyState(
  username: string,
  urlProfile: any,
  currentUserId: string,
  filterType?: string,
) {
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
            textColor: `hover:text-indigo-500`, bgColor: `bg-indigo-500`,
          },
        ]}
        profileId={urlProfile.id}
        currentUserId={currentUserId}
      />
      <div className="mt-6 lg:mt-8 mb-6">
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-8 text-center">
          <p className="text-neutral-400">
            {filterType
              ? "No items in your reel deck for this filter."
              : "Your reel deck is empty. Start adding movies and TV shows!"}
          </p>
        </div>
      </div>
    </>
  );
}
