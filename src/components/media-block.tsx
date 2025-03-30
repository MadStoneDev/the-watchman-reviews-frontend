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
  IconShare,
} from "@tabler/icons-react";

import { Genre } from "@/src/types/media";
import { CircularProgress } from "@mui/material";

type Collection = {
  id: string;
  title: string;
  is_owner: boolean;
};

interface MediaItemProps {
  data: any;
  movieGenres: Genre[];
  seriesGenres: Genre[];
  admin?: boolean;
  user?: any;
  collections?: string[];
}

export default function MediaBlock({
  data = {},
  movieGenres = [],
  seriesGenres = [],
  admin = false,
  user = null,
  collections = [],
}: MediaItemProps) {
  if (!data.title || !data.releaseDate) return null;
  const cleanRating = Math.floor(data.rating / 2);

  const randomDelay = useMemo(() => Math.floor(Math.random() * 1000), []);

  // States
  const [loadingImage, setLoadingImage] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [showCollectionSelector, setShowCollectionSelector] = useState(false);
  const [userCollections, setUserCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  const supabase = createClient();

  // Load user's collections - both owned and shared with them
  useEffect(() => {
    const fetchCollections = async () => {
      if (!user) return;

      try {
        // Fetch owned collections
        const { data: ownedCollections, error: ownedError } = await supabase
          .from("collections")
          .select("id, title")
          .eq("owner", user.id);

        if (ownedError) {
          console.error("Error fetching owned collections:", ownedError);
        }

        // Fetch shared collections
        const { data: sharedCollectionsIds, error: sharedError } =
          await supabase
            .from("shared_collection")
            .select("collection_id")
            .eq("user_id", user.id);

        if (sharedError) {
          console.error("Error fetching shared collection IDs:", sharedError);
        }

        // Extract collection IDs from shared collections
        const sharedIds =
          sharedCollectionsIds?.map((item) => item.collection_id) || [];

        if (sharedIds.length > 0) {
          // Fetch the actual collection details for shared collections
          const { data: sharedCollections, error: sharedDetailsError } =
            await supabase
              .from("collections")
              .select("id, title")
              .in("id", sharedIds);

          if (sharedDetailsError) {
            console.error(
              "Error fetching shared collection details:",
              sharedDetailsError,
            );
          }

          // Combine owned and shared collections
          const combinedCollections = [
            ...(ownedCollections || []).map((c) => ({ ...c, is_owner: true })),
            ...(sharedCollections || []).map((c) => ({
              ...c,
              is_owner: false,
            })),
          ];

          setUserCollections(combinedCollections);
        } else {
          // Just use owned collections if no shared ones
          setUserCollections(
            (ownedCollections || []).map((c) => ({ ...c, is_owner: true })),
          );
        }
      } catch (error) {
        console.error("Error in fetchCollections:", error);
      }
    };

    fetchCollections();
  }, [user]);

  // Functions
  const getYearFromDate = (date: string) => {
    const timestamp = Date.parse(date);
    if (isNaN(timestamp)) return "";
    return new Date(timestamp).getFullYear();
  };

  const handleAddToCollection = async () => {
    if (!selectedCollection) return;

    setLoading(true);

    try {
      // Create the media_collection entry
      const { error } = await supabase.from("media_collection").insert({
        collection_id: selectedCollection,
        media_id: data.id.toString(),
        media_type: data.type,
        title: data.title,
        poster_path: data.poster,
        release_year: getYearFromDate(data.releaseDate).toString(),
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
    if (!data.poster) setLoadingImage(false);
  }, [data.poster]);

  return (
    <article
      className={`pb-5 relative flex ${
        admin ? "flex-row" : "flex-col"
      } justify-between gap-4 rounded-xl md:rounded-3xl transition-all duration-300 ease-in-out overflow-hidden`}
    >
      {/* Collection Add Button - Only show if user is logged in */}
      {user && (
        <button
          onClick={() => setShowCollectionSelector(true)}
          className="absolute top-2 right-2 z-10 p-1 bg-neutral-800/80 hover:bg-lime-500/80 text-white rounded-md transition-all duration-300 ease-in-out"
          title="Add to collection"
        >
          <IconSquarePlus size={24} />
        </button>
      )}

      {/* Collection Selector Overlay */}
      {showCollectionSelector && user && (
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
            ) : userCollections.length === 0 ? (
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
                {/* Group owned collections */}
                <optgroup label="Your Collections">
                  {userCollections
                    .filter((col) => col.is_owner)
                    .map((collection) => (
                      <option key={collection.id} value={collection.id}>
                        {collection.title}
                      </option>
                    ))}
                </optgroup>

                {/* Group shared collections */}
                {userCollections.some((col) => !col.is_owner) && (
                  <optgroup label="Shared With You">
                    {userCollections
                      .filter((col) => !col.is_owner)
                      .map((collection) => (
                        <option key={collection.id} value={collection.id}>
                          {collection.title}
                        </option>
                      ))}
                  </optgroup>
                )}
              </select>
            )}

            <button
              onClick={handleAddToCollection}
              disabled={
                !selectedCollection || loading || userCollections.length === 0
              }
              className={`w-full p-2 rounded ${
                !selectedCollection || loading || userCollections.length === 0
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
