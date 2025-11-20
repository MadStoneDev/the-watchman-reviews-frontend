"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconStarFilled, IconMovie, IconDeviceTv } from "@tabler/icons-react";

interface FeaturedMedia {
  id: string;
  title: string;
  overview: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  release_year: string | null;
  vote_average: number | null;
  media_type: "movie" | "series";
  tmdb_id: number;
}

interface SpecialMediaBlockProps {
  myIndex: number;
  activeIndex: number;
  timerProgress: number;
  timerRunning: boolean;
  setActiveBlock: React.Dispatch<React.SetStateAction<number>>;
  setTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
  media: FeaturedMedia;
}

export default function SpecialMediaBlock({
  myIndex = 0,
  activeIndex = 0,
  timerProgress,
  timerRunning,
  setActiveBlock,
  setTimerRunning,
  media,
}: SpecialMediaBlockProps) {
  // States
  const [activateMe, setActivateMe] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [displayAnimation, setDisplayAnimation] = useState(false);

  // Refs
  const isMouseOver = useRef(false);

  // Functions
  const handleMakeActive = () => {
    setActiveBlock(myIndex);
  };

  const handleMouseEnter = () => {
    isMouseOver.current = true;
    if (activeIndex === myIndex) setTimerRunning(false);
  };

  const handleMouseLeave = () => {
    isMouseOver.current = false;
    setTimerRunning(true);
  };

  const handleMouseMove = () => {
    if (activeIndex === myIndex && isMouseOver.current) setTimerRunning(false);
  };

  // Effects
  useEffect(() => {
    if (myIndex === activeIndex) {
      setActivateMe(true);
      setShowInfo(true);

      setTimeout(() => {
        setDisplayAnimation(true);
      }, 400);

      if (isMouseOver.current) {
        setTimerRunning(false);
      }
    } else {
      setDisplayAnimation(false);
      setActivateMe(false);
      setShowInfo(false);
    }
  }, [myIndex, activeIndex, setTimerRunning]);

  // Get media URL
  const mediaUrl =
    media.media_type === "movie"
      ? `/movies/${media.id}`
      : `/series/${media.id}`;

  // Format rating as stars (out of 5)
  const renderStars = () => {
    if (!media.vote_average) return null;

    const rating = Math.round((media.vote_average / 10) * 5); // Convert 0-10 to 0-5
    const stars = [];

    for (let i = 0; i < 5; i++) {
      stars.push(
        <IconStarFilled
          key={i}
          size={15}
          className={i < rating ? "text-lime-400" : "text-neutral-600"}
        />,
      );
    }

    return <div className="flex gap-1 items-center">{stars}</div>;
  };

  return (
    <article
      className={`group relative w-full ${
        activateMe
          ? "min-w-auto md:min-w-auto sm:lg:min-w-[650px] max-w-full md:max-w-full sm:lg:max-w-[999px]"
          : "cursor-pointer min-w-[10px] max-w-[40px]"
      } h-auto md:h-auto sm:lg:h-[430px] duration-700 overflow-hidden transition-all ease-in-out`}
      onClick={handleMakeActive}
    >
      {/* Back Row - Info Panel */}
      <div
        className={`pt-0 md:pt-0 sm:lg:pt-12 ${
          showInfo ? "" : "absolute hidden"
        } ${
          activateMe ? "flex " : ""
        } flex-col w-full h-full overflow-hidden z-0 transition-all duration-300 ease-in-out`}
      >
        {/* Main Block */}
        <div
          className={`flex-grow relative flex w-full bg-transparent md:bg-transparent sm:lg:bg-neutral-800 rounded-2xl border-[1px] border-transparent md:border-transparent sm:lg:border-neutral-50/30 overflow-hidden transition-all duration-300 ease-in-out`}
          style={{
            backdropFilter: "blur(5px)",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          {/* Timer Indicator */}
          <div
            className={`absolute bottom-0 ${
              timerRunning ? "h-0.5 bg-lime-400" : "h-1 bg-rose-700"
            } z-50 transition-all duration-300 ease-in-out`}
            style={{
              width: activateMe ? `${Math.ceil(timerProgress)}%` : "0%",
              transition: `width 0.2s ease`,
            }}
          />

          {/* Fake Column for Poster Space */}
          <div className={`w-[40%] md:w-[40%] sm:lg:min-w-[324px]`} />

          {/* Information Column */}
          <div
            className={`${showInfo ? "flex" : "hidden"} ${
              displayAnimation ? "opacity-100" : "opacity-0"
            } w-[60%] md:w-[60%] sm:lg:w-auto pl-4 md:pl-4 sm:lg:pl-4 pr-0 md:pr-0 sm:lg:pr-8 py-8 flex-col gap-6 justify-center`}
            style={{
              transition: displayAnimation
                ? "opacity 1s ease-in-out"
                : "opacity 0.3s ease-in-out",
            }}
          >
            {/* Card Header */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                {media.media_type === "movie" ? (
                  <IconMovie size={20} className="text-lime-400" />
                ) : (
                  <IconDeviceTv size={20} className="text-lime-400" />
                )}
                <span className="text-xs text-neutral-400 uppercase tracking-wide">
                  {media.media_type === "movie" ? "Movie" : "TV Series"}
                </span>
              </div>

              <h3 className="text-lg md:text-xl font-bold leading-tight">
                {media.title}
              </h3>

              <div className="flex gap-3 items-center text-neutral-400">
                {renderStars()}
                {media.vote_average && (
                  <>
                    <div className="w-[1px] h-4 bg-neutral-600" />
                    <span className="text-xs font-semibold">
                      {media.vote_average.toFixed(1)}
                    </span>
                  </>
                )}
                {media.release_year && (
                  <>
                    <div className="w-[1px] h-4 bg-neutral-600" />
                    <span className="text-xs">{media.release_year}</span>
                  </>
                )}
              </div>
            </div>

            {/* Overview */}
            {media.overview && (
              <div className="flex-grow">
                <p className="text-xs md:text-sm leading-relaxed text-neutral-300 line-clamp-4">
                  {media.overview}
                </p>
              </div>
            )}

            {/* CTA Button */}
            <div>
              <Link
                href={mediaUrl}
                className="inline-flex items-center gap-2 px-4 py-2 bg-lime-400 hover:bg-lime-500 text-neutral-900 font-semibold rounded-lg transition-colors text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Front Row - Poster */}
      <div
        className={`pointer-events-none ${
          showInfo ? "absolute" : "relative group-hover:-translate-y-11"
        } top-0 left-0 right-0 h-full z-10 transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-nowrap w-full h-full z-10 transition-all duration-300 ease-in-out">
          {/* Poster Image */}
          <div
            className={`${
              activateMe
                ? "px-0 sm:px-8 md:px-0 lg:px-8 pb-0 md:pb-0 sm:lg:pb-8"
                : "pt-12"
            } w-full transition-all duration-300 ease-in-out`}
          >
            <div
              className={`pointer-events-auto relative w-full min-w-[40px] max-w-[40%] md:max-w-[40%] sm:lg:max-w-[260px] h-full rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out ${
                !activateMe && "cursor-pointer hover:scale-105"
              }`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            >
              {media.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                  alt={media.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 40vw, (max-width: 1024px) 260px, 260px"
                />
              ) : (
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                  {media.media_type === "movie" ? (
                    <IconMovie size={48} className="text-neutral-600" />
                  ) : (
                    <IconDeviceTv size={48} className="text-neutral-600" />
                  )}
                </div>
              )}

              {/* Backdrop overlay when not active */}
              {!activateMe && media.backdrop_path && (
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
