import { createClient } from "@/src/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * POST /api/reel-deck/toggle-season
 * Mark all episodes in a season as watched/unwatched
 *
 * ALREADY HAS: Filter for aired episodes when marking as watched
 * OPTIMIZATIONS ADDED:
 * - Better validation
 * - Batch operations optimization
 * - Better error messages
 * - Return useful metadata
 */
export async function POST(request: Request) {
  try {
    const { seasonId, seriesId, userId, markAsWatched } = await request.json();

    console.log("[Toggle Season] Request:", {
      seasonId,
      seriesId,
      userId,
      markAsWatched,
    });

    // OPTIMIZATION: Better validation with clear error messages
    if (!seasonId || typeof seasonId !== "string") {
      return NextResponse.json({ error: "Invalid season ID" }, { status: 400 });
    }

    if (!seriesId || typeof seriesId !== "string") {
      return NextResponse.json({ error: "Invalid series ID" }, { status: 400 });
    }

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    if (typeof markAsWatched !== "boolean") {
      return NextResponse.json(
        { error: "markAsWatched must be a boolean" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Verify user is authenticated
    const { data: user } = await supabase.auth.getClaims();
    const currentUserId = user?.claims?.sub;

    if (!currentUserId || currentUserId !== userId) {
      console.error("[Toggle Season] Unauthorized:", { currentUserId, userId });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get today's date for aired episode filtering
    const today = new Date().toISOString().split("T")[0];

    // Get episodes - filter for aired if marking as watched
    let query = supabase
      .from("episodes")
      .select("id, air_date")
      .eq("season_id", seasonId);

    // ✅ ALREADY CORRECT: Only include aired episodes when marking as watched
    if (markAsWatched) {
      query = query.or(`air_date.is.null,air_date.lte.${today}`);
    }

    const { data: episodes, error: episodesError } = await query;

    if (episodesError) {
      console.error("[Toggle Season] Error fetching episodes:", episodesError);
      return NextResponse.json(
        { error: "Failed to fetch episodes", details: episodesError.message },
        { status: 500 },
      );
    }

    if (!episodes || episodes.length === 0) {
      console.error("[Toggle Season] No episodes found for season:", seasonId);
      return NextResponse.json(
        { error: "No episodes found for this season" },
        { status: 404 },
      );
    }

    console.log(
      `[Toggle Season] Found ${episodes.length} ${
        markAsWatched ? "aired" : ""
      } episodes`,
    );

    if (markAsWatched) {
      // OPTIMIZATION: Bulk upsert with single query
      const episodeWatches = episodes.map((ep) => ({
        user_id: userId,
        episode_id: ep.id,
        series_id: seriesId,
        watched_at: new Date().toISOString(),
      }));

      const { error: upsertError } = await supabase
        .from("episode_watches")
        .upsert(episodeWatches, {
          onConflict: "user_id,episode_id",
        });

      if (upsertError) {
        console.error("[Toggle Season] Error marking as watched:", upsertError);
        return NextResponse.json(
          {
            error: "Failed to mark episodes as watched",
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
          "[Toggle Season] Failed to update reel_deck timestamp:",
          updateError,
        );
        // Don't fail the request if this update fails
      }

      console.log(
        `[Toggle Season] Marked ${episodes.length} aired episodes as watched`,
      );
    } else {
      // OPTIMIZATION: Bulk delete with single query
      const episodeIds = episodes.map((ep) => ep.id);

      const { error: deleteError } = await supabase
        .from("episode_watches")
        .delete()
        .eq("user_id", userId)
        .eq("series_id", seriesId)
        .in("episode_id", episodeIds);

      if (deleteError) {
        console.error(
          "[Toggle Season] Error marking as unwatched:",
          deleteError,
        );
        return NextResponse.json(
          {
            error: "Failed to mark episodes as unwatched",
            details: deleteError.message,
          },
          { status: 500 },
        );
      }

      console.log(
        `[Toggle Season] Marked ${episodes.length} episodes as unwatched`,
      );
    }

    // OPTIMIZATION: Return useful metadata
    return NextResponse.json({
      success: true,
      episodesAffected: episodes.length,
      action: markAsWatched ? "watched" : "unwatched",
      airedOnly: markAsWatched, // Only aired when marking as watched
    });
  } catch (error) {
    console.error("[Toggle Season] Unexpected error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
