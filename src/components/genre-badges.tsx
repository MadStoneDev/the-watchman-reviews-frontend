import React from "react";
import {
  IconSword,
  IconMountain,
  IconPalette,
  IconMoodHappy,
  IconShieldCheck,
  IconMovie,
  IconMask,
  IconUsers,
  IconWand,
  IconBook,
  IconGhost,
  IconMusic,
  IconQuestionMark,
  IconHeart,
  IconRocket,
  IconDeviceTv,
  IconAlertTriangle,
  IconSwordOff,
  IconHorse,
  IconIceCream,
  IconNews,
  IconCamera,
  IconMicrophone,
  IconFlag,
} from "@tabler/icons-react";

interface Genre {
  id: string;
  tmdb_id: number;
  name: string;
  icon: string | null;
}

interface GenreBadgeProps {
  genres: Genre[];
  size?: "sm" | "md" | "lg";
  showIcons?: boolean;
  maxDisplay?: number; // Maximum number of genres to display
}

// Icon mapping - using any to avoid TypeScript complexity with ForwardRefExoticComponent
const iconMap: Record<string, any> = {
  sword: IconSword,
  mountain: IconMountain,
  palette: IconPalette,
  "mood-happy": IconMoodHappy,
  "shield-check": IconShieldCheck, // Crime/Police genre
  movie: IconMovie,
  mask: IconMask,
  users: IconUsers,
  wand: IconWand,
  book: IconBook,
  ghost: IconGhost,
  music: IconMusic,
  "question-mark": IconQuestionMark,
  heart: IconHeart,
  rocket: IconRocket,
  "device-tv": IconDeviceTv,
  "alert-triangle": IconAlertTriangle,
  "sword-off": IconSwordOff,
  horse: IconHorse,
  "ice-cream": IconIceCream,
  news: IconNews,
  camera: IconCamera,
  microphone: IconMicrophone,
  flag: IconFlag,
};

export default function GenreBadges({
  genres,
  size = "md",
  showIcons = true,
  maxDisplay,
}: GenreBadgeProps) {
  if (!genres || genres.length === 0) return null;

  const displayGenres = maxDisplay ? genres.slice(0, maxDisplay) : genres;
  const remainingCount =
    maxDisplay && genres.length > maxDisplay ? genres.length - maxDisplay : 0;

  // Size classes
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  return (
    <div className="flex flex-wrap gap-2">
      {displayGenres.map((genre) => {
        const IconComponent = genre.icon ? iconMap[genre.icon] : null;

        return (
          <div
            key={genre.id}
            className={`
              ${sizeClasses[size]}
              bg-neutral-800 text-lime-400 
              rounded-full font-medium
              flex items-center gap-1.5
              transition-colors hover:bg-neutral-700
            `}
          >
            {showIcons && IconComponent && (
              <IconComponent size={iconSizes[size]} className="shrink-0" />
            )}
            <span>{genre.name}</span>
          </div>
        );
      })}

      {remainingCount > 0 && (
        <div
          className={`
            ${sizeClasses[size]}
            bg-neutral-700 text-neutral-400 
            rounded-full font-medium
          `}
        >
          +{remainingCount} more
        </div>
      )}
    </div>
  );
}
