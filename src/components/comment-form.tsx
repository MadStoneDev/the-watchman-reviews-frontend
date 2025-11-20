"use client";

import React, { useState, useTransition } from "react";
import { IconSend, IconX } from "@tabler/icons-react";

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
  initialValue?: string;
  placeholder?: string;
  submitLabel?: string;
  autoFocus?: boolean;
  minHeight?: string;
}

export default function CommentForm({
  onSubmit,
  onCancel,
  initialValue = "",
  placeholder = "Write a comment...",
  submitLabel = "Post Comment",
  autoFocus = false,
  minHeight = "min-h-[100px]",
}: CommentFormProps) {
  const [content, setContent] = useState(initialValue);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || isPending) return;

    startTransition(async () => {
      await onSubmit(content);
      setContent("");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={isPending}
        className={`w-full ${minHeight} px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg 
          text-neutral-200 placeholder-neutral-500 resize-none
          focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200`}
      />

      <div className="flex items-center gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 
              rounded-lg transition-colors duration-200 flex items-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconX size={18} />
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={!content.trim() || isPending}
          className="px-4 py-2 bg-lime-400 hover:bg-lime-500 text-neutral-900 font-medium
            rounded-lg transition-colors duration-200 flex items-center gap-2
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconSend size={18} />
          {isPending ? "Posting..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
