"use client";

import React, { useEffect, useRef, useState } from "react";
import SpecialMediaBlock from "@/components/special-media-block";

export default function SpecialBlockWrapper() {
  // States
  const [activeBlock, setActiveBlock] = useState(0);
  const [blocksToShow, setBlocksToShow] = useState(5);

  const [isLoading, setIsLoading] = useState(true);

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
  const handleResize = () => {
    if (window.innerWidth > breakpoints["3xl"]) {
      setBlocksToShow(20);
      if (activeBlock > 19) setActiveBlock(19);
    } else if (window.innerWidth > breakpoints["2xl"]) {
      setBlocksToShow(15);
      if (activeBlock > 14) setActiveBlock(14);
    } else if (window.innerWidth > breakpoints.xl) {
      setBlocksToShow(9);
      if (activeBlock > 8) setActiveBlock(8);
    } else if (window.innerWidth > breakpoints.lg) {
      setBlocksToShow(5);
      if (activeBlock > 4) setActiveBlock(4);
    } else if (window.innerWidth > breakpoints.md) {
      setBlocksToShow(1);
      if (activeBlock > 0) setActiveBlock(0);
    } else if (window.innerWidth > breakpoints.sm) {
      setBlocksToShow(2);
      if (activeBlock > 1) setActiveBlock(1);
    } else {
      setBlocksToShow(1);
      if (activeBlock > 0) setActiveBlock(0);
    }
  };

  const resetTimer = (shouldReset = true) => {
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
  };

  const pauseTimer = () => {
    if (blockTimer.current) {
      clearInterval(blockTimer.current);
    }

    pausedTime.current = Date.now() - (startTime.current || 0);
  };

  // Effects
  useEffect(() => {
    handleResize();

    // Add Event Listener on Resize
    window.addEventListener("resize", handleResize);

    setIsLoading(false);

    // Remove Event Listener on Resize
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
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
  }, [timerRunning]);

  useEffect(() => {
    resetTimer(true);
  }, [activeBlock, blocksToShow]);

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
            setTimerRunning={setTimerRunning}
          />
        ))}
    </>
  );
}
