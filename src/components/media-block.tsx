import Image from "next/image";
import React, { useMemo, useEffect, useState } from "react";

import { Popcorn } from "lucide-react";
import {
  IconBed,
  IconFlame,
  IconGhost2,
  IconGhost2Filled,
  IconStarFilled,
  IconSwords,
  IconTank,
  IconUsers,
} from "@tabler/icons-react";

import { Genre } from "@/lib/types";

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
      className={`p-3 pb-5 flex ${
        admin ? "flex-row" : "flex-col"
      } justify-between gap-4 bg-black rounded-3xl transition-all duration-300 ease-in-out`}
    >
      <div
        className={`group grid place-items-center ${
          admin
            ? "w-[125px] min-w-[125px] hover:w-1/2 hover:min-w-1/2 h-[190px]"
            : "w-full aspect-square"
        } bg-neutral-800 rounded-xl overflow-hidden transition-all duration-300 ease-in-out`}
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
            height={admin ? 190 : 342}
            onLoad={() => setLoadingImage(false)}
            onError={() => {
              setLoadingImage(false);
              setImageError(true);
            }}
            className={`${
              loadingImage ? "opacity-0" : "opacity-100"
            } w-full h-full bg-black ${
              admin ? "object-center" : "object-top"
            } object-cover`}
            style={{ aspectRatio: "1/1" }}
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

      <section className={`flex-grow flex flex-col gap-2`}>
        <div className={`flex-grow w-full`}>
          <h3
            className={`text-neutral-50 ${
              admin ? "" : "whitespace-nowrap truncate"
            }`}
          >
            {data.title}
          </h3>
          <h4 className={`text-sm text-neutral-500`}>
            {data.genres &&
              data.genres
                .map((genre: number) => {
                  if (data.type === "movie")
                    return movieGenres.find((g) => g.id === genre)?.name;
                  else return seriesGenres.find((g) => g.id === genre)?.name;
                })
                .join(", ")}
          </h4>
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
          <div
            className={`flex items-center gap-1`}
            title={`User Rating: ${data.rating / 2} / 5`}
          >
            {Array.from({ length: 5 }, (_, index) => (
              <IconStarFilled
                key={`${data.id}-${index}`}
                size={13}
                className={`${
                  index <= cleanRating ? "text-lime-400" : "text-neutral-600"
                }`}
              />
            ))}
          </div>
        )}

        <section
          className={`mt-3 pt-2 flex flex-col gap-2 border-t border-neutral-800`}
        >
          <h4 className={`text-sm font-bold text-neutral-300`}>Stats:</h4>
          <div
            className={`flex flex-row flex-wrap items-center justify-evenly gap-1 text-neutral-300`}
          >
            <StatBlock
              title={"Horror"}
              value={20}
              colour={"border-neutral-700"}
            />
            <StatBlock
              title={"Violence"}
              value={60}
              colour={"border-violet-700"}
            />
            <StatBlock title={"Nudity"} value={80} colour={"border-pink-500"} />
            <StatBlock
              title={"Sexual Content"}
              value={100}
              colour={"border-rose-600"}
            />
            <StatBlock
              title={"Age Rating"}
              value={0}
              colour={"border-lime-600"}
            />
          </div>
        </section>
      </section>
    </article>
  );
}

const StatBlock = ({
  title,
  value,
  colour,
}: {
  title: string;
  value: number;
  colour?: string;
}) => {
  const baseHeight = 100 - value;
  const finalHeight = baseHeight === 0 ? `0px` : `${baseHeight}% + 6px`;

  return (
    <article
      className={`relative box-border w-8 h-8 flex items-center justify-center border-[3px] ${
        colour ? colour : "border-lime-600"
      } rounded-full`}
      title={`${title}: ${value}%`}
    >
      <IconUsers size={16} className={`z-30`} />
      <div
        className={`absolute -top-[3px] -left-[3px] -right-[3px] ${
          value === 100 ? "opacity-0" : "opacity-100"
        }`}
        style={{
          height: `calc(${100 - value}% + 6px)`,
          background: "linear-gradient(to bottom, black 80%, transparent 100%)",
        }}
      ></div>
    </article>
  );
};
