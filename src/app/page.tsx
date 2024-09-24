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
        className={`mt-14 lg:mt-20 mb-14 transition-all duration-300 ease-in-out`}
      >
        <h1 className={`max-w-64 text-2xl sm:3xl md:text-4xl font-bold`}>
          What to Watch Next?
        </h1>
        <p className={`mt-6 max-w-72 text-base font-semibold text-neutral-400`}>
          Browse through our reviews on popular movies and TV shows
        </p>
      </section>

      <section className={`flex items-center justify-center`}>
        <article
          className={`relative w-full max-w-2xl`}
          style={
            {
              // aspectRatio: "3/1.75",
            }
          }
        >
          {/* Bottom-Most Row */}
          <div className={`flex flex-col w-full h-full z-0`}>
            {/* Top Row Spacer */}
            <div className={`w-full h-12`}></div>

            {/* Writing Block */}
            <div
              className={`flex-grow grid grid-cols-2 w-full bg-neutral-800 rounded-2xl`}
              style={{
                backdropFilter: "blur(5px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              {/* Fake Column */}
              <div></div>

              {/* Information Column */}
              <div className={`pr-8 py-8 flex flex-col gap-7`}>
                {/* Card Header */}
                <div className={`flex flex-col gap-3`}>
                  <h3 className={`text-lg font-bold`}>The Devil Princess</h3>

                  <div className={`flex gap-3 items-center text-neutral-400`}>
                    <div className={`flex gap-1 items-center text-lime-400`}>
                      <IconStarFilled size={15} className={`text-lime-400`} />
                      <IconStarFilled size={15} className={`text-lime-400`} />
                      <IconStarFilled size={15} className={`text-lime-400`} />
                      <IconStarFilled size={15} className={`text-lime-400`} />
                      <IconStarFilled size={15} className={`text-lime-400`} />
                    </div>
                    <div className={`w-[1px] h-full bg-neutral-400`}></div>
                    <span className={`text-xs`}>2024</span>
                  </div>
                </div>

                {/* Review Summary */}
                <div className={`text-neutral-400`}>
                  <p className={`text-xs leading-loose`}>
                    She is a devil princess from the something something and
                    this is meant to be a summary of a movie review. She is a
                    devil princess from the something something and this is
                    meant to be a summary of a movie review.
                  </p>
                </div>

                {/* Statics */}
                <div className={`flex flex-col gap-1`}>
                  <h4 className={`text-sm font-bold text-neutral-200`}>
                    Statistics:
                  </h4>

                  <div
                    className={`px-3 py-4 flex flex-row flex-wrap items-center gap-2 lg:gap-2 bg-neutral-900 rounded-xl text-neutral-300`}
                  >
                    <StatBlock
                      title={"Horror"}
                      value={100}
                      icon={<IconGhost2 size={14} className={`z-30`} />}
                      colour={"#a3a3a3"}
                    />

                    <div
                      className={`hidden lg:block w-[1px] h-1/2 bg-neutral-700`}
                    ></div>

                    <StatBlock
                      title={"Violence"}
                      value={60}
                      icon={<IconSwords size={14} className={`z-30`} />}
                      colour={"#4f46e5"}
                    />

                    <div
                      className={`hidden lg:block w-[1px] h-1/2 bg-neutral-700`}
                    ></div>

                    <StatBlock
                      title={"Nudity"}
                      value={80}
                      icon={<IconBed size={15} className={`z-30`} />}
                      colour={"#e11d48"}
                    />

                    <div
                      className={`hidden lg:block w-[1px] h-1/2 bg-neutral-700`}
                    ></div>

                    <StatBlock
                      title={"Sexual Content"}
                      value={100}
                      icon={<IconFlame size={15} className={`z-30`} />}
                      colour={"#f97316"}
                    />

                    <div
                      className={`hidden lg:block w-[1px] h-1/2 bg-neutral-700`}
                    ></div>

                    <StatBlock
                      title={"Age Rating"}
                      value={50}
                      icon={<IconUsers size={14} className={`z-30`} />}
                      colour={"#22d3ee"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top-Most Row */}
          <div className={`absolute top-0 left-0 right-0 h-full z-10`}>
            <div className={`grid grid-cols-2 h-full z-10`}>
              {/* Image */}
              <div className={`px-8 pb-8`}>
                <div className={`w-full h-full bg-rose-800`}></div>
              </div>

              {/* Fake Column */}
              <div></div>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}
