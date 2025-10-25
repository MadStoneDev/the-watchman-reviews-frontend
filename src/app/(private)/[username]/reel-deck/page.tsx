import React from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import BrowseNavigation from "@/src/components/browse-navigation";
import ReelDeckGrid from "@/src/components/reel-deck-grid";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconCircleCheck,
  IconClock,
  IconChairDirector,
  IconDeviceTv,
} from "@tabler/icons-react";

interface ReelDeckPageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ status?: string; type?: string }>;
}

export default async function ReelDeckPage({
  params,
  searchParams,
}: ReelDeckPageProps) {
  const { username } = await params;
  const { status: filterStatus, type: filterType } = await searchParams;
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
    // Redirect to their own reel deck
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
          seriesWithDetails.push({
            ...series,
            reelDeckItem: item,
          });
        }
      }
    }
  }

  const allMediaWithDetails = [...moviesWithDetails, ...seriesWithDetails].sort(
    (a, b) => {
      const aTime = a.reelDeckItem.last_watched_at || a.reelDeckItem.added_at;
      const bTime = b.reelDeckItem.last_watched_at || b.reelDeckItem.added_at;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    },
  );

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

  const STATUS_FILTERS = [
    { value: "", label: "All", count: statusCounts.all, icon: null },
    {
      value: "watching",
      label: "Watching",
      count: statusCounts.watching,
      icon: IconPlayerPlay,
    },
    {
      value: "completed",
      label: "Completed",
      count: statusCounts.completed,
      icon: IconCircleCheck,
    },
    {
      value: "paused",
      label: "On Hold",
      count: statusCounts.paused,
      icon: IconPlayerPause,
    },
    {
      value: "plan_to_watch",
      label: "Plan to Watch",
      count: statusCounts.plan_to_watch,
      icon: IconClock,
    },
  ];

  const TYPE_FILTERS = [
    { value: "", label: "All", count: typeCounts.all, icon: null },
    {
      value: "movie",
      label: "Movies",
      count: typeCounts.movie,
      icon: IconChairDirector,
    },
    {
      value: "tv",
      label: "TV Shows",
      count: typeCounts.tv,
      icon: IconDeviceTv,
    },
  ];

  // Build URL for filter links
  const buildFilterUrl = (status?: string, type?: string) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (type) params.set("type", type);
    const queryString = params.toString();
    return `/${username}/reel-deck${queryString ? `?${queryString}` : ""}`;
  };

  // Get current filter label for display
  const getCurrentFilterLabel = () => {
    const statusLabel =
      STATUS_FILTERS.find((f) => f.value === filterStatus)?.label || "All";
    const typeLabel =
      TYPE_FILTERS.find((f) => f.value === filterType)?.label || "";

    if (filterType) {
      return `${statusLabel} ${typeLabel}`;
    }
    return statusLabel;
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
          {
            label: "Reel Deck",
            href: `/${urlProfile.username}/reel-deck`,
          },
        ]}
        profileId={urlProfile.id}
        currentUserId={currentUserId || ""}
      />

      <section className="mt-14 lg:mt-20 mb-6 transition-all duration-300 ease-in-out">
        <h1 className="max-w-3xl text-2xl sm:text-3xl md:text-4xl font-bold">
          My Reel Deck
        </h1>
        <p className="text-neutral-400 mt-2">
          Track what you're watching, have watched, and want to watch
        </p>
      </section>

      {/* Primary Filter: Status */}
      <div className="mb-4">
        <h2 className="text-sm font-medium text-neutral-400 mb-2">Status</h2>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => {
            const Icon = filter.icon;
            const isActive =
              filterStatus === filter.value ||
              (!filterStatus && filter.value === "");

            return (
              <a
                key={filter.value}
                href={buildFilterUrl(filter.value, filterType)}
                className={`px-4 py-2 rounded-lg transition-all font-medium text-sm flex items-center gap-2 ${
                  isActive
                    ? "bg-lime-400 text-neutral-900"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                {Icon && <Icon size={18} />}
                <span>{filter.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    isActive
                      ? "bg-neutral-900/20 text-neutral-900"
                      : "bg-neutral-700 text-neutral-400"
                  }`}
                >
                  {filter.count}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Secondary Filter: Media Type */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-neutral-400 mb-2">
          Media Type
        </h2>
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((filter) => {
            const Icon = filter.icon;
            const isActive =
              filterType === filter.value ||
              (!filterType && filter.value === "");

            return (
              <a
                key={filter.value}
                href={buildFilterUrl(filterStatus, filter.value)}
                className={`px-3 py-1.5 rounded-lg transition-all text-sm flex items-center gap-2 ${
                  isActive
                    ? "bg-neutral-700 text-white border border-neutral-600"
                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-750 border border-neutral-800"
                }`}
              >
                {Icon && <Icon size={16} />}
                <span>{filter.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-xs ${
                    isActive
                      ? "bg-neutral-800 text-neutral-300"
                      : "bg-neutral-700 text-neutral-500"
                  }`}
                >
                  {filter.count}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Current Filter Display */}
      {(filterStatus || filterType) && (
        <div className="mb-6 flex items-center gap-2 text-sm">
          <span className="text-neutral-500">Showing:</span>
          <span className="font-medium text-neutral-200">
            {getCurrentFilterLabel()}
          </span>
          <a
            href={`/${username}/reel-deck`}
            className="text-lime-400 hover:text-lime-300 transition-colors ml-2"
          >
            Clear filters
          </a>
        </div>
      )}

      {/* Media Grid */}
      {allMediaWithDetails.length === 0 ? (
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-12 text-center">
          <IconClock size={64} className="mx-auto mb-4 text-neutral-600" />
          <h2 className="text-xl font-semibold mb-2">No items found</h2>
          <p className="text-neutral-400 mb-6">
            {filterStatus || filterType
              ? `You don't have any ${getCurrentFilterLabel().toLowerCase()} items in your Reel Deck`
              : "Start adding movies and TV shows to track your watching progress!"}
          </p>
          <div className="flex gap-3 justify-center">
            {(filterStatus || filterType) && (
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
      ) : (
        <ReelDeckGrid items={allMediaWithDetails} username={username} />
      )}
    </>
  );
}
