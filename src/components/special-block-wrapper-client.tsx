"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import SpecialMediaBlock from "@/src/components/special-media-block";
import SpecialMediaBlockSkeleton from "@/src/components/special-media-block-skeleton";

const TIMER_DURATION = 10000;

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "3xl": 1920,
} as const;

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

interface SpecialBlockWrapperClientProps {
  featuredMedia: FeaturedMedia[];
}

export default function SpecialBlockWrapperClient({
                                                    featuredMedia,
                                                  }: SpecialBlockWrapperClientProps) {
  // States
  const [activeBlock, setActiveBlock] = useState(0);
  const [blocksToShow, setBlocksToShow] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [timerMaster, setTimerMaster] = useState(true);
  const [timerRunning, setTimerRunning] = useState(true);
  const [timerProgress, setTimerProgress] = useState(0);

  // Refs
  const blockTimer = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<number | null>(null);
  const pausedTime = useRef<number | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (blockTimer.current) {
        clearInterval(blockTimer.current);
      }
    };
  }, []);

  // Reset timer function
  const resetTimer = useCallback(
      (shouldReset: boolean = true) => {
        if (blockTimer.current) {
          clearInterval(blockTimer.current);
          blockTimer.current = null;
        }

        if (!timerMaster) {
          setTimerRunning(false);
          setTimerProgress(0);
          return;
        }

        if (shouldReset) {
          setTimerProgress(0);
          startTime.current = Date.now();
          pausedTime.current = null;
        } else if (pausedTime.current !== null) {
          startTime.current = Date.now() - pausedTime.current;
          pausedTime.current = null;
        }

        blockTimer.current = setInterval(() => {
          const elapsed = Date.now() - (startTime.current || 0);
          const progress = Math.min((elapsed / TIMER_DURATION) * 100, 100);

          setTimerProgress(progress);

          if (progress >= 100) {
            setActiveBlock((prev) => {
              const nextBlock = (prev + 1) % blocksToShow;
              return nextBlock;
            });

            startTime.current = Date.now();
            setTimerProgress(0);
          }
        }, 50);
      },
      [timerMaster, blocksToShow],
  );

  const pauseTimer = useCallback(() => {
    if (blockTimer.current) {
      clearInterval(blockTimer.current);
      blockTimer.current = null;
    }
    pausedTime.current = Date.now() - (startTime.current || 0);
  }, []);

  const calculateBlocksToShow = useCallback(
      (width: number): number => {
        if (width > BREAKPOINTS["3xl"]) return Math.min(featuredMedia.length, 20);
        if (width > BREAKPOINTS["2xl"]) return Math.min(featuredMedia.length, 12);
        if (width > BREAKPOINTS.xl) return Math.min(featuredMedia.length, 6);
        if (width > BREAKPOINTS.lg) return Math.min(featuredMedia.length, 3);
        if (width > BREAKPOINTS.md) return 1;
        if (width > BREAKPOINTS.sm) return Math.min(featuredMedia.length, 2);
        return 1;
      },
      [featuredMedia.length],
  );

  const handleResize = useCallback(() => {
    const newBlocksToShow = calculateBlocksToShow(window.innerWidth);

    setBlocksToShow(newBlocksToShow);
    setActiveBlock((prevActive) => Math.min(prevActive, newBlocksToShow - 1));
    setTimerMaster(newBlocksToShow > 1);

    if (newBlocksToShow > 1) {
      resetTimer(true);
    }
  }, [calculateBlocksToShow, resetTimer]);

  useEffect(() => {
    handleResize();
    setIsLoading(false);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    if (blocksToShow < 2) {
      setActiveBlock(0);
      setTimerMaster(false);
      setTimerRunning(false);
      setTimerProgress(0);
      if (blockTimer.current) {
        clearInterval(blockTimer.current);
        blockTimer.current = null;
      }
      return;
    }

    if (!timerMaster) {
      setTimerRunning(false);
      setTimerProgress(0);
      if (blockTimer.current) {
        clearInterval(blockTimer.current);
        blockTimer.current = null;
      }
      return;
    }

    if (timerRunning) {
      resetTimer(false);
    } else {
      pauseTimer();
    }

    return () => {
      if (blockTimer.current) {
        clearInterval(blockTimer.current);
        blockTimer.current = null;
      }
    };
  }, [timerRunning, timerMaster, blocksToShow, resetTimer, pauseTimer]);

  useEffect(() => {
    if (!timerMaster || blocksToShow < 2) return;

    if (timerProgress === 0 || timerProgress >= 100) {
      resetTimer(true);
    }
  }, [activeBlock]);

  // Return message if absolutely no media exists
  if (featuredMedia.length === 0) {
    return (
        <div className="w-full p-12 bg-neutral-900 rounded-lg border border-neutral-800 text-center">
          <p className="text-neutral-500">
            No media available yet. Add some movies or series to get started!
          </p>
        </div>
    );
  }

  // Show skeleton loaders while loading
  if (isLoading) {
    return (
        <>
          {Array.from({ length: 5 }, (_, i) => (
              <SpecialMediaBlockSkeleton key={`skeleton-${i}`} isActive={i === 0} />
          ))}
        </>
    );
  }

  return (
      <>
        {Array.from({ length: blocksToShow }, (_, i) => i).map((index) => {
          // Get the media for this block (cycle through available media)
          const mediaIndex = index % featuredMedia.length;
          const media = featuredMedia[mediaIndex];

          return (
              <SpecialMediaBlock
                  key={`${media.id}-${index}`}
                  myIndex={index}
                  activeIndex={activeBlock}
                  setActiveBlock={setActiveBlock}
                  timerProgress={timerProgress}
                  timerRunning={timerRunning}
                  setTimerProgress={setTimerProgress}
                  setTimerRunning={setTimerRunning}
                  media={media}
              />
          );
        })}
      </>
  );
}