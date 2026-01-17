import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IconUser, IconExternalLink } from "@tabler/icons-react";
import { TMDBCastMember } from "@/src/lib/types";

interface CastCarouselProps {
  cast: TMDBCastMember[];
  title?: string;
}

export default function CastCarousel({
  cast,
  title = "Cast",
}: CastCarouselProps) {
  if (!cast || cast.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <div
        className="special-scrollbar flex flex-nowrap gap-4 overflow-x-auto pb-4"
        style={{
          scrollSnapType: "x mandatory",
          scrollPaddingInlineStart: "1rem",
        }}
      >
        {cast.map((member) => (
          <Link
            key={member.id}
            href={`https://www.themoviedb.org/person/${member.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex-shrink-0"
            style={{ scrollSnapAlign: "start" }}
          >
            <article className="w-[100px] flex flex-col items-center">
              {/* Circular photo */}
              <div className="relative w-[80px] h-[80px] rounded-full overflow-hidden bg-neutral-800 border-2 border-transparent group-hover:border-lime-400 transition-colors">
                {member.profile_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-500">
                    <IconUser size={32} />
                  </div>
                )}
              </div>

              {/* Name */}
              <p
                className="mt-2 text-sm font-medium text-center text-neutral-200 group-hover:text-lime-400 transition-colors line-clamp-2"
                title={member.name}
              >
                {member.name}
              </p>

              {/* Character */}
              <p
                className="text-xs text-center text-neutral-400 line-clamp-2"
                title={member.character}
              >
                {member.character}
              </p>

              {/* External link indicator on hover */}
              <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <IconExternalLink size={12} className="text-neutral-500" />
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
