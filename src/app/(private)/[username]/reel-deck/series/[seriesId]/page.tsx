import React, { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/src/utils/supabase/server";
import { ensureSeasonMetadata } from "@/src/utils/tmdb-utils";
import SeriesProgressTracker from "@/src/components/series-progress-tracker";
import BrowseNavigation from "@/src/components/browse-navigation";
import {
  IconArrowLeft,
  IconDeviceTv,
  IconCalendar,
  IconMessage2,
} from "@tabler/icons-react";
import RemoveFromReelDeckButton from "@/src/components/remove-from-reel-deck-button";
import ForceRefreshReelDeck from "@/src/components/force-refresh-reel-deck";

interface SeriesProgressPageProps {
  params: Promise<{
    username: string;
    seriesId: string;
  }>;
}

export default async function SeriesProgressPage({
  params,
}: SeriesProgressPageProps) {
  const { username, seriesId } = await params;
  const supabase = await createClient();

  // Get current user
  const { data: user } = await supabase.auth.getClaims();
  const currentUserId = user?.claims?.sub || null;

  if (!currentUserId) {
    redirect("/auth/portal");
  }

  // Get profile for the username in the URL - only needed fields
  const { data: urlProfile } = await supabase
    .from("profiles")
    .select("id, username, role")
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

  // Get series data - only needed fields
  const { data: series, error: seriesError } = await supabase
    .from("series")
    .select("id, title, tmdb_id, poster_path, release_year, status, overview")
    .eq("id", seriesId)
    .single();

  if (seriesError || !series) {
    notFound();
  }

  // OPTIMIZATION 1: Only ensure season metadata exists (not full episodes)
  // Episodes will be loaded progressively per season
  await ensureSeasonMetadata(seriesId, series.tmdb_id);

  // Get seasons with basic info only
  const { data: seasons } = await supabase
    .from("seasons")
    .select("id, season_number, title, poster_path, episode_count")
    .eq("series_id", seriesId)
    .order("season_number", { ascending: true });

  if (!seasons || seasons.length === 0) {
    notFound();
  }

  // OPTIMIZATION 2: Get all watched episodes in a single query
  const { data: watchedEpisodes } = await supabase
    .from("episode_watches")
    .select("episode_id, series_id")
    .eq("user_id", currentUserId)
    .eq("series_id", seriesId);

  const watchedEpisodeIds = new Set(
    watchedEpisodes?.map((w) => w.episode_id) || [],
  );

  // Get current watch cycle info
  const { data: watchCycle } = await supabase
    .from("watch_cycles")
    .select("id, cycle_number, status, started_at, episodes_watched, total_episodes")
    .eq("user_id", currentUserId)
    .eq("series_id", seriesId)
    .order("cycle_number", { ascending: false })
    .limit(1)
    .single();

  // For initial display, show season structure without episodes
  // Episodes will be loaded progressively by the client component
  const seasonsForTracker = seasons
    .map((season) => ({
      id: season.id,
      season_number: season.season_number,
      title: season.title,
      poster_path: season.poster_path,
      episodes: [], // Start empty - will be loaded by SeriesProgressTracker
      watchedCount: 0, // Will be calculated when episodes load
      totalCount: season.episode_count || 0,
      percentage: 0,
      isLoading: true, // Flag to show loading state
    }))
    .reverse(); // Latest seasons first

  return (
    <>
      <BrowseNavigation
        items={[
          {
            label: "Account",
            href: `/${username}`,
          },
          {
            label: "Collections",
            href: `/${username}/collections`,
            textColor: `hover:text-indigo-500`,
            bgColor: `bg-indigo-500`,
          },
        ]}
        profileId={urlProfile.id}
        currentUserId={currentUserId}
      />

      <div className="mt-6 lg:mt-8 mb-6">
        {/* Back Button */}
        <Link
          href={`/${username}/reel-deck`}
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-lime-400 transition-colors mb-6"
        >
          <IconArrowLeft size={20} />
          <span>Back to Reel Deck</span>
        </Link>

        {/* Series Header */}
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden mb-6">
          <div className="flex flex-col md:flex-row gap-6 p-6">
            {/* Poster */}
            <div className="w-32 md:w-48 aspect-2/3 rounded-lg overflow-hidden shrink-0 bg-neutral-800 border-2 border-neutral-700">
              {series.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
                  alt={series.title}
                  width={192}
                  height={288}
                  className="object-cover w-full h-full"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <IconDeviceTv size={48} className="text-neutral-600" />
                </div>
              )}
            </div>

            {/* Series Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{series.title}</h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-neutral-400 mb-4">
                {series.release_year && (
                  <div className="flex items-center gap-2">
                    <IconCalendar size={18} />
                    <span>{series.release_year}</span>
                  </div>
                )}

                {series.status && (
                  <div className="px-3 py-1 rounded-full text-xs font-semibold bg-neutral-800 text-neutral-300">
                    {series.status}
                  </div>
                )}
              </div>

              {/* Overview */}
              {series.overview && (
                <p className="text-neutral-400 leading-relaxed line-clamp-4">
                  {series.overview}
                </p>
              )}

              {/* Link to full series details */}
              <Link
                href={`/series/${seriesId}`}
                className="inline-flex items-centers gap-1 mt-4 text-sm text-lime-400/70 hover:text-lime-400 transition-colors"
              >
                <IconMessage2 size={20} />
                View full series details
              </Link>

              <div className={`mt-6 flex justify-end gap-2`}>
                {urlProfile.role >= 10 && (
                  <ForceRefreshReelDeck
                    userId={currentUserId}
                    role={parseInt(urlProfile.role) || 0}
                    tmdbId={series.tmdb_id}
                    seriesId={seriesId}
                  />
                )}

                {user && (
                  <RemoveFromReelDeckButton
                    userId={currentUserId}
                    username={username}
                    seriesId={seriesId}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Tracker - Episodes load progressively */}
        {/* Overall progress now shown at the top of SeriesProgressTracker */}
        {seasonsForTracker.length > 0 ? (
          <SeriesProgressTracker
            seasons={seasonsForTracker}
            seriesId={seriesId}
            userId={currentUserId}
            username={username}
            initialWatchedIds={Array.from(watchedEpisodeIds)}
            initialWatchCycle={watchCycle}
          />
        ) : (
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-12 text-center">
            <p className="text-neutral-400">
              No season data available for this series.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
