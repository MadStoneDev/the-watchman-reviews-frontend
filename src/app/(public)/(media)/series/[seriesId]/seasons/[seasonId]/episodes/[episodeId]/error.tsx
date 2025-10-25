"use client";

import React from "react";
import Link from "next/link";
import { IconAlertTriangle } from "@tabler/icons-react";

export default function SeriesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen px-5 md:px-10 xl:px-24 py-20">
      <div className="max-w-2xl mx-auto text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="p-6 bg-orange-900/20 rounded-full border-2 border-orange-800/50">
            <IconAlertTriangle size={64} className="text-orange-400" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Something Went Wrong
        </h1>

        <p className="text-neutral-400 text-lg mb-2">
          We encountered an error while loading this series.
        </p>

        {process.env.NODE_ENV === "development" && (
          <p className="text-sm text-red-400 mb-8 font-mono">{error.message}</p>
        )}

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={reset}
            className="px-6 py-3 bg-lime-400 text-neutral-900 hover:bg-lime-500 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>

          <Link
            href="/search"
            className="px-6 py-3 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 rounded-lg font-medium transition-colors"
          >
            Back to Search
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-12 p-6 bg-neutral-900 rounded-lg border border-neutral-800 text-left">
          <h3 className="font-semibold mb-2 text-neutral-200">
            What you can do:
          </h3>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li className="flex items-start gap-2">
              <span className="text-lime-400 mt-1">•</span>
              <span>Click "Try Again" to reload the page</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lime-400 mt-1">•</span>
              <span>Search for a different series</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lime-400 mt-1">•</span>
              <span>Check your internet connection</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
