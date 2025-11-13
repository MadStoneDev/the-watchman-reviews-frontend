import React from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/src/utils/supabase/server";
import { ensureSeriesDataPopulated } from "@/src/utils/tmdb-utils";
import SeriesProgressTracker from "@/src/components/series-progress-tracker";
import BrowseNavigation from "@/src/components/browse-navigation";
import {
  IconArrowLeft,
  IconDeviceTv,
  IconCalendar,
  IconStar,
} from "@tabler/icons-react";

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

  // Get series data
  const { data: series, error: seriesError } = await supabase
    .from("series")
    .select("*")
    .eq("id", seriesId)
    .single();

  if (seriesError || !series) {
    notFound();
  }

  // ✅ FIX: Ensure ALL season and episode data is populated from TMDB
  const { seasons: seasonsWithEpisodes, totalEpisodes } =
    await ensureSeriesDataPopulated(seriesId, series.tmdb_id);

  // Get user's watched episodes
  const { data: watchedEpisodes } = await supabase
    .from("episode_watches")
    .select("episode_id")
    .eq("user_id", currentUserId)
    .eq("series_id", seriesId);

  const watchedEpisodeIds = new Set(
    watchedEpisodes?.map((w) => w.episode_id) || [],
  );

  // Transform data for the progress tracker component
  const today = new Date().toISOString().split("T")[0];

  const seasonsForTracker = seasonsWithEpisodes
    .map((season) => ({
      id: season.id,
      season_number: season.season_number,
      title: season.title,
      poster_path: season.poster_path,
      episodes: season.episodes
        .map((episode) => ({
          id: episode.id,
          episode_number: episode.episode_number,
          title: episode.title,
          isWatched: watchedEpisodeIds.has(episode.id),
          air_date: episode.air_date,
          hasAired: episode.air_date ? episode.air_date <= today : false,
        }))
        .reverse(), // Latest episodes first
      watchedCount: season.episodes.filter((ep) => watchedEpisodeIds.has(ep.id))
        .length,
      totalCount: season.episodes.length,
      percentage:
        season.episodes.length > 0
          ? Math.round(
              (season.episodes.filter((ep) => watchedEpisodeIds.has(ep.id))
                .length /
                season.episodes.length) *
                100,
            )
          : 0,
    }))
    .reverse(); // Latest seasons first

  const watchedCount = watchedEpisodeIds.size;
  const overallPercentage =
    totalEpisodes > 0 ? Math.round((watchedCount / totalEpisodes) * 100) : 0;

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
          },
        ]}
        profileId={urlProfile.id}
        currentUserId={currentUserId}
      />

      <div className="mt-14 lg:mt-20 mb-6">
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
            <div className="w-32 md:w-48 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0 bg-neutral-800 border-2 border-neutral-700">
              {series.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
                  alt={series.title}
                  width={192}
                  height={288}
                  className="object-cover w-full h-full"
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

                {series.vote_average && (
                  <div className="flex items-center gap-2">
                    <IconStar size={18} className="text-yellow-500" />
                    <span>{series.vote_average.toFixed(1)}</span>
                  </div>
                )}

                {series.status && (
                  <div className="px-3 py-1 rounded-full text-xs font-semibold bg-neutral-800 text-neutral-300">
                    {series.status}
                  </div>
                )}
              </div>

              {/* Overall Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-neutral-300">
                    Overall Progress
                  </span>
                  <span className="text-2xl font-bold text-lime-400">
                    {overallPercentage}%
                  </span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-lime-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${overallPercentage}%` }}
                  />
                </div>
                <p className="text-sm text-neutral-500 mt-2">
                  {watchedCount} of {totalEpisodes} episodes watched
                </p>
              </div>

              {/* Overview */}
              {series.overview && (
                <p className="text-neutral-400 leading-relaxed">
                  {series.overview}
                </p>
              )}

              {/* Link to full series details */}
              <Link
                href={`/series/${seriesId}`}
                className="inline-block mt-4 text-sm text-lime-400 hover:text-lime-300 transition-colors"
              >
                View full series details →
              </Link>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        {seasonsForTracker.length > 0 ? (
          <SeriesProgressTracker
            seasons={seasonsForTracker}
            seriesId={seriesId}
            userId={currentUserId}
            username={username}
          />
        ) : (
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-12 text-center">
            <p className="text-neutral-400">
              No episode data available for this series.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
