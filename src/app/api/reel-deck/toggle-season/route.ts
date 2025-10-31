import { createClient } from "@/src/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { seasonId, seriesId, userId, markAsWatched } = await request.json();

    console.log("Toggle season request:", {
      seasonId,
      seriesId,
      userId,
      markAsWatched,
    });

    if (
      !seasonId ||
      !seriesId ||
      !userId ||
      typeof markAsWatched !== "boolean"
    ) {
      console.error("Missing required fields:", {
        seasonId,
        seriesId,
        userId,
        markAsWatched,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Verify user is authenticated
    const { data: user } = await supabase.auth.getClaims();
    const currentUserId = user?.claims?.sub;

    if (!currentUserId || currentUserId !== userId) {
      console.error("Unauthorized:", { currentUserId, userId });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all episodes for this season
    const { data: episodes, error: episodesError } = await supabase
      .from("episodes")
      .select("id")
      .eq("season_id", seasonId);

    if (episodesError) {
      console.error("Error fetching episodes:", episodesError);
      return NextResponse.json(
        { error: "Failed to fetch episodes", details: episodesError.message },
        { status: 500 },
      );
    }

    if (!episodes || episodes.length === 0) {
      console.error("No episodes found for season:", seasonId);
      return NextResponse.json(
        { error: "No episodes found for this season" },
        { status: 404 },
      );
    }

    console.log(`Found ${episodes.length} episodes for season ${seasonId}`);

    if (markAsWatched) {
      // Mark all episodes as watched - bulk insert/update
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
        console.error("Error marking episodes as watched:", upsertError);
        return NextResponse.json(
          {
            error: "Failed to mark episodes as watched",
            details: upsertError.message,
          },
          { status: 500 },
        );
      }

      console.log(`Successfully marked ${episodes.length} episodes as watched`);
    } else {
      // Mark all episodes as unwatched - bulk delete
      const episodeIds = episodes.map((ep) => ep.id);

      const { error: deleteError } = await supabase
        .from("episode_watches")
        .delete()
        .eq("user_id", userId)
        .eq("series_id", seriesId)
        .in("episode_id", episodeIds);

      if (deleteError) {
        console.error("Error marking episodes as unwatched:", deleteError);
        return NextResponse.json(
          {
            error: "Failed to mark episodes as unwatched",
            details: deleteError.message,
          },
          { status: 500 },
        );
      }

      console.log(
        `Successfully marked ${episodes.length} episodes as unwatched`,
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in toggle-season route:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
