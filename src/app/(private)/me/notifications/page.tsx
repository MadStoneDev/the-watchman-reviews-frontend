import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import { getNotifications } from "@/src/app/actions/notifications";

import BrowseNavigation from "@/src/components/browse-navigation";
import NotificationsList from "@/src/components/notifications-list";

export const revalidate = 0; // Always fresh

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || "1", 10);

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

  // Get notifications
  const result = await getNotifications(page, 20);
  const notifications = result.notifications || [];
  const total = result.total || 0;
  const unreadCount = result.unreadCount || 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <>
      <BrowseNavigation
        items={[
          { label: "Account", href: "/me" },
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:3xl md:text-4xl font-bold">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-neutral-400 mt-1">
                {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      </section>

      <NotificationsList
        initialNotifications={notifications}
        initialUnreadCount={unreadCount}
        currentPage={page}
        totalPages={totalPages}
        username={profile.username}
      />
    </>
  );
}
