"use client";

import Image from "next/image";
import React, { useMemo, useEffect, useState } from "react";

import { Popcorn } from "lucide-react";
import {
  IconBed,
  IconFlame,
  IconGhost2,
  IconStarFilled,
  IconSwords,
  IconUsers,
} from "@tabler/icons-react";

import { Genre } from "@/lib/types";
import { CircularProgress } from "@mui/material";

interface MediaItemProps {
  data: any;
  movieGenres: Genre[];
  seriesGenres: Genre[];
  admin?: boolean;
}

export default function MediaBlock({
  data = {},
  movieGenres = [],
  seriesGenres = [],
  admin = false,
}: MediaItemProps) {
  if (!data.title || !data.releaseDate) return null;
  const cleanRating = Math.floor(data.rating / 2);

  const randomDelay = useMemo(() => Math.floor(Math.random() * 1000), []);

  // States
  const [loadingImage, setLoadingImage] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Functions
  const getYearFromDate = (date: string) => {
    const timestamp = Date.parse(date);
    if (isNaN(timestamp)) return "";
    return new Date(timestamp).getFullYear();
  };

  useEffect(() => {
    if (!data.poster) setLoadingImage(false);
  }, [data.poster]);

  // const breakpoints = {
  //   sm: 640,
  //   md: 768,
  //   lg: 1024,
  //   xl: 1280,
  //   "2xl": 1536,
  // };
  //
  // const imageSizes = {
  //   poster: ["w92", "w154", "w185", "w342", "w500", "w780", "original"],
  //   backdrop: ["w300", "w780", "w1280", "original"],
  // };

  // States
  // const [posterSize, setPosterSize] = useState(imageSizes.poster[4]);

  // Effects
  // useEffect(() => {
  //   const handleResize = () => {
  //     const width = window.innerWidth;
  //     if (width < breakpoints.sm) {
  //       setPosterSize(imageSizes.poster[3]);
  //     } else if (width < breakpoints.md) {
  //       setPosterSize(imageSizes.poster[3]);
  //     } else if (width < breakpoints.lg) {
  //       setPosterSize(imageSizes.poster[3]);
  //     } else {
  //       setPosterSize(imageSizes.poster[3]);
  //     }
  //   };
  //
  //   handleResize();
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  return (
    <article
      className={`pb-5 flex ${
        admin ? "flex-row" : "flex-col"
      } justify-between gap-4 rounded-3xl transition-all duration-300 ease-in-out`}
    >
      <div
        className={`group grid place-items-center ${
          admin
            ? "w-[125px] min-w-[125px] hover:w-1/2 hover:min-w-1/2 h-[190px]"
            : "w-full"
        } bg-neutral-800 rounded-3xl overflow-hidden transition-all duration-300 ease-in-out`}
        style={{ aspectRatio: "1/1.25" }}
      >
        {loadingImage && (
          <Popcorn
            className={`absolute text-neutral-500 animate-bouncing`}
            style={{
              animationDelay: `${randomDelay}ms`,
            }}
          />
        )}

        {data.poster ? (
          <Image
            src={`https://image.tmdb.org/t/p/${admin ? "w500" : "w342"}${
              data.poster
            }`}
            alt={`${data.title} Poster`}
            width={admin ? 500 : 342}
            height={admin ? 190 : 430}
            onLoad={() => setLoadingImage(false)}
            onError={() => {
              setLoadingImage(false);
              setImageError(true);
            }}
            className={`${
              loadingImage ? "opacity-0" : "opacity-100"
            } w-full h-full bg-black ${
              admin ? "object-center" : ""
            } object-cover`}
            style={{
              objectPosition: "top center",
            }}
          ></Image>
        ) : (
          <div
            className={`flex flex-col items-center justify-center gap-2 text-neutral-400`}
          >
            <Popcorn />
            <p className={`text-xs`}>No image found</p>
          </div>
        )}
      </div>

      <section className={`flex-grow flex flex-col gap-4`}>
        <div className={`flex-grow w-full`}>
          <h3
            className={`text-neutral-200 ${
              admin ? "" : "whitespace-nowrap truncate"
            } text-sm font-semibold`}
          >
            {data.title}
          </h3>
          {/*<h4 className={`text-xs text-neutral-500`}>*/}
          {/*  {data.genres &&*/}
          {/*    data.genres*/}
          {/*      .map((genre: number) => {*/}
          {/*        if (data.type === "movie")*/}
          {/*          return movieGenres.find((g) => g.id === genre)?.name;*/}
          {/*        else return seriesGenres.find((g) => g.id === genre)?.name;*/}
          {/*      })*/}
          {/*      .join(", ")}*/}
          {/*</h4>*/}
        </div>

        {admin ? (
          <div className={`flex flex-col justify-center gap-4 text-sm`}>
            <p
              className={`flex items-center justify-between font-bold uppercase text-neutral-50`}
            >
              Date:{" "}
              <span
                className={`px-2 py-1 min-w-20 bg-neutral-300 font-normal lowercase text-neutral-950`}
              >
                {getYearFromDate(data.releaseDate)}
              </span>
            </p>

            <p
              className={`flex items-center justify-between font-bold uppercase text-neutral-50`}
            >
              Id:{" "}
              <span
                className={`px-2 py-1 min-w-20 bg-neutral-300 font-normal text-neutral-950`}
              >
                {data.id}
              </span>
            </p>

            <p
              className={`flex items-center justify-between font-bold uppercase text-neutral-50`}
            >
              Type:{" "}
              <span
                className={`px-2 py-1 min-w-20 bg-neutral-300 font-normal lowercase text-neutral-950`}
              >
                {data.type}
              </span>
            </p>
          </div>
        ) : (
          <div className={`flex items-center gap-2`} title={`TMDB Rating`}>
            <div
              className={`pr-2 flex items-center gap-2 border-r border-neutral-700`}
            >
              <IconStarFilled size={15} className={`text-lime-400`} />
              <span className={`text-xs text-neutral-300`}>
                {data.rating.toFixed(1)}
              </span>
            </div>
            <div className={`pr-2 flex items-center`}>
              <span className={`text-xs text-neutral-300`}>
                {getYearFromDate(data.releaseDate)}
              </span>
            </div>
          </div>
        )}

        <section className={`pt-2 flex flex-col border-t border-neutral-800`}>
          <div
            className={`flex flex-row flex-wrap items-center justify-between gap-1 lg:gap-2 text-neutral-300`}
          >
            <StatBlock
              title={"Horror"}
              value={100}
              icon={<IconGhost2 size={14} className={`z-30`} />}
              colour={"#737373"}
            />

            <div
              className={`hidden lg:block w-[1px] h-1/2 bg-neutral-700`}
            ></div>

            <StatBlock
              title={"Violence"}
              value={60}
              icon={<IconSwords size={14} className={`z-30`} />}
              colour={"#7e22ce"}
            />

            <div
              className={`hidden lg:block w-[1px] h-1/2 bg-neutral-700`}
            ></div>

            <StatBlock
              title={"Nudity"}
              value={80}
              icon={<IconBed size={15} className={`z-30`} />}
              colour={"#ec4899"}
            />

            <div
              className={`hidden lg:block w-[1px] h-1/2 bg-neutral-700`}
            ></div>

            <StatBlock
              title={"Sexual Content"}
              value={100}
              icon={<IconFlame size={15} className={`z-30`} />}
              colour={"#be123c"}
            />

            <div
              className={`hidden lg:block w-[1px] h-1/2 bg-neutral-700`}
            ></div>

            <StatBlock
              title={"Age Rating"}
              value={50}
              icon={<IconUsers size={14} className={`z-30`} />}
              colour={"#38bdf8"}
            />
          </div>
        </section>
      </section>
    </article>
  );
}

export const StatBlock = ({
  title,
  value,
  icon = <IconUsers size={16} className={`z-30`} />,
  colour = "text-lime-600",
}: {
  title: string;
  value: number;
  icon?: React.ReactElement;
  colour?: string;
}) => {
  return (
    <article
      className={`relative flex items-center justify-center`}
      title={`${title}: ${value}%`}
    >
      <CircularProgress
        variant="determinate"
        value={value}
        size={25}
        className={`rounded-full`}
        style={{
          color: colour,
        }}
      />
      <div
        className={`absolute`}
        style={{
          color: colour,
        }}
      >
        {icon}
      </div>
    </article>
  );
};
