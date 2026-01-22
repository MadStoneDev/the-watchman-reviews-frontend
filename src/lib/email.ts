import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_FROM = process.env.EMAIL_FROM || "JustReel <notifications@justreel.app>";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("[Email] Failed to send email:", error);
      return { success: false, error: error.message };
    }

    console.log("[Email] Email sent successfully:", data?.id);
    return { success: true };
  } catch (error) {
    console.error("[Email] Error sending email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

/**
 * Base email template with shared header/footer
 */
export function wrapEmailTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JustReel</title>
    <style type="text/css">
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

        @media only screen and (max-width: 640px) {
            .ms-content {
                width: 100% !important;
                border-radius: 0;
            }
            .ms-content-body {
                padding: 30px !important;
            }
        }
    </style>
</head>
<body style="font-family:'Outfit', Helvetica, Arial, sans-serif; width: 100% !important; height: 100%; margin: 0; padding: 0; -webkit-text-size-adjust: none; background-color: #171717; color: #FAFAFA;">
    <table class="ms-body" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;background-color:#171717;width:100%;margin:0;padding:0;">
        <tr>
            <td align="center" style="word-break:break-word;font-family:'Outfit', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;">
                <table class="ms-container" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;margin:0;padding:0;">
                    <tr>
                        <td align="center" style="word-break:break-word;font-family:'Outfit', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;">
                            <table class="ms-header" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                <tr>
                                    <td height="40" style="font-size:0px;line-height:0px;word-break:break-word;font-family:'Outfit', Helvetica, Arial, sans-serif;">
                                        &nbsp;
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="word-break:break-word;font-family:'Outfit', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;">
                            <table class="ms-content" width="640" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;width:640px;margin:0 auto;padding:0;background-color:#262626;border-radius:6px;box-shadow:0 3px 6px 0 rgba(0,0,0,.05);">
                                <tr>
                                    <td class="ms-content-body" style="word-break:break-word;font-family:'Outfit', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;padding:40px 50px;">
                                        ${content}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="word-break:break-word;font-family:'Outfit', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;">
                            <table class="ms-footer" width="640" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;width:640px;margin:0 auto;">
                                <tr>
                                    <td class="ms-content-body" align="center" style="word-break:break-word;font-family:'Outfit', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;padding:40px 50px;">
                                        <p style="margin:20px 0;color:#96a2b3;font-size:14px;line-height:21px;">
                                            &copy; ${new Date().getFullYear()} <a href="https://justreel.app" style="font-weight: bold; text-decoration: none; color: #B4D429;">Just Reel</a>. All rights reserved.
                                        </p>
                                        <p style="margin:10px 0;color:#666;font-size:12px;line-height:18px;">
                                            <a href="https://justreel.app/settings" style="color: #666; text-decoration: underline;">Manage notification preferences</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `.trim();
}

/**
 * Create a CTA button for emails
 */
export function emailButton(text: string, href: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">
        <tr>
            <td align="center" style="padding:20px 0;">
                <a href="${href}" style="display:inline-block;background-color:#B4D429;color:#171717;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:16px;">${text}</a>
            </td>
        </tr>
    </table>
  `;
}

/**
 * Create a styled heading
 */
export function emailHeading(text: string): string {
  return `<h1 style="margin-top:0;color:#FAFAFA;font-size:24px;line-height:36px;font-weight:600;margin-bottom:24px;">${text}</h1>`;
}

/**
 * Create a styled paragraph
 */
export function emailParagraph(text: string): string {
  return `<p style="color:#FAFAFA;margin:20px 0;font-size:16px;line-height:28px;">${text}</p>`;
}

/**
 * Create an accent-colored text
 */
export function emailAccent(text: string): string {
  return `<span style="color:#B4D429;font-weight:600;">${text}</span>`;
}

/**
 * Create a divider
 */
export function emailDivider(): string {
  return `
    <table width="100%" style="border-collapse:collapse;">
        <tr>
            <td height="20" style="font-size:0px;line-height:0px;">&nbsp;</td>
        </tr>
        <tr>
            <td height="1" style="font-size:0px;line-height:0px;border-top:1px solid #444;">&nbsp;</td>
        </tr>
        <tr>
            <td height="20" style="font-size:0px;line-height:0px;">&nbsp;</td>
        </tr>
    </table>
  `;
}
