import React from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import BrowseNavigation from "@/src/components/browse-navigation";
import ReelDeckGrid from "@/src/components/reel-deck-grid";
import { getSeriesEpisodeCount } from "@/src/utils/tmdb-utils";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

interface NextUpPageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{
    type?: string;
    sort?: string;
  }>;
}

type SortOption = "latest-aired" | "title-asc" | "title-desc" | "rating";

export default async function NextUpPage({
  params,
  searchParams,
}: NextUpPageProps) {
  const { username } = await params;
  const { type: filterType, sort: sortOption = "latest-aired" } =
    await searchParams;
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
      redirect(`/${ownProfile.username}/reel-deck/next-up`);
    }
    notFound();
  }

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
  const today = new Date().toISOString().split("T")[0];

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
              latestAiredEpisodeDate: latestAiredEpisode?.air_date || null,
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
  const { data: allReelDeckItems } = await supabase
    .from("reel_deck")
    .select("*")
    .eq("user_id", currentUserId);

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

      <div className="mt-6 lg:mt-8 mb-6">
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
                {/*<p className="text-neutral-400 mb-6">*/}
                {/*  {filterType*/}
                {/*    ? "Try adjusting your filters or check your upcoming shows"*/}
                {/*    : "You're all caught up! Check your upcoming shows or browse for new content."}*/}
                {/*</p>*/}
                {/*<div className="flex gap-3 justify-center">*/}
                {/*  {filterType && (*/}
                {/*    <Link*/}
                {/*      href={`/${username}/reel-deck/next-up`}*/}
                {/*      className="inline-flex px-6 py-3 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 rounded-lg font-medium transition-colors"*/}
                {/*    >*/}
                {/*      Clear Filters*/}
                {/*    </Link>*/}
                {/*  )}*/}
                {/*  <Link*/}
                {/*    href="/search"*/}
                {/*    className="inline-flex px-6 py-3 bg-lime-400 text-neutral-900 hover:bg-lime-500 rounded-lg font-medium transition-colors"*/}
                {/*  >*/}
                {/*    Browse Media*/}
                {/*  </Link>*/}
                {/*</div>*/}
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

        {/* Sidebar Filters */}
        {/*<aside className="hidden lg:block w-64 flex-shrink-0">*/}
        {/*  <div className="sticky top-24 space-y-6">*/}
        {/*    /!* Type Filter *!/*/}
        {/*    <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4">*/}
        {/*      <h3 className="font-semibold mb-4">Type</h3>*/}
        {/*      <div className="space-y-2">*/}
        {/*        <Link*/}
        {/*          href={`/${username}/reel-deck/next-up`}*/}
        {/*          className={`block px-3 py-2 rounded-lg transition-colors ${*/}
        {/*            !filterType*/}
        {/*              ? "bg-lime-400 text-neutral-900 font-medium"*/}
        {/*              : "text-neutral-300 hover:bg-neutral-800"*/}
        {/*          }`}*/}
        {/*        >*/}
        {/*          <div className="flex items-center justify-between">*/}
        {/*            <span>All</span>*/}
        {/*            <span className="text-sm">{typeCounts.all}</span>*/}
        {/*          </div>*/}
        {/*        </Link>*/}
        {/*        <Link*/}
        {/*          href={`/${username}/reel-deck/next-up?type=movie`}*/}
        {/*          className={`block px-3 py-2 rounded-lg transition-colors ${*/}
        {/*            filterType === "movie"*/}
        {/*              ? "bg-lime-400 text-neutral-900 font-medium"*/}
        {/*              : "text-neutral-300 hover:bg-neutral-800"*/}
        {/*          }`}*/}
        {/*        >*/}
        {/*          <div className="flex items-center justify-between">*/}
        {/*            <span>Movies</span>*/}
        {/*            <span className="text-sm">{typeCounts.movie}</span>*/}
        {/*          </div>*/}
        {/*        </Link>*/}
        {/*        <Link*/}
        {/*          href={`/${username}/reel-deck/next-up?type=tv`}*/}
        {/*          className={`block px-3 py-2 rounded-lg transition-colors ${*/}
        {/*            filterType === "tv"*/}
        {/*              ? "bg-lime-400 text-neutral-900 font-medium"*/}
        {/*              : "text-neutral-300 hover:bg-neutral-800"*/}
        {/*          }`}*/}
        {/*        >*/}
        {/*          <div className="flex items-center justify-between">*/}
        {/*            <span>TV Shows</span>*/}
        {/*            <span className="text-sm">{typeCounts.tv}</span>*/}
        {/*          </div>*/}
        {/*        </Link>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        
        {/*    /!* Sort Options *!/*/}
        {/*    <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4">*/}
        {/*      <h3 className="font-semibold mb-4">Sort By</h3>*/}
        {/*      <div className="space-y-2">*/}
        {/*        <Link*/}
        {/*          href={`/${username}/reel-deck/next-up${*/}
        {/*            filterType ? `?type=${filterType}` : ""*/}
        {/*          }`}*/}
        {/*          className={`block px-3 py-2 rounded-lg transition-colors text-sm ${*/}
        {/*            sortOption === "latest-aired"*/}
        {/*              ? "bg-lime-400 text-neutral-900 font-medium"*/}
        {/*              : "text-neutral-300 hover:bg-neutral-800"*/}
        {/*          }`}*/}
        {/*        >*/}
        {/*          Latest Aired*/}
        {/*        </Link>*/}
        {/*        <Link*/}
        {/*          href={`/${username}/reel-deck/next-up?sort=title-asc${*/}
        {/*            filterType ? `&type=${filterType}` : ""*/}
        {/*          }`}*/}
        {/*          className={`block px-3 py-2 rounded-lg transition-colors text-sm ${*/}
        {/*            sortOption === "title-asc"*/}
        {/*              ? "bg-lime-400 text-neutral-900 font-medium"*/}
        {/*              : "text-neutral-300 hover:bg-neutral-800"*/}
        {/*          }`}*/}
        {/*        >*/}
        {/*          Title (A-Z)*/}
        {/*        </Link>*/}
        {/*        <Link*/}
        {/*          href={`/${username}/reel-deck/next-up?sort=title-desc${*/}
        {/*            filterType ? `&type=${filterType}` : ""*/}
        {/*          }`}*/}
        {/*          className={`block px-3 py-2 rounded-lg transition-colors text-sm ${*/}
        {/*            sortOption === "title-desc"*/}
        {/*              ? "bg-lime-400 text-neutral-900 font-medium"*/}
        {/*              : "text-neutral-300 hover:bg-neutral-800"*/}
        {/*          }`}*/}
        {/*        >*/}
        {/*          Title (Z-A)*/}
        {/*        </Link>*/}
        {/*        <Link*/}
        {/*          href={`/${username}/reel-deck/next-up?sort=rating${*/}
        {/*            filterType ? `&type=${filterType}` : ""*/}
        {/*          }`}*/}
        {/*          className={`block px-3 py-2 rounded-lg transition-colors text-sm ${*/}
        {/*            sortOption === "rating"*/}
        {/*              ? "bg-lime-400 text-neutral-900 font-medium"*/}
        {/*              : "text-neutral-300 hover:bg-neutral-800"*/}
        {/*          }`}*/}
        {/*        >*/}
        {/*          Highest Rated*/}
        {/*        </Link>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</aside>*/}
      </div>
    </>
  );
}
