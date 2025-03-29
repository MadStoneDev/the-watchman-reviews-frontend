"use client";

import Image from "next/image";
import React, { useMemo, useEffect, useState } from "react";
import { createClient } from "@/src/utils/supabase/client";

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
  user_id: string;
  is_owner: boolean;
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
  // Debug logs - uncomment to see what data is coming in
  // console.log("Media data received:", data);

  // Guard for empty data
  if (!data.title && !data.name) return null;

  // Extract data properly - Keep the properties matching the source data exactly
  const title = data.title || data.name || "";
  const releaseDate = data.release_date || data.first_air_date || "";
  const posterPath = data.poster_path || "";
  const mediaType = data.media_type || "";
  const mediaId = data.id || "";
  const rating = data.vote_average || 0;

  // Debug release date and year
  // console.log("Release date:", releaseDate, "Type:", typeof releaseDate);

  const cleanRating = Math.floor(rating / 2);
  const releaseYear = getYearFromDate(releaseDate);

  // Debug year extraction
  // console.log("Year extracted:", releaseYear);

  const randomDelay = useMemo(() => Math.floor(Math.random() * 1000), []);

  // States
  const [loadingImage, setLoadingImage] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [showCollectionSelector, setShowCollectionSelector] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  const supabase = createClient();

  // Load user's collections
  useEffect(() => {
    const fetchCollections = async () => {
      const { data: userCollections, error } = await supabase
        .from("collections")
        .select("*");

      if (!error && userCollections) {
        // Map collections to include is_owner flag
        const mappedCollections = userCollections.map((collection) => ({
          ...collection,
          is_owner: true, // For now, we're only showing collections the user owns
        }));

        setCollections(mappedCollections);
      } else {
        console.error("Error fetching collections:", error);
      }
    };

    fetchCollections();
  }, []);

  // Functions
  function getYearFromDate(date: string) {
    // Safety check for empty dates
    if (!date) return "";

    try {
      const timestamp = Date.parse(date);
      if (isNaN(timestamp)) return "";
      return new Date(timestamp).getFullYear().toString();
    } catch (error) {
      console.error("Date parsing error:", error);
      return "";
    }
  }

  const handleAddToCollection = async () => {
    if (!selectedCollection) return;

    setLoading(true);

    try {
      // Create the media_collection entry
      const { error } = await supabase.from("media_collection").insert({
        collection_id: selectedCollection,
        media_id: mediaId.toString(),
        media_type: mediaType,
        title: title,
        poster_path: posterPath,
        release_year: releaseYear,
      });

      if (error) {
        console.error("Error adding to collection:", error);
      } else {
        setAddSuccess(true);

        // Reset success message after a delay
        setTimeout(() => {
          setAddSuccess(false);
          setShowCollectionSelector(false);
          setSelectedCollection("");
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to add to collection:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!posterPath) setLoadingImage(false);
  }, [posterPath]);

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
          <div className={`bg-neutral-900 py-3 px-4 w-full max-w-xs`}>
            <div className={`flex justify-between items-start mb-4`}>
              <h4 className={`text-white font-semibold`}>Add to collection</h4>
              <button
                onClick={() => {
                  setShowCollectionSelector(false);
                  setSelectedCollection("");
                  setAddSuccess(false);
                }}
                className={`text-neutral-400 hover:text-white`}
              >
                <IconX size={18} />
              </button>
            </div>

            {addSuccess ? (
              <div className="py-2 px-3 bg-lime-500/20 text-lime-400 rounded mb-4">
                Added to collection successfully!
              </div>
            ) : collections.length === 0 ? (
              <div className="py-2 mb-4 text-neutral-400">
                No collections found. Create a collection first.
              </div>
            ) : (
              <select
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                disabled={loading}
                className="w-full p-2 mb-4 bg-neutral-800 text-white border border-neutral-700 rounded focus:outline-none focus:border-lime-400"
              >
                <option value="">Select a collection</option>
                {collections
                  .filter((col) => col.is_owner)
                  .map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.title}
                    </option>
                  ))}
              </select>
            )}

            <button
              onClick={handleAddToCollection}
              disabled={
                !selectedCollection || loading || collections.length === 0
              }
              className={`w-full p-2 rounded ${
                !selectedCollection || loading || collections.length === 0
                  ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                  : "bg-lime-500 text-black hover:bg-lime-400"
              } transition-colors duration-300`}
            >
              {loading ? "Adding..." : "Add to collection"}
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

        {posterPath ? (
          <Image
            src={`https://image.tmdb.org/t/p/${
              admin ? "w500" : "w342"
            }${posterPath}`}
            alt={`${title} Poster`}
            width={admin ? 500 : 342}
            height={admin ? 190 : 430}
            onLoad={() => setLoadingImage(false)}
            onError={() => {
              setLoadingImage(false);
              setImageError(true);
              // Debug image errors
              // console.error(`Failed to load image for: ${title}`);
            }}
            className={`${
              loadingImage ? "opacity-0" : "opacity-100"
            } w-full h-full bg-black ${
              admin ? "object-center" : ""
            } object-cover`}
            style={{
              objectPosition: "top center",
            }}
          />
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
            {title}
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
                {releaseYear}
              </span>
            </p>

            <p
              className={`flex items-center justify-between font-bold uppercase text-neutral-50`}
            >
              Id:{" "}
              <span
                className={`px-2 py-1 min-w-20 bg-neutral-300 font-normal text-neutral-950`}
              >
                {mediaId}
              </span>
            </p>

            <p
              className={`flex items-center justify-between font-bold uppercase text-neutral-50`}
            >
              Type:{" "}
              <span
                className={`px-2 py-1 min-w-20 bg-neutral-300 font-normal lowercase text-neutral-950`}
              >
                {mediaType}
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
                {rating ? rating.toFixed(1) : "N/A"}
              </span>
            </div>
            <div className={`pr-2 flex items-center`}>
              <span className={`text-xs text-neutral-300`}>
                {releaseYear || "N/A"}
              </span>
            </div>
          </div>
        )}
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
