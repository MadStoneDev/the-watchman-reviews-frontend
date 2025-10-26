import React from "react";
import type { Metadata } from "next";
import SpecialBlockWrapper from "@/src/components/special-block-wrapper";
import { Popcorn } from "lucide-react";
import Image from "next/image";
import { IconStarFilled } from "@tabler/icons-react";
import { BrowseMediaRow } from "@/src/components/browse-media-row";

export const metadata: Metadata = {
  title: "Browse | JustReel",
  description:
    "Guiding families and groups to make informed viewing choices. Get detailed content analysis of movies and TV shows, including themes, language, and values.",
};

export default function BrowsePage() {
  return (
    <>
      <section
        className={`mt-14 lg:mt-20 transition-all duration-300 ease-in-out`}
      >
        <h1 className={`max-w-60 text-2xl sm:3xl md:text-4xl font-bold`}>
          Browse
        </h1>
      </section>

      <div
        className={`mt-8 flex flex-nowrap items-center justify-between gap-2 transition-all duration-300 ease-in-out`}
      >
        <SpecialBlockWrapper />
      </div>

      <BrowseMediaRow title={"Newest Reviews"} type={"newest"} />
      <BrowseMediaRow title={"Movie Reviews"} type={"movies"} />
      <BrowseMediaRow title={"TV Show Reviews"} type={"series"} />
      <BrowseMediaRow title={"Kids Section"} type={"kids"} />
    </>
  );
}
