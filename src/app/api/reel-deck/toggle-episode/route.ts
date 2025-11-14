import { createClient } from "@/src/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * POST /api/reel-deck/toggle-episode
 * Mark a single episode as watched/unwatched
 *
 * OPTIMIZATIONS:
 * - Better validation with type checks
 * - Graceful error handling for reel_deck updates
 * - Structured logging
 * - Useful response metadata
 */
export async function POST(request: Request) {
  try {
    const { episodeId, seriesId, userId, isWatched } = await request.json();

    console.log("[Toggle Episode] Request:", {
      episodeId,
      seriesId,
      userId,
      isWatched,
    });

    // OPTIMIZATION: Better validation with clear error messages
    if (!episodeId || typeof episodeId !== "string") {
      return NextResponse.json(
        { error: "Invalid episode ID" },
        { status: 400 },
      );
    }

    if (!seriesId || typeof seriesId !== "string") {
      return NextResponse.json({ error: "Invalid series ID" }, { status: 400 });
    }

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    if (typeof isWatched !== "boolean") {
      return NextResponse.json(
        { error: "isWatched must be a boolean" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Verify user is authenticated
    const { data: user } = await supabase.auth.getClaims();
    const currentUserId = user?.claims?.sub;

    if (!currentUserId || currentUserId !== userId) {
      console.error("[Toggle Episode] Unauthorized:", {
        currentUserId,
        userId,
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get episode details to verify it exists and get air date
    const { data: episode, error: episodeError } = await supabase
      .from("episodes")
      .select("id, air_date, episode_number, season_number")
      .eq("id", episodeId)
      .single();

    if (episodeError || !episode) {
      console.error("[Toggle Episode] Episode not found:", episodeError);
      return NextResponse.json({ error: "Episode not found" }, { status: 404 });
    }

    // Check if episode has aired (prevent marking unaired episodes as watched)
    const today = new Date().toISOString().split("T")[0];
    const hasAired = episode.air_date ? episode.air_date <= today : false;

    if (isWatched && !hasAired) {
      console.warn("[Toggle Episode] Attempt to mark unaired episode:", {
        episodeId,
        airDate: episode.air_date,
      });
      return NextResponse.json(
        {
          error: "Cannot mark unaired episodes as watched",
          airDate: episode.air_date,
        },
        { status: 400 },
      );
    }

    if (isWatched) {
      // Mark episode as watched
      const { error: upsertError } = await supabase
        .from("episode_watches")
        .upsert(
          {
            user_id: userId,
            episode_id: episodeId,
            series_id: seriesId,
            watched_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,episode_id",
          },
        );

      if (upsertError) {
        console.error(
          "[Toggle Episode] Error marking as watched:",
          upsertError,
        );
        return NextResponse.json(
          {
            error: "Failed to mark episode as watched",
            details: upsertError.message,
          },
          { status: 500 },
        );
      }

      // Update reel_deck last_watched_at
      const { error: updateError } = await supabase
        .from("reel_deck")
        .update({ last_watched_at: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("media_id", seriesId)
        .eq("media_type", "tv");

      if (updateError) {
        console.warn(
          "[Toggle Episode] Failed to update reel_deck timestamp:",
          updateError,
        );
        // Don't fail the request if this update fails
      }

      console.log(
        `[Toggle Episode] Marked S${episode.season_number}E${episode.episode_number} as watched`,
      );
    } else {
      // Mark episode as unwatched
      const { error: deleteError } = await supabase
        .from("episode_watches")
        .delete()
        .eq("user_id", userId)
        .eq("episode_id", episodeId);

      if (deleteError) {
        console.error(
          "[Toggle Episode] Error marking as unwatched:",
          deleteError,
        );
        return NextResponse.json(
          {
            error: "Failed to mark episode as unwatched",
            details: deleteError.message,
          },
          { status: 500 },
        );
      }

      console.log(
        `[Toggle Episode] Marked S${episode.season_number}E${episode.episode_number} as unwatched`,
      );
    }

    // OPTIMIZATION: Return useful metadata
    return NextResponse.json({
      success: true,
      episodeId,
      action: isWatched ? "watched" : "unwatched",
      episode: {
        number: episode.episode_number,
        season: episode.season_number,
      },
    });
  } catch (error) {
    console.error("[Toggle Episode] Unexpected error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
