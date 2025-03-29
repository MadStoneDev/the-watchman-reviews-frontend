import React from "react";

import UserCollectionsBlock from "@/src/components/user-collections-block";
import BrowseNavigation from "@/src/components/browse-navigation";

export default async function ListsPage({
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
          { label: "Lists", href: `/${username}/lists` },
        ]}
      />

      <section
        className={`mt-14 lg:mt-20 transition-all duration-300 ease-in-out`}
      >
        <h1 className={`max-w-60 text-2xl sm:3xl md:text-4xl font-bold`}>
          Lists
        </h1>
      </section>

      <UserCollectionsBlock />
    </>
  );
}
