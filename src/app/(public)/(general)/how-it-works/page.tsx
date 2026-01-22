import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works | JustReel",
  description:
    "Learn how JustReel helps you track, collaborate and discuss Movies and TV Shows with friends and family.",
};

export default function StatisticsPage() {
  return (
    <>
      <section
        className={`mt-6 lg:mt-8 transition-all duration-300 ease-in-out`}
      >
        <h1 className={`max-w-60 text-2xl sm:3xl md:text-4xl font-bold`}>
          How It Works
        </h1>
      </section>

      <section
        className={`mt-6 lg:mt-8 transition-all duration-300 ease-in-out`}
      ></section>
    </>
  );
}
