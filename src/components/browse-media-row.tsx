"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Popcorn } from "lucide-react";
import { IconStarFilled } from "@tabler/icons-react";

interface MediaItem {
  id: string;
  title: string;
  type?: "movie" | "series";
  poster_path: string | null;
  backdrop_path?: string | null;
  release_year: string | null;
  vote_average?: number | null;
}

interface BrowseMediaRowProps {
  data: MediaItem[];
  linkType?: "movie" | "series"; // Determines URL structure
  title?: string;
  max?: number;
  type?: "newest" | "movies" | "series" | "kids"; // Optional: for tracking/analytics
}

export function BrowseMediaRow({
  data = [],
  title = "Media",
  linkType,
  max = 20,
  type, // Optional prop for tracking
}: BrowseMediaRowProps) {
  const filteredData = data.slice(0, max);

  // Determine the base URL for links
  const getMediaUrl = (item: MediaItem) => {
    if (linkType) {
      return linkType === "movie" ? `/movies/${item.id}` : `/series/${item.id}`;
    } else if (item.type) {
      return item.type === "movie"
        ? `/movies/${item.id}`
        : `/series/${item.id}`;
    } else {
      return "";
    }
  };

  return (
    <section className={`mt-12 flex flex-col`}>
      <h2 className={`max-w-60 text-base sm:lg md:text-xl font-semibold`}>
        {title}
      </h2>

      <div
        className={`special-scrollbar px-2 mt-4 flex flex-nowrap items-center justify-between gap-5 overflow-x-auto transition-all duration-300 ease-in-out`}
        style={{
          scrollSnapType: "x mandatory",
          scrollPaddingInlineStart: "2rem",
        }}
      >
        {filteredData.length === 0 ? (
          <p className="text-neutral-500 text-sm py-8">No content available</p>
        ) : (
          filteredData.map((media) => (
            <article
              key={media.id}
              className={`pb-5 flex flex-col justify-between min-w-[180px] max-w-[180px] transition-all duration-300 ease-in-out`}
              style={{
                scrollSnapAlign: "center",
              }}
            >
              <Link href={getMediaUrl(media)} className="group">
                <div
                  className={`relative grid place-items-center w-full bg-neutral-800 rounded-xl overflow-hidden transition-all duration-300 ease-in-out border-2 border-transparent group-hover:border-lime-400`}
                  style={{ aspectRatio: "1/1.5" }}
                >
                  {media.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                      alt={media.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className={`flex flex-col items-center justify-center gap-2 text-neutral-400`}
                    >
                      <Popcorn />
                      <p className={`text-xs`}>No image</p>
                    </div>
                  )}
                </div>

                <section className={`grow flex flex-col gap-1 mt-4`}>
                  <div className={`grow w-full`}>
                    <h3
                      className={`text-neutral-200 whitespace-nowrap truncate text-sm font-semibold group-hover:text-lime-400 transition-colors`}
                      title={media.title}
                    >
                      {media.title}
                    </h3>
                  </div>

                  <div className={`flex items-center gap-2`}>
                    {media.vote_average !== null &&
                      media.vote_average !== undefined &&
                      media.vote_average > 0 && (
                        <>
                          <div
                            className={`pr-2 flex items-center gap-2 border-r border-neutral-700`}
                            title={`TMDB Rating: ${media.vote_average.toFixed(
                              1,
                            )}`}
                          >
                            <IconStarFilled
                              size={15}
                              className={`text-lime-400`}
                            />
                            <span className={`text-xs text-neutral-300`}>
                              {media.vote_average.toFixed(1)}
                            </span>
                          </div>
                        </>
                      )}

                    {media.release_year && (
                      <div className={`pr-2 flex items-center`}>
                        <span className={`text-xs text-neutral-300`}>
                          {media.release_year}
                        </span>
                      </div>
                    )}
                  </div>
                </section>
              </Link>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
