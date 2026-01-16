"use client";

import React, { useState, useOptimistic, useTransition } from "react";
import { IconUserPlus, IconUserCheck, IconUsers } from "@tabler/icons-react";
import { toast } from "sonner";
import { followUser, unfollowUser } from "@/src/app/actions/follows";
import type { FollowStatus } from "@/src/lib/types";

interface FollowButtonProps {
  targetUserId: string;
  targetUsername: string;
  initialStatus: FollowStatus;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "compact";
}

export default function FollowButton({
  targetUserId,
  targetUsername,
  initialStatus,
  size = "md",
  variant = "default",
}: FollowButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(initialStatus);
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(status);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const wasFollowing = optimisticStatus.isFollowing;
    const toastId = toast.loading(
      wasFollowing ? `Unfollowing ${targetUsername}...` : `Following ${targetUsername}...`
    );

    // Optimistic update
    const newIsFollowing = !wasFollowing;
    const newStatus: FollowStatus = {
      isFollowing: newIsFollowing,
      isFollowedBy: optimisticStatus.isFollowedBy,
      isMutual: newIsFollowing && optimisticStatus.isFollowedBy,
    };

    startTransition(async () => {
      setOptimisticStatus(newStatus);

      try {
        const result = wasFollowing
          ? await unfollowUser(targetUserId)
          : await followUser(targetUserId);

        if (result.success) {
          setStatus(newStatus);
          toast.success(
            wasFollowing
              ? `Unfollowed ${targetUsername}`
              : `Now following ${targetUsername}`,
            { id: toastId }
          );
        } else {
          // Revert on error
          setOptimisticStatus(status);
          toast.error(result.error || "Something went wrong", { id: toastId });
        }
      } catch {
        // Revert on error
        setOptimisticStatus(status);
        toast.error("Failed to update follow status", { id: toastId });
      }
    });
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 20,
  };

  const getButtonStyles = () => {
    if (optimisticStatus.isMutual) {
      return "bg-indigo-500 text-white hover:bg-indigo-600";
    }
    if (optimisticStatus.isFollowing) {
      return "bg-lime-400 text-neutral-900 hover:bg-lime-500";
    }
    return "bg-neutral-800 text-neutral-100 hover:bg-neutral-700 border border-neutral-700";
  };

  const getIcon = () => {
    if (optimisticStatus.isMutual) {
      return <IconUsers size={iconSizes[size]} />;
    }
    if (optimisticStatus.isFollowing) {
      return <IconUserCheck size={iconSizes[size]} />;
    }
    return <IconUserPlus size={iconSizes[size]} />;
  };

  const getLabel = () => {
    if (optimisticStatus.isMutual) {
      return "Mutuals";
    }
    if (optimisticStatus.isFollowing) {
      return "Following";
    }
    return "Follow";
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`${sizeClasses[size]} rounded-lg flex items-center gap-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${getButtonStyles()}`}
    >
      {isPending ? (
        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        getIcon()
      )}
      {variant === "default" && <span>{getLabel()}</span>}
    </button>
  );
}
