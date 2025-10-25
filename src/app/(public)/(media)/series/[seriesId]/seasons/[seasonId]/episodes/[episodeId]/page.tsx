import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/src/utils/supabase/server";
import {
  IconDeviceTv,
  IconArrowLeft,
  IconCalendar,
  IconClock,
  IconStar,
} from "@tabler/icons-react";

interface EpisodePageProps {
  params: Promise<{
    seriesId: string;
    seasonId: string;
    episodeId: string;
  }>;
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { seriesId, seasonId, episodeId } = await params;
  const supabase = await createClient();

  // Fetch episode data
  const { data: episode, error: episodeError } = await supabase
    .from("episodes")
    .select("*")
    .eq("id", episodeId)
    .single();

  if (episodeError || !episode) {
    notFound();
  }

  // Fetch season and series data for context
  const { data: season } = await supabase
    .from("seasons")
    .select("*")
    .eq("id", seasonId)
    .single();

  const { data: series } = await supabase
    .from("series")
    .select("*")
    .eq("id", seriesId)
    .single();

  return (
    <main className="min-h-screen px-5 md:px-10 xl:px-24 py-10">
      {/* Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
        <Link
          href={`/series/${seriesId}`}
          className="text-neutral-400 hover:text-lime-400 transition-colors"
        >
          {series?.title}
        </Link>
        <span className="text-neutral-600">/</span>
        <Link
          href={`/series/${seriesId}/seasons/${seasonId}`}
          className="text-neutral-400 hover:text-lime-400 transition-colors"
        >
          {season?.title || `Season ${season?.season_number}`}
        </Link>
        <span className="text-neutral-600">/</span>
        <span className="text-neutral-200">
          Episode {episode.episode_number}
        </span>
      </div>

      <Link
        href={`/series/${seriesId}/seasons/${seasonId}`}
        className="flex items-center gap-2 text-neutral-400 hover:text-lime-400 transition-colors w-fit mb-6"
      >
        <IconArrowLeft size={20} />
        <span>
          Back to {season?.title || `Season ${season?.season_number}`}
        </span>
      </Link>

      {/* Episode Header */}
      <div className="mb-8">
        {/* Episode Still Image */}
        {episode.poster_path && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-xl mb-6 border-2 border-neutral-800">
            <Image
              src={`https://image.tmdb.org/t/p/original${episode.poster_path}`}
              alt={episode.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Episode Info */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {episode.episode_number}. {episode.title}
          </h1>

          {/* Meta Info: Air Date, Runtime, Rating */}
          <div className="flex flex-wrap items-center gap-4 text-neutral-300 mb-4">
            {episode.air_date && (
              <div className="flex items-center gap-2">
                <IconCalendar size={18} />
                <span>
                  {new Date(episode.air_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}

            {episode.runtime && (
              <div className="flex items-center gap-2">
                <IconClock size={18} />
                <span>{episode.runtime} min</span>
              </div>
            )}

            {episode.vote_average !== null &&
              episode.vote_average !== undefined &&
              episode.vote_average > 0 && (
                <div className="flex items-center gap-2">
                  <IconStar size={18} className="text-yellow-500" />
                  <span>{episode.vote_average.toFixed(1)}</span>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="max-w-6xl">
        {/* Overview */}
        {episode.overview && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-neutral-300 leading-relaxed text-lg">
              {episode.overview}
            </p>
          </div>
        )}

        {/* Comments Section - Will implement in point 6 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
            <p className="text-neutral-500 text-center">
              Comments coming soon...
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
