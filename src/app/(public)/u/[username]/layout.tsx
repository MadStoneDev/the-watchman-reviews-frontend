import React from "react";

export default function PublicProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-4 md:px-6 lg:px-8 max-w-6xl mx-auto w-full">
      {children}
    </div>
  );
}
