"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/utils/supabase/client";
import { IconPlaylistAdd, IconCheck } from "@tabler/icons-react";
import { toast } from "sonner";

interface AddToReelDeckButtonProps {
  tmdbId: number;
  databaseId?: string;
  mediaType: "movie" | "tv";
  isInReelDeck: boolean;
}

export default function AddToReelDeckButton({
  tmdbId,
  databaseId,
  mediaType,
  isInReelDeck,
}: AddToReelDeckButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [inReelDeck, setInReelDeck] = useState(isInReelDeck);

  const handleToggleReelDeck = async (e: React.MouseEvent) => {
    e.stopPropagation();

    console.log("🎯 BUTTON CLICKED - Initial state:", {
      inReelDeck,
      isInReelDeck,
      tmdbId,
      databaseId,
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/portal");
      return;
    }

    if (inReelDeck) {
      console.log("❌ Removing from reel deck with databaseId:", databaseId);

      // Remove from reel deck
      const toastId = toast.loading("Removing from Reel Deck...");

      // Optimistic update
      setInReelDeck(false);

      try {
        setLoading(true);

        const { error } = await supabase
          .from("reel_deck")
          .delete()
          .eq("user_id", user.id)
          .eq("media_id", databaseId)
          .eq("media_type", mediaType);

        if (error) throw error;

        toast.success("Removed from Reel Deck", { id: toastId });

        // ✅ Keep optimistic state - it's now the source of truth
      } catch (error) {
        console.error("Error removing from reel deck:", error);
        setInReelDeck(true); // Revert on error
        toast.error("Failed to remove from Reel Deck", { id: toastId });
      } finally {
        setLoading(false);
      }
    } else {
      console.log("✅ Adding to reel deck with tmdbId:", tmdbId);

      // Add to reel deck
      const toastId = toast.loading("Adding to Reel Deck...");

      // Optimistic update
      setInReelDeck(true);

      try {
        setLoading(true);

        const response = await fetch("/api/media/ensure", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tmdb_id: tmdbId,
            media_type: mediaType,
          }),
        });

        console.log(
          "📡 Response status:",
          response.status,
          response.statusText,
        ); // ADD THIS

        if (!response.ok) {
          const errorText = await response.text(); // ADD THIS

          console.log("❌ Response error body:", errorText); // ADD THIS

          throw new Error("Failed to create media record");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to create media record");
        }

        const { error } = await supabase.from("reel_deck").insert({
          user_id: user.id,
          media_id: result.media_id,
          media_type: mediaType,
          status: "watching",
        });

        if (error) throw error;

        toast.success("Added to Reel Deck", { id: toastId });

        // ✅ Keep optimistic state - it's now the source of truth
        console.log("📦 API returned media_id:", result.media_id);
      } catch (error) {
        console.error("Error adding to reel deck:", error);
        setInReelDeck(false); // Revert on error
        toast.error("Failed to add to Reel Deck", { id: toastId });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <button
      onClick={handleToggleReelDeck}
      disabled={loading}
      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
        inReelDeck
          ? "bg-lime-400 text-neutral-900 hover:bg-lime-500"
          : "bg-neutral-800 hover:bg-neutral-700"
      }`}
    >
      {loading ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
          <span>{inReelDeck ? "Removing..." : "Adding..."}</span>
        </>
      ) : (
        <>
          {inReelDeck ? (
            <>
              <IconCheck size={18} />
              <span>In Reel Deck</span>
            </>
          ) : (
            <>
              <IconPlaylistAdd size={18} />
              <span>Add to Reel Deck</span>
            </>
          )}
        </>
      )}
    </button>
  );
}
