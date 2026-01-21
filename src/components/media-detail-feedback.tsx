"use client";

import React, { useState, useEffect } from "react";
import { IconLoader2 } from "@tabler/icons-react";
import MediaFeedbackButtons from "@/src/components/media-feedback-buttons";
import { getMediaFeedback, type ReactionType } from "@/src/app/actions/feedback";

interface MediaDetailFeedbackProps {
  tmdbId: number;
  mediaType: "movie" | "tv";
  userId?: string | null;
}

export default function MediaDetailFeedback({
  tmdbId,
  mediaType,
  userId,
}: MediaDetailFeedbackProps) {
  const [initialIsSeen, setInitialIsSeen] = useState(false);
  const [initialReaction, setInitialReaction] = useState<ReactionType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const result = await getMediaFeedback(tmdbId, mediaType);
        if (result.success && result.feedback) {
          setInitialIsSeen(result.feedback.is_seen);
          setInitialReaction(result.feedback.reaction as ReactionType | null);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [tmdbId, mediaType, userId]);

  if (!userId) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-2">
        <IconLoader2 size={16} className="animate-spin text-neutral-500" />
        <span className="text-sm text-neutral-500">Loading feedback...</span>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="text-xs text-neutral-500 mb-2">Rate this title:</div>
      <MediaFeedbackButtons
        tmdbId={tmdbId}
        mediaType={mediaType}
        initialIsSeen={initialIsSeen}
        initialReaction={initialReaction}
        size="md"
        variant="default"
      />
    </div>
  );
}
