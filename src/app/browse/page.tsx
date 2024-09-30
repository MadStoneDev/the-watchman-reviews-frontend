import React from "react";
import type { Metadata } from "next";
import SpecialBlockWrapper from "@/components/special-block-wrapper";
import { Popcorn } from "lucide-react";
import Image from "next/image";
import { IconStarFilled } from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Browse - The Watchman Reviews",
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

      <section className={`mt-24 flex flex-col`}>
        <h2 className={`max-w-60 text-base sm:lg md:text-xl font-semibold`}>
          Newest Reviews
        </h2>

        <div
          className={`special-scrollbar mt-4 flex flex-nowrap items-center justify-between gap-5 overflow-x-auto transition-all duration-300 ease-in-out`}
        >
          {Array.from({ length: 20 }, (_, i) => i).map((index) => (
            <article
              className={`pb-5 flex flex-col justify-between gap-4 rounded-3xl transition-all duration-300 ease-in-out`}
            >
              <div
                className={`group grid place-items-center w-full bg-neutral-800 rounded-3xl overflow-hidden transition-all duration-300 ease-in-out`}
                style={{ aspectRatio: "1/1.25" }}
              >
                <div
                  className={`flex flex-col items-center justify-center gap-2 text-neutral-400`}
                >
                  <Popcorn />
                  <p className={`text-xs`}>No image found</p>
                </div>
              </div>

              <section className={`flex-grow flex flex-col gap-4`}>
                <div className={`flex-grow w-full`}>
                  <h3
                    className={`text-neutral-200 whitespace-nowrap truncate text-sm font-semibold`}
                  >
                    This Movie We Reviewed
                  </h3>
                </div>

                <div
                  className={`flex items-center gap-2`}
                  title={`TMDB Rating`}
                >
                  <div
                    className={`pr-2 flex items-center gap-2 border-r border-neutral-700`}
                  >
                    <IconStarFilled size={15} className={`text-lime-400`} />
                    <span className={`text-xs text-neutral-300`}>5.6</span>
                  </div>
                  <div className={`pr-2 flex items-center`}>
                    <span className={`text-xs text-neutral-300`}>2024</span>
                  </div>
                </div>
              </section>
            </article>
          ))}
        </div>
      </section>

      <section className={`mt-24 flex flex-col`}>
        <h2 className={`max-w-60 text-base sm:lg md:text-xl font-semibold`}>
          Movie Reviews
        </h2>
        <div
          className={`special-scrollbar mt-4 flex flex-nowrap items-center justify-between gap-5 overflow-x-auto transition-all duration-300 ease-in-out`}
        >
          {Array.from({ length: 20 }, (_, i) => i).map((index) => (
            <article
              className={`pb-5 flex flex-col justify-between gap-4 rounded-3xl transition-all duration-300 ease-in-out`}
            >
              <div
                className={`group grid place-items-center w-full bg-neutral-800 rounded-3xl overflow-hidden transition-all duration-300 ease-in-out`}
                style={{ aspectRatio: "1/1.25" }}
              >
                <div
                  className={`flex flex-col items-center justify-center gap-2 text-neutral-400`}
                >
                  <Popcorn />
                  <p className={`text-xs`}>No image found</p>
                </div>
              </div>

              <section className={`flex-grow flex flex-col gap-4`}>
                <div className={`flex-grow w-full`}>
                  <h3
                    className={`text-neutral-200 whitespace-nowrap truncate text-sm font-semibold`}
                  >
                    This Movie We Reviewed
                  </h3>
                </div>

                <div
                  className={`flex items-center gap-2`}
                  title={`TMDB Rating`}
                >
                  <div
                    className={`pr-2 flex items-center gap-2 border-r border-neutral-700`}
                  >
                    <IconStarFilled size={15} className={`text-lime-400`} />
                    <span className={`text-xs text-neutral-300`}>5.6</span>
                  </div>
                  <div className={`pr-2 flex items-center`}>
                    <span className={`text-xs text-neutral-300`}>2024</span>
                  </div>
                </div>
              </section>
            </article>
          ))}
        </div>
      </section>

      <section className={`mt-24 flex flex-col`}>
        <h2 className={`max-w-60 text-base sm:lg md:text-xl font-semibold`}>
          Series Reviews
        </h2>
        <div
          className={`special-scrollbar mt-4 flex flex-nowrap items-center justify-between gap-5 overflow-x-auto transition-all duration-300 ease-in-out`}
        >
          {Array.from({ length: 20 }, (_, i) => i).map((index) => (
            <article
              className={`pb-5 flex flex-col justify-between gap-4 rounded-3xl transition-all duration-300 ease-in-out`}
            >
              <div
                className={`group grid place-items-center w-full bg-neutral-800 rounded-3xl overflow-hidden transition-all duration-300 ease-in-out`}
                style={{ aspectRatio: "1/1.25" }}
              >
                <div
                  className={`flex flex-col items-center justify-center gap-2 text-neutral-400`}
                >
                  <Popcorn />
                  <p className={`text-xs`}>No image found</p>
                </div>
              </div>

              <section className={`flex-grow flex flex-col gap-4`}>
                <div className={`flex-grow w-full`}>
                  <h3
                    className={`text-neutral-200 whitespace-nowrap truncate text-sm font-semibold`}
                  >
                    This Movie We Reviewed
                  </h3>
                </div>

                <div
                  className={`flex items-center gap-2`}
                  title={`TMDB Rating`}
                >
                  <div
                    className={`pr-2 flex items-center gap-2 border-r border-neutral-700`}
                  >
                    <IconStarFilled size={15} className={`text-lime-400`} />
                    <span className={`text-xs text-neutral-300`}>5.6</span>
                  </div>
                  <div className={`pr-2 flex items-center`}>
                    <span className={`text-xs text-neutral-300`}>2024</span>
                  </div>
                </div>
              </section>
            </article>
          ))}
        </div>
      </section>

      <section className={`mt-24 flex flex-col`}>
        <h2 className={`max-w-60 text-base sm:lg md:text-xl font-semibold`}>
          Kids Section
        </h2>
        <div
          className={`special-scrollbar mt-4 flex flex-nowrap items-center justify-between gap-5 overflow-x-auto transition-all duration-300 ease-in-out`}
        >
          {Array.from({ length: 20 }, (_, i) => i).map((index) => (
            <article
              className={`pb-5 flex flex-col justify-between gap-4 rounded-3xl transition-all duration-300 ease-in-out`}
            >
              <div
                className={`group grid place-items-center w-full bg-neutral-800 rounded-3xl overflow-hidden transition-all duration-300 ease-in-out`}
                style={{ aspectRatio: "1/1.25" }}
              >
                <div
                  className={`flex flex-col items-center justify-center gap-2 text-neutral-400`}
                >
                  <Popcorn />
                  <p className={`text-xs`}>No image found</p>
                </div>
              </div>

              <section className={`flex-grow flex flex-col gap-4`}>
                <div className={`flex-grow w-full`}>
                  <h3
                    className={`text-neutral-200 whitespace-nowrap truncate text-sm font-semibold`}
                  >
                    This Movie We Reviewed
                  </h3>
                </div>

                <div
                  className={`flex items-center gap-2`}
                  title={`TMDB Rating`}
                >
                  <div
                    className={`pr-2 flex items-center gap-2 border-r border-neutral-700`}
                  >
                    <IconStarFilled size={15} className={`text-lime-400`} />
                    <span className={`text-xs text-neutral-300`}>5.6</span>
                  </div>
                  <div className={`pr-2 flex items-center`}>
                    <span className={`text-xs text-neutral-300`}>2024</span>
                  </div>
                </div>
              </section>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
