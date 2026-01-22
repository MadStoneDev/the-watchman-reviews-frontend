"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  IconSparkles,
  IconX,
  IconFilter,
  IconRefresh,
  IconMovie,
  IconDeviceTv,
  IconStar,
  IconChevronDown,
  IconLoader2,
  IconPlaylistAdd,
  IconCheck,
  IconBubbleText,
  IconSquarePlus,
  IconFlame,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { createClient } from "@/src/utils/supabase/client";
import { MediaCollection } from "@/src/lib/types";
import MediaFeedbackButtons from "@/src/components/media-feedback-buttons";
import {
  getUserRecommendations,
  generateRecommendations,
  forceGenerateRecommendations,
  canRequestRecommendations,
  dismissRecommendation,
  type Recommendation,
} from "@/src/app/actions/recommendations";
import {
  getMultipleMediaFeedback,
  type ReactionType,
} from "@/src/app/actions/feedback";

interface RecommendationsSectionProps {
  username: string;
  userId?: string;
  userRole?: number;
  ownedCollections?: MediaCollection[];
  sharedCollections?: MediaCollection[];
}

const DECADES = ["2020s", "2010s", "2000s", "1990s", "1980s", "Earlier"];
const RATINGS = [
  { label: "Any Rating", value: 0 },
  { label: "7+ Rating", value: 7 },
  { label: "8+ Rating", value: 8 },
];

export default function RecommendationsSection({
  username,
  userId,
  userRole = 0,
  ownedCollections = [],
  sharedCollections = [],
}: RecommendationsSectionProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [forceGenerating, setForceGenerating] = useState(false);
  const [canRequest, setCanRequest] = useState(true);
  const [daysUntilNext, setDaysUntilNext] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [feedbackMap, setFeedbackMap] = useState<
    Map<string, { is_seen: boolean; reaction: ReactionType | null }>
  >(new Map());

  const isAdmin = userRole >= 10;

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [mediaTypeFilter, setMediaTypeFilter] = useState<"movie" | "tv" | null>(
    null,
  );
  const [decadeFilter, setDecadeFilter] = useState<string | null>(null);
  const [minRatingFilter, setMinRatingFilter] = useState<number>(0);

  // Fetch recommendations and rate limit status on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [recsResult, canRequestResult] = await Promise.all([
          getUserRecommendations({
            mediaType: mediaTypeFilter || undefined,
            decade: decadeFilter
              ? decadeFilter === "Earlier"
                ? "1970"
                : decadeFilter.replace("s", "")
              : undefined,
            minRating: minRatingFilter || undefined,
          }),
          canRequestRecommendations(),
        ]);

        if (recsResult.success) {
          setRecommendations(recsResult.recommendations || []);

          // Fetch feedback for all recommendations
          if (recsResult.recommendations && recsResult.recommendations.length > 0) {
            const feedbackResult = await getMultipleMediaFeedback(
              recsResult.recommendations.map((rec) => ({
                tmdbId: rec.tmdb_id,
                mediaType: rec.media_type,
              }))
            );
            if (feedbackResult.success && feedbackResult.feedbackMap) {
              setFeedbackMap(feedbackResult.feedbackMap);
            }
          }
        }

        if (canRequestResult.success) {
          setCanRequest(canRequestResult.canRequest || false);
          setDaysUntilNext(canRequestResult.daysUntil || 0);
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mediaTypeFilter, decadeFilter, minRatingFilter]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const result = await generateRecommendations();
      if (result.success) {
        setRecommendations(result.recommendations || []);
        setCanRequest(false);
        setDaysUntilNext(7);

        // Fetch feedback for new recommendations
        if (result.recommendations && result.recommendations.length > 0) {
          const feedbackResult = await getMultipleMediaFeedback(
            result.recommendations.map((rec) => ({
              tmdbId: rec.tmdb_id,
              mediaType: rec.media_type,
            }))
          );
          if (feedbackResult.success && feedbackResult.feedbackMap) {
            setFeedbackMap(feedbackResult.feedbackMap);
          }
        }
      } else {
        setError(result.error || "Failed to generate recommendations");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setGenerating(false);
    }
  };

  const handleForceGenerate = async () => {
    setForceGenerating(true);
    setError(null);
    toast.loading("Force refreshing recommendations...", {
      id: "force-refresh",
    });
    try {
      const result = await forceGenerateRecommendations();
      if (result.success) {
        setRecommendations(result.recommendations || []);
        setCanRequest(false);
        setDaysUntilNext(7);
        toast.success("Recommendations refreshed!", { id: "force-refresh" });

        // Fetch feedback for new recommendations
        if (result.recommendations && result.recommendations.length > 0) {
          const feedbackResult = await getMultipleMediaFeedback(
            result.recommendations.map((rec) => ({
              tmdbId: rec.tmdb_id,
              mediaType: rec.media_type,
            }))
          );
          if (feedbackResult.success && feedbackResult.feedbackMap) {
            setFeedbackMap(feedbackResult.feedbackMap);
          }
        }
      } else {
        setError(result.error || "Failed to generate recommendations");
        toast.error(result.error || "Failed to generate", {
          id: "force-refresh",
        });
      }
    } catch (err) {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred", { id: "force-refresh" });
    } finally {
      setForceGenerating(false);
    }
  };

  const handleDismiss = async (id: string) => {
    startTransition(async () => {
      const result = await dismissRecommendation(id);
      if (result.success) {
        setRecommendations((prev) => prev.filter((r) => r.id !== id));
      }
    });
  };

  // Apply client-side decade filter for "Earlier"
  const filteredRecommendations = recommendations.filter((rec) => {
    if (decadeFilter === "Earlier" && rec.release_year) {
      return rec.release_year < 1980;
    }
    return true;
  });

  if (loading) {
    return (
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <IconSparkles className="text-amber-400" size={24} />
          <h2 className="text-xl sm:text-2xl font-bold">For You</h2>
        </div>
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-8 flex items-center justify-center">
          <IconLoader2 className="animate-spin text-neutral-500" size={32} />
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <IconSparkles className="text-amber-400" size={24} />
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">For You</h2>
            <p className="text-sm text-neutral-500">
              AI-powered recommendations based on your watching patterns
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              showFilters
                ? "bg-neutral-700 text-neutral-200"
                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
            }`}
          >
            <IconFilter size={18} />
            Filters
            <IconChevronDown
              size={16}
              className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
            />
          </button>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={generating || forceGenerating || !canRequest}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              canRequest && !generating && !forceGenerating
                ? "bg-amber-500 text-neutral-900 hover:bg-amber-400"
                : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
            }`}
          >
            {generating ? (
              <>
                <IconLoader2 size={18} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <IconRefresh size={18} />
                {canRequest
                  ? "Study My Patterns"
                  : `Available in ${daysUntilNext} days`}
              </>
            )}
          </button>

          {/* Admin Force Refresh Button */}
          {isAdmin && (
            <button
              onClick={handleForceGenerate}
              disabled={generating || forceGenerating}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                !generating && !forceGenerating
                  ? "bg-red-600 text-white hover:bg-red-500"
                  : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
              }`}
              title="Admin: Force refresh (clears existing and regenerates)"
            >
              {forceGenerating ? (
                <IconLoader2 size={18} className="animate-spin" />
              ) : (
                <IconFlame size={18} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-4 p-4 bg-neutral-900 rounded-lg border border-neutral-800">
          <div className="flex flex-wrap gap-4">
            {/* Media Type Filter */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-neutral-500 font-medium uppercase">
                Type
              </span>
              <div className="flex gap-2">
                <FilterButton
                  active={mediaTypeFilter === null}
                  onClick={() => setMediaTypeFilter(null)}
                >
                  All
                </FilterButton>
                <FilterButton
                  active={mediaTypeFilter === "tv"}
                  onClick={() => setMediaTypeFilter("tv")}
                  icon={<IconDeviceTv size={16} />}
                >
                  Shows
                </FilterButton>
                <FilterButton
                  active={mediaTypeFilter === "movie"}
                  onClick={() => setMediaTypeFilter("movie")}
                  icon={<IconMovie size={16} />}
                >
                  Movies
                </FilterButton>
              </div>
            </div>

            {/* Decade Filter */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-neutral-500 font-medium uppercase">
                Decade
              </span>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  active={decadeFilter === null}
                  onClick={() => setDecadeFilter(null)}
                >
                  Any
                </FilterButton>
                {DECADES.map((decade) => (
                  <FilterButton
                    key={decade}
                    active={decadeFilter === decade}
                    onClick={() => setDecadeFilter(decade)}
                  >
                    {decade}
                  </FilterButton>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-neutral-500 font-medium uppercase">
                Rating
              </span>
              <div className="flex gap-2">
                {RATINGS.map((rating) => (
                  <FilterButton
                    key={rating.value}
                    active={minRatingFilter === rating.value}
                    onClick={() => setMinRatingFilter(rating.value)}
                    icon={rating.value > 0 ? <IconStar size={14} /> : undefined}
                  >
                    {rating.label}
                  </FilterButton>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Recommendations Grid */}
      {filteredRecommendations.length === 0 ? (
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-8 text-center">
          {recommendations.length === 0 ? (
            <>
              <IconSparkles
                className="mx-auto mb-4 text-amber-400/50"
                size={48}
              />
              <h3 className="text-lg font-semibold mb-2">
                No recommendations yet
              </h3>
              <p className="text-neutral-400 mb-4 max-w-md mx-auto">
                Click "Study My Patterns" to analyze your watching habits and
                get personalized movie and TV show recommendations.
              </p>
              {!canRequest && (
                <p className="text-sm text-neutral-500">
                  You can request new recommendations in {daysUntilNext} days.
                </p>
              )}
            </>
          ) : (
            <p className="text-neutral-400">
              No recommendations match your current filters.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredRecommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              username={username}
              userId={userId}
              ownedCollections={ownedCollections}
              sharedCollections={sharedCollections}
              onDismiss={() => handleDismiss(rec.id)}
              isPending={isPending}
              initialFeedback={feedbackMap.get(`${rec.media_type}:${rec.tmdb_id}`)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function FilterButton({
  children,
  active,
  onClick,
  icon,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        active
          ? "bg-amber-500 text-neutral-900"
          : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function RecommendationCard({
  recommendation,
  username,
  userId,
  ownedCollections = [],
  sharedCollections = [],
  onDismiss,
  isPending,
  initialFeedback,
}: {
  recommendation: Recommendation;
  username: string;
  userId?: string;
  ownedCollections?: MediaCollection[];
  sharedCollections?: MediaCollection[];
  onDismiss: () => void;
  isPending: boolean;
  initialFeedback?: { is_seen: boolean; reaction: ReactionType | null };
}) {
  const supabase = createClient();
  const [addingToReelDeck, setAddingToReelDeck] = useState(false);
  const [inReelDeck, setInReelDeck] = useState(false);
  const [navigating, setNavigating] = useState(false);

  // Collections state
  const [showCollections, setShowCollections] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [alreadyInCollections, setAlreadyInCollections] = useState<string[]>(
    [],
  );
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [addingToCollections, setAddingToCollections] = useState(false);

  const allCollections = [...ownedCollections, ...sharedCollections];

  // Load collection status when modal opens
  useEffect(() => {
    if (showCollections && userId) {
      loadCollectionStatus();
    }
  }, [showCollections, userId]);

  const loadCollectionStatus = async () => {
    setLoadingCollections(true);
    try {
      const { data: userCollections } = await supabase
        .from("collections")
        .select("id")
        .or(`creator_id.eq.${userId},editors.cs.{${userId}}`);

      if (!userCollections || userCollections.length === 0) {
        setLoadingCollections(false);
        return;
      }

      const collectionIds = userCollections.map((c) => c.id);

      const { data: existingEntries } = await supabase
        .from("medias_collections")
        .select("collection_id, media_id")
        .eq("media_type", recommendation.media_type)
        .in("collection_id", collectionIds);

      if (existingEntries && existingEntries.length > 0) {
        const mediaIds = existingEntries.map((e) => e.media_id);
        const tableName =
          recommendation.media_type === "movie" ? "movies" : "series";

        const { data: mediaRecords } = await supabase
          .from(tableName)
          .select("id, tmdb_id")
          .in("id", mediaIds)
          .eq("tmdb_id", recommendation.tmdb_id);

        if (mediaRecords && mediaRecords.length > 0) {
          const matchingMediaIds = new Set(mediaRecords.map((m) => m.id));
          const matchingCollectionIds = existingEntries
            .filter((e) => matchingMediaIds.has(e.media_id))
            .map((e) => e.collection_id);
          setAlreadyInCollections(matchingCollectionIds);
        }
      }
    } catch (error) {
      console.error("Error loading collection status:", error);
    } finally {
      setLoadingCollections(false);
    }
  };

  const handleCollectionToggle = (collectionId: string) => {
    setSelectedCollections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId],
    );
  };

  const handleAddToCollections = async () => {
    if (selectedCollections.length === 0) return;

    setAddingToCollections(true);
    const toastId = toast.loading(
      `Adding to ${selectedCollections.length} collection${selectedCollections.length > 1 ? "s" : ""}...`,
    );

    try {
      // Ensure media exists
      const response = await fetch("/api/media/ensure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdb_id: recommendation.tmdb_id,
          media_type: recommendation.media_type,
        }),
      });

      if (!response.ok) throw new Error("Failed to create media record");

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      const mediaDbId = result.media_id;

      // Get positions for each collection
      const positionPromises = selectedCollections.map(async (collectionId) => {
        const { data: posData } = await supabase
          .from("medias_collections")
          .select("position")
          .eq("collection_id", collectionId)
          .order("position", { ascending: false })
          .limit(1)
          .maybeSingle();

        return {
          collectionId,
          nextPosition: posData ? posData.position + 1 : 0,
        };
      });

      const positions = await Promise.all(positionPromises);

      const entries = positions.map(({ collectionId, nextPosition }) => ({
        collection_id: collectionId,
        media_id: mediaDbId,
        media_type: recommendation.media_type,
        position: nextPosition,
      }));

      const { error } = await supabase
        .from("medias_collections")
        .upsert(entries, {
          onConflict: "collection_id,media_id,media_type",
          ignoreDuplicates: true,
        });

      if (error) throw error;

      toast.success(
        `Added to ${selectedCollections.length} collection${selectedCollections.length > 1 ? "s" : ""}`,
        { id: toastId },
      );

      setAlreadyInCollections((prev) => [...prev, ...selectedCollections]);
      setSelectedCollections([]);
      setShowCollections(false);
    } catch (error) {
      console.error("Error adding to collections:", error);
      toast.error("Failed to add to collections", { id: toastId });
    } finally {
      setAddingToCollections(false);
    }
  };

  const handleAddToReelDeck = async () => {
    if (recommendation.media_type !== "tv") return;

    const toastId = toast.loading("Adding to Reel Deck...");
    setAddingToReelDeck(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in", { id: toastId });
        return;
      }

      const response = await fetch("/api/media/ensure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdb_id: recommendation.tmdb_id,
          media_type: recommendation.media_type,
        }),
      });

      if (!response.ok) throw new Error("Failed to create media record");

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      const { error } = await supabase.from("reel_deck").insert({
        user_id: user.id,
        media_id: result.media_id,
        media_type: recommendation.media_type,
        status: "watching",
      });

      if (error) throw error;

      toast.success("Added to Reel Deck", { id: toastId });
      setInReelDeck(true);
    } catch (error) {
      console.error("Error adding to reel deck:", error);
      toast.error("Failed to add to Reel Deck", { id: toastId });
    } finally {
      setAddingToReelDeck(false);
    }
  };

  const handleViewDetails = async () => {
    setNavigating(true);

    try {
      const response = await fetch("/api/media/ensure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdb_id: recommendation.tmdb_id,
          media_type: recommendation.media_type,
        }),
      });

      if (!response.ok) throw new Error("Failed to load media");

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      const path =
        recommendation.media_type === "movie"
          ? `/movies/${result.media_id}`
          : `/series/${result.media_id}`;

      window.location.href = path;
    } catch (err) {
      console.error("Error navigating to details:", err);
      toast.error("Failed to load details");
      setNavigating(false);
    }
  };

  return (
    <>
      <article className="group relative flex flex-col bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden hover:border-neutral-700 transition-all">
        {/* Poster */}
        <div
          className="relative aspect-[2/3] cursor-pointer"
          onClick={handleViewDetails}
        >
          {recommendation.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w300${recommendation.poster_path}`}
              alt={recommendation.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            />
          ) : (
            <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
              {recommendation.media_type === "movie" ? (
                <IconMovie size={40} className="text-neutral-600" />
              ) : (
                <IconDeviceTv size={40} className="text-neutral-600" />
              )}
            </div>
          )}

          {/* Media Type Badge */}
          <div className="absolute top-2 left-2">
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${
                recommendation.media_type === "movie"
                  ? "bg-purple-500/80 text-white"
                  : "bg-blue-500/80 text-white"
              }`}
            >
              {recommendation.media_type === "movie" ? "Movie" : "TV"}
            </span>
          </div>

          {/* Confidence Badge */}
          <div className="absolute top-2 right-2">
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-500/80 text-neutral-900">
              {Math.round(recommendation.confidence_score * 100)}% match
            </span>
          </div>

          {/* Dismiss Button - appears on hover */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            disabled={isPending}
            className="absolute top-10 right-2 opacity-0 group-hover:opacity-100 p-1.5 bg-neutral-900/80 hover:bg-red-600 text-neutral-400 hover:text-white rounded transition-all disabled:opacity-50"
            title="Not interested"
          >
            <IconX size={14} />
          </button>

          {/* Reason overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute bottom-2 left-2 right-2">
              <p className="text-[11px] text-neutral-300 line-clamp-3">
                {recommendation.reason}
              </p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 flex-1 flex flex-col">
          <button
            onClick={handleViewDetails}
            disabled={navigating}
            className="w-full text-left hover:text-amber-400 transition-colors disabled:cursor-not-allowed"
          >
            <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
              {recommendation.title}
            </h3>
          </button>
          <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
            {recommendation.media_type === "movie" ? (
              <IconMovie size={14} />
            ) : (
              <IconDeviceTv size={14} />
            )}

            <span>|</span>

            {recommendation.release_year && (
              <span>{recommendation.release_year}</span>
            )}
            {recommendation.rating && (
              <>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <IconStar size={12} className="text-amber-400" />
                  {recommendation.rating.toFixed(1)}
                </span>
              </>
            )}
          </div>

          {/* Genres - flex-grow to push buttons to bottom */}
          <div className="grow">
            {recommendation.genres && recommendation.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {recommendation.genres.slice(0, 2).map((genre) => (
                  <span
                    key={genre}
                    className="px-1.5 py-0.5 bg-neutral-800 rounded text-[10px] text-neutral-400"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Feedback Buttons */}
          <div className="mt-3 pt-2 border-t border-neutral-800/50">
            <MediaFeedbackButtons
              tmdbId={recommendation.tmdb_id}
              mediaType={recommendation.media_type}
              size="sm"
              variant="icon-only"
              initialIsSeen={initialFeedback?.is_seen ?? false}
              initialReaction={initialFeedback?.reaction ?? null}
            />
          </div>

          {/* Action Buttons - Always visible at bottom */}
          <div className="flex gap-2 mt-2 pt-2 border-t border-neutral-800">
            {/* Add to Reel Deck (TV only) */}
            {recommendation.media_type === "tv" && !inReelDeck && (
              <button
                onClick={handleAddToReelDeck}
                disabled={addingToReelDeck}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-lime-400 text-neutral-900 hover:bg-lime-500 disabled:bg-lime-400/50 disabled:cursor-not-allowed rounded-lg font-medium text-xs transition-colors"
                title="Add to Reel Deck"
              >
                {addingToReelDeck ? (
                  <IconLoader2 size={16} className="animate-spin" />
                ) : (
                  <IconDeviceTv size={16} />
                )}
              </button>
            )}

            {/* In Reel Deck indicator */}
            {recommendation.media_type === "tv" && inReelDeck && (
              <div className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-lime-400/20 text-lime-400 rounded-lg font-medium text-xs border border-lime-400/30">
                <IconCheck size={16} />
              </div>
            )}

            {/* Add to Collection */}
            {allCollections.length > 0 && (
              <button
                onClick={() => setShowCollections(true)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-indigo-500 text-white hover:bg-indigo-600 rounded-lg font-medium text-xs transition-colors"
                title="Add to collection"
              >
                <IconPlaylistAdd size={16} />
              </button>
            )}

            {/* More Info Button */}
            <button
              onClick={handleViewDetails}
              disabled={navigating}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-neutral-700 text-neutral-200 hover:bg-neutral-600 disabled:bg-neutral-700/50 disabled:cursor-not-allowed rounded-lg font-medium text-xs transition-colors"
              title="More info"
            >
              {navigating ? (
                <IconLoader2 size={16} className="animate-spin" />
              ) : (
                <IconBubbleText size={16} />
              )}
            </button>
          </div>
        </div>
      </article>

      {/* Collections Modal */}
      {showCollections && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-neutral-800 rounded-lg shadow-xl border border-neutral-700 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-neutral-700 p-6">
              <div>
                <h2 className="text-lg font-semibold mb-1">
                  Add to Collection
                </h2>
                <p className="text-sm text-neutral-400 line-clamp-1">
                  {recommendation.title}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCollections(false);
                  setSelectedCollections([]);
                }}
                className="text-neutral-400 hover:text-white transition-colors p-1"
              >
                <IconX size={20} />
              </button>
            </div>

            {/* Collections List */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingCollections ? (
                <div className="flex items-center justify-center py-8">
                  <IconLoader2
                    size={24}
                    className="animate-spin text-neutral-400"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Owned Collections */}
                  {ownedCollections.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-neutral-400 mb-2">
                        Your Collections
                      </h3>
                      <ul className="space-y-2">
                        {ownedCollections.map((collection) => {
                          const isInCollection = alreadyInCollections.includes(
                            collection.id,
                          );
                          const isSelected = selectedCollections.includes(
                            collection.id,
                          );

                          return (
                            <li key={collection.id}>
                              {isInCollection ? (
                                <div className="flex items-center gap-3 w-full py-2 px-3 bg-neutral-700 border border-neutral-600 rounded-lg">
                                  <IconCheck
                                    size={18}
                                    className="text-lime-400 shrink-0"
                                  />
                                  <span className="text-sm flex-1">
                                    {collection.title}
                                  </span>
                                  <span className="text-xs text-neutral-400">
                                    Added
                                  </span>
                                </div>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleCollectionToggle(collection.id)
                                  }
                                  className={`flex items-center gap-3 w-full py-2 px-3 rounded-lg border transition-all ${
                                    isSelected
                                      ? "bg-lime-400/10 border-lime-400 text-lime-400"
                                      : "bg-neutral-700 border-neutral-600 hover:border-neutral-500"
                                  }`}
                                >
                                  {isSelected ? (
                                    <IconCheck size={18} className="shrink-0" />
                                  ) : (
                                    <IconSquarePlus
                                      size={18}
                                      className="shrink-0"
                                    />
                                  )}
                                  <span className="text-sm flex-1 text-left">
                                    {collection.title}
                                  </span>
                                </button>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {/* Shared Collections */}
                  {sharedCollections.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-neutral-400 mb-2">
                        Shared with You
                      </h3>
                      <ul className="space-y-2">
                        {sharedCollections.map((collection) => {
                          const isInCollection = alreadyInCollections.includes(
                            collection.id,
                          );
                          const isSelected = selectedCollections.includes(
                            collection.id,
                          );

                          return (
                            <li key={collection.id}>
                              {isInCollection ? (
                                <div className="flex items-center gap-3 w-full py-2 px-3 bg-neutral-700 border border-neutral-600 rounded-lg">
                                  <IconCheck
                                    size={18}
                                    className="text-lime-400 shrink-0"
                                  />
                                  <span className="text-sm flex-1">
                                    {collection.title}
                                  </span>
                                  <span className="text-xs text-neutral-400">
                                    Added
                                  </span>
                                </div>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleCollectionToggle(collection.id)
                                  }
                                  className={`flex items-center gap-3 w-full py-2 px-3 rounded-lg border transition-all ${
                                    isSelected
                                      ? "bg-lime-400/10 border-lime-400 text-lime-400"
                                      : "bg-neutral-700 border-neutral-600 hover:border-neutral-500"
                                  }`}
                                >
                                  {isSelected ? (
                                    <IconCheck size={18} className="shrink-0" />
                                  ) : (
                                    <IconSquarePlus
                                      size={18}
                                      className="shrink-0"
                                    />
                                  )}
                                  <span className="text-sm flex-1 text-left">
                                    {collection.title}
                                  </span>
                                </button>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {/* No collections message */}
                  {allCollections.length === 0 && (
                    <p className="text-sm text-neutral-400 text-center py-8">
                      You don't have any collections yet.
                      {username && (
                        <Link
                          href={`/${username}/collections`}
                          className="block mt-2 text-lime-400 hover:text-lime-300"
                        >
                          Create one now
                        </Link>
                      )}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-neutral-700 p-6">
              <button
                onClick={handleAddToCollections}
                disabled={
                  addingToCollections ||
                  selectedCollections.length === 0 ||
                  loadingCollections
                }
                className={`w-full py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                  addingToCollections ||
                  selectedCollections.length === 0 ||
                  loadingCollections
                    ? "bg-neutral-700 text-neutral-500 cursor-not-allowed"
                    : "bg-lime-400 text-neutral-900 hover:bg-lime-500"
                }`}
              >
                {addingToCollections ? (
                  <>
                    <IconLoader2 size={18} className="animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <IconCheck size={18} />
                    <span>
                      Add to{" "}
                      {selectedCollections.length === 1
                        ? "Collection"
                        : `${selectedCollections.length} Collections`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
