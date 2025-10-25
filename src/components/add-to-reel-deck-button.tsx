"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/utils/supabase/client";
import {
  IconPlaylistAdd,
  IconCheck,
  IconX,
  IconPlayerPlay,
  IconPlayerPause,
  IconCircleCheck,
  IconClock,
} from "@tabler/icons-react";

interface AddToReelDeckButtonProps {
  mediaId: string;
  mediaType: "movie" | "tv";
  isInReelDeck: boolean;
  currentStatus?: string | null;
}

const STATUS_OPTIONS = [
  { value: "watching", label: "Watching", icon: IconPlayerPlay },
  { value: "completed", label: "Completed", icon: IconCircleCheck },
  { value: "paused", label: "On Hold", icon: IconPlayerPause },
  { value: "plan_to_watch", label: "Plan to Watch", icon: IconClock },
];

export default function AddToReelDeckButton({
  mediaId,
  mediaType,
  isInReelDeck,
  currentStatus,
}: AddToReelDeckButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [inReelDeck, setInReelDeck] = useState(isInReelDeck);
  const [status, setStatus] = useState(currentStatus);

  const handleAddToReelDeck = async (selectedStatus: string) => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/portal");
        return;
      }

      // Add to reel deck
      const { error } = await supabase.from("reel_deck").insert({
        user_id: user.id,
        media_id: mediaId,
        media_type: mediaType,
        status: selectedStatus,
      });

      if (error) throw error;

      setInReelDeck(true);
      setStatus(selectedStatus);
      setShowStatusMenu(false);
      router.refresh();
    } catch (error) {
      console.error("Error adding to reel deck:", error);
      alert("Failed to add to reel deck");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase
        .from("reel_deck")
        .update({
          status: newStatus,
          last_watched_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("media_id", mediaId)
        .eq("media_type", mediaType);

      if (error) throw error;

      setStatus(newStatus);
      setShowStatusMenu(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromReelDeck = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase
        .from("reel_deck")
        .delete()
        .eq("user_id", user.id)
        .eq("media_id", mediaId)
        .eq("media_type", mediaType);

      if (error) throw error;

      setInReelDeck(false);
      setStatus(null);
      setShowStatusMenu(false);
      router.refresh();
    } catch (error) {
      console.error("Error removing from reel deck:", error);
      alert("Failed to remove from reel deck");
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = () => {
    const statusOption = STATUS_OPTIONS.find((opt) => opt.value === status);
    return statusOption?.label || "In Reel Deck";
  };

  return (
    <div className="relative">
      {!inReelDeck ? (
        <button
          onClick={() => setShowStatusMenu(true)}
          disabled={loading}
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Adding...</span>
            </>
          ) : (
            <>
              <IconPlaylistAdd size={18} />
              <span>Add to Reel Deck</span>
            </>
          )}
        </button>
      ) : (
        <button
          onClick={() => setShowStatusMenu(true)}
          disabled={loading}
          className="px-4 py-2 bg-lime-400 text-neutral-900 hover:bg-lime-500 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconCheck size={18} />
          <span>{getStatusLabel()}</span>
        </button>
      )}

      {/* Status Menu Modal */}
      {showStatusMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80">
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {inReelDeck ? "Update Status" : "Add to Reel Deck"}
              </h3>
              <button
                onClick={() => setShowStatusMenu(false)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <IconX size={20} />
              </button>
            </div>

            <div className="space-y-2">
              {STATUS_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() =>
                      inReelDeck
                        ? handleUpdateStatus(option.value)
                        : handleAddToReelDeck(option.value)
                    }
                    disabled={loading}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                      status === option.value
                        ? "bg-lime-400/10 border-lime-400 text-lime-400"
                        : "bg-neutral-800 border-neutral-700 hover:border-neutral-600"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Icon size={20} className="shrink-0" />
                    <span className="font-medium">{option.label}</span>
                    {status === option.value && (
                      <IconCheck size={18} className="ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>

            {inReelDeck && (
              <button
                onClick={handleRemoveFromReelDeck}
                disabled={loading}
                className="w-full mt-4 px-4 py-3 bg-red-900/20 text-red-400 hover:bg-red-900/30 rounded-lg border border-red-800/50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove from Reel Deck
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
