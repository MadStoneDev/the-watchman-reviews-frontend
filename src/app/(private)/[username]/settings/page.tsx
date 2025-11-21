import React from "react";
import BrowseNavigation from "@/src/components/browse-navigation";

export default async function SettingsPage({
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
            color: `indigo-500`,
          },
        ]}
      />
      <section
        className={`mt-14 lg:mt-20 mb-6 transition-all duration-300 ease-in-out`}
      >
        <h1 className={`max-w-3xl text-2xl sm:3xl md:text-4xl font-bold`}>
          Settings
        </h1>
      </section>
    </>
  );
}
