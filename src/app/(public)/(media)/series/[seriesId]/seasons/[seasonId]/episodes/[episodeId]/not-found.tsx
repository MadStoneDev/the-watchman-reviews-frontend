import React from "react";
import Link from "next/link";
import { IconAlertCircle } from "@tabler/icons-react";

export default function EpisodesNotFound() {
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
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Episode Not Found
        </h1>

        <p className="text-neutral-400 text-lg mb-8">
          We couldn't find the episode you're looking for. It might not exist or
          you need to browse from the season page.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/search"
            className="px-6 py-3 bg-lime-400 text-neutral-900 hover:bg-lime-500 rounded-lg font-medium transition-colors"
          >
            Search for a Series
          </Link>

          <Link
            href="/browse/series"
            className="px-6 py-3 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 rounded-lg font-medium transition-colors"
          >
            Browse TV Shows
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-12 p-6 bg-neutral-900 rounded-lg border border-neutral-800 text-left">
          <h3 className="font-semibold mb-2 text-neutral-200">
            To view episodes:
          </h3>
          <ol className="space-y-2 text-sm text-neutral-400 list-decimal list-inside">
            <li>Search for a TV series</li>
            <li>Navigate to the series detail page</li>
            <li>Select a season from the tabs</li>
            <li>Choose an episode from the list</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
