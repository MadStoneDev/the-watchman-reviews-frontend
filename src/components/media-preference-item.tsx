import Image from "next/image";
import { IconChairDirector } from "@tabler/icons-react";
import React from "react";

export default function MediaPreferenceItem({
  data,
  photo,
  title,
  dependencies = [],
}: {
  data: any;
  photo: string;
  title: string;
  dependencies?: any[];
}) {
  if (dependencies.length === 0 || dependencies.some((dep) => dep == null))
    return null;

  return (
    <article
      key={data.id}
      className={`group relative aspect-[2/3] bg-neutral-800 rounded overflow-hidden`}
    >
      {photo ? (
        <Image
          src={`https://image.tmdb.org/t/p/w500${photo}`}
          alt={photo}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 30vw, 20vw"
          className="object-cover object-center"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <IconChairDirector size={40} className="text-neutral-600" />
        </div>
      )}
      <h2
        className={`absolute bottom-0 left-0 right-0 px-2 py-4 bg-neutral-900/70 font-bold translate-y-full group-hover:translate-y-0 transition-all duration-300 ease-in-out z-10`}
      >
        {title}
      </h2>
    </article>
  );
}
