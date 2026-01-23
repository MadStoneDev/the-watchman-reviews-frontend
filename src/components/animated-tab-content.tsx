"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

interface AnimatedTabContentProps {
  children: React.ReactNode;
  tabIndex: number; // 0 = Activity, 1 = Collections, 2 = Achievements
}

const STORAGE_KEY = "public-profile-tab-index";

export default function AnimatedTabContent({
  children,
  tabIndex,
}: AnimatedTabContentProps) {
  const [direction, setDirection] = useState<"left" | "right" | "none">("none");
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Only animate on initial mount, not on re-renders
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    // Get previous tab index from sessionStorage
    const prevIndexStr = sessionStorage.getItem(STORAGE_KEY);
    const prevIndex = prevIndexStr !== null ? parseInt(prevIndexStr, 10) : tabIndex;

    // Store current index for next navigation
    sessionStorage.setItem(STORAGE_KEY, tabIndex.toString());

    // Determine direction and animate
    if (prevIndex !== tabIndex) {
      const newDirection = tabIndex > prevIndex ? "right" : "left";
      setDirection(newDirection);
      setShouldAnimate(true);

      // Reset animation state after completion
      const timer = setTimeout(() => {
        setShouldAnimate(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [tabIndex]);

  return (
    <div
      className={`${
        shouldAnimate
          ? direction === "right"
            ? "animate-slide-in-right"
            : "animate-slide-in-left"
          : ""
      }`}
    >
      {children}

      <style jsx global>{`
        @keyframes slideInRight {
          from {
            transform: translateX(40px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-40px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
