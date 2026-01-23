import {
  wrapEmailTemplate,
  emailHeading,
  emailParagraph,
  emailButton,
  emailAccent,
  emailDivider,
} from "@/src/lib/email";

interface TrendingItem {
  title: string;
  poster_path: string | null;
  release_year: string | null;
  db_id: string;
  media_type: "movie" | "series";
}

interface MostWatchedShow {
  title: string;
  poster_path: string | null;
  db_id: string;
  episodeCount: number;
}

interface WeeklyDigestEmailProps {
  username: string;
  trendingMovies: TrendingItem[];
  trendingSeries: TrendingItem[];
  weeklyStats?: {
    episodesWatched: number;
    showsCompleted: number;
    mostWatchedShow?: MostWatchedShow | null;
  };
}

function trendingGridCard(item: TrendingItem): string {
  const posterUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : "https://justreel.app/placeholder-poster.png";

  const itemUrl =
    item.media_type === "movie"
      ? `https://justreel.app/movie/${item.db_id}`
      : `https://justreel.app/series/${item.db_id}`;

  return `
    <td style="width:50%;padding:6px;vertical-align:top;">
      <a href="${itemUrl}" style="text-decoration:none;display:block;">
        <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;background:#171717;border-radius:24px;overflow:hidden;">
          <tr>
            <td style="padding:0;">
              <img src="${posterUrl}" alt="${item.title}" width="100%" height="auto" style="display:block;border-radius:24px 24px 0 0;aspect-ratio:2/3;object-fit:cover;" />
            </td>
          </tr>
          <tr>
            <td style="padding:18px 24px 14px;">
              <div style="color:#FAFAFA;font-weight:600;font-size:13px;line-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.title}</div>
              ${item.release_year ? `<div style="color:#737373;font-size:11px;margin-top:-3px;">${item.release_year}</div>` : ""}
            </td>
          </tr>
        </table>
      </a>
    </td>
  `;
}

function trendingGrid(items: TrendingItem[]): string {
  const topFour = items.slice(0, 4);
  if (topFour.length === 0) return "";

  const row1 = topFour.slice(0, 2);
  const row2 = topFour.slice(2, 4);

  return `
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;margin-bottom:8px;">
      <tr>
        ${row1.map((item) => trendingGridCard(item)).join("")}
      </tr>
      ${
        row2.length > 0
          ? `<tr>${row2.map((item) => trendingGridCard(item)).join("")}</tr>`
          : ""
      }
    </table>
  `;
}

export function weeklyDigestEmail({
  username,
  trendingMovies,
  trendingSeries,
  weeklyStats,
}: WeeklyDigestEmailProps): { subject: string; html: string } {
  const hasActivity =
    weeklyStats &&
    (weeklyStats.episodesWatched > 0 || weeklyStats.showsCompleted > 0);

  const mostWatched = weeklyStats?.mostWatchedShow;
  const mostWatchedPoster = mostWatched?.poster_path
    ? `https://image.tmdb.org/t/p/w92${mostWatched.poster_path}`
    : null;

  const statsSection = hasActivity
    ? `
      <h2 style="color:#FAFAFA;font-size:18px;font-weight:600;margin:0 0 16px 0;">📊 Your Week in Numbers</h2>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;margin-bottom:12px;">
        <tr>
          <td style="background:linear-gradient(135deg,#1a1a1a 0%,#171717 100%);border:1px solid #262626;border-radius:12px;padding:20px;text-align:center;width:50%;">
            <div style="color:#B4D429;font-size:36px;font-weight:700;line-height:1;">${weeklyStats!.episodesWatched}</div>
            <div style="color:#A3A3A3;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-top:6px;">Episodes</div>
          </td>
          <td style="min-width:12px;">&nbsp;</td>
          <td style="background:linear-gradient(135deg,#1a1a1a 0%,#171717 100%);border:1px solid #262626;border-radius:12px;padding:20px;text-align:center;width:50%;">
            <div style="color:#B4D429;font-size:36px;font-weight:700;line-height:1;">${weeklyStats!.showsCompleted}</div>
            <div style="color:#A3A3A3;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-top:6px;">Shows Completed</div>
          </td>
        </tr>
      </table>
      ${
        mostWatched
          ? `
        <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;margin-bottom:24px;">
          <tr>
            <td style="background:#171717;border:1px solid #262626;border-radius:12px;padding:16px;">
              <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">
                <tr>
                  ${
                    mostWatchedPoster
                      ? `<td style="width:60px;vertical-align:middle;">
                      <img src="${mostWatchedPoster}" alt="${mostWatched.title}" width="60" height="90" style="border-radius:12px;display:block;" />
                    </td>`
                      : ""
                  }
                  <td style="padding-left:${mostWatchedPoster ? "14px" : "0"};vertical-align:middle;">
                    <div style="color:#737373;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">🔥 Most Watched This Week</div>
                    <a href="https://justreel.app/series/${mostWatched.db_id}" style="color:#FAFAFA;font-weight:600;font-size:16px;text-decoration:none;line-height:22px;">${mostWatched.title}</a>
                    <div style="color:#B4D429;font-size:13px;margin-top:4px;">${mostWatched.episodeCount} episode${mostWatched.episodeCount !== 1 ? "s" : ""} watched</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `
          : ""
      }
      ${emailDivider()}
    `
    : "";

  const content = `
    ${emailHeading(`Hey ${username}🍿`)}
    ${emailParagraph(`Here's your weekly recap and what everyone's watching right now.`)}

    ${statsSection}

    <h2 style="color:#FAFAFA;font-size:18px;font-weight:600;margin:0 0 16px 0;">🎬 Trending Movies this Week</h2>
    ${trendingGrid(trendingMovies)}

    ${emailDivider()}

    <h2 style="color:#FAFAFA;font-size:18px;font-weight:600;margin:0 0 16px 0;">📺 Trending TV Shows this Week</h2>
    ${trendingGrid(trendingSeries)}

    <div style="text-align:center;margin-top:28px;">
      ${emailButton("Discover More", "https://justreel.app/discover")}
    </div>

    <p style="color:#525252;font-size:16px;text-align:center;margin-top:28px;">
      See you next week! 🍿
    </p>
  `;

  return {
    subject: `${username}, here's your weekly recap 🎬`,
    html: wrapEmailTemplate(content),
  };
}
