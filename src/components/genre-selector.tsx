"use client";

import React from "react";
import {
  Film,
  Tv,
  Theater,
  Skull,
  Heart,
  Laugh,
  Flame,
  Shield,
  Rocket,
  Zap,
  Glasses,
  Ghost,
  Crown,
  Users,
  Music,
  Megaphone,
  Baby,
  BookOpen,
  Camera,
  Drama,
} from "lucide-react";

// Map genre IDs to icons
// This maps common TMDB genre IDs to appropriate icons
const genreIconMap = {
  28: Flame, // Action
  12: Rocket, // Adventure
  16: Baby, // Animation
  35: Laugh, // Comedy
  80: Shield, // Crime
  99: Camera, // Documentary
  18: Drama, // Drama
  10751: Users, // Family
  14: Crown, // Fantasy
  36: BookOpen, // History
  27: Ghost, // Horror
  10402: Music, // Music
  9648: Glasses, // Mystery
  10749: Heart, // Romance
  878: Zap, // Science Fiction
  10770: Tv, // TV Movie
  53: Skull, // Thriller
  10752: Shield, // War
  37: Megaphone, // Western
};

// Default icon for genres without specific mappings
const DefaultIcon = Film;

export default function GenreSelector({
  genres,
  selectedGenres,
  onSelectGenre,
}) {
  // Get icon component for a genre
  const getGenreIcon = (genreId) => {
    const IconComponent = genreIconMap[genreId] || DefaultIcon;
    return <IconComponent size={24} />;
  };

  if (!genres || genres.length === 0) {
    return (
      <div className="py-8 text-center">
        <p>No genres available. Please check your API connection.</p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <h2 className="text-lg font-semibold mb-6">
        Select your favorite genres
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => onSelectGenre(genre.id)}
            className={`
              flex items-center gap-3 p-3 rounded-lg border transition-all
              ${
                selectedGenres.includes(genre.id)
                  ? "bg-blue-100 border-blue-500 dark:bg-blue-900 dark:border-blue-700"
                  : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              }
            `}
          >
            <div
              className={`
              p-2 rounded-full
              ${
                selectedGenres.includes(genre.id)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300"
              }
            `}
            >
              {getGenreIcon(genre.id)}
            </div>
            <span className="font-medium">{genre.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 text-gray-600 dark:text-gray-400">
        <p>
          Select the genres you typically enjoy watching. This helps us better
          understand your preferences.
        </p>
      </div>
    </div>
  );
}
