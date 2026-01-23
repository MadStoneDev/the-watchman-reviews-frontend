import { createClient } from "@/src/utils/supabase/server";
import { weeklyDigestEmail } from "@/src/emails/weekly-digest";
import { getTrendingMovies, getTrendingSeries } from "@/src/lib/trending";

export default async function WeeklyDigestTest() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const [trendingMovies, trendingSeries, episodeWatchesResult, showsCompletedResult, weeklyWatches] =
    await Promise.all([
      getTrendingMovies(),
      getTrendingSeries(),
      supabase
        .from("episode_watches")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id)
        .gte("watched_at", oneWeekAgo.toISOString()),
      supabase
        .from("watch_cycles")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id)
        .eq("status", "completed")
        .gte("completed_at", oneWeekAgo.toISOString()),
      // Get all episode watches this week to find most watched show
      supabase
        .from("episode_watches")
        .select("series_id")
        .eq("user_id", user?.id)
        .gte("watched_at", oneWeekAgo.toISOString()),
    ]);

  // Find most watched series
  let mostWatchedShow = null;
  if (weeklyWatches.data && weeklyWatches.data.length > 0) {
    const seriesCounts = weeklyWatches.data.reduce(
      (acc: Record<string, number>, watch) => {
        acc[watch.series_id] = (acc[watch.series_id] || 0) + 1;
        return acc;
      },
      {}
    );

    const topSeriesId = Object.entries(seriesCounts).sort(
      ([, a], [, b]) => b - a
    )[0];

    if (topSeriesId) {
      const { data: seriesData } = await supabase
        .from("series")
        .select("id, title, poster_path")
        .eq("id", topSeriesId[0])
        .single();

      if (seriesData) {
        mostWatchedShow = {
          title: seriesData.title,
          poster_path: seriesData.poster_path,
          db_id: seriesData.id,
          episodeCount: topSeriesId[1],
        };
      }
    }
  }

  const { subject, html } = weeklyDigestEmail({
    username: "KingArthur",
    trendingMovies,
    trendingSeries,
    weeklyStats: {
      episodesWatched: episodeWatchesResult.count || 0,
      showsCompleted: showsCompletedResult.count || 0,
      mostWatchedShow,
    },
  });

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
