import React from "react";

import { Popcorn } from "lucide-react";
import { IconStarFilled } from "@tabler/icons-react";

import { Genre } from "@/lib/types";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface MediaItemProps {
  data: any;
  movieGenres: Genre[];
  seriesGenres: Genre[];
}

export default function MediaBlock({
  data = {},
  movieGenres = [],
  seriesGenres = [],
}: MediaItemProps) {
  if (!data.title || !data.releaseDate) return null;
  const cleanRating = Math.floor(data.rating / 2);

  // const breakpoints = {
  //   sm: 640,
  //   md: 768,
  //   lg: 1024,
  //   xl: 1280,
  //   "2xl": 1536,
  // };
  //
  // const imageSizes = {
  //   poster: ["w92", "w154", "w185", "w342", "w500", "w780", "original"],
  //   backdrop: ["w300", "w780", "w1280", "original"],
  // };

  // States
  // const [posterSize, setPosterSize] = useState(imageSizes.poster[4]);

  // Effects
  // useEffect(() => {
  //   const handleResize = () => {
  //     const width = window.innerWidth;
  //     if (width < breakpoints.sm) {
  //       setPosterSize(imageSizes.poster[3]);
  //     } else if (width < breakpoints.md) {
  //       setPosterSize(imageSizes.poster[3]);
  //     } else if (width < breakpoints.lg) {
  //       setPosterSize(imageSizes.poster[3]);
  //     } else {
  //       setPosterSize(imageSizes.poster[3]);
  //     }
  //   };
  //
  //   handleResize();
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  return (
    <Link
      className={`cursor-pointer p-3 pb-5 flex flex-col justify-between gap-4 bg-black rounded-3xl hover:scale-105 transition-all duration-300 ease-in-out`}
      href={`/media/${data.type === "movie" ? "m" : "s"}${data.id}`}
    >
      <div
        className={`grid place-items-center w-full aspect-square bg-neutral-800 rounded-xl overflow-hidden`}
      >
        {data.poster ? (
          <img
            className={`w-full h-full bg-black object-top object-cover`}
            style={{ aspectRatio: "1/1" }}
            src={`https://image.tmdb.org/t/p/w342${data.poster}`}
            alt={`${data.title} Poster`}
          ></img>
        ) : (
          <Popcorn className={``} />
        )}
      </div>

      <div className={`flex-grow w-full`}>
        <h3 className={`text-neutral-50 whitespace-nowrap truncate`}>
          {data.title}
        </h3>
        <h4 className={`text-sm text-neutral-500`}>
          {data.genres &&
            data.genres
              .map((genre: number) => {
                if (data.type === "movie")
                  return movieGenres.find((g) => g.id === genre)?.name;
                else return seriesGenres.find((g) => g.id === genre)?.name;
              })
              .join(", ")}
        </h4>
      </div>

      <div
        className={`flex items-center`}
        title={`User Rating: ${data.rating / 2} / 5`}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <IconStarFilled
            key={`${data.id}-${index}`}
            size={15}
            className={`${
              index <= cleanRating ? "text-lime-400" : "text-neutral-50"
            }`}
          />
        ))}
      </div>
    </Link>
  );
}
