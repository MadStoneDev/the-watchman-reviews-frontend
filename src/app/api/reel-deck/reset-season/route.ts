import { createClient } from "@/src/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { seasonId, seriesId, userId } = await request.json();

    if (!seasonId || !seriesId || !userId) {
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all episode IDs for this season
    const { data: episodes, error: episodesError } = await supabase
      .from("episodes")
      .select("id")
      .eq("season_id", seasonId);

    if (episodesError) {
      console.error("Error fetching episodes:", episodesError);
      return NextResponse.json(
        { error: "Failed to fetch episodes" },
        { status: 500 },
      );
    }

    if (!episodes || episodes.length === 0) {
      return NextResponse.json(
        { error: "No episodes found for this season" },
        { status: 404 },
      );
    }

    const episodeIds = episodes.map((ep) => ep.id);

    // Delete all episode watches for this season
    const { error: deleteError } = await supabase
      .from("episode_watches")
      .delete()
      .eq("user_id", userId)
      .eq("series_id", seriesId)
      .in("episode_id", episodeIds);

    if (deleteError) {
      console.error("Error deleting episode watches:", deleteError);
      return NextResponse.json(
        { error: "Failed to reset season progress" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in reset-season route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
