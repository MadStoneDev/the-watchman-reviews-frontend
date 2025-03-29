"use client";

import Image from "next/image";
import React, { useMemo, useEffect, useState } from "react";

import { Popcorn } from "lucide-react";
import {
  IconStarFilled,
  IconUsers,
  IconSquarePlus,
  IconX,
} from "@tabler/icons-react";

import { Genre } from "@/src/types/media";
import { CircularProgress } from "@mui/material";

type Collection = {
  id: string;
  title: string;
  isOwner?: boolean;
};

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
  const [showCollectionSelector, setShowCollectionSelector] = useState(false);

  // Mock collections - in a real implementation, you would fetch this from your backend
  const [collections, setCollections] = useState<Collection[]>([
    { id: "1", title: "My Favorites", isOwner: true },
    { id: "2", title: "Watch Later", isOwner: true },
    { id: "3", title: "Horror Classics", isOwner: true },
    { id: "4", title: "Friend's Recommendations", isOwner: false },
  ]);

  const [selectedCollection, setSelectedCollection] = useState<string>("");

  // Functions
  const getYearFromDate = (date: string) => {
    const timestamp = Date.parse(date);
    if (isNaN(timestamp)) return "";
    return new Date(timestamp).getFullYear();
  };

  const handleAddToCollection = () => {
    if (!selectedCollection) return;

    // Here you would implement the actual logic to add the media to the collection
    console.log(`Adding ${data.title} to collection: ${selectedCollection}`);

    // Close the selector after adding
    setShowCollectionSelector(false);
    setSelectedCollection("");
  };

  useEffect(() => {
    if (!data.poster) setLoadingImage(false);
  }, [data.poster]);

  return (
    <article
      className={`pb-5 relative flex ${
        admin ? "flex-row" : "flex-col"
      } justify-between gap-4 rounded-xl md:rounded-3xl transition-all duration-300 ease-in-out overflow-hidden`}
    >
      {/* Collection Add Button */}
      <button
        onClick={() => setShowCollectionSelector(true)}
        className="absolute top-2 right-2 z-10 p-1 bg-neutral-800/80 hover:bg-lime-500/80 text-white rounded-md transition-all duration-300 ease-in-out"
        title="Add to collection"
      >
        <IconSquarePlus size={20} />
      </button>

      {/* Collection Selector Overlay */}
      {showCollectionSelector && (
        <div
          className={`absolute inset-0 z-20 bg-neutral-800/60 flex items-center justify-center backdrop-blur-sm text-sm`}
        >
          <div className={`bg-neutral-900 py-3 px-2 w-full max-w-xs`}>
            <div className={`flex justify-between items-start mb-4`}>
              <h4 className={`text-white font-semibold`}>Add to collection</h4>
              <button
                onClick={() => {
                  setShowCollectionSelector(false);
                  setSelectedCollection("");
                }}
                className={`text-neutral-400 hover:text-white`}
              >
                <IconX size={18} />
              </button>
            </div>

            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="w-full p-2 mb-4 bg-neutral-800 text-white border border-neutral-700 rounded focus:outline-none focus:border-lime-400"
            >
              <option value="">Select a collection</option>
              {collections
                .filter((col) => col.isOwner)
                .map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.title}
                  </option>
                ))}
            </select>

            <button
              onClick={handleAddToCollection}
              disabled={!selectedCollection}
              className={`w-full p-2 rounded ${
                !selectedCollection
                  ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                  : "bg-lime-500 text-black hover:bg-lime-400"
              } transition-colors duration-300`}
            >
              Add to collection
            </button>
          </div>
        </div>
      )}

      <div
        className={`group grid place-items-center ${
          admin
            ? "w-[125px] min-w-[125px] hover:w-1/2 hover:min-w-1/2 h-[190px]"
            : "w-full"
        } bg-neutral-800 rounded-xl md:rounded-3xl overflow-hidden transition-all duration-300 ease-in-out`}
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
            onClick={() => console.log(data)}
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

        {/* Statistic Blocks */}
        {/*<section className={`pt-2 flex flex-col border-t border-neutral-800`}>*/}
        {/*  <div*/}
        {/*    className={`flex flex-row flex-wrap items-center justify-between gap-1 lg:gap-2 text-neutral-300`}*/}
        {/*  >*/}
        {/*    /!* Horror *!/*/}
        {/*    /!* Violence *!/*/}
        {/*    /!* Nudity *!/*/}
        {/*    /!* Sexual Content *!/*/}
        {/*    /!* Substance Abuse *!/*/}
        {/*    /!* Rainbow Meter *!/*/}

        {/*    <StatBlock*/}
        {/*      title={"Horror"}*/}
        {/*      value={100}*/}
        {/*      icon={<IconGhost2 size={14} className={``} />}*/}
        {/*      colour={"#737373"}*/}
        {/*    />*/}

        {/*    <div*/}
        {/*      className={`hidden lg:block w-[1px] h-1/2 bg-neutral-700`}*/}
        {/*    ></div>*/}

        {/*    <StatBlock*/}
        {/*      title={"Violence"}*/}
        {/*      value={60}*/}
        {/*      icon={<IconSwords size={14} className={``} />}*/}
        {/*      colour={"#7e22ce"}*/}
        {/*    />*/}

        {/*    <div*/}
        {/*      className={`hidden lg:block w-[1px] h-1/2 bg-neutral-700`}*/}
        {/*    ></div>*/}

        {/*    <StatBlock*/}
        {/*      title={"Nudity"}*/}
        {/*      value={80}*/}
        {/*      icon={<IconBed size={15} className={``} />}*/}
        {/*      colour={"#ec4899"}*/}
        {/*    />*/}

        {/*    <div*/}
        {/*      className={`hidden lg:block w-[1px] h-1/2 bg-neutral-700`}*/}
        {/*    ></div>*/}

        {/*    <StatBlock*/}
        {/*      title={"Sexual Content"}*/}
        {/*      value={100}*/}
        {/*      icon={<IconFlame size={15} className={` `} />}*/}
        {/*      colour={"#be123c"}*/}
        {/*    />*/}

        {/*    <div*/}
        {/*      className={`hidden lg:block w-[1px] h-1/2 bg-neutral-700`}*/}
        {/*    ></div>*/}

        {/*    <StatBlock*/}
        {/*      title={"Age Rating"}*/}
        {/*      value={50}*/}
        {/*      icon={<IconUsers size={14} className={``} />}*/}
        {/*      colour={"#38bdf8"}*/}
        {/*    />*/}

        {/*    <StatBlock*/}
        {/*      title={"Age Rating"}*/}
        {/*      value={50}*/}
        {/*      icon={<IconRainbow size={14} className={``} />}*/}
        {/*      colour={"#38bdf8"}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</section>*/}
      </section>
    </article>
  );
}

export const StatBlock = ({
  title,
  value,
  icon = <IconUsers size={16} />,
  colour = "text-lime-600",
}: {
  title: string;
  value: number;
  icon?: React.ReactElement;
  colour?: string;
}) => {
  return (
    <article
      className={`group/stat relative flex items-center justify-center transition-all duration-300 ease-in-out`}
      title={`${title}: ${value}%`}
    >
      <CircularProgress
        variant="determinate"
        value={value}
        size={30}
        className={`rounded-full opacity-100 group-hover/stat:opacity-20 transition-all duration-300 ease-in-out`}
        style={{
          color: colour,
        }}
      />
      <div
        className={`absolute scale-100 group-hover/stat:scale-150 z-30 transition-all duration-300 ease-in-out`}
        style={{
          color: colour,
        }}
      >
        {icon}
      </div>
    </article>
  );
};
