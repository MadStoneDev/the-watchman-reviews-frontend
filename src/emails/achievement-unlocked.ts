import {
  wrapEmailTemplate,
  emailHeading,
  emailParagraph,
  emailButton,
  emailAccent,
} from "@/src/lib/email";

interface AchievementUnlockedEmailProps {
  achievementName: string;
  achievementDescription: string;
  achievementTier: string;
}

// Tier colors for the badge
const tierColors: Record<string, string> = {
  bronze: "#CD7F32",
  silver: "#C0C0C0",
  gold: "#FFD700",
  platinum: "#E5E4E2",
};

export function achievementUnlockedEmail({
  achievementName,
  achievementDescription,
  achievementTier,
}: AchievementUnlockedEmailProps): { subject: string; html: string } {
  const tierColor = tierColors[achievementTier] || "#B4D429";
  const tierLabel = achievementTier.charAt(0).toUpperCase() + achievementTier.slice(1);

  const content = `
    ${emailHeading("Achievement Unlocked!")}

    <div style="text-align:center;margin:30px 0;">
      <div style="display:inline-block;background:linear-gradient(135deg, ${tierColor}33, ${tierColor}11);border:2px solid ${tierColor};border-radius:16px;padding:30px 40px;">
        <div style="font-size:48px;margin-bottom:10px;">🏆</div>
        <div style="color:${tierColor};font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">${tierLabel}</div>
        <div style="color:#FAFAFA;font-size:24px;font-weight:700;margin-bottom:8px;">${achievementName}</div>
        <div style="color:#A3A3A3;font-size:14px;">${achievementDescription}</div>
      </div>
    </div>

    ${emailParagraph(`Congratulations! You've earned the ${emailAccent(achievementName)} achievement.`)}
    ${emailParagraph("Keep tracking your shows to unlock more achievements!")}
    ${emailButton("View All Achievements", "https://justreel.app/achievements")}
  `;

  return {
    subject: `Achievement Unlocked: ${achievementName}`,
    html: wrapEmailTemplate(content),
  };
}
