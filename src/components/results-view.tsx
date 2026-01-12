"use client";

import React from "react";
import {
  Film,
  Tv,
  Users,
  Tag,
  Clock,
  BookOpen,
  Repeat,
  Flag,
} from "lucide-react";

interface ThemeItem {
  word: string;
  count: number;
}

interface GenreItem {
  id: string | number;
  name: string;
  score: number;
}

interface DecadeItem {
  decade: string;
  score: number;
}

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  original_name?: string;
  type?: string;
  mediaType?: string;
  genres?: string[];
  decade?: string;
  poster_path?: string;
  [key: string]: any;
}

interface ActorItem {
  id: number;
  name: string;
  profile_path?: string;
}

interface ResultsData {
  topGenres: GenreItem[];
  favoriteDecades: DecadeItem[];
  likedThemes: ThemeItem[];
  dislikedThemes: ThemeItem[];
  likedMovies: MediaItem[];
  dislikedMovies: MediaItem[];
  likedShows: MediaItem[];
  dislikedShows: MediaItem[];
  likedActors: ActorItem[];
  dislikedActors: ActorItem[];
  selectedGenres: {
    id: number | string;
    name: string;
  }[];
}

interface ResultsViewProps {
  results: ResultsData;
  onStartOver: () => void;
}

export default function ResultsView({
  results,
  onStartOver,
}: ResultsViewProps) {
  const maxScore = Math.max(...results.topGenres.map((g) => g.score), 5); // Set minimum to 5 for scaling

  return (
    <div className="py-4">
      <h2 className="text-xl font-semibold mb-2">Your Preference Analysis</h2>
      <p className="mb-6 text-gray-600">
        Based on your selections, we've analyzed your preferences to help
        personalize your experience.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Top Genres */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Tag className="mr-2" size={18} />
            Your Top Genres
          </h3>
          <div className="space-y-2">
            {results.topGenres
              .filter((g) => g.score > 0)
              .slice(0, 5)
              .map((genre) => (
                <div key={genre.id} className="flex items-center">
                  <div className="w-32 font-medium truncate mr-2">
                    {genre.name}
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${(genre.score / maxScore) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-10 text-right text-sm text-gray-500">
                    {genre.score}
                  </div>
                </div>
              ))}

            {results.topGenres.filter((g) => g.score > 0).length === 0 && (
              <p className="text-gray-500 italic">
                No positive genre preferences detected
              </p>
            )}
          </div>

          {results.topGenres.filter((g) => g.score < 0).length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2 text-gray-600">
                Genres You May Not Enjoy
              </h4>
              <div className="flex flex-wrap gap-2">
                {results.topGenres
                  .filter((g) => g.score < 0)
                  .sort((a, b) => a.score - b.score) // Sort by most negative first
                  .slice(0, 3)
                  .map((genre) => (
                    <span
                      key={`disliked-${genre.id}`}
                      className="bg-red-50 text-red-600 px-2 py-1 rounded-sm text-xs"
                    >
                      {genre.name}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Favorite Decades */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="mr-2" size={18} />
            Your Favorite Decades
          </h3>
          <div className="space-y-2">
            {results.favoriteDecades
              .filter((d) => d.score > 0)
              .slice(0, 5)
              .map((decade) => (
                <div key={decade.decade} className="flex items-center">
                  <div className="w-24 font-medium mr-2">{decade.decade}</div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full"
                        style={{ width: `${(decade.score / maxScore) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-10 text-right text-sm text-gray-500">
                    {decade.score}
                  </div>
                </div>
              ))}

            {results.favoriteDecades.filter((d) => d.score > 0).length ===
              0 && (
              <p className="text-gray-500 italic">
                No decade preferences detected
              </p>
            )}
          </div>
        </div>

        {/* Themes You Enjoy */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BookOpen className="mr-2" size={18} />
            Themes You Enjoy
          </h3>
          {results.likedThemes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {results.likedThemes.slice(0, 15).map((theme) => (
                <span
                  key={`theme-${theme.word}`}
                  className="bg-green-50 text-green-700 px-2 py-1 rounded-sm text-sm"
                  style={{
                    fontSize: `${Math.max(
                      0.75,
                      Math.min(1.2, 0.8 + (theme.count / 5) * 0.4),
                    )}rem`,
                  }}
                >
                  {theme.word}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              No themes detected from your liked content
            </p>
          )}
        </div>

        {/* Themes You May Not Enjoy */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Flag className="mr-2" size={18} />
            Themes You May Not Enjoy
          </h3>
          {results.dislikedThemes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {results.dislikedThemes.slice(0, 15).map((theme) => (
                <span
                  key={`disliked-theme-${theme.word}`}
                  className="bg-red-50 text-red-700 px-2 py-1 rounded-sm text-sm"
                  style={{
                    fontSize: `${Math.max(
                      0.75,
                      Math.min(1.2, 0.8 + (theme.count / 5) * 0.4),
                    )}rem`,
                  }}
                >
                  {theme.word}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              No themes detected from your disliked content
            </p>
          )}
        </div>
      </div>

      {/* Raw data for developers */}
      <div className="mb-8">
        <details className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <summary className="font-medium text-gray-700 cursor-pointer">
            View Complete Results Data
          </summary>
          <div className="mt-4">
            <pre className="bg-gray-100 p-4 rounded-sm overflow-auto max-h-96 text-xs">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        </details>
      </div>

      <div className="flex justify-between items-center">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-sm hover:bg-gray-300"
          onClick={onStartOver}
        >
          <div className="flex items-center">
            <Repeat className="mr-2" size={16} />
            Start Over
          </div>
        </button>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700"
          onClick={() => {
            // Here you could save the preferences to your backend
            alert("Preferences saved successfully!");
          }}
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
