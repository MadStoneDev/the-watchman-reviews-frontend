// /src/components/ui/media-image.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { IconChairDirector, IconDeviceTv } from "@tabler/icons-react";

interface MediaImageProps {
  src: string | null;
  alt: string;
  mediaType: "movie" | "tv";
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  priority?: boolean;
  className?: string;
  fallbackClassName?: string;
}

// Predefined size configurations for optimal image loading
const SIZE_CONFIG = {
  sm: {
    width: 200,
    sizes: "(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw",
  },
  md: {
    width: 300,
    sizes: "(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw",
  },
  lg: {
    width: 500,
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  },
  xl: {
    width: 780,
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw",
  },
  hero: {
    width: 1280,
    sizes: "100vw",
  },
} as const;

/**
 * Optimized media image component with:
 * - Automatic size optimization
 * - Lazy loading (unless priority)
 * - Error handling with fallback
 * - Consistent styling
 */
export function MediaImage({
  src,
  alt,
  mediaType,
  size = "md",
  priority = false,
  className = "object-cover",
  fallbackClassName = "w-full h-full flex items-center justify-center bg-neutral-800",
}: MediaImageProps) {
  const [imageError, setImageError] = useState(false);

  // Show fallback if no src or image failed to load
  if (!src || imageError) {
    return (
      <div className={fallbackClassName}>
        {mediaType === "movie" ? (
          <IconChairDirector size={48} className="text-neutral-600" />
        ) : (
          <IconDeviceTv size={48} className="text-neutral-600" />
        )}
      </div>
    );
  }

  const config = SIZE_CONFIG[size];

  return (
    <Image
      src={`https://image.tmdb.org/t/p/w${config.width}${src}`}
      alt={alt}
      fill
      sizes={config.sizes}
      className={className}
      loading={priority ? undefined : "lazy"}
      priority={priority}
      onError={() => setImageError(true)}
    />
  );
}

/**
 * Backdrop image variant for hero sections
 */
export function BackdropImage({
  src,
  alt,
  priority = false,
  className = "object-cover",
}: {
  src: string | null;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
        <div className="text-neutral-600">No backdrop available</div>
      </div>
    );
  }

  return (
    <Image
      src={`https://image.tmdb.org/t/p/original${src}`}
      alt={alt}
      fill
      sizes="100vw"
      className={className}
      loading={priority ? undefined : "lazy"}
      priority={priority}
      onError={() => setImageError(true)}
    />
  );
}

/**
 * Profile/avatar image variant
 */
export function ProfileImage({
  src,
  alt,
  size = 48,
  className = "rounded-full object-cover",
}: {
  src: string | null;
  alt: string;
  size?: number;
  className?: string;
}) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div
        className={`bg-neutral-800 flex items-center justify-center text-neutral-400 ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-lg font-bold">{alt.charAt(0).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      onError={() => setImageError(true)}
    />
  );
}
