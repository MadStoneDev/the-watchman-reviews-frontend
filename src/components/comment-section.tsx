"use client";

import React, { useState, useTransition, useOptimistic } from "react";
import { IconMessageCircle } from "@tabler/icons-react";
import { toast } from "sonner";
import CommentForm from "./comment-form";
import CommentItem, { type CommentData } from "./comment-item";
import {
  addComment,
  updateComment,
  deleteComment,
  type CommentMediaType,
} from "@/src/app/actions/comments";

interface CommentSectionProps {
  mediaType: CommentMediaType;
  mediaId: string;
  initialComments: CommentData[];
  currentUserId?: string | null;
}

type OptimisticAction =
  | { type: "add"; comment: CommentData }
  | { type: "delete"; commentId: string }
  | { type: "update"; commentId: string; content: string };

export default function CommentSection({
  mediaType,
  mediaId,
  initialComments,
  currentUserId,
}: CommentSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticComments, setOptimisticComments] = useOptimistic<
    CommentData[],
    OptimisticAction
  >(initialComments, (state, action) => {
    switch (action.type) {
      case "add":
        // If it's a reply, find the parent and add to replies
        if (action.comment.parent_comment_id) {
          return addReplyToTree(state, action.comment);
        }
        // Otherwise add to top level
        return [...state, action.comment];

      case "delete":
        return deleteFromTree(state, action.commentId);

      case "update":
        return updateInTree(state, action.commentId, action.content);

      default:
        return state;
    }
  });

  // Helper function to add reply to nested structure
  function addReplyToTree(
    comments: CommentData[],
    reply: CommentData,
  ): CommentData[] {
    return comments.map((comment) => {
      if (comment.id === reply.parent_comment_id) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply],
        };
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: addReplyToTree(comment.replies, reply),
        };
      }
      return comment;
    });
  }

  // Helper function to delete from nested structure
  function deleteFromTree(
    comments: CommentData[],
    commentId: string,
  ): CommentData[] {
    return comments
      .filter((comment) => comment.id !== commentId)
      .map((comment) => ({
        ...comment,
        replies: comment.replies
          ? deleteFromTree(comment.replies, commentId)
          : [],
      }));
  }

  // Helper function to update in nested structure
  function updateInTree(
    comments: CommentData[],
    commentId: string,
    content: string,
  ): CommentData[] {
    return comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          content,
          updated_at: new Date().toISOString(),
        };
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateInTree(comment.replies, commentId, content),
        };
      }
      return comment;
    });
  }

  const handleAddComment = async (
    content: string,
    parentId?: string | null,
  ) => {
    if (!currentUserId) {
      toast.error("You must be logged in to comment");
      return;
    }

    // Create optimistic comment
    const optimisticComment: CommentData = {
      id: `temp-${Date.now()}`,
      content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      parent_comment_id: parentId || null,
      user: {
        id: currentUserId,
        username: "You",
        avatar_path: null,
      },
      replies: [],
    };

    // Optimistically add comment
    setOptimisticComments({ type: "add", comment: optimisticComment });

    startTransition(async () => {
      const result = await addComment(mediaType, mediaId, content, parentId);

      if (!result.success) {
        toast.error(result.error || "Failed to post comment");
        // Revert optimistic update
        setOptimisticComments({
          type: "delete",
          commentId: optimisticComment.id,
        });
      } else {
        toast.success("Comment posted!");
      }
    });
  };

  const handleEditComment = async (commentId: string, content: string) => {
    // Optimistically update comment
    setOptimisticComments({ type: "update", commentId, content });

    startTransition(async () => {
      const result = await updateComment(mediaType, commentId, content);

      if (!result.success) {
        toast.error(result.error || "Failed to update comment");
        // Note: In production you'd want to revert to original content here
      } else {
        toast.success("Comment updated!");
      }
    });
  };

  const handleDeleteComment = async (commentId: string) => {
    // Optimistically delete comment
    setOptimisticComments({ type: "delete", commentId });

    startTransition(async () => {
      const result = await deleteComment(mediaType, commentId);

      if (!result.success) {
        toast.error(result.error || "Failed to delete comment");
        // Note: In production you'd want to revert the deletion here
      } else {
        toast.success("Comment deleted!");
      }
    });
  };

  const commentCount = countComments(optimisticComments);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IconMessageCircle size={28} className="text-lime-400" />
          <h2 className="text-xl md:text-3xl font-bold">
            Discussion
          </h2>
          {commentCount > 0 && (
            <span className="text-lg text-neutral-500 font-normal">
              {commentCount}
            </span>
          )}
        </div>
      </div>

      {/* Add Comment Form */}
      {currentUserId ? (
        <div className="pb-6 border-b border-neutral-800">
          <CommentForm
            onSubmit={(content) => handleAddComment(content)}
            placeholder="What did you think?"
          />
        </div>
      ) : (
        <div className="py-8 border-y border-neutral-800 text-center">
          <p className="text-neutral-500">Sign in to join the discussion</p>
        </div>
      )}

      {/* Comments List */}
      {optimisticComments.length > 0 ? (
        <div className="space-y-1">
          {optimisticComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onReply={(content, parentId) =>
                handleAddComment(content, parentId)
              }
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <IconMessageCircle
            size={56}
            className="text-neutral-800 mx-auto mb-4"
          />
          <p className="text-neutral-500 text-lg">
            No comments yet. Start the conversation!
          </p>
        </div>
      )}
    </div>
  );
}

// Helper to count total comments including replies
function countComments(comments: CommentData[]): number {
  return comments.reduce((count, comment) => {
    return count + 1 + (comment.replies ? countComments(comment.replies) : 0);
  }, 0);
}
