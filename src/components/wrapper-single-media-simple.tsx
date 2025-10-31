"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import GoBack from "@/src/components/go-back";

interface MediaItem {
  id: number;
  title: string;
  tagline: string;
  backdrop: string;
  poster: string;
  imdb_id: string;
  overview: string;
  date: string;
  rating: number;
  adult: boolean;
}

interface SingleMediaWrapperProps {
  mediaData: MediaItem;
}

export default function SingleMediaWrapperSimple({
  mediaData,
}: SingleMediaWrapperProps) {
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
      <section className="relative z-10">
        <GoBack />
      </section>

      {/* Spacing for mobile */}
      <div className="block md:hidden h-[40dvh]"></div>

      <div className="absolute top-0 md:top-auto left-0 md:left-auto right-0 md:right-auto md:relative">
        {/* Backdrop Image */}
        <section className="relative md:mt-5 h-[50dvh] md:h-[500px] md:rounded-3xl transition-all duration-300 ease-in-out overflow-hidden">
          {mediaData.backdrop && (
            <Image
              className="bg-neutral-800 object-cover"
              src={`https://image.tmdb.org/t/p/original${mediaData.backdrop}`}
              alt={`${mediaData.title} Backdrop`}
              fill
              priority
              sizes="100vw"
            />
          )}

          {/* Gradient Overlay for mobile */}
          <div className="md:hidden absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-100"></div>
        </section>

        {/* Title Section */}
        <section className="absolute md:relative bottom-0 left-0 right-0 mt-12 p-5 md:p-0 transition-all duration-300 ease-in-out z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            {mediaData.title}
          </h1>
          {mediaData.tagline && (
            <p className="text-lg text-neutral-400 mt-2">{mediaData.tagline}</p>
          )}
        </section>
      </div>

      {/* Content Section */}
      <section className="mt-6 sm:mt-12 grid lg:grid-cols-3 gap-8 transition-all duration-300 ease-in-out">
        {/* Main Content - Overview */}
        <article className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-200 mb-3">
              Overview
            </h2>
            <p className="text-neutral-400 leading-relaxed text-base">
              {mediaData.overview || "No overview available."}
            </p>
          </div>
        </article>

        {/* Sidebar - Media Info */}
        <article className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 h-fit space-y-6">
          {/* Poster */}
          {mediaData.poster && (
            <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden border-2 border-neutral-800">
              <Image
                src={`https://image.tmdb.org/t/p/${posterSize}${mediaData.poster}`}
                alt={`${mediaData.title} Poster`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          )}

          {/* Details */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-200 mb-4">
              Details
            </h2>

            <div className="space-y-4">
              {/* Release Date */}
              {mediaData.date && (
                <div>
                  <dt className="text-neutral-500 text-xs font-medium uppercase tracking-wider mb-1">
                    Release Date
                  </dt>
                  <dd className="text-neutral-200">
                    {new Date(mediaData.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </dd>
                </div>
              )}

              {/* Rating */}
              {mediaData.rating > 0 && (
                <div>
                  <dt className="text-neutral-500 text-xs font-medium uppercase tracking-wider mb-1">
                    Rating
                  </dt>
                  <dd className="text-neutral-200">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500 text-lg">★</span>
                        <span className="font-semibold">
                          {mediaData.rating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-neutral-500">/ 10</span>
                    </div>
                  </dd>
                </div>
              )}

              {/* IMDb Link */}
              {mediaData.imdb_id && (
                <div>
                  <dt className="text-neutral-500 text-xs font-medium uppercase tracking-wider mb-1">
                    IMDb
                  </dt>
                  <dd>
                    <a
                      href={`https://www.imdb.com/title/${mediaData.imdb_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-lime-400 hover:text-lime-300 transition-colors"
                    >
                      View on IMDb
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </dd>
                </div>
              )}

              {/* TMDB Link */}
              <div>
                <dt className="text-neutral-500 text-xs font-medium uppercase tracking-wider mb-1">
                  TMDB
                </dt>
                <dd>
                  <a
                    href={`https://www.themoviedb.org/movie/${mediaData.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-lime-400 hover:text-lime-300 transition-colors"
                  >
                    View on TMDB
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </dd>
              </div>

              {/* Adult Content Warning */}
              {mediaData.adult && (
                <div className="pt-4 border-t border-neutral-800">
                  <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-3">
                    <p className="text-red-400 text-xs font-medium">
                      ⚠️ Adult Content
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>
      </section>
    </>
  );
}
