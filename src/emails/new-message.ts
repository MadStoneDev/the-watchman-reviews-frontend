import {
  wrapEmailTemplate,
  emailHeading,
  emailParagraph,
  emailButton,
  emailAccent,
  emailDivider,
} from "@/src/lib/email";

interface NewMessageEmailProps {
  senderUsername: string;
  messagePreview: string;
}

export function newMessageEmail({
  senderUsername,
  messagePreview,
}: NewMessageEmailProps): { subject: string; html: string } {
  // Truncate message preview to 100 characters
  const truncatedPreview =
    messagePreview.length > 100
      ? messagePreview.substring(0, 100) + "..."
      : messagePreview;

  const content = `
    ${emailHeading("New message received")}
    ${emailParagraph(`${emailAccent(senderUsername)} sent you a message:`)}
    <div style="background-color:#171717;border-radius:6px;padding:20px;margin:20px 0;border-left:3px solid #B4D429;">
      <p style="color:#FAFAFA;margin:0;font-size:16px;line-height:24px;font-style:italic;">"${truncatedPreview}"</p>
    </div>
    ${emailButton("View Conversation", `https://justreel.app/messages`)}
    ${emailDivider()}
    <p style="color:#666;font-size:12px;margin:0;">You won't receive another message notification for 1 hour to avoid spam.</p>
  `;

  return {
    subject: `${senderUsername} sent you a message on Just Reel`,
    html: wrapEmailTemplate(content),
  };
}
