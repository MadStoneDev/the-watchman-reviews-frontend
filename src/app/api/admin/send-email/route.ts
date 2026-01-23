import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/src/utils/supabase/server";
import { createAdminClient } from "@/src/utils/supabase/admin";
import { sendEmail } from "@/src/lib/email";
import { founderMessageEmail } from "@/src/emails/manual/founder-message";

interface ChangelogItem {
  type: "new" | "fix" | "improvement";
  text: string;
}

interface EmailData {
  subject: string;
  greeting: string;
  message: string;
  signOff: string;
  founderName: string;
  changelog?: ChangelogItem[];
  ctaText?: string;
  ctaUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role < 10) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse request body
    const { recipientType, recipientId, emailData } = (await request.json()) as {
      recipientType: "all" | "single";
      recipientId?: string;
      emailData: EmailData;
    };

    // Validate input
    if (!emailData.message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (recipientType === "single" && !recipientId) {
      return NextResponse.json(
        { error: "Recipient ID is required for single recipient" },
        { status: 400 }
      );
    }

    // Use admin client to access auth.users for emails
    const adminClient = createAdminClient();

    let recipients: { id: string; username: string; email: string }[] = [];

    if (recipientType === "single") {
      // Get single user
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, username")
        .eq("id", recipientId)
        .single();

      if (!profile) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      // Get email from auth.users
      const { data: authUser } = await adminClient.auth.admin.getUserById(
        recipientId!
      );

      if (!authUser.user?.email) {
        return NextResponse.json(
          { error: "User email not found" },
          { status: 404 }
        );
      }

      recipients = [
        {
          id: profile.id,
          username: profile.username,
          email: authUser.user.email,
        },
      ];
    } else {
      // Get all users with email notifications enabled (or all if not checking settings)
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username");

      if (!profiles || profiles.length === 0) {
        return NextResponse.json({ error: "No users found" }, { status: 404 });
      }

      // Get emails for all users - batch by 50 to avoid rate limits
      const { data: authUsers } = await adminClient.auth.admin.listUsers({
        perPage: 1000,
      });

      const emailMap = new Map(
        authUsers.users.map((u) => [u.id, u.email])
      );

      recipients = profiles
        .map((p) => ({
          id: p.id,
          username: p.username,
          email: emailMap.get(p.id) || "",
        }))
        .filter((r) => r.email); // Only include users with valid emails
    }

    // Send emails
    let sentCount = 0;
    const errors: string[] = [];

    for (const recipient of recipients) {
      try {
        // Generate personalized email
        const personalizedGreeting = emailData.greeting.replace(
          /\{\{username\}\}/g,
          recipient.username
        );

        const { subject, html } = founderMessageEmail({
          username: recipient.username,
          subject: emailData.subject,
          greeting: personalizedGreeting,
          message: emailData.message,
          signOff: emailData.signOff,
          founderName: emailData.founderName,
          changelog: emailData.changelog,
          ctaText: emailData.ctaText,
          ctaUrl: emailData.ctaUrl,
        });

        const result = await sendEmail({
          to: recipient.email,
          subject,
          html,
        });

        if (result.success) {
          sentCount++;
        } else {
          errors.push(`${recipient.username}: ${result.error}`);
        }

        // Delay to avoid rate limiting
        if (recipients.length > 1) {
          await new Promise((resolve) => setTimeout(resolve, 600));
        }
      } catch (error) {
        errors.push(
          `${recipient.username}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    console.log(
      `[Admin Email] Sent ${sentCount}/${recipients.length} emails by admin ${user.id}`
    );

    if (errors.length > 0) {
      console.error("[Admin Email] Errors:", errors);
    }

    // Save email to history for future reference
    try {
      await supabase.from("sent_emails").insert({
        subject: emailData.subject,
        greeting: emailData.greeting,
        message: emailData.message,
        sign_off: emailData.signOff,
        founder_name: emailData.founderName,
        cta_text: emailData.ctaText || null,
        cta_url: emailData.ctaUrl || null,
        changelog: emailData.changelog || null,
        recipient_type: recipientType,
        recipient_count: sentCount,
        sent_by: user.id,
      });
    } catch (saveError) {
      console.error("[Admin Email] Failed to save email history:", saveError);
      // Don't fail the request if history save fails
    }

    return NextResponse.json({
      success: true,
      sentCount,
      totalRecipients: recipients.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("[Admin Email] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
