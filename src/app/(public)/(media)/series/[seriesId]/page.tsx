import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/src/utils/supabase/server";
import SeriesSeasonTabs from "@/src/components/series-season-tabs";
import AddToReelDeckButton from "@/src/components/add-to-reel-deck-button";
import GenreBadges from "@/src/components/genre-badges";
import CommentSection from "@/src/components/comment-section";
import CastCarousel from "@/src/components/cast-carousel";
import { syncSeriesGenres, getSeriesGenres } from "@/src/utils/genre-utils";
import { getComments } from "@/src/app/actions/comments";
import { getTVCredits } from "@/src/app/actions/credits";
import {
  IconDeviceTv,
  IconExternalLink,
  IconCalendar,
} from "@tabler/icons-react";
import MediaDetailFeedback from "@/src/components/media-detail-feedback";

interface SeriesPageProps {
  params: Promise<{ seriesId: string }>;
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { seriesId } = await params;
  const supabase = await createClient();

  // Fetch series data
  const { data: series, error } = await supabase
    .from("series")
    .select("*")
    .eq("id", seriesId)
    .single();

  if (error || !series) {
    notFound();
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const currentUserId = user?.id || null;

  // Check if series is in user's reel deck
  let reelDeckItem = null;
  if (currentUserId) {
    const { data } = await supabase
      .from("reel_deck")
      .select("*")
      .eq("user_id", currentUserId)
      .eq("media_id", seriesId)
      .eq("media_type", "tv")
      .single();

    reelDeckItem = data;
  }

  // Sync genres from TMDB if not already synced
  await syncSeriesGenres(seriesId, series.tmdb_id);

  // Get genres with icons from junction table
  const genres = await getSeriesGenres(seriesId);

  // Fetch seasons for this series
  const { data: seasons } = await supabase
    .from("seasons")
    .select("*")
    .eq("series_id", seriesId)
    .order("season_number", { ascending: true });

  // Fetch comments
  const commentsResult = await getComments("series", seriesId);
  const comments = commentsResult.success ? commentsResult.comments || [] : [];

  // Fetch cast credits
  const creditsResult = await getTVCredits(series.tmdb_id);
  const cast = creditsResult.success ? creditsResult.credits?.cast || [] : [];

  // Format air date range
  const formatAirDateRange = () => {
    if (!series.first_air_date) return null;

    const startYear = new Date(series.first_air_date).getFullYear();
    const endYear = series.last_air_date
      ? new Date(series.last_air_date).getFullYear()
      : "Present";

    return startYear === endYear ? `${startYear}` : `${startYear} - ${endYear}`;
  };

  // Status badge color
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "Returning Series":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "Ended":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "Canceled":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "In Production":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default:
        return "bg-neutral-500/20 text-neutral-400 border-neutral-500/50";
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section with Backdrop */}
      <section className="relative w-full h-[50vh] md:h-[60vh] mb-8">
        {series.backdrop_path ? (
          <div className="absolute inset-0">
            <Image
              src={`https://image.tmdb.org/t/p/original${series.backdrop_path}`}
              alt={series.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-linear-to-b from-neutral-900 to-neutral-950" />
        )}

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-10 xl:px-24">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            {/* Poster */}
            <div className="relative w-32 md:w-48 aspect-2/3 rounded-lg overflow-hidden shadow-2xl shrink-0 border-2 border-neutral-800">
              {series.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
                  alt={series.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                  <IconDeviceTv size={48} className="text-neutral-600" />
                </div>
              )}
            </div>

            {/* Title and Meta */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-5xl font-bold">
                  {series.title}
                </h1>
                {series.status && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      series.status,
                    )}`}
                  >
                    {series.status}
                  </span>
                )}
              </div>

              {/* Meta Info: Air Dates, Rating */}
              <div className="flex flex-wrap items-center gap-4 text-neutral-300 mb-4">
                {formatAirDateRange() && (
                  <div className="flex items-center gap-2">
                    <IconCalendar size={18} />
                    <span>{formatAirDateRange()}</span>
                  </div>
                )}

                {series.vote_average && (
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">⭐</span>
                    <span>{series.vote_average.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {genres.length > 0 && (
                <div className="mb-4">
                  <GenreBadges
                    genres={genres}
                    size="md"
                    showIcons={true}
                    maxDisplay={4}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`https://www.themoviedb.org/tv/${series.tmdb_id}`}
                  target="_blank"
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center gap-2 transition-colors text-sm"
                >
                  <span>View on TMDB</span>
                  <IconExternalLink size={16} />
                </Link>

                {currentUserId && (
                  <AddToReelDeckButton
                    tmdbId={series.tmdb_id}
                    databaseId={seriesId} // For deletion
                    mediaType="tv"
                    isInReelDeck={!!reelDeckItem}
                  />
                )}
              </div>

              {/* Feedback Section */}
              <MediaDetailFeedback
                tmdbId={series.tmdb_id}
                mediaType="tv"
                userId={currentUserId}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-5 md:px-10 xl:px-24 pb-20">
        <div className="max-w-6xl">
          {/* Overview */}
          {series.overview && (
            <div className="mb-12">
              <h2 className="text-xl font-bold mb-4">Overview</h2>
              <p className="text-neutral-300 leading-relaxed text-lg">
                {series.overview}
              </p>
            </div>
          )}

          {/* Cast Carousel */}
          {cast.length > 0 && <CastCarousel cast={cast} />}

          {/* Seasons Tabs */}
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4">Seasons</h2>
            <SeriesSeasonTabs
              seriesId={seriesId}
              seriesTmdbId={series.tmdb_id}
              initialSeasons={seasons || []}
            />
          </div>

          {/* Comments Section */}
          <div className="mb-12">
            <CommentSection
              mediaType="series"
              mediaId={seriesId}
              initialComments={comments}
              currentUserId={currentUserId}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
