import {
  wrapEmailTemplate,
  emailHeading,
  emailParagraph,
  emailButton,
  emailAccent,
} from "@/src/lib/email";

interface NewMutualEmailProps {
  mutualUsername: string;
}

export function newMutualEmail({
  mutualUsername,
}: NewMutualEmailProps): { subject: string; html: string } {
  const content = `
    ${emailHeading("You're now mutuals!")}
    ${emailParagraph(`You and ${emailAccent(mutualUsername)} are now following each other on Just Reel.`)}
    ${emailParagraph("As mutuals, you can now send each other direct messages. Why not say hello?")}
    ${emailButton("Start a Conversation", `https://justreel.app/messages`)}
    ${emailParagraph("Happy watching!")}
  `;

  return {
    subject: `You and ${mutualUsername} are now mutuals on Just Reel`,
    html: wrapEmailTemplate(content),
  };
}
