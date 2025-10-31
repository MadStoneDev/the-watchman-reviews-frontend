import { createClient } from "@/src/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { episodeId, seriesId, userId, isWatched } = await request.json();

    console.log("Toggle episode request:", {
      episodeId,
      seriesId,
      userId,
      isWatched,
    });

    if (!episodeId || !seriesId || !userId || typeof isWatched !== "boolean") {
      console.error("Missing required fields:", {
        episodeId,
        seriesId,
        userId,
        isWatched,
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

    if (isWatched) {
      // Mark as watched - insert or update
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
        console.error("Error inserting episode watch:", upsertError);
        return NextResponse.json(
          {
            error: "Failed to mark episode as watched",
            details: upsertError.message,
          },
          { status: 500 },
        );
      }

      console.log("Successfully marked episode as watched");
    } else {
      // Mark as unwatched - delete
      const { error: deleteError } = await supabase
        .from("episode_watches")
        .delete()
        .eq("user_id", userId)
        .eq("episode_id", episodeId);

      if (deleteError) {
        console.error("Error deleting episode watch:", deleteError);
        return NextResponse.json(
          {
            error: "Failed to mark episode as unwatched",
            details: deleteError.message,
          },
          { status: 500 },
        );
      }

      console.log("Successfully marked episode as unwatched");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in toggle-episode route:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
