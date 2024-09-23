"use client";

import React, { useMemo } from "react";

export default function SearchSkeletonBoundary() {
  const randomDelay = useMemo(() => Math.floor(Math.random() * 1000), []);

  return (
    <section className={`flex flex-col gap-10 opacity-75`}>
      <div className={`flex flex-row gap-3 items-center`}>
        <div
          className={`flex-grow h-10 bg-neutral-800/50 rounded-md animate-skeleton`}
          style={{
            animationDelay: `${randomDelay}ms`,
          }}
        />
        <div
          className={`w-[105px] h-10 bg-neutral-800/50 rounded-md animate-skeleton`}
          style={{
            animationDelay: `${randomDelay}ms`,
          }}
        />
      </div>

      <div
        className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5`}
      >
        {Array.from({ length: 6 }, (_, index) => (
          <article
            className={`p-3 pb-5 flex flex-col justify-between gap-4 bg-neutral-800/50 rounded-3xl animate-skeleton`}
            style={{
              animationDelay: `${index * 0.25 * randomDelay}ms`,
            }}
          >
            <div
              className={`group grid place-items-center w-full aspect-square rounded-xl overflow-hidden transition-all duration-300 ease-in-out`}
            >
              <div className={`w-[342px] h-[342px] bg-neutral-800/50`}></div>
            </div>

            <section className={`flex-grow flex flex-col gap-2`}>
              <div className={`w-[100px] h-6 bg-neutral-800/50`}></div>
              <h4 className={`w-full h-4 bg-neutral-800/50`}></h4>
            </section>
          </article>
        ))}
      </div>
    </section>
  );
}
