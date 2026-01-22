"use client";

import React, { useState, useTransition, useEffect } from "react";
import {
  IconEye,
  IconThumbUp,
  IconHeart,
  IconThumbDown,
  IconLoader2,
} from "@tabler/icons-react";
import { toast } from "sonner";
import {
  setSeenStatus,
  setReaction,
  type ReactionType,
} from "@/src/app/actions/feedback";

interface MediaFeedbackButtonsProps {
  tmdbId: number;
  mediaType: "movie" | "tv";
  initialIsSeen?: boolean;
  initialReaction?: ReactionType | null;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "compact" | "icon-only";
  onFeedbackChange?: (isSeen: boolean, reaction: ReactionType | null) => void;
}

const REACTION_OPTIONS: {
  type: ReactionType;
  icon: React.ElementType;
  label: string;
  activeColor: string;
  bgColor: string;
}[] = [
  {
    type: "disliked",
    icon: IconThumbDown,
    label: "Disliked",
    activeColor: "text-red-400",
    bgColor: "bg-red-500/20 border-red-500/50",
  },
  {
    type: "liked",
    icon: IconThumbUp,
    label: "Liked",
    activeColor: "text-green-400",
    bgColor: "bg-green-500/20 border-green-500/50",
  },
  {
    type: "loved",
    icon: IconHeart,
    label: "Loved",
    activeColor: "text-pink-400",
    bgColor: "bg-pink-500/20 border-pink-500/50",
  },
];

export default function MediaFeedbackButtons({
  tmdbId,
  mediaType,
  initialIsSeen = false,
  initialReaction = null,
  size = "md",
  variant = "default",
  onFeedbackChange,
}: MediaFeedbackButtonsProps) {
  const [isSeen, setIsSeen] = useState(initialIsSeen);
  const [currentReaction, setCurrentReaction] = useState<ReactionType | null>(
    initialReaction
  );
  const [isPending, startTransition] = useTransition();
  const [loadingSeen, setLoadingSeen] = useState(false);
  const [loadingReaction, setLoadingReaction] = useState<ReactionType | null>(null);

  // Sync state when initial props change (e.g., when feedback is loaded after mount)
  useEffect(() => {
    setIsSeen(initialIsSeen);
  }, [initialIsSeen]);

  useEffect(() => {
    setCurrentReaction(initialReaction);
  }, [initialReaction]);

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  const buttonSizes = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5",
  };

  const handleSeenToggle = () => {
    setLoadingSeen(true);
    startTransition(async () => {
      try {
        const newSeenStatus = !isSeen;
        const result = await setSeenStatus(tmdbId, mediaType, newSeenStatus);
        if (result.success) {
          setIsSeen(newSeenStatus);
          onFeedbackChange?.(newSeenStatus, currentReaction);
          toast.success(newSeenStatus ? "Marked as seen" : "Removed seen status");
        } else {
          toast.error(result.error || "Failed to update");
        }
      } catch (error) {
        toast.error("An error occurred");
      } finally {
        setLoadingSeen(false);
      }
    });
  };

  const handleReaction = (reactionType: ReactionType) => {
    setLoadingReaction(reactionType);
    startTransition(async () => {
      try {
        // If clicking the same reaction, remove it
        if (currentReaction === reactionType) {
          const result = await setReaction(tmdbId, mediaType, null);
          if (result.success) {
            setCurrentReaction(null);
            onFeedbackChange?.(isSeen, null);
            toast.success("Reaction removed");
          } else {
            toast.error(result.error || "Failed to remove reaction");
          }
        } else {
          // Set new reaction (this also marks as seen)
          const result = await setReaction(tmdbId, mediaType, reactionType);
          if (result.success) {
            setCurrentReaction(reactionType);
            setIsSeen(true); // Reactions automatically mark as seen
            onFeedbackChange?.(true, reactionType);
            const option = REACTION_OPTIONS.find((o) => o.type === reactionType);
            toast.success(`Marked as ${option?.label || reactionType}`);
          } else {
            toast.error(result.error || "Failed to set reaction");
          }
        }
      } catch (error) {
        toast.error("An error occurred");
      } finally {
        setLoadingReaction(null);
      }
    });
  };

  if (variant === "icon-only") {
    return (
      <div className="flex items-center gap-1">
        {/* Seen Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSeenToggle();
          }}
          disabled={isPending}
          className={`${buttonSizes[size]} rounded-md transition-all ${
            isSeen
              ? "bg-blue-500/20 border border-blue-500/50 text-blue-400"
              : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-700/50"
          } ${isPending ? "opacity-50" : ""}`}
          title={isSeen ? "Mark as not seen" : "Mark as seen"}
        >
          {loadingSeen ? (
            <IconLoader2 size={iconSizes[size]} className="animate-spin" />
          ) : (
            <IconEye size={iconSizes[size]} />
          )}
        </button>

        {/* Separator */}
        <div className="w-px h-4 bg-neutral-700 mx-0.5" />

        {/* Reactions */}
        {REACTION_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = currentReaction === option.type;
          const isLoading = loadingReaction === option.type && isPending;

          return (
            <button
              key={option.type}
              onClick={(e) => {
                e.stopPropagation();
                handleReaction(option.type);
              }}
              disabled={isPending}
              className={`${buttonSizes[size]} rounded-md transition-all ${
                isActive
                  ? `${option.bgColor} ${option.activeColor}`
                  : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-700/50"
              } ${isPending ? "opacity-50" : ""}`}
              title={isActive ? `Remove ${option.label}` : option.label}
            >
              {isLoading ? (
                <IconLoader2 size={iconSizes[size]} className="animate-spin" />
              ) : (
                <Icon size={iconSizes[size]} />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-1 flex-wrap">
        {/* Seen Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSeenToggle();
          }}
          disabled={isPending}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all border ${
            isSeen
              ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
              : "border-neutral-700 text-neutral-400 hover:text-neutral-200 hover:border-neutral-600"
          } ${isPending ? "opacity-50" : ""}`}
          title={isSeen ? "Mark as not seen" : "Mark as seen"}
        >
          {loadingSeen ? (
            <IconLoader2 size={12} className="animate-spin" />
          ) : (
            <IconEye size={12} />
          )}
          <span className="hidden sm:inline">Seen</span>
        </button>

        {/* Separator */}
        <div className="w-px h-4 bg-neutral-700 mx-0.5" />

        {/* Reactions */}
        {REACTION_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = currentReaction === option.type;
          const isLoading = loadingReaction === option.type && isPending;

          return (
            <button
              key={option.type}
              onClick={(e) => {
                e.stopPropagation();
                handleReaction(option.type);
              }}
              disabled={isPending}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all border ${
                isActive
                  ? `${option.bgColor} ${option.activeColor}`
                  : "border-neutral-700 text-neutral-400 hover:text-neutral-200 hover:border-neutral-600"
              } ${isPending ? "opacity-50" : ""}`}
              title={isActive ? `Remove ${option.label}` : option.label}
            >
              {isLoading ? (
                <IconLoader2 size={12} className="animate-spin" />
              ) : (
                <Icon size={12} />
              )}
              <span className="hidden sm:inline">{option.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Default variant
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Seen Toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleSeenToggle();
        }}
        disabled={isPending}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
          isSeen
            ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
            : "border-neutral-700 bg-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-600"
        } ${isPending ? "opacity-50" : ""}`}
        title={isSeen ? "Mark as not seen" : "Mark as seen"}
      >
        {loadingSeen ? (
          <IconLoader2 size={iconSizes[size]} className="animate-spin" />
        ) : (
          <IconEye size={iconSizes[size]} />
        )}
        <span>Seen</span>
      </button>

      {/* Separator */}
      <div className="w-px h-6 bg-neutral-700" />

      {/* Reactions */}
      {REACTION_OPTIONS.map((option) => {
        const Icon = option.icon;
        const isActive = currentReaction === option.type;
        const isLoading = loadingReaction === option.type && isPending;

        return (
          <button
            key={option.type}
            onClick={(e) => {
              e.stopPropagation();
              handleReaction(option.type);
            }}
            disabled={isPending}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
              isActive
                ? `${option.bgColor} ${option.activeColor}`
                : "border-neutral-700 bg-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-600"
            } ${isPending ? "opacity-50" : ""}`}
            title={isActive ? `Remove ${option.label}` : option.label}
          >
            {isLoading ? (
              <IconLoader2 size={iconSizes[size]} className="animate-spin" />
            ) : (
              <Icon size={iconSizes[size]} />
            )}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
