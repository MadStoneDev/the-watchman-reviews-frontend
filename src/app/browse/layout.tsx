import React from "react";

import BrowseNavigation from "@/components/browse-navigation";

export default function BrowseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <BrowseNavigation
        items={[
          // { label: "New", href: "/browse/new" },
          { label: "Movies", href: "/browse/movies" },
          { label: "Series", href: "/browse/series" },
          { label: "Kids", href: "/browse/kids" },
          // {label: "Popular", href: "/browse/popular"},
          // {label: "Trending", href: "/browse/trending"},
        ]}
      />

      {children}
    </>
  );
}
