import React, { useEffect, useRef, useState } from "react";

import {
  IconBed,
  IconFlame,
  IconGhost2,
  IconStarFilled,
  IconSwords,
  IconUsers,
} from "@tabler/icons-react";
import { StatBlock } from "@/components/media-block";

interface SpecialMediaBlockProps {
  myIndex: number;
  activeIndex: number;
  timerProgress: number;
  setActiveBlock: React.Dispatch<React.SetStateAction<number>>;
  setTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SpecialMediaBlock({
  myIndex = 0,
  activeIndex = 0,
  timerProgress,
  setActiveBlock,
  setTimerRunning,
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

      // Check if mouse is over
      if (isMouseOver.current) {
        setTimerRunning(false);
      }
    } else {
      setDisplayAnimation(false);
      setActivateMe(false);
      setShowInfo(false);
    }
  }, [myIndex, activeIndex, setTimerRunning]);

  return (
    <article
      className={`group relative ${
        activateMe ? "w-[650px]" : "cursor-pointer w-[40px]"
      } h-[430px] duration-700 overflow-hidden transition-all ease-in-out`}
    >
      {/* Bottom-Most Row */}
      <div
        className={`pt-12 ${showInfo ? "" : "absolute hidden"} ${
          activateMe ? "flex " : ""
        } flex-col w-full h-full overflow-hidden z-0 transition-all duration-300 ease-in-out`}
      >
        {/* Writing Block */}
        <div
          className={`flex-grow relative grid grid-cols-2 w-full bg-neutral-800 rounded-2xl overflow-hidden transition-all duration-300 ease-in-out`}
          style={{
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
          onClick={handleMakeActive}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <div
            className={`absolute bottom-0 h-0.5 bg-lime-400 z-50 transition-all duration-300 ease-in-out`}
            style={{
              width: activateMe ? `${Math.ceil(timerProgress)}%` : "0%",
              transition: `width 0.2s ease`,
            }}
          ></div>

          {/* Fake Column */}
          <div></div>

          {/* Information Column */}
          <div
            className={`${showInfo ? "flex" : "hidden"} ${
              displayAnimation ? "opacity-100" : "opacity-0"
            } pr-8 py-8 flex-col gap-7`}
            style={{
              transition: `${
                displayAnimation
                  ? "opacity 1s ease-in-out"
                  : "opacity 0.3s ease-in-out"
              }`,
            }}
          >
            {/* Card Header */}
            <div className={`flex flex-col gap-3`}>
              <h3 className={`text-lg font-bold`}>
                ({myIndex}) The Kingdom of Heaven
              </h3>

              <div className={`flex gap-3 items-center text-neutral-400`}>
                <div className={`flex gap-1 items-center text-lime-400`}>
                  <IconStarFilled size={15} className={`text-lime-400`} />
                  <IconStarFilled size={15} className={`text-lime-400`} />
                  <IconStarFilled size={15} className={`text-lime-400`} />
                  <IconStarFilled size={15} className={`text-lime-400`} />
                  <IconStarFilled size={15} className={`text-lime-400`} />
                </div>
                <div className={`w-[1px] h-full bg-neutral-400`}></div>
                <span className={`text-xs`}>2024</span>
              </div>
            </div>

            {/* Review Summary */}
            <div className={`flex-grow text-neutral-400`}>
              <p className={`text-xs leading-loose`}>
                She is a devil princess from the something something and this is
                meant to be a summary of a movie review.
              </p>
            </div>

            {/* Statics */}
            <div className={`flex flex-col gap-1`}>
              <h4 className={`text-sm font-bold text-neutral-200`}>
                Statistics:
              </h4>

              <div
                className={`px-3 py-4 flex flex-row flex-wrap items-center gap-2 lg:gap-2 bg-neutral-900 rounded-xl text-neutral-300`}
              >
                <StatBlock
                  title={"Horror"}
                  value={100}
                  icon={<IconGhost2 size={14} className={`z-30`} />}
                  colour={"#a3a3a3"}
                />

                <div
                  className={`hidden lg:block w-[1px] h-1/2 bg-neutral-700`}
                ></div>

                <StatBlock
                  title={"Violence"}
                  value={60}
                  icon={<IconSwords size={14} className={`z-30`} />}
                  colour={"#4f46e5"}
                />

                <div
                  className={`hidden lg:block w-[1px] h-1/2 bg-neutral-700`}
                ></div>

                <StatBlock
                  title={"Nudity"}
                  value={80}
                  icon={<IconBed size={15} className={`z-30`} />}
                  colour={"#e11d48"}
                />

                <div
                  className={`hidden lg:block w-[1px] h-1/2 bg-neutral-700`}
                ></div>

                <StatBlock
                  title={"Sexual Content"}
                  value={100}
                  icon={<IconFlame size={15} className={`z-30`} />}
                  colour={"#f97316"}
                />

                <div
                  className={`hidden lg:block w-[1px] h-1/2 bg-neutral-700`}
                ></div>

                <StatBlock
                  title={"Age Rating"}
                  value={50}
                  icon={<IconUsers size={14} className={`z-30`} />}
                  colour={"#22d3ee"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top-Most Row */}
      <div
        className={`pointer-events-none ${
          showInfo ? "absolute" : "relative group-hover:-translate-y-11"
        } top-0 left-0 right-0 h-full z-10 transition-all duration-300 ease-in-out`}
      >
        <div
          className={`grid ${
            activateMe ? "grid-cols-2" : ""
          } h-full z-10 transition-all duration-300 ease-in-out`}
        >
          {/* Image */}
          <div
            className={`${
              activateMe ? "px-8 pb-8" : "pt-12"
            } transition-all duration-300 ease-in-out`}
          >
            <div
              className={`pointer-events-auto w-full min-w-[40px] max-w-[260px] h-full bg-rose-800 transition-all duration-300 ease-in-out`}
              onClick={handleMakeActive}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            ></div>
          </div>

          {/* Fake Column */}
          <div className={`${activateMe ? "" : "hidden"}`}></div>
        </div>
      </div>
    </article>
  );
}
