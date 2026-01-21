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

    // Call the start_rewatch_cycle function
    // This will: mark current cycle as completed, create new cycle, clear episode watches
    const { data: newCycleId, error: rpcError } = await supabase.rpc(
      "start_rewatch_cycle",
      {
        p_user_id: userId,
        p_series_id: seriesId,
      },
    );

    if (rpcError) {
      console.error("Error starting rewatch cycle:", rpcError);
      return NextResponse.json(
        { error: "Failed to start rewatch" },
        { status: 500 },
      );
    }

    // Get the new cycle details to return
    const { data: cycleData, error: cycleError } = await supabase
      .from("watch_cycles")
      .select("id, cycle_number, started_at, status")
      .eq("id", newCycleId)
      .single();

    if (cycleError) {
      console.error("Error fetching new cycle:", cycleError);
      // Still return success since the rewatch was started
      return NextResponse.json({
        success: true,
        cycleId: newCycleId,
      });
    }

    return NextResponse.json({
      success: true,
      cycle: cycleData,
    });
  } catch (error) {
    console.error("Error in start-rewatch route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
