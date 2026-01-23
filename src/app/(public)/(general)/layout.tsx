import React from "react";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`px-5 lg:px-10 pt-3 lg:pt-10 grow`}>{children}</div>;
}
