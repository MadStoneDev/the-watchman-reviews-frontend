import { NextRequest, NextResponse } from "next/server";
import {
  getUsersForWeeklyDigest,
  sendWeeklyDigestEmail,
} from "@/src/app/actions/email-notifications";

// Resend free tier: max 2 requests per second
// Send emails one at a time with delay to stay under limit
const DELAY_BETWEEN_EMAILS_MS = 600; // 600ms = ~1.6 emails/sec, safely under 2/sec

/**
 * Helper to delay execution
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("[WeeklyDigest] Starting weekly digest job...");

    // Get all users who have weekly digest enabled
    const userIds = await getUsersForWeeklyDigest();
    console.log(`[WeeklyDigest] Found ${userIds.length} users for digest`);

    if (userIds.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No users to send digest to",
        stats: { total: 0, sent: 0, failed: 0 },
        timestamp: new Date().toISOString(),
      });
    }

    let sent = 0;
    let failed = 0;

    // Process users sequentially with delay to respect Resend rate limits
    for (let i = 0; i < userIds.length; i++) {
      const userId = userIds[i];

      try {
        const result = await sendWeeklyDigestEmail(userId);
        if (result.success) {
          sent++;
        } else {
          failed++;
          console.error(`[WeeklyDigest] Failed for user ${userId}:`, result.error);
        }
      } catch (error) {
        console.error(`[WeeklyDigest] Error sending to user ${userId}:`, error);
        failed++;
      }

      // Delay between emails to stay under rate limit (except after last email)
      if (i < userIds.length - 1) {
        await delay(DELAY_BETWEEN_EMAILS_MS);
      }
    }

    console.log(`[WeeklyDigest] Completed: ${sent} sent, ${failed} failed`);

    return NextResponse.json({
      success: true,
      message: "Weekly digest job completed",
      stats: {
        total: userIds.length,
        sent,
        failed,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[WeeklyDigest] Error running weekly digest:", error);
    return NextResponse.json(
      { error: "Failed to run weekly digest" },
      { status: 500 }
    );
  }
}

// Also support POST for flexibility
export async function POST(request: NextRequest) {
  return GET(request);
}
