"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/utils/supabase/client";
import { IconPlaylistAdd, IconCheck } from "@tabler/icons-react";
import { toast } from "sonner";

interface AddToReelDeckButtonProps {
  mediaId: string;
  mediaType: "movie" | "tv";
  isInReelDeck: boolean;
}

export default function AddToReelDeckButton({
  mediaId,
  mediaType,
  isInReelDeck,
}: AddToReelDeckButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [inReelDeck, setInReelDeck] = useState(isInReelDeck);
  const [foundInReelDeck, setFoundInReelDeck] = useState(isInReelDeck);

  const handleToggleReelDeck = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/portal");
      return;
    }

    if (inReelDeck) {
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
          .eq("media_id", mediaId)
          .eq("media_type", mediaType);

        if (error) throw error;

        toast.success("Removed from Reel Deck", { id: toastId });
        setFoundInReelDeck(false)

        // ✅ Keep optimistic state - it's now the source of truth
      } catch (error) {
        console.error("Error removing from reel deck:", error);
        setInReelDeck(true); // Revert on error
        setInReelDeck(true); // Revert on error
        toast.error("Failed to remove from Reel Deck", { id: toastId });
      } finally {
        setLoading(false);
      }
    } else {
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
            tmdb_id: mediaId,
            media_type: mediaType,
          }),
        });

        if (!response.ok) {
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
        setFoundInReelDeck(true)

        // ✅ Keep optimistic state - it's now the source of truth
      } catch (error) {
        console.error("Error adding to reel deck:", error);
        setInReelDeck(false); // Revert on error
        setFoundInReelDeck(false); // Revert on error
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
          foundInReelDeck
          ? "bg-lime-400 text-neutral-900 hover:bg-lime-500"
          : "bg-neutral-800 hover:bg-neutral-700"
      }`}
    >
      {loading ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
          <span>{foundInReelDeck ? "Removing..." : "Adding..."}</span>
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
