import React from "react";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`px-5 md:px-10 pt-5 md:pt-10 flex-grow`}>{children}</div>
  );
}
