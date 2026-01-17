import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Call the refresh_all_leaderboards function in Supabase
    // This function must be created in Supabase (see SQL below)
    const { data, error } = await supabaseAdmin.rpc("refresh_all_leaderboards");

    if (error) {
      console.error("[Cron] Error refreshing leaderboards:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          hint: "Make sure the refresh_all_leaderboards function exists in Supabase",
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "All leaderboards refreshed successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Cron] Error refreshing leaderboards:", error);
    return NextResponse.json(
      { error: "Failed to refresh leaderboards" },
      { status: 500 }
    );
  }
}

// Also support POST for flexibility
export async function POST(request: NextRequest) {
  return GET(request);
}
