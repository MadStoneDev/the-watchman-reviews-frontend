import React from "react";
import Link from "next/link";
import { IconAlertCircle } from "@tabler/icons-react";

export default function MovieNotFound() {
  return (
    <main className="min-h-screen px-5 md:px-10 xl:px-24 py-20">
      <div className="max-w-2xl mx-auto text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="p-6 bg-red-900/20 rounded-full border-2 border-red-800/50">
            <IconAlertCircle size={64} className="text-red-400" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Movie Not Found</h1>

        <p className="text-neutral-400 text-lg mb-8">
          We couldn't find the movie you're looking for. It might have been
          removed or the link is incorrect.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/search"
            className="px-6 py-3 bg-lime-400 text-neutral-900 hover:bg-lime-500 rounded-lg font-medium transition-colors"
          >
            Search for Movies
          </Link>

          <Link
            href="/browse/movies"
            className="px-6 py-3 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 rounded-lg font-medium transition-colors"
          >
            Browse Movies
          </Link>
        </div>
      </div>
    </main>
  );
}
