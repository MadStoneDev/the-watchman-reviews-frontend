import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import { getFollowers } from "@/src/app/actions/follows";

import BrowseNavigation from "@/src/components/browse-navigation";
import UserListItem from "@/src/components/user-list-item";

export const revalidate = 60;

export default async function MyFollowersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || "1", 10);
  const limit = 20;

  const supabase = await createClient();

  // Get current user
  const { data: user, error } = await supabase.auth.getClaims();

  if (error || !user) {
    redirect("/auth/portal");
  }

  const currentUserId = user.claims.sub;

  // Get current user's profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("id", currentUserId)
    .single();

  if (profileError || !profile) {
    redirect("/auth/portal");
  }

  // Get followers
  const result = await getFollowers(profile.id, page, limit);
  const followers = result.users || [];
  const total = result.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <BrowseNavigation
        items={[
          {
            label: "Account",
            href: "/me",
          },
          {
            label: "Collections",
            href: "/me/collections",
            textColor: "hover:text-indigo-500",
            bgColor: "bg-indigo-500",
          },
        ]}
        profileId={profile.id}
        currentUserId={currentUserId}
      />

      <section className="mt-6 lg:mt-8 mb-6 transition-all duration-300 ease-in-out">
        <h1 className="max-w-3xl text-2xl sm:3xl md:text-4xl font-bold">
          My Followers
        </h1>
        <p className="text-neutral-400 mt-2">
          {total} {total === 1 ? "follower" : "followers"}
        </p>
      </section>

      <section className="space-y-1">
        {followers.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            You don't have any followers yet.
          </div>
        ) : (
          followers.map((follower) => (
            <UserListItem
              key={follower.id}
              user={follower}
              currentUserId={currentUserId}
              showFollowButton={true}
            />
          ))
        )}
      </section>

      {totalPages > 1 && (
        <nav className="flex justify-center gap-2 mt-8 pb-8">
          {page > 1 && (
            <a
              href={`/me/followers?page=${page - 1}`}
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
              href={`/me/followers?page=${page + 1}`}
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
