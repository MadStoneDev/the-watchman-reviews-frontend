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
        className={`w-full ${minHeight} px-4 py-3 bg-neutral-900/50 border-2 border-neutral-800 rounded-xl
          text-neutral-200 placeholder-neutral-600 resize-none text-base leading-relaxed
          focus:outline-hidden focus:border-lime-400/50 focus:bg-neutral-900
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200`}
      />

      <div className="flex items-center gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="px-4 py-2 text-neutral-400 hover:text-neutral-200
              rounded-lg transition-colors duration-200 flex items-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={!content.trim() || isPending}
          className="px-5 py-2.5 bg-lime-400 hover:bg-lime-500 text-neutral-900 font-semibold
            rounded-lg transition-all duration-200 flex items-center gap-2
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-lg shadow-lime-400/20 hover:shadow-lime-400/30"
        >
          {isPending ? "Posting..." : submitLabel}
          <IconSend size={16} />
        </button>
      </div>
    </form>
  );
}
