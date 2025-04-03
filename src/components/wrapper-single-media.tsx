"use client";

import React, { useEffect, useState } from "react";

import { Database } from "@/src/types/supabase";

import GoBack from "@/src/components/go-back";

interface TMDBItem {
  id: number;
  title: string;
  tagline: string;
  backdrop: string;
  poster: string;
  numberOfSeasons?: number;
  seasons?: any[];
  imdb_id: string;
  overview: string;
  date: string;
  rating: number;
  adult: boolean;
}

type MediaItem = Database["public"]["Tables"]["medias"]["Row"];
type ReviewItem = Database["public"]["Tables"]["reviews"]["Row"];

export default function SingleMediaWrapper({
  mediaData,
  reviewData,
  TMDBData,
}: {
  mediaData?: MediaItem | null;
  reviewData?: ReviewItem | null;
  TMDBData?: TMDBItem | null;
}) {
  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  };

  const imageSizes = {
    poster: ["w92", "w154", "w185", "w342", "w500", "w780", "original"],
    backdrop: ["w300", "w780", "w1280", "original"],
  };

  // States
  const [posterSize, setPosterSize] = useState(imageSizes.poster[4]);

  // Effects
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < breakpoints.lg) {
        setPosterSize(imageSizes.poster[2]);
      } else if (width < breakpoints.xl) {
        setPosterSize(imageSizes.poster[5]);
      } else {
        setPosterSize(imageSizes.poster[6]);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <section className={`relative z-10`}>
        <GoBack />
      </section>

      {/* Spacing */}
      <div className={`block md:hidden h-[40dvh]`}></div>

      <div
        className={`absolute top-0 md:top-auto left-0 md:left-auto right-0 md:right-auto md:relative`}
      >
        <section
          className={`relative md:mt-5 h-[50dvh] md:h-[500px] md:rounded-3xl transition-all duration-300 ease-in-out overflow-hidden`}
        >
          {TMDBData && mediaData && (
            <img
              className={`bg-neutral-800 w-full h-full object-cover`}
              src={`https://image.tmdb.org/t/p/original${TMDBData.backdrop}`}
              alt={`${mediaData.title} Poster`}
            />
          )}

          <div className="md:hidden absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-100"></div>
        </section>

        <section
          className={`absolute md:relative bottom-0 left-0 right-0 mt-12 p-5 md:p-0 transition-all duration-300 ease-in-out z-10`}
        >
          <h1 className={`text-2xl sm:3xl md:text-4xl font-bold`}>
            {mediaData?.title}
          </h1>
          {/*<h3 className={`text-lg text-neutral-500`}>*/}
          {/*  {TMDBData?.genres.map(({ id, name }) => name).join(", ")}*/}
          {/*</h3>*/}
        </section>
      </div>

      <section
        className={`mt-6 sm:mt-12 grid lg:grid-cols-2 gap-16 text-sm text-neutral-500 transition-all duration-300 ease-in-out`}
      >
        <article className={`grid gap-6`}>
          <p className={``}>
            Cras in neque. Sed lacinia, felis ut sodales pretium, justo sapien
            hendrerit est, et convallis nisi quam sit amet erat. Suspendisse
            consequat nibh a mauris. Curabitur libero ligula, faucibus at,
            mollis ornare, mattis et, libero.
          </p>
          <p>
            Aliquam pulvinar congue pede. Fusce condimentum turpis vel dolor. Ut
            blandit. Sed elementum justo quis sem. Sed eu orci eu ante iaculis
            accumsan. Sed suscipit dolor quis mi. Curabitur ultrices nonummy
            lacus. Morbi ipsum ipsum, adipiscing eget, tincidunt vitae, pharetra
            at, tellus. Nulla gravida, arcu eget dictum eleifend, velit ligula
            suscipit nibh, sagittis imperdiet metus nunc non pede. Aenean congue
            pede in nisi tristique interdum. Sed commodo, ipsum ac dignissim
            ullamcorper, odio nulla venenatis nisi, in porta dolor neque
            venenatis lacus. Pellentesque fermentum. Mauris sit amet ligula ut
            tellus gravida mattis. Vestibulum ante ipsum primis in faucibus orci
            luctus et ultrices posuere cubilia Curae;
          </p>
        </article>

        <article className={`bg-neutral-200 p-6 rounded-3xl`}></article>
      </section>
    </>
  );
}
