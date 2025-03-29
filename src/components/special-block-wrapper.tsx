"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import SpecialMediaBlock from "@/src/components/special-media-block";

export default function SpecialBlockWrapper() {
  // States
  const [activeBlock, setActiveBlock] = useState(0);
  const [blocksToShow, setBlocksToShow] = useState(5);

  const [isLoading, setIsLoading] = useState(true);

  const [timerMaster, setTimerMaster] = useState(true); // True means on, false means off
  const [timerRunning, setTimerRunning] = useState(true);
  const [timerProgress, setTimerProgress] = useState(0);

  // Refs
  const blockTimer = useRef<any>(null);
  const startTime = useRef<number | null>(null);
  const pausedTime = useRef<number | null>(null);

  // Constants
  const TIMER_DURATION = 10000;
  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
    "3xl": 1920,
  };

  // Functions
  const handleResize = useCallback(() => {
    let newBlocksToShow = 0;

    if (window.innerWidth > breakpoints["3xl"]) {
      newBlocksToShow = 20;
    } else if (window.innerWidth > breakpoints["2xl"]) {
      newBlocksToShow = 12;
    } else if (window.innerWidth > breakpoints.xl) {
      newBlocksToShow = 6;
    } else if (window.innerWidth > breakpoints.lg) {
      newBlocksToShow = 3;
    } else if (window.innerWidth > breakpoints.md) {
      newBlocksToShow = 1;
    } else if (window.innerWidth > breakpoints.sm) {
      newBlocksToShow = 2;
    } else {
      newBlocksToShow = 1;
    }

    setBlocksToShow(newBlocksToShow);
    setActiveBlock((prevActive) => {
      return Math.min(prevActive, newBlocksToShow - 1);
    });

    setTimerMaster(newBlocksToShow > 1);
    resetTimer(true);
  }, []);

  const resetTimer = useCallback(
    (shouldReset = true) => {
      if (!timerMaster) {
        setTimerRunning(false);
        setTimerProgress(0);
        return;
      }

      if (blockTimer.current) {
        clearInterval(blockTimer.current);
      }

      if (shouldReset) {
        setTimerProgress(0);
        startTime.current = Date.now();
        pausedTime.current = null;
      } else if (pausedTime.current !== null) {
        // Resume Timer
        startTime.current = Date.now() - (pausedTime.current || 0);
        pausedTime.current = null;
      }

      blockTimer.current = setInterval(() => {
        const elapsed = Date.now() - (startTime.current || 0);
        const progress = Math.min((elapsed / TIMER_DURATION) * 100, 100);
        setTimerProgress(progress);

        if (progress >= 100) {
          setActiveBlock((prevActive) => (prevActive + 1) % blocksToShow);
          resetTimer();
        }
      }, 50);
    },
    [timerMaster, blocksToShow]
  );

  const pauseTimer = useCallback(() => {
    if (blockTimer.current) {
      clearInterval(blockTimer.current);
    }

    pausedTime.current = Date.now() - (startTime.current || 0);
  }, []);

  // Effects
  useEffect(() => {
    handleResize();

    // Add Event Listener on Resize
    window.addEventListener("resize", handleResize);

    setIsLoading(false);

    // Remove Event Listener on Resize
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (blocksToShow < 2) {
      setActiveBlock(0);
      setTimerMaster(false);
      setTimerRunning(false);
      setTimerProgress(0);
      return;
    }

    if (!timerMaster) {
      setTimerRunning(false);
      setTimerProgress(0);
      return;
    }

    if (timerRunning) {
      resetTimer(false);
    } else if (blockTimer.current) {
      pauseTimer();
    }

    return () => {
      if (blockTimer.current) {
        clearInterval(blockTimer.current!);
      }
    };
  }, [timerRunning, timerMaster, resetTimer, pauseTimer]);

  useEffect(() => {
    if (!timerMaster) {
      setTimerRunning(false);
      setTimerProgress(0);
      return;
    }

    resetTimer(true);
  }, [activeBlock, blocksToShow, timerMaster, resetTimer]);

  return (
    <>
      {!isLoading &&
        Array.from({ length: blocksToShow }, (_, i) => i).map((index) => (
          <SpecialMediaBlock
            key={index}
            myIndex={index}
            activeIndex={activeBlock}
            setActiveBlock={setActiveBlock}
            timerProgress={timerProgress}
            timerRunning={timerRunning}
            setTimerRunning={setTimerRunning}
          />
        ))}
    </>
  );
}
