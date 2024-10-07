import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`grid md:grid-cols-2 md:items-center md:justify-center w-full min-h-screen bg-neutral-800`}
    >
      <section className={`hidden md:block h-full bg-lime-400`}></section>
      <main
        className={`col-span-2 md:col-span-1 p-3 sm:p-6 flex flex-col justify-center items-center w-full text-center`}
      >
        {children}
      </main>
    </div>
  );
}
