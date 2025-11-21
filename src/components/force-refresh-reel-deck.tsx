"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  IconLoader2,
  IconRefresh,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { createClient } from "@/src/utils/supabase/client";

export default function ForceRefreshReelDeck({
  role,
  tmdbId,
  seriesId,
}: {
  userId: string;
  role: number;
  tmdbId: string;
  seriesId: string;
}) {
  if (role < 10) return;

  // Hooks
  const router = useRouter();

  // States
  const [refreshing, setRefreshing] = useState(false);

  // Functions
  const handleRemoveFromDeck = async () => {
    setRefreshing(true);

    try {
      const tmdbResponse = await fetch(`/api/tmdb/tv/${tmdbId}?language=en-US`);

      if (tmdbResponse.ok) {
        const supabase = createClient();
        const tmdbSeries = await tmdbResponse.json();

        // Update series record with fresh data
        await supabase
          .from("series")
          .update({
            title: tmdbSeries.name,
            overview: tmdbSeries.overview || "",
            poster_path: tmdbSeries.poster_path,
            backdrop_path: tmdbSeries.backdrop_path,
            release_year: tmdbSeries.first_air_date
              ? new Date(tmdbSeries.first_air_date).getFullYear().toString()
              : "",
            first_air_date: tmdbSeries.first_air_date || null,
            last_air_date: tmdbSeries.last_air_date || null,
            status: tmdbSeries.status || null,
            last_fetched: new Date().toISOString(),
          })
          .eq("id", seriesId);
      }

      router.refresh();
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <button
      onClick={handleRemoveFromDeck}
      disabled={refreshing}
      className="group p-0.5 relative bg-neutral-700 text-sm text-neutral-300 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
    >
      <div
        className={`absolute left-0 top-0 right-full group-hover:right-0 bottom-0 bg-cyan-600 group-hover:bg-cyan-700 transition-all duration-200`}
      ></div>
      <div
        className={`relative flex items-center gap-2 px-4 py-2 bg-neutral-800 group-hover:bg-cyan-800 rounded-lg z-10 transition-all delay-200 duration-300`}
      >
        {refreshing ? (
          <IconLoader2 size={16} className="animate-spin" />
        ) : (
          <IconRefresh size={16} />
        )}
        {refreshing ? "Refreshing..." : "Force Refresh Media"}
      </div>
    </button>
  );
}
