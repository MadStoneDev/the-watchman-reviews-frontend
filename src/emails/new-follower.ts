import {
  wrapEmailTemplate,
  emailHeading,
  emailParagraph,
  emailButton,
  emailAccent,
} from "@/src/lib/email";

interface NewFollowerEmailProps {
  followerUsername: string;
  followerAvatarUrl?: string | null;
}

export function newFollowerEmail({
  followerUsername,
}: NewFollowerEmailProps): { subject: string; html: string } {
  const content = `
    ${emailHeading("You have a new follower!")}
    ${emailParagraph(`${emailAccent(followerUsername)} started following you on Just Reel.`)}
    ${emailParagraph("Check out their profile and see what they're watching.")}
    ${emailButton("View Profile", `https://justreel.app/u/${followerUsername}`)}
    ${emailParagraph("Keep tracking and sharing your favorite shows!")}
  `;

  return {
    subject: `${followerUsername} started following you on Just Reel`,
    html: wrapEmailTemplate(content),
  };
}
