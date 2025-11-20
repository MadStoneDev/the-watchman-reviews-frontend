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
}

interface CommentItemProps {
  comment: CommentData;
  currentUserId?: string | null;
  onReply: (content: string, parentId: string) => Promise<void>;
  onEdit: (commentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  depth?: number;
  maxDepth?: number;
}

export default function CommentItem({
  comment,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  depth = 0,
  maxDepth = 5,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isPending, startTransition] = useTransition();

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

  return (
    <div className={`${depth > 0 ? "ml-6 md:ml-12" : ""}`}>
      <div className="flex gap-3 group">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden">
            {comment.user.avatar_path ? (
              <Image
                src={comment.user.avatar_path}
                alt={comment.user.username}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <IconUser size={20} className="text-neutral-600" />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-neutral-200">
              {comment.user.username}
            </span>
            <span className="text-xs text-neutral-500">
              {formatDate(comment.created_at)}
            </span>
            {comment.updated_at !== comment.created_at && (
              <span className="text-xs text-neutral-500 italic">(edited)</span>
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
            <p className="text-sm text-neutral-300 whitespace-pre-wrap break-words mb-2">
              {comment.content}
            </p>
          )}

          {/* Actions */}
          {!isEditing && (
            <div className="flex items-center gap-4 text-xs">
              {canReply && currentUserId && (
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="text-neutral-500 hover:text-lime-400 transition-colors flex items-center gap-1"
                >
                  <IconMessageReply size={14} />
                  Reply
                </button>
              )}

              {isOwner && (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="text-neutral-500 hover:text-neutral-300 transition-colors"
                  >
                    <IconDotsVertical size={16} />
                  </button>

                  {showMenu && (
                    <div className="absolute left-0 top-6 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-10 py-1 min-w-[120px]">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-700 flex items-center gap-2"
                      >
                        <IconEdit size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDelete();
                          setShowMenu(false);
                        }}
                        disabled={isPending}
                        className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-neutral-700 flex items-center gap-2 disabled:opacity-50"
                      >
                        <IconTrash size={14} />
                        {isPending ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Reply Form */}
          {isReplying && (
            <div className="mt-3">
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
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUserId={currentUserId}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
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
