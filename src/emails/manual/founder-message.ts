import {
  wrapEmailTemplate,
  emailHeading,
  emailParagraph,
  emailButton,
  emailAccent,
  emailDivider,
} from "@/src/lib/email";

interface ChangelogItem {
  type: "new" | "fix" | "improvement";
  text: string;
}

interface FounderMessageEmailProps {
  username: string;
  subject: string;
  greeting?: string;
  message: string;
  signOff?: string;
  founderName?: string;
  changelog?: ChangelogItem[];
  ctaText?: string;
  ctaUrl?: string;
}

function changelogIcon(type: ChangelogItem["type"]): string {
  switch (type) {
    case "new":
      return "✨";
    case "fix":
      return "🔧";
    case "improvement":
      return "⚡";
    default:
      return "•";
  }
}

function changelogBadge(type: ChangelogItem["type"]): string {
  const colors = {
    new: { bg: "#B4D429", text: "#171717" },
    fix: { bg: "#f59e0b", text: "#171717" },
    improvement: { bg: "#3b82f6", text: "#FAFAFA" },
  };
  const color = colors[type];
  const label = type.charAt(0).toUpperCase() + type.slice(1);

  return `<span style="display:inline-block;background:${color.bg};color:${color.text};font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;text-transform:uppercase;letter-spacing:0.5px;margin-right:8px;">${label}</span>`;
}

function changelogSection(items: ChangelogItem[]): string {
  if (!items || items.length === 0) return "";

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #333;">
          <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">
            <tr>
              <td style="vertical-align:middle;">
                ${changelogBadge(item.type)}
                <span style="color:#FAFAFA;font-size:14px;line-height:20px;">${item.text}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `,
    )
    .join("");

  return `
    ${emailDivider()}
    <h2 style="color:#FAFAFA;font-size:18px;font-weight:600;margin:0 0 16px 0;">🚀 What's New in JustReel</h2>
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;background:#171717;border-radius:12px;overflow:hidden;margin-bottom:20px;">
      <tr>
        <td style="padding:6px 16px;">
          <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">
            ${itemsHtml}
          </table>
        </td>
      </tr>
    </table>
  `;
}

export function founderMessageEmail({
  username,
  subject,
  greeting,
  message,
  signOff = "Thanks for being part of the JustReel community!",
  founderName = "Arthur",
  changelog,
  ctaText,
  ctaUrl,
}: FounderMessageEmailProps): { subject: string; html: string } {
  // Convert message line breaks to <br> tags
  const formattedMessage = message
    .split("\n\n")
    .map((para) => emailParagraph(para.replace(/\n/g, "<br>")))
    .join("");

  const ctaSection =
    ctaText && ctaUrl
      ? `
      <div style="text-align:center;margin-top:24px;">
        ${emailButton(ctaText, ctaUrl)}
      </div>
    `
      : "";

  const content = `
    ${emailHeading(greeting || `Hey ${username} 👋`)}

    ${formattedMessage}

    ${changelog && changelog.length > 0 ? changelogSection(changelog) : ""}

    ${ctaSection}

    ${emailDivider()}

    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;margin-top:20px;">
      <tr>
        <td style="vertical-align:top;width:50px;">
          <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#B4D429 0%,#8fb320 100%);display:flex;align-items:center;justify-content:center;">
            <span style="color:#171717;font-weight:700;font-size:18px;line-height:44px;text-align:center;display:block;width:100%;">A</span>
          </div>
        </td>
        <td style="vertical-align:middle;padding-left:12px;">
          <div style="color:#FAFAFA;font-size:14px;line-height:20px;">${signOff}</div>
          <div style="color:#B4D429;font-weight:600;font-size:14px;margin-top:2px;">${founderName}</div>
          <div style="color:#737373;font-size:12px;">Founder, JustReel</div>
        </td>
      </tr>
    </table>

    <p style="color:#525252;font-size:12px;text-align:center;margin-top:28px;">
      This is a personal message from the JustReel team. 💚
    </p>
  `;

  return {
    subject,
    html: wrapEmailTemplate(content),
  };
}

// Pre-built template for common scenarios
export const EMAIL_TEMPLATES = {
  thankYou: {
    id: "thank-you",
    name: "Thank You Message",
    description: "Thank users for their patience/support",
    defaults: {
      subject: "A quick thank you from JustReel 💚",
      greeting: "Hey {{username}} 👋",
      message: `I wanted to take a moment to personally thank you for being part of JustReel.

Your patience and support mean everything as we continue to improve the platform. We're a small team with big dreams, and users like you make it all worthwhile.

If you ever have feedback or just want to say hi, feel free to reply to this email - I read every single one.`,
      signOff: "Thanks for being awesome!",
    },
  },
  announcement: {
    id: "announcement",
    name: "Feature Announcement",
    description: "Announce new features or updates",
    defaults: {
      subject: "Something new is brewing at JustReel ✨",
      greeting: "Hey {{username}} 👋",
      message: `Exciting news! We've been working hard on some new features and I couldn't wait to share them with you.`,
      signOff: "Happy watching!",
      ctaText: "Check It Out",
      ctaUrl: "https://justreel.app",
    },
  },
  apology: {
    id: "apology",
    name: "Service Apology",
    description: "Apologize for issues or downtime",
    defaults: {
      subject: "A quick note about recent issues",
      greeting: "Hey {{username}} 👋",
      message: `I wanted to reach out personally about some recent hiccups you may have experienced.

We take reliability seriously, and I'm sorry for any inconvenience this may have caused. The issue has been identified and fixed.

Thank you for your patience and understanding.`,
      signOff: "We appreciate you sticking with us!",
    },
  },
};
