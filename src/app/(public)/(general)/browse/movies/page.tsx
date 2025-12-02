import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movies | JustReel",
  description:
    "Guiding families and groups to make informed viewing choices. Get detailed content analysis of movies and TV shows, including themes, language, and values.",
};

export default function MoviesPage() {
  return (
    <>
      <section
        className={`mt-6 lg:mt-8 transition-all duration-300 ease-in-out`}
      >
        <h1 className={`max-w-60 text-2xl sm:3xl md:text-4xl font-bold`}>
          Movies
        </h1>
      </section>
    </>
  );
}
