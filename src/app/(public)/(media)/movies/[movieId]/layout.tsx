import React from "react";
import { createClient } from "@/src/utils/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ movieId: string }>;
}) {
  const { movieId } = await params;

  // Supabase
  const supabase = await createClient();

  const { data: movie, error } = await supabase
    .from("movies")
    .select("title")
    .eq("id", movieId)
    .single();

  if (movie) {
    return {
      title: `${movie.title} | JustReel`,
      description: `${movie.title} on JustReel`,
    };
  } else {
    return {
      title: `Movies on JustReel`,
      description: `Find out more on JustReel`,
    };
  }
}

export default async function MoviesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
