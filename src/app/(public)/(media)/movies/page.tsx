import React from "react";
import Link from "next/link";
import { IconSearch, IconChairDirector } from "@tabler/icons-react";

export default function MoviesIndexPage() {
  return (
    <main className="min-h-screen px-5 md:px-10 xl:px-24 py-20">
      <div className="max-w-2xl mx-auto text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="p-6 bg-neutral-900 rounded-full border-2 border-neutral-800">
            <IconChairDirector size={64} className="text-neutral-600" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Looking for a Movie?
        </h1>

        <p className="text-neutral-400 text-lg mb-8">
          To view movie details, you'll need to search for a specific movie
          first.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/search"
            className="px-6 py-3 bg-lime-400 text-neutral-900 hover:bg-lime-500 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <IconSearch size={20} />
            <span>Search Movies</span>
          </Link>

          <Link
            href="/browse/movies"
            className="px-6 py-3 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 rounded-lg font-medium transition-colors"
          >
            Browse Movies
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-12 p-6 bg-neutral-900 rounded-lg border border-neutral-800 text-left">
          <h3 className="font-semibold mb-2 text-neutral-200">
            How to find movies:
          </h3>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li className="flex items-start gap-2">
              <span className="text-lime-400 mt-1">•</span>
              <span>Use the search bar to find any movie by title</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lime-400 mt-1">•</span>
              <span>Browse curated movie collections</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lime-400 mt-1">•</span>
              <span>Check out what's new in the browse section</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
