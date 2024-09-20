import type { Metadata } from "next";
import SearchWrapper from "@/components/wrapper-search";

export const metadata: Metadata = {
  title: "Search - The Watchman Reviews",
  description:
    "Guiding families and groups to make informed viewing choices. Get detailed content analysis of movies and TV shows, including themes, language, and values.",
};

export default function SearchPage() {
  return <SearchWrapper />;
}
