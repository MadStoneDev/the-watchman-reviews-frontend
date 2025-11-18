import React from "react";
import { createClient } from "@/src/utils/supabase/server";

export async function generateMetadata(params: Promise<{ seriesId: string }>) {
  const { seriesId } = await params;

  // Supabase
  const supabase = await createClient();

  const { data: series, error } = await supabase
    .from("series")
    .select("title")
    .eq("id", seriesId)
    .single();

  if (series) {
    return {
      title: `${series.title} | JustReel`,
      description: `${series.title} on JustReel`,
    };
  } else {
    return {
      title: `Series on JustReel`,
      description: `Find out more on JustReel`,
    };
  }
}

export default async function SeriesLayout({
  params,
  children,
}: {
  params: Promise<{ seriesId: string }>;
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
