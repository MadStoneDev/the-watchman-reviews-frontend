"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { IconLoader2, IconMoodEmpty } from "@tabler/icons-react";
import ActivityFeedItem from "./activity-feed-item";
import {
  getActivityFeed,
  getUserActivity,
  type ActivityFeedItem as ActivityItem,
} from "@/src/app/actions/activity-feed";

interface ActivityFeedProps {
  userId?: string; // If provided, shows specific user's activity
  initialActivities?: ActivityItem[];
}

export default function ActivityFeed({
  userId,
  initialActivities = [],
}: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = userId
        ? await getUserActivity(userId, page + 1, 20)
        : await getActivityFeed(page + 1, 20);

      if (result.success && result.activities) {
        setActivities((prev) => [...prev, ...result.activities!]);
        setHasMore(result.hasMore || false);
        setPage((prev) => prev + 1);
      } else {
        setError(result.error || "Failed to load activities");
      }
    } catch (err) {
      setError("Failed to load activities");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, userId]);

  // Load initial activities if not provided
  useEffect(() => {
    if (initialActivities.length === 0 && activities.length === 0) {
      const loadInitial = async () => {
        setIsLoading(true);
        try {
          const result = userId
            ? await getUserActivity(userId, 1, 20)
            : await getActivityFeed(1, 20);

          if (result.success && result.activities) {
            setActivities(result.activities);
            setHasMore(result.hasMore || false);
          } else {
            setError(result.error || "Failed to load activities");
          }
        } catch (err) {
          setError("Failed to load activities");
        } finally {
          setIsLoading(false);
        }
      };
      loadInitial();
    }
  }, [userId, initialActivities.length, activities.length]);

  // Load more when scrolling to bottom
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMore();
    }
  }, [inView, hasMore, isLoading, loadMore]);

  if (activities.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
        <IconMoodEmpty size={48} className="mb-4" />
        <p className="text-lg">No activity yet</p>
        <p className="text-sm mt-1">
          {userId
            ? "This user hasn't done anything yet"
            : "Follow some users to see their activity here"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <ActivityFeedItem key={activity.id} activity={activity} />
      ))}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center py-6">
          <IconLoader2 size={24} className="animate-spin text-lime-400" />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="text-center py-6 text-red-400">
          <p>{error}</p>
          <button
            onClick={loadMore}
            className="mt-2 text-sm text-lime-400 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Infinite scroll trigger */}
      {hasMore && !isLoading && <div ref={ref} className="h-1" />}

      {/* End of feed */}
      {!hasMore && activities.length > 0 && (
        <p className="text-center text-sm text-neutral-500 py-6">
          You've reached the end
        </p>
      )}
    </div>
  );
}
