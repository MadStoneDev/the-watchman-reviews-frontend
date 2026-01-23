import { founderMessageEmail } from "@/src/emails/manual/founder-message";

export default async function FounderMessageTest() {
  const { html } = founderMessageEmail({
    username: "KingArthur",
    subject: "A quick thank you from JustReel 💚",
    greeting: "Hey KingArthur 👋",
    message: `I wanted to take a moment to personally thank you for being part of JustReel.

You may have noticed a few extra emails landing in your inbox lately - that was my fault! I was configuring our new weekly digest feature and got the timing wrong on our scheduled jobs. Oops! 😅

The good news? It's all sorted now, and your inbox should be back to normal.

Your patience and support mean everything as we continue to improve the platform. We're a small team with big dreams, and users like you make it all worthwhile.`,
    signOff: "Thanks for being awesome!",
    founderName: "Arthur",
    changelog: [
      {
        type: "new",
        text: "Weekly Digest emails - get a recap of your watching activity every Friday",
      },
      {
        type: "new",
        text: "Most Watched Show tracking - see which show you binged the most",
      },
      {
        type: "improvement",
        text: "Faster episode loading on TV series pages",
      },
      {
        type: "fix",
        text: "Fixed email scheduling (no more spam, I promise!)",
      },
      {
        type: "fix",
        text: "Button loading states now show properly across the app",
      },
    ],
    ctaText: "Explore JustReel",
    ctaUrl: "https://justreel.app",
  });

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
