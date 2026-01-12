import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/src/utils/supabase/server";
import SeasonEpisodeTabs from "@/src/components/season-episode-tabs";
import CommentSection from "@/src/components/comment-section";
import { getComments } from "@/src/app/actions/comments";
import { IconDeviceTv, IconArrowLeft, IconCalendar } from "@tabler/icons-react";

interface SeasonPageProps {
  params: Promise<{ seriesId: string; seasonId: string }>;
}

export default async function SeasonPage({ params }: SeasonPageProps) {
  const { seriesId, seasonId } = await params;
  const supabase = await createClient();

  // Fetch season data
  const { data: season, error: seasonError } = await supabase
    .from("seasons")
    .select("*")
    .eq("id", seasonId)
    .single();

  if (seasonError || !season) {
    notFound();
  }

  // Fetch series data for context
  const { data: series } = await supabase
    .from("series")
    .select("*")
    .eq("id", seriesId)
    .single();

  // Fetch episodes for this season
  const { data: episodes } = await supabase
    .from("episodes")
    .select("*")
    .eq("season_id", seasonId)
    .order("episode_number", { ascending: true });

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const currentUserId = user?.id || null;

  // Fetch comments
  const commentsResult = await getComments("season", seasonId);
  const comments = commentsResult.success ? commentsResult.comments || [] : [];

  return (
    <main className="min-h-screen px-5 md:px-10 xl:px-24 py-10">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href={`/series/${seriesId}`}
          className="flex items-center gap-2 text-neutral-400 hover:text-lime-400 transition-colors w-fit"
        >
          <IconArrowLeft size={20} />
          <span>Back to {series?.title}</span>
        </Link>
      </div>

      {/* Season Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-12">
        {/* Season Poster */}
        <div className="relative w-32 md:w-48 aspect-2/3 rounded-lg overflow-hidden shadow-xl shrink-0 border-2 border-neutral-800">
          {season.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${season.poster_path}`}
              alt={season.title || `Season ${season.season_number}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
              <IconDeviceTv size={48} className="text-neutral-600" />
            </div>
          )}
        </div>

        {/* Season Info */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {season.title || `Season ${season.season_number}`}
          </h1>
          {season.release_year && (
            <div className="flex items-center gap-2 text-neutral-400 mb-4">
              <IconCalendar size={18} />
              <span>{season.release_year}</span>
            </div>
          )}
          {season.overview && (
            <p className="text-neutral-300 leading-relaxed">
              {season.overview}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-6xl">
        {/* Episodes Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Episodes</h2>
          <SeasonEpisodeTabs
            seriesId={seriesId}
            seasonId={seasonId}
            seriesTmdbId={series?.tmdb_id || 0}
            seasonNumber={season.season_number}
            initialEpisodes={episodes || []}
          />
        </div>

        {/* Comments Section */}
        <div className="mb-12">
          <CommentSection
            mediaType="season"
            mediaId={seasonId}
            initialComments={comments}
            currentUserId={currentUserId}
          />
        </div>
      </div>
    </main>
  );
}
