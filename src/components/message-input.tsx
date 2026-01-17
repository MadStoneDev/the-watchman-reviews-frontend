"use client";

import React, { useState, useRef, useEffect } from "react";
import { IconSend, IconLoader2 } from "@tabler/icons-react";

interface MessageInputProps {
  onSend: (content: string) => Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
}

export default function MessageInput({
  onSend,
  isLoading = false,
  placeholder = "Type a message...",
}: MessageInputProps) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedContent = content.trim();
    if (!trimmedContent || isLoading) return;

    await onSend(trimmedContent);
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex-grow relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          maxLength={2000}
          className="w-full px-4 py-3 bg-neutral-700 text-white rounded-xl resize-none placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-lime-400 disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={!content.trim() || isLoading}
        className="shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-lime-400 text-neutral-900 hover:bg-lime-300 disabled:opacity-50 disabled:hover:bg-lime-400 transition-colors"
      >
        {isLoading ? (
          <IconLoader2 size={20} className="animate-spin" />
        ) : (
          <IconSend size={20} />
        )}
      </button>
    </form>
  );
}
