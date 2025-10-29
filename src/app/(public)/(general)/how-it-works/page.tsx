import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statistics | JustReel",
  description:
    "Guiding families and groups to make informed viewing choices. Get detailed content analysis of movies and TV shows, including themes, language, and values.",
};

export default function StatisticsPage() {
  return (
    <>
      <section
        className={`mt-14 lg:mt-20 transition-all duration-300 ease-in-out`}
      >
        <h1 className={`max-w-60 text-2xl sm:3xl md:text-4xl font-bold`}>
          How It Works
        </h1>
      </section>

      <section
        className={`mt-14 lg:mt-20 transition-all duration-300 ease-in-out`}
      ></section>
    </>
  );
}
