import React from "react";
import Link from "next/link";
import Logo from "@/src/components/logo";

interface Poster {
  title: string;
  url: string;
  position: string;
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const imageBasePath = "https://image.tmdb.org/t/p/original/";

  // Posters
  const posters: Poster[] = [
    {
      title: "Bluey",
      url: "c71B3umVpuLCtUKaZssCc2XIjBB.jpg",
      position: "object-center",
    },
    {
      title: "Spider-Man: Into the Spider-Verse",
      url: "qGQf2OHIkoh89K8XeKQzhxczf96.jpg",
      position: "object-center",
    },
    {
      title: "Am I Racist?",
      url: "7PImlfBNIq0wUQ4v9Xy4OqQShnW.jpg",
      position: "object-center",
    },
    {
      title: "A Gentleman in Moscow",
      url: "lFzmyLYydG4Cp7NTVn8jTNyEVKR.jpg",
      position: "object-center",
    },
    {
      title: "DuckTales",
      url: "tco0lyOHy3bjy2hyishbuCk0Yvg.jpg",
      position: "object-center",
    },
    {
      title: "Special Ops: Lioness",
      url: "sa9vB0xb3OMU6iSMkig8RBbdESq.jpg",
      position: "object-center",
    },
    {
      title: "Sound of Freedom",
      url: "kSf9svfL2WrKeuK8W08xeR5lTn8.jpg",
      position: "object-center",
    },
    {
      title: "Cat in the Hat",
      url: "qgEk63SkI0AgcMHnI54laB1LQjY.jpg",
      position: "object-center",
    },
  ];

  // Functions
  const getPoster = () => {
    const max = posters.length;
    return Math.floor(Math.random() * max);
  };

  const selectedPoster = getPoster();

  return (
    <div
      className={`grid md:grid-cols-2 w-full h-dvh bg-neutral-800 overflow-hidden`}
    >
      <section className={`relative hidden md:block h-full max-h-dvh`}>
        <img
          src={imageBasePath + posters[selectedPoster].url}
          alt={posters[selectedPoster].title}
          title={posters[selectedPoster].title}
          className={`w-full h-full object-cover ${posters[selectedPoster].position}`}
        />

        <Link
          href={`https://themoviedb.org`}
          title={`Go to TMDB`}
          target="_blank"
          className={`px-2 py-1 absolute bottom-2 left-2 bg-neutral-200/50 hover:bg-neutral-800 text-neutral-900 hover:text-neutral-100 text-[0.65rem] z-20 transition-all duration-300 ease-in-out`}
          style={{
            backdropFilter: "blur(2px)",
          }}
        >
          Poster from TMDB
        </Link>
      </section>

      <main
        className={`col-span-2 md:col-span-1 p-3 sm:p-6 flex flex-col justify-start items-center w-full min-h-dvh bg-neutral-800/80 text-center overflow-auto`}
        style={{
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          className={`flex-grow relative flex flex-col justify-center w-full max-w-sm`}
        >
          <Link href={`/`} className={`self-center mb-10`}>
            <Logo className={`scale-75`} />
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}
