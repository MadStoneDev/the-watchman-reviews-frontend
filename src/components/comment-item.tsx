"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconMessageReply,
  IconUser,
} from "@tabler/icons-react";
import CommentForm from "./comment-form";
import {
  toggleCommentReaction,
  type CommentReactions,
} from "@/src/app/actions/comments";
import { REACTION_TYPES, type ReactionType } from "@/src/lib/reactions-config";
import { toast } from "sonner";

export interface CommentData {
  id: string;
  content: string;
  created_at: string | null;
  updated_at: string | null;
  parent_comment_id: string | null;
  user: {
    id: string;
    username: string;
    avatar_path: string | null;
  };
  replies?: CommentData[];
  reactions?: CommentReactions;
}

interface CommentItemProps {
  comment: CommentData;
  currentUserId?: string | null;
  onReply: (content: string, parentId: string) => Promise<void>;
  onEdit: (commentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  onReactionUpdate?: (commentId: string, reactions: CommentReactions) => void;
  depth?: number;
  maxDepth?: number;
}

export default function CommentItem({
  comment,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  onReactionUpdate,
  depth = 0,
  maxDepth = 5,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [reactions, setReactions] = useState<CommentReactions>(
    comment.reactions || {
      positive: 0,
      negative: 0,
      popcorn: 0,
      userReaction: null,
    },
  );

  const isOwner = currentUserId === comment.user.id;
  const canReply = depth < maxDepth;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const handleReply = async (content: string) => {
    await onReply(content, comment.id);
    setIsReplying(false);
  };

  const handleEdit = async (content: string) => {
    await onEdit(comment.id, content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this comment?")) {
      startTransition(async () => {
        await onDelete(comment.id);
      });
    }
  };

  const handleReaction = async (reactionType: ReactionType) => {
    if (!currentUserId) {
      toast.error("You must be logged in to react");
      return;
    }

    // Optimistic update
    const previousReactions = { ...reactions };
    const wasActiveReaction = reactions.userReaction === reactionType;

    // Calculate new reactions optimistically
    let newReactions: CommentReactions;

    if (wasActiveReaction) {
      // Removing reaction
      newReactions = {
        ...reactions,
        [reactionType]: Math.max(0, reactions[reactionType] - 1),
        userReaction: null,
      };
    } else if (reactions.userReaction) {
      // Changing reaction
      newReactions = {
        ...reactions,
        [reactions.userReaction]: Math.max(
          0,
          reactions[reactions.userReaction] - 1,
        ),
        [reactionType]: reactions[reactionType] + 1,
        userReaction: reactionType,
      };
    } else {
      // Adding new reaction
      newReactions = {
        ...reactions,
        [reactionType]: reactions[reactionType] + 1,
        userReaction: reactionType,
      };
    }

    setReactions(newReactions);

    // Update server
    startTransition(async () => {
      const result = await toggleCommentReaction(comment.id, reactionType);

      if (result.success && result.reactions) {
        setReactions(result.reactions);
        onReactionUpdate?.(comment.id, result.reactions);
      } else {
        // Revert on error
        setReactions(previousReactions);
        toast.error(result.error || "Failed to update reaction");
      }
    });
  };

  return (
    <div className={`relative ${depth > 0 ? "ml-8 md:ml-14" : ""}`}>
      {/* Thread connection line for replies */}
      {depth > 0 && (
        <div className="absolute -left-4 md:-left-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-neutral-700 to-transparent" />
      )}

      <div className="flex gap-2 md:gap-4 group py-4 hover:bg-neutral-900/30 -mx-2 md:-mx-4 px-2 md:px-4 rounded-lg transition-colors">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 border-2 border-neutral-700/50 overflow-hidden ring-2 ring-transparent transition-all">
            {comment.user.avatar_path ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${comment.user.avatar_path}`}
                alt={comment.user.username}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <IconUser size={24} className="text-neutral-600" />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="font-bold text-base text-neutral-100">
              {comment.user.username}
            </span>
            <span className="text-xs text-neutral-500">•</span>
            <span className="text-sm text-neutral-500">
              {formatDate(comment.created_at)}
            </span>
            {comment.updated_at !== comment.created_at && (
              <span className={`text-[12px] text-neutral-500/80`}>
                (Edited)
              </span>
            )}

            {/* Owner menu - moved to header on desktop */}
            {isOwner && !isEditing && (
              <div className="relative ml-auto">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 text-neutral-600 hover:text-neutral-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <IconDotsVertical size={18} />
                </button>

                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 top-8 bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl z-20 py-1 min-w-[140px]">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-neutral-300 hover:bg-neutral-700 flex items-center gap-2 transition-colors"
                      >
                        <IconEdit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDelete();
                          setShowMenu(false);
                        }}
                        disabled={isPending}
                        className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-neutral-700 flex items-center gap-2 disabled:opacity-50 transition-colors"
                      >
                        <IconTrash size={16} />
                        {isPending ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Comment Content or Edit Form */}
          {isEditing ? (
            <div className="mb-3">
              <CommentForm
                onSubmit={handleEdit}
                onCancel={() => setIsEditing(false)}
                initialValue={comment.content}
                placeholder="Edit your comment..."
                submitLabel="Save"
                autoFocus
                minHeight="min-h-[80px]"
              />
            </div>
          ) : (
            <p className="text-base leading-relaxed text-neutral-300 whitespace-pre-wrap break-words mb-3">
              {comment.content}
            </p>
          )}

          {/* Actions */}
          {!isEditing && (
            <div className="flex items-center justify-between gap-4 text-sm">
              {/* Left side - Reply button */}
              <div className="flex items-center gap-4">
                {canReply && currentUserId && (
                  <button
                    onClick={() => setIsReplying(!isReplying)}
                    className="text-neutral-500 hover:text-lime-400 transition-colors flex items-center gap-1.5 font-medium"
                  >
                    <IconMessageReply size={20} />
                    Reply
                  </button>
                )}
              </div>

              {/* Right side - Reaction buttons */}
              <div className="flex items-center gap-1 md:gap-2">
                {(Object.keys(REACTION_TYPES) as ReactionType[]).map(
                  (reactionType) => {
                    const config = REACTION_TYPES[reactionType];
                    const Icon = config.icon;
                    const count = reactions[reactionType];
                    const isActive = reactions.userReaction === reactionType;
                    const showCount = isOwner && count > 0;

                    return (
                      <button
                        key={reactionType}
                        onClick={() => handleReaction(reactionType)}
                        disabled={!currentUserId}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
                          isActive
                            ? `${config.activeBg} ${config.activeColor}`
                            : `text-neutral-500 ${config.hoverColor} hover:bg-neutral-800/50`
                        } ${
                          !currentUserId ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        title={
                          !currentUserId ? "Sign in to react" : config.label
                        }
                      >
                        <Icon size={20} strokeWidth={2} />
                        {showCount && (
                          <span className="text-xs font-medium">{count}</span>
                        )}
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          )}

          {/* Reply Form */}
          {isReplying && (
            <div className="mt-4 pt-4 border-t border-neutral-800">
              <CommentForm
                onSubmit={handleReply}
                onCancel={() => setIsReplying(false)}
                placeholder={`Reply to ${comment.user.username}...`}
                submitLabel="Reply"
                autoFocus
                minHeight="min-h-[80px]"
              />
            </div>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2 space-y-0">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUserId={currentUserId}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onReactionUpdate={onReactionUpdate}
                  depth={depth + 1}
                  maxDepth={maxDepth}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
