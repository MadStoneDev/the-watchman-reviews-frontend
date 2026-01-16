import React from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import { getFollowing } from "@/src/app/actions/follows";

import BrowseNavigation from "@/src/components/browse-navigation";
import UserListItem from "@/src/components/user-list-item";

export const revalidate = 60;

export default async function FollowingPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { username } = await params;
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || "1", 10);
  const limit = 20;

  const supabase = await createClient();

  // Get current user
  const { data: user } = await supabase.auth.getClaims();
  const currentUserId = user?.claims.sub || null;

  // Get profile for this username
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("username", username)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  // Get following
  const result = await getFollowing(profile.id, page, limit);
  const following = result.users || [];
  const total = result.total || 0;
  const totalPages = Math.ceil(total / limit);

  const isOwnProfile = currentUserId === profile.id;

  return (
    <>
      <BrowseNavigation
        items={[
          {
            label: isOwnProfile ? "Account" : "Profile",
            href: `/${profile.username}`,
          },
          {
            label: "Collections",
            href: `/${profile.username}/collections`,
            textColor: "hover:text-indigo-500",
            bgColor: "bg-indigo-500",
          },
          {
            label: "Followers",
            href: `/${profile.username}/followers`,
            textColor: "hover:text-amber-400",
            bgColor: "bg-amber-400",
          },
          {
            label: "Following",
            href: `/${profile.username}/following`,
            textColor: "hover:text-cyan-400",
            bgColor: "bg-cyan-400",
          },
        ]}
        profileId={profile.id}
        currentUserId={currentUserId || ""}
      />

      <section className="mt-6 lg:mt-8 mb-6 transition-all duration-300 ease-in-out">
        <h1 className="max-w-3xl text-2xl sm:3xl md:text-4xl font-bold">
          {isOwnProfile ? "Following" : `${username} is Following`}
        </h1>
        <p className="text-neutral-400 mt-2">
          {total} {total === 1 ? "user" : "users"}
        </p>
      </section>

      <section className="space-y-1">
        {following.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            {isOwnProfile
              ? "You're not following anyone yet."
              : `${username} isn't following anyone yet.`}
          </div>
        ) : (
          following.map((user) => (
            <UserListItem
              key={user.id}
              user={user}
              currentUserId={currentUserId || undefined}
              showFollowButton={true}
            />
          ))
        )}
      </section>

      {totalPages > 1 && (
        <nav className="flex justify-center gap-2 mt-8 pb-8">
          {page > 1 && (
            <a
              href={`/${username}/following?page=${page - 1}`}
              className="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
            >
              Previous
            </a>
          )}
          <span className="px-4 py-2 text-neutral-400">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <a
              href={`/${username}/following?page=${page + 1}`}
              className="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
            >
              Next
            </a>
          )}
        </nav>
      )}
    </>
  );
}
