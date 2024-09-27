import React from "react";
import type { Metadata } from "next";

import BrowseNavigation from "@/components/browse-navigation";
import {
  IconBed,
  IconFlame,
  IconGhost2,
  IconStarFilled,
  IconSwords,
  IconUsers,
} from "@tabler/icons-react";
import { StatBlock } from "@/components/media-block";
import SpecialMediaBlock from "@/components/special-media-block";
import SpecialBlockWrapper from "@/components/special-block-wrapper";

export const metadata: Metadata = {
  title: "The Watchman Reviews | Guarding Your Screen, Guiding Your Choices",
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
        className={`mt-14 lg:mt-20 mb-6 transition-all duration-300 ease-in-out`}
      >
        <h1 className={`max-w-64 text-2xl sm:3xl md:text-4xl font-bold`}>
          What to Watch Next?
        </h1>
        <p className={`mt-6 max-w-72 text-base font-semibold text-neutral-400`}>
          Browse through our reviews on popular movies and TV shows
        </p>
      </section>

      <section
        className={`flex flex-nowrap items-center justify-between gap-3 transition-all duration-300 ease-in-out`}
      >
        <SpecialBlockWrapper />
      </section>
    </>
  );
}
