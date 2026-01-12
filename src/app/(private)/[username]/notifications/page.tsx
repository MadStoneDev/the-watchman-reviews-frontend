import React from "react";
import BrowseNavigation from "@/src/components/browse-navigation";

export default async function NotificationsPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return (
    <>
      <BrowseNavigation
        items={[
          { label: "Account", href: `/${username}` },
          {
            label: "Collections",
            href: `/${username}/collections`,
              textColor: `hover:text-indigo-500`, bgColor: `bg-indigo-500`,
          },
        ]}
      />

      <section
        className={`mt-6 lg:mt-8 transition-all duration-300 ease-in-out`}
      >
        <h1 className={`max-w-60 text-2xl sm:3xl md:text-4xl font-bold`}>
          Notifications
        </h1>
      </section>

      <p className={`mt-4 text-sm text-neutral-400 italic`}>Coming soon.</p>
    </>
  );
}
