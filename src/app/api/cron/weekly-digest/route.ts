import { NextRequest, NextResponse } from "next/server";
import {
  getUsersForWeeklyDigest,
  sendWeeklyDigestEmail,
} from "@/src/app/actions/email-notifications";

// Batch size for sending emails to avoid overwhelming the email service
const BATCH_SIZE = 10;
// Delay between batches in milliseconds
const BATCH_DELAY_MS = 1000;

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

    // Process users in batches
    for (let i = 0; i < userIds.length; i += BATCH_SIZE) {
      const batch = userIds.slice(i, i + BATCH_SIZE);

      // Send emails for this batch in parallel
      const results = await Promise.all(
        batch.map(async (userId) => {
          try {
            const result = await sendWeeklyDigestEmail(userId);
            return result.success;
          } catch (error) {
            console.error(`[WeeklyDigest] Error sending to user ${userId}:`, error);
            return false;
          }
        })
      );

      // Count successes and failures
      results.forEach((success) => {
        if (success) {
          sent++;
        } else {
          failed++;
        }
      });

      // Delay between batches to avoid rate limiting
      if (i + BATCH_SIZE < userIds.length) {
        await delay(BATCH_DELAY_MS);
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
