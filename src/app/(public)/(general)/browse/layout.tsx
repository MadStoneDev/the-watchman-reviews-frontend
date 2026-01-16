import React from "react";

import BrowseNavigation from "@/src/components/browse-navigation";

export default function BrowseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
