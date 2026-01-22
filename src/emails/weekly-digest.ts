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

interface WeeklyDigestEmailProps {
  username: string;
  trendingMovies: TrendingItem[];
  trendingSeries: TrendingItem[];
  weeklyStats?: {
    episodesWatched: number;
    showsCompleted: number;
  };
}

function trendingItemCard(item: TrendingItem, index: number): string {
  const posterUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
    : "https://justreel.app/placeholder-poster.png";

  const itemUrl = item.media_type === "movie"
    ? `https://justreel.app/movie/${item.db_id}`
    : `https://justreel.app/series/${item.db_id}`;

  return `
    <tr>
      <td style="padding:8px 0;">
        <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">
          <tr>
            <td style="width:30px;color:#B4D429;font-weight:600;font-size:16px;vertical-align:middle;">
              ${index + 1}.
            </td>
            <td style="width:46px;vertical-align:middle;">
              <img src="${posterUrl}" alt="${item.title}" width="46" height="69" style="border-radius:4px;display:block;" />
            </td>
            <td style="padding-left:12px;vertical-align:middle;">
              <a href="${itemUrl}" style="color:#FAFAFA;font-weight:500;text-decoration:none;font-size:14px;line-height:20px;">${item.title}</a>
              ${item.release_year ? `<div style="color:#666;font-size:12px;">${item.release_year}</div>` : ""}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

export function weeklyDigestEmail({
  username,
  trendingMovies,
  trendingSeries,
  weeklyStats,
}: WeeklyDigestEmailProps): { subject: string; html: string } {
  const moviesList = trendingMovies
    .slice(0, 5)
    .map((item, i) => trendingItemCard(item, i))
    .join("");

  const seriesList = trendingSeries
    .slice(0, 5)
    .map((item, i) => trendingItemCard(item, i))
    .join("");

  const statsSection = weeklyStats && (weeklyStats.episodesWatched > 0 || weeklyStats.showsCompleted > 0)
    ? `
      ${emailDivider()}
      <h2 style="color:#FAFAFA;font-size:18px;font-weight:600;margin:0 0 16px 0;">Your Week in Numbers</h2>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;margin-bottom:20px;">
        <tr>
          <td style="background:#171717;border-radius:8px;padding:20px;text-align:center;width:50%;">
            <div style="color:#B4D429;font-size:32px;font-weight:700;">${weeklyStats.episodesWatched}</div>
            <div style="color:#A3A3A3;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Episodes Watched</div>
          </td>
          <td style="width:16px;"></td>
          <td style="background:#171717;border-radius:8px;padding:20px;text-align:center;width:50%;">
            <div style="color:#B4D429;font-size:32px;font-weight:700;">${weeklyStats.showsCompleted}</div>
            <div style="color:#A3A3A3;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Shows Completed</div>
          </td>
        </tr>
      </table>
    `
    : "";

  const content = `
    ${emailHeading(`Your Week in Just Reel`)}
    ${emailParagraph(`Hey ${emailAccent(username)}, here's what's trending this week plus a recap of your activity.`)}

    ${emailDivider()}

    <h2 style="color:#FAFAFA;font-size:18px;font-weight:600;margin:0 0 16px 0;">Trending Movies</h2>
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;margin-bottom:20px;">
      ${moviesList}
    </table>

    ${emailDivider()}

    <h2 style="color:#FAFAFA;font-size:18px;font-weight:600;margin:0 0 16px 0;">Trending TV Shows</h2>
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;margin-bottom:20px;">
      ${seriesList}
    </table>

    ${statsSection}

    ${emailButton("Explore More", "https://justreel.app/discover")}

    <p style="color:#666;font-size:12px;text-align:center;margin-top:20px;">
      See you next Friday!
    </p>
  `;

  return {
    subject: `Your Week in Just Reel - ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
    html: wrapEmailTemplate(content),
  };
}
