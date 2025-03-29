"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { createClient } from "@/src/utils/supabase/client";

import CollectionItem from "./collection-item";
import {
  IconSquarePlus,
  IconShare,
  IconCheck,
  IconX,
} from "@tabler/icons-react";

type MediaItem = {
  id: string;
  collection_id: string;
  media_id: string;
  media_type: string;
  title: string;
  poster_path: string | null;
  release_year: string | null;
};

type CollectionBlockProps = {
  initialItems?: MediaItem[];
  collectionId: string;
  isOwner?: boolean;
};

export default function CollectionBlock({
  initialItems = [],
  collectionId,
  isOwner = false,
}: CollectionBlockProps) {
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [showShareForm, setShowShareForm] = useState(false);
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const supabase = createClient();

  const handleDeleteItem = async (id: string) => {
    try {
      // Delete from database
      const { error } = await supabase
        .from("media_collection")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting item:", error);
        return;
      }

      // Update UI
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      // Get current user for checking
      const { data: userData } = await supabase.auth.getUser();
      const currentUserId = userData?.user?.id;

      if (!currentUserId) {
        setStatus("error");
        setMessage("You must be logged in to share collections.");
        return;
      }

      // Find the user by username (case insensitive)
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, username")
        .ilike("username", username.trim())
        .single();

      if (profileError || !profile) {
        setStatus("error");
        setMessage("User not found. Please check the username.");
        return;
      }

      // Don't allow sharing with oneself
      if (profile.id === currentUserId) {
        setStatus("error");
        setMessage("You can't share a collection with yourself.");
        return;
      }

      // Check if already shared with this user
      const { data: existingShare, error: existingError } = await supabase
        .from("shared_collection")
        .select("*")
        .eq("collection_id", collectionId)
        .eq("user_id", profile.id)
        .single();

      if (existingShare) {
        setStatus("error");
        setMessage(`Collection already shared with ${profile.username}.`);
        return;
      }

      // Add to shared_collection table
      const { error: shareError } = await supabase
        .from("shared_collection")
        .insert({
          collection_id: collectionId,
          user_id: profile.id,
        });

      if (shareError) {
        setStatus("error");
        setMessage("Failed to share collection. Please try again.");
        console.error("Share error:", shareError);
        return;
      }

      // Success
      setStatus("success");
      setMessage(`Collection shared with ${profile.username}!`);

      // Reset form after delay
      setTimeout(() => {
        setUsername("");
        setStatus("idle");
        setMessage("");
        setShowShareForm(false);
      }, 3000);
    } catch (err) {
      console.error("Share error:", err);
      setStatus("error");
      setMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="my-4">
      {/* Header with title and buttons */}
      {isOwner && (
        <div className="mb-4">
          {!showShareForm ? (
            <button
              onClick={() => setShowShareForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
            >
              <IconShare size={18} />
              <span>Share Collection</span>
            </button>
          ) : (
            <div className="p-4 bg-neutral-800 rounded">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Share Collection</h3>
                <button
                  onClick={() => {
                    setShowShareForm(false);
                    setUsername("");
                    setStatus("idle");
                    setMessage("");
                  }}
                  className="text-neutral-400 hover:text-white"
                >
                  <IconX size={18} />
                </button>
              </div>

              <form onSubmit={handleShare} className="flex flex-col gap-3">
                <div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full p-2 bg-neutral-700 border border-neutral-600 rounded focus:outline-none focus:border-lime-400"
                    disabled={status === "loading" || status === "success"}
                  />
                </div>

                {message && (
                  <div
                    className={`py-2 px-3 rounded text-sm ${
                      status === "error"
                        ? "bg-red-900/20 text-red-400"
                        : status === "success"
                          ? "bg-lime-500/20 text-lime-400"
                          : ""
                    }`}
                  >
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    !username.trim() ||
                    status === "loading" ||
                    status === "success"
                  }
                  className={`p-2 rounded flex items-center justify-center gap-2 ${
                    !username.trim() ||
                    status === "loading" ||
                    status === "success"
                      ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                      : "bg-lime-500 text-black hover:bg-lime-400"
                  }`}
                >
                  {status === "loading" ? (
                    "Sharing..."
                  ) : status === "success" ? (
                    <>
                      <IconCheck size={18} />
                      Shared!
                    </>
                  ) : (
                    "Share"
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Collection Items */}
      <section className={`flex flex-col gap-2`}>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-neutral-400 border border-dashed border-neutral-700 rounded">
            <p className="mb-4">This collection is empty</p>
            <Link
              href={`/search`}
              className="p-2 flex justify-center items-center gap-1 border hover:border-lime-400 hover:text-lime-400 opacity-70 hover:opacity-100 transition-all duration-300 ease-in-out rounded"
            >
              <IconSquarePlus size={20} />
              <span>Add media</span>
            </Link>
          </div>
        ) : (
          <>
            {items.map((item) => (
              <CollectionItem
                key={item.id}
                id={item.id}
                title={item.title}
                imageUrl={item.poster_path ? item.poster_path : undefined}
                mediaId={item.media_id}
                mediaType={item.media_type}
                releaseYear={item.release_year || undefined}
                onDelete={() => handleDeleteItem(item.id)}
              />
            ))}

            <Link
              href={`/search`}
              className="p-2 flex justify-center items-center gap-1 w-full border hover:border-lime-400 hover:text-lime-400 opacity-70 hover:opacity-100 transition-all duration-300 ease-in-out rounded"
            >
              <IconSquarePlus size={20} />
              <span>Add more</span>
            </Link>
          </>
        )}
      </section>
    </div>
  );
}
