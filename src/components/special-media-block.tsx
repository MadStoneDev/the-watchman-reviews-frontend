import React, { useEffect, useRef, useState } from "react";

import {
  IconBuildingCircus,
  IconEyeOff,
  IconFlame,
  IconGhost2,
  IconHeart,
  IconMessage,
  IconMessages,
  IconStarFilled,
  IconSwords,
  IconUsers,
} from "@tabler/icons-react";
import { CircularProgress } from "@mui/material";
import { Dices } from "lucide-react";

interface SpecialMediaBlockProps {
  myIndex: number;
  activeIndex: number;
  timerProgress: number;
  timerRunning: boolean;
  setActiveBlock: React.Dispatch<React.SetStateAction<number>>;
  setTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SpecialMediaBlock({
  myIndex = 0,
  activeIndex = 0,
  timerProgress,
  timerRunning,
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
      className={`group relative w-full ${
        activateMe
          ? "min-w-auto md:min-w-auto sm:lg:min-w-[650px] max-w-full md:max-w-full sm:lg:max-w-[999px]"
          : "cursor-pointer min-w-[10px] max-w-[40px]"
      } h-auto md:h-auto sm:lg:h-[430px] duration-700 overflow-hidden transition-all ease-in-out`}
      onClick={handleMakeActive}
    >
      {/* Back Row */}
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
          ></div>

          {/* Fake Column */}
          <div className={`w-[40%] md:w-[40%] sm:lg:min-w-[324px]`}></div>

          {/* Information Column */}
          <div
            className={`${showInfo ? "flex" : "hidden"} ${
              displayAnimation ? "opacity-100" : "opacity-0"
            } w-[60%] md:w-[60%] sm:lg:w-auto pl-4 md:pl-4 sm:lg:pl-4 pr-0 md:pr-0 sm:lg:pr-8 py-8 flex-col gap-7`}
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

            {/* Statistics */}
            <div className={`flex flex-col gap-1`}>
              <h4 className={`text-sm font-bold text-neutral-200`}>
                Statistics:
              </h4>

              <div
                className={`px-3 py-2.5 flex flex-row flex-wrap items-center gap-2 lg:gap-2 bg-neutral-900 rounded-xl text-neutral-300 transition-all duration-300 ease-in-out`}
              >
                {/* Horror */}
                {/* Violence */}
                {/* Nudity */}
                {/* Sexual Content */}
                {/* Substance Abuse */}
                {/* Rainbow Meter */}

                <StatBlock
                  title={"Horror"}
                  value={100}
                  icon={<IconGhost2 size={16} className={`text-neutral-300`} />}
                  colour={"#d6d3d1"}
                />

                <div
                  className={`hidden lg:block w-[1px] h-1/2 bg-neutral-700`}
                ></div>

                <StatBlock
                  title={"Violence"}
                  value={60}
                  icon={<IconSwords size={15} className={`text-violet-500`} />}
                  colour={"#8b5cf6"}
                />

                <div
                  className={`hidden lg:block w-[1px] h-1/2 bg-neutral-700`}
                ></div>

                <StatBlock
                  title={"Profanity and Language"}
                  value={25}
                  icon={
                    <IconMessages size={18} className={`text-yellow-400`} />
                  }
                  colour={"#facc15"}
                />

                <div
                  className={`hidden lg:block w-[1px] h-1/2 bg-neutral-700`}
                ></div>

                <StatBlock
                  title={"Nudity"}
                  value={80}
                  icon={<IconEyeOff size={17} className={`text-orange-500`} />}
                  colour={"#f97316"}
                />

                <div
                  className={`hidden lg:block w-[1px] h-1/2 bg-neutral-700`}
                ></div>

                <StatBlock
                  title={"Sexual Content"}
                  value={100}
                  icon={<IconHeart size={16} className={`text-rose-600`} />}
                  colour={"#dc2626"}
                />

                <div
                  className={`hidden lg:block w-[1px] h-1/2 bg-neutral-700`}
                ></div>

                <StatBlock
                  title={"Gambling Content"}
                  value={50}
                  icon={<Dices size={17} className={`text-sky-400`} />}
                  colour={"#0ea5e9"}
                />

                <div
                  className={`hidden lg:block w-[1px] h-1/2 bg-neutral-700`}
                ></div>

                <StatBlock
                  title={"Age Rating"}
                  value={50}
                  icon={
                    <IconBuildingCircus size={17} className={`text-pink-400`} />
                  }
                  colour={"#fb7185"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Front Row */}
      <div
        className={`pointer-events-none ${
          showInfo ? "absolute" : "relative group-hover:-translate-y-11"
        } top-0 left-0 right-0 h-full z-10 transition-all duration-300 ease-in-out`}
      >
        <div
          className={`flex flex-nowrap w-full h-full z-10 transition-all duration-300 ease-in-out`}
        >
          {/* Image */}
          <div
            className={`${
              activateMe
                ? "px-0 sm:px-8 md:px-0 lg:px-8 pb-0 md:pb-0 sm:lg:pb-8"
                : "pt-12"
            } w-full transition-all duration-300 ease-in-out`}
          >
            <div
              className={`pointer-events-auto w-full min-w-[40px] max-w-[40%] md:max-w-[40%] sm:lg:max-w-[260px] h-full bg-rose-800 transition-all duration-300 ease-in-out`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            ></div>
          </div>
        </div>
      </div>
    </article>
  );
}

export const StatBlock = ({
  title,
  value,
  icon = <IconUsers size={16} />,
  colour = "lime-600",
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
      >
        {icon}
      </div>
    </article>
  );
};
