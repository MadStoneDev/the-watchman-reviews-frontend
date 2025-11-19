"use client";

import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { IconLoader2, IconTrash, IconX } from "@tabler/icons-react";

export default function RemoveFromReelDeckButton({
  userId,
  username,
  seriesId,
}: {
  userId: string;
  username: string;
  seriesId: string;
}) {
  // Hooks
  const router = useRouter();

  // States
  const [removingFromDeck, setRemovingFromDeck] = useState(false);

  // Functions
  const handleRemoveFromDeck = useCallback(async () => {
    if (
      !confirm(
        `Are you sure you want to remove this TV Show from your Reel Deck? All progress will be lost.`,
      )
    ) {
      return;
    }

    setRemovingFromDeck(true);

    try {
      const response = await fetch("/api/reel-deck/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaId: seriesId,
          mediaType: "tv",
          userId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to remove from Reel Deck");
      }

      router.push(`/${username}/reel-deck`);
      router.refresh();
    } catch (error) {
      console.error("Error removing from deck:", error);
    } finally {
      setRemovingFromDeck(false);
    }
  }, [seriesId, userId, router]);

  return (
    <button
      onClick={handleRemoveFromDeck}
      disabled={removingFromDeck}
      className="group p-0.5 relative bg-neutral-700 text-sm text-neutral-300 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
    >
      <div
        className={`absolute left-0 top-0 right-full group-hover:right-0 bottom-0 bg-red-700 group-hover:bg-red-600 transition-all duration-200`}
      ></div>
      <div
        className={`relative flex items-center gap-2 px-4 py-2 bg-neutral-800 group-hover:bg-red-800 rounded-lg z-10 transition-all delay-300 duration-300`}
      >
        {removingFromDeck ? (
          <IconLoader2 size={16} className="animate-spin" />
        ) : (
          <IconTrash size={16} />
        )}
        {removingFromDeck ? "Removing..." : "Remove from Reel Deck"}
      </div>
    </button>
  );
}
