import React from "react";
import type { Metadata } from "next";

import BrowseNavigation from "@/src/components/browse-navigation";
import SpecialBlockWrapper from "@/src/components/special-block-wrapper";

export const metadata: Metadata = {
  title: "JustReel | Guarding Your Screen, Guiding Your Choices",
  description:
    "Guiding families and groups to make informed viewing choices. Get detailed content analysis of movies and TV shows, including themes, language, and values.",
};

async function getStrapiData(path: string) {
  const baseUrl = "http://localhost:1337";
  try {
    const response = await fetch(`${baseUrl}${path}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export default async function Home() {
  // const strapiData = await getStrapiData("/api/home-page");
  // console.log(strapiData);
  //
  // const { title, description } = strapiData.data.attributes;

  const elements = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <>
      <BrowseNavigation
        items={[
          { label: "New", href: "/browse/new" },
          { label: "Movies", href: "/browse/movies" },
          { label: "Series", href: "/browse/series" },
          { label: "Kids", href: "/browse/kids" },
          // {label: "Popular", href: "/browse/popular"},
          // {label: "Trending", href: "/browse/trending"},
        ]}
      />

      <section
        className={`mt-6 lg:mt-8 mb-6 transition-all duration-300 ease-in-out`}
      >
        <h1 className={`max-w-64 text-2xl sm:3xl md:text-4xl font-bold`}>
          What to Watch Next?
        </h1>
        <p className={`mt-6 max-w-72 text-base font-semibold text-neutral-400`}>
          Browse through our reviews on popular movies and TV shows
        </p>
      </section>
    </>
  );
}
