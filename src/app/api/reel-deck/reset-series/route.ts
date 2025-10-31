import { createClient } from "@/src/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { seriesId, userId } = await request.json();

    if (!seriesId || !userId) {
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

    // Delete all episode watches for this entire series
    const { error: deleteError } = await supabase
      .from("episode_watches")
      .delete()
      .eq("user_id", userId)
      .eq("series_id", seriesId);

    if (deleteError) {
      console.error("Error deleting episode watches:", deleteError);
      return NextResponse.json(
        { error: "Failed to reset series progress" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in reset-series route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
