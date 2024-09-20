import React from "react";
import GoBack from "@/components/go-back";

interface SearchParams {
  params: {
    title: string;
  };
}

export default function MediaPage(searchParams: SearchParams) {
  // Variables
  const title = searchParams.params.title
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <>
      <section className={`relative z-10`}>
        <GoBack />
      </section>

      {/* Spacing */}
      <div className={`block md:hidden h-[40dvh]`}></div>

      <div
        className={`absolute top-0 md:top-auto left-0 md:left-auto right-0 md:right-auto md:relative`}
      >
        <section
          className={`md:mt-5 h-[50dvh] md:h-[500px] md:rounded-3xl transition-all duration-300 ease-in-out overflow-hidden`}
        >
          <div className={`bg-neutral-400 w-full h-full object-cover`}></div>
        </section>

        <section
          className={`absolute md:relative bottom-0 left-0 right-0 mt-12 p-5 md:p-0 transition-all duration-300 ease-in-out z-10`}
        >
          <h1 className={`text-2xl sm:3xl md:text-4xl font-bold`}>{title}</h1>
          <h3 className={`text-lg text-neutral-500`}>Animation, Action</h3>
        </section>
      </div>

      <section
        className={`mt-6 sm:mt-12 grid lg:grid-cols-2 gap-16 text-sm text-neutral-500 transition-all duration-300 ease-in-out`}
      >
        <article className={`grid gap-6`}>
          <p className={``}>
            Cras in neque. Sed lacinia, felis ut sodales pretium, justo sapien
            hendrerit est, et convallis nisi quam sit amet erat. Suspendisse
            consequat nibh a mauris. Curabitur libero ligula, faucibus at,
            mollis ornare, mattis et, libero.
          </p>
          <p>
            Aliquam pulvinar congue pede. Fusce condimentum turpis vel dolor. Ut
            blandit. Sed elementum justo quis sem. Sed eu orci eu ante iaculis
            accumsan. Sed suscipit dolor quis mi. Curabitur ultrices nonummy
            lacus. Morbi ipsum ipsum, adipiscing eget, tincidunt vitae, pharetra
            at, tellus. Nulla gravida, arcu eget dictum eleifend, velit ligula
            suscipit nibh, sagittis imperdiet metus nunc non pede. Aenean congue
            pede in nisi tristique interdum. Sed commodo, ipsum ac dignissim
            ullamcorper, odio nulla venenatis nisi, in porta dolor neque
            venenatis lacus. Pellentesque fermentum. Mauris sit amet ligula ut
            tellus gravida mattis. Vestibulum ante ipsum primis in faucibus orci
            luctus et ultrices posuere cubilia Curae;
          </p>
        </article>

        <article className={`bg-neutral-50 p-6 rounded-3xl`}></article>
      </section>
    </>
  );
}
