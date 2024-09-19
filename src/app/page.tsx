import React from "react";
import BrowseNavigation from "@/components/BrowseNavigation";
import type { Metadata } from "next";

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
  const strapiData = await getStrapiData("/api/home-page");
  console.log(strapiData);

  const { title, description } = strapiData.data.attributes;

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

      <section className={`mt-20`}>
        <h1 className={`max-w-60 text-4xl font-bold`}>{title}</h1>
        <p className={`mt-6 max-w-64 text-base font-bold text-neutral-400`}>
          {description}
        </p>
      </section>
    </>
  );
}
