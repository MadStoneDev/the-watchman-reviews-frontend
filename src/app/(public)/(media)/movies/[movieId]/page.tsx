import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/src/utils/supabase/server";
import AddToReelDeckButton from "@/src/components/add-to-reel-deck-button";
import GenreBadges from "@/src/components/genre-badges";
import CommentSection from "@/src/components/comment-section";
import CastCarousel from "@/src/components/cast-carousel";
import { syncMovieGenres, getMovieGenres } from "@/src/utils/genre-utils";
import { getComments } from "@/src/app/actions/comments";
import { getMovieCredits } from "@/src/app/actions/credits";
import {
  IconMovie,
  IconExternalLink,
  IconCalendar,
  IconClock,
} from "@tabler/icons-react";
import MediaDetailFeedback from "@/src/components/media-detail-feedback";

interface MoviePageProps {
  params: Promise<{ movieId: string }>;
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { movieId } = await params;
  const supabase = await createClient();

  // Fetch movie data
  const { data: movie, error } = await supabase
    .from("movies")
    .select("*")
    .eq("id", movieId)
    .single();

  if (error || !movie) {
    notFound();
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const currentUserId = user?.id || null;

  // Check if movie is in user's reel deck
  let reelDeckItem = null;
  if (currentUserId) {
    const { data } = await supabase
      .from("reel_deck")
      .select("*")
      .eq("user_id", currentUserId)
      .eq("media_id", movieId)
      .eq("media_type", "movie")
      .single();

    reelDeckItem = data;
  }

  // Sync genres from TMDB if not already synced
  await syncMovieGenres(movieId, movie.tmdb_id);

  // Get genres with icons from junction table
  const genres = await getMovieGenres(movieId);

  // Fetch comments
  const commentsResult = await getComments("movie", movieId);
  const comments = commentsResult.success ? commentsResult.comments || [] : [];

  // Fetch cast credits
  const creditsResult = await getMovieCredits(movie.tmdb_id);
  const cast = creditsResult.success ? creditsResult.credits?.cast || [] : [];

  // Format runtime
  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section with Backdrop */}
      <section className="relative w-full h-[50vh] md:h-[60vh] mb-8">
        {movie.backdrop_path ? (
          <div className="absolute inset-0">
            <Image
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
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
              {movie.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                  <IconMovie size={48} className="text-neutral-600" />
                </div>
              )}
            </div>

            {/* Title and Meta */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-bold mb-3">
                {movie.title}
              </h1>

              {/* Meta Info: Release Date, Runtime, Rating */}
              <div className="flex flex-wrap items-center gap-4 text-neutral-300 mb-4">
                {movie.release_year && (
                  <div className="flex items-center gap-2">
                    <IconCalendar size={18} />
                    <span>{movie.release_year}</span>
                  </div>
                )}

                {movie.runtime && (
                  <div className="flex items-center gap-2">
                    <IconClock size={18} />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                )}

                {movie.vote_average && (
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">⭐</span>
                    <span>{movie.vote_average.toFixed(1)}</span>
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
                  href={`https://www.themoviedb.org/movie/${movie.tmdb_id}`}
                  target="_blank"
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center gap-2 transition-colors text-sm"
                >
                  <span>View on TMDB</span>
                  <IconExternalLink size={16} />
                </Link>

                {/*{currentUserId && (*/}
                {/*  <AddToReelDeckButton*/}
                {/*    tmdbId={movie.tmdbId}*/}
                {/*    databaseId={movieId}*/}
                {/*    mediaType="movie"*/}
                {/*    isInReelDeck={!!reelDeckItem}*/}
                {/*  />*/}
                {/*)}*/}
              </div>

              {/* Feedback Section */}
              <MediaDetailFeedback
                tmdbId={movie.tmdb_id}
                mediaType="movie"
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
          {movie.overview && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-neutral-300 leading-relaxed text-lg">
                {movie.overview}
              </p>
            </div>
          )}

          {/* Cast Carousel */}
          {cast.length > 0 && <CastCarousel cast={cast} />}

          {/* Comments Section */}
          <div className="mb-12">
            <CommentSection
              mediaType="movie"
              mediaId={movieId}
              initialComments={comments}
              currentUserId={currentUserId}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
