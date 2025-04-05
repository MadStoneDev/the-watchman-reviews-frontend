"use client";

import React from "react";
import { Button } from "@/src/components/ui/button";
import { ChevronDown } from "lucide-react";

export default ({
  loading,
  onLoadMore,
}: {
  loading: boolean;
  onLoadMore: () => Promise<void>;
}) => (
  <div className="flex justify-center my-8">
    <Button
      variant="outline"
      size="lg"
      onClick={onLoadMore}
      disabled={loading}
      className={`flex items-center gap-2 px-6 py-3 transition-all duration-300 ease-in-out
          ${loading ? "opacity-70" : "hover:bg-neutral-700 hover:scale-105"}`}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-lime-400 border-t-transparent rounded-full"></div>
          <span>Loading...</span>
        </div>
      ) : (
        <>
          <span>Load More</span>
          <ChevronDown size={18} />
        </>
      )}
    </Button>
  </div>
);
