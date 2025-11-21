"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/utils/supabase/client";
import { IconPlaylistAdd, IconCheck } from "@tabler/icons-react";

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

  const handleToggleReelDeck = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/portal");
        return;
      }

      if (inReelDeck) {
        // Remove from reel deck
        const { error } = await supabase
          .from("reel_deck")
          .delete()
          .eq("user_id", user.id)
          .eq("media_id", mediaId)
          .eq("media_type", mediaType);

        if (error) throw error;

        setInReelDeck(false);
      } else {
        // Add to reel deck with "watching" status
        const { error } = await supabase.from("reel_deck").insert({
          user_id: user.id,
          media_id: mediaId,
          media_type: mediaType,
          status: "watching",
        });

        if (error) throw error;

        setInReelDeck(true);
      }

      router.refresh();
    } catch (error) {
      console.error("Error toggling reel deck:", error);
      alert(`Failed to ${inReelDeck ? "remove from" : "add to"} reel deck`);
    } finally {
      setLoading(false);
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
