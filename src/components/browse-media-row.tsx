"use client";

import React, { useEffect, useState } from "react";

import { Popcorn } from "lucide-react";
import { IconStarFilled } from "@tabler/icons-react";
import { dummyReviewList } from "@/data/dummy-review-list";

interface BrowseMediaRowProps {
  data?: any[];
  type?: "newest" | "movies" | "series" | "kids";
  title?: string;
  max?: number;
}

export function BrowseMediaRow({
  data = [],
  type = "newest",
  title = "Newest Reviews",
  max = 20,
}: BrowseMediaRowProps) {
  // Temporary data
  data = [...dummyReviewList];

  // States
  const [isLoading, setIsLoading] = useState(true);
  const [filteredData, setFilteredData] = useState(data);

  // Functions
  const filterData = () => {
    const sortedData = data.sort(
      (a, b) =>
        new Date(b.reviewed_at).getTime() - new Date(a.reviewed_at).getTime(),
    );

    if (type === "newest") {
      return sortedData.slice(0, max);
    } else if (type === "movies") {
      return sortedData.filter((item) => item.type === "movie").slice(0, max);
    } else if (type === "series") {
      return sortedData.filter((item) => item.type === "series").slice(0, max);
    } else if (type === "kids") {
      return sortedData.filter((item) => item.ageRating < 16).slice(0, max);
    } else {
      return data.slice(0, max);
    }
  };

  const getYear = (date: string) => {
    const dateObject = new Date(date);
    return dateObject.getFullYear();
  };

  // Effects
  useEffect(() => {
    setFilteredData(filterData());
    setIsLoading(false);
  }, []);

  return (
    <section className={`mt-24 flex flex-col`}>
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
        {!isLoading &&
          filteredData.map((media, index) => (
            <article
              key={`${type}-review-${index}`}
              className={`pb-5 flex flex-col justify-between gap-4 min-w-[180px] max-w-[180px] rounded-3xl transition-all duration-300 ease-in-out`}
              style={{
                scrollSnapAlign: "center",
              }}
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
                    {media.title}
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
                    <span className={`text-xs text-neutral-300`}>
                      {media.rating}
                    </span>
                  </div>
                  <div className={`pr-2 flex items-center`}>
                    <span className={`text-xs text-neutral-300`}>
                      {getYear(media.releaseDate)}
                    </span>
                  </div>
                </div>
              </section>
            </article>
          ))}
      </div>
    </section>
  );
}
