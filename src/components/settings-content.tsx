"use client";

import Image from "next/image";
import React, { useState } from "react";
import { createClient } from "@/src/utils/supabase/client";

import {
  IconMail,
  IconEye,
  IconEyeOff,
  IconBell,
  IconLock,
  IconCalendar,
  IconTrash,
  IconDownload,
  IconUpload,
  IconUser,
  IconUsers,
  IconUserPlus,
  IconMessage,
  IconHeart,
  IconCoffee,
  IconLoader2,
  IconTrophy,
  IconActivity,
} from "@tabler/icons-react";
import type { VisibilityLevel } from "@/src/lib/types";
import DeleteAccountModal from "./delete-account-modal";

interface SettingsContentProps {
  profileData: any;
  userEmail: string;
  memberSince: string;
  userId: string;
}

export default function SettingsContent({
  profileData,
  userEmail,
  memberSince,
  userId,
}: SettingsContentProps) {
  const supabase = createClient();

  // Parse settings from JSONB
  const initialSettings = {
    email_notifications: true,
    email_new_followers: true,
    email_new_mutuals: true,
    email_messages: true,
    email_achievements: true,
    email_weekly_digest: true,
    default_collection_privacy: "private",
    show_collections_to: "everyone" as VisibilityLevel,
    show_watch_progress_to: "everyone" as VisibilityLevel,
    show_activity_to: "everyone" as VisibilityLevel,
    show_achievements_to: "everyone" as VisibilityLevel,
    allow_messages_from: "everyone" as VisibilityLevel,
    ...profileData.settings,
  };

  const [settings, setSettings] = useState(initialSettings);
  const [profileVisibility, setProfileVisibility] = useState(
    profileData.profile_visibility || "public",
  );
  const [avatarPath, setAvatarPath] = useState(profileData.avatar_path);
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const updateSettings = async (newSettings: any) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ settings: newSettings })
        .eq("id", userId);

      if (error) throw error;
      setSettings(newSettings);
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  const updateProfileVisibility = async (visibility: string) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ profile_visibility: visibility })
        .eq("id", userId);

      if (error) throw error;
      setProfileVisibility(visibility);
    } catch (error) {
      console.error("Error updating profile visibility:", error);
      alert("Failed to update profile visibility");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be less than 2MB");
      return;
    }

    setIsUploading(true);

    try {
      // Delete old avatar if exists
      if (avatarPath) {
        await supabase.storage.from("avatars").remove([avatarPath]);
      }

      // Upload new avatar
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Update profile with new avatar path
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_path: fileName })
        .eq("id", userId);

      if (updateError) throw updateError;

      setAvatarPath(fileName);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Fetch collections with their media items
      const { data: collections } = await supabase
        .from("collections")
        .select("id, title, is_public, created_at")
        .eq("owner", userId);

      // Fetch media items for each collection
      const collectionsWithMedia = await Promise.all(
        (collections || []).map(async (collection) => {
          const { data: mediaItems } = await supabase
            .from("medias_collections")
            .select("media_id, media_type")
            .eq("collection_id", collection.id);

          // Get titles for each media item
          const itemsWithTitles = await Promise.all(
            (mediaItems || []).map(async (item) => {
              if (item.media_type === "movie") {
                const { data: movie } = await supabase
                  .from("movies")
                  .select("title, release_year")
                  .eq("id", item.media_id)
                  .single();
                return {
                  type: "movie",
                  title: movie?.title || "Unknown",
                  year: movie?.release_year || null,
                };
              } else {
                const { data: series } = await supabase
                  .from("series")
                  .select("title, release_year")
                  .eq("id", item.media_id)
                  .single();
                return {
                  type: "series",
                  title: series?.title || "Unknown",
                  year: series?.release_year || null,
                };
              }
            }),
          );

          return {
            name: collection.title,
            isPublic: collection.is_public,
            createdAt: collection.created_at,
            items: itemsWithTitles,
          };
        }),
      );

      // Fetch Reel Deck (currently watching/tracking)
      const { data: reelDeckItems } = await supabase
        .from("reel_deck")
        .select("media_id, media_type, status, added_at")
        .eq("user_id", userId);

      const reelDeckWithTitles = await Promise.all(
        (reelDeckItems || []).map(async (item) => {
          if (item.media_type === "movie") {
            const { data: movie } = await supabase
              .from("movies")
              .select("title, release_year")
              .eq("id", item.media_id)
              .single();
            return {
              type: "movie",
              title: movie?.title || "Unknown",
              year: movie?.release_year || null,
              status: item.status,
              addedAt: item.added_at,
            };
          } else {
            const { data: series } = await supabase
              .from("series")
              .select("title, release_year")
              .eq("id", item.media_id)
              .single();
            return {
              type: "series",
              title: series?.title || "Unknown",
              year: series?.release_year || null,
              status: item.status,
              addedAt: item.added_at,
            };
          }
        }),
      );

      // Fetch episode watch progress grouped by series
      const { data: episodeWatches } = await supabase
        .from("episode_watches")
        .select("episode_id, series_id, watched_at")
        .eq("user_id", userId)
        .order("watched_at", { ascending: false });

      // Group by series and get details
      const seriesMap = new Map<string, any>();
      for (const watch of episodeWatches || []) {
        if (!seriesMap.has(watch.series_id)) {
          const { data: series } = await supabase
            .from("series")
            .select("title")
            .eq("id", watch.series_id)
            .single();
          seriesMap.set(watch.series_id, {
            title: series?.title || "Unknown Series",
            episodes: [],
          });
        }

        const { data: episode } = await supabase
          .from("episodes")
          .select("title, episode_number, season_number")
          .eq("id", watch.episode_id)
          .single();

        seriesMap.get(watch.series_id).episodes.push({
          season: episode?.season_number || 0,
          episode: episode?.episode_number || 0,
          title: episode?.title || "Unknown Episode",
          watchedAt: watch.watched_at,
        });
      }

      // Convert map to array and sort episodes
      const tvProgress = Array.from(seriesMap.entries()).map(([_, data]) => ({
        series: data.title,
        episodesWatched: data.episodes.length,
        episodes: data.episodes.sort((a: any, b: any) => {
          if (a.season !== b.season) return a.season - b.season;
          return a.episode - b.episode;
        }),
      }));

      const exportData = {
        exportedAt: new Date().toISOString(),
        profile: {
          username: profileData.username,
          memberSince: profileData.created_at,
        },
        collections: collectionsWithMedia,
        reelDeck: reelDeckWithTitles,
        tvShowProgress: tvProgress,
      };

      // Create and download JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `watchman-export-${profileData.username}-${new Date().toISOString().split("T")[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const getAvatarUrl = () => {
    if (avatarPath) {
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(avatarPath);

      return data.publicUrl;
    }
    return null;
  };

  const avatarUrl = getAvatarUrl();

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <IconUser size={24} />
          Profile
        </h2>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={80}
                height={80}
                className="rounded-full aspect-square object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-lime-400 flex items-center justify-center text-neutral-900 text-3xl font-bold">
                {profileData.username[0].toUpperCase()}
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400"></div>
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="avatar-upload"
              className="px-4 py-2 bg-lime-400 text-neutral-900 rounded-lg hover:bg-lime-500 cursor-pointer inline-flex items-center gap-2 transition-colors"
            >
              <IconUpload size={18} />
              Upload Avatar
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              disabled={isUploading}
            />
            <p className="text-sm text-neutral-500 mt-2">
              Max 2MB. JPG, PNG, or GIF.
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-400 mb-2">
            <IconMail size={18} />
            Email
          </label>
          <input
            type="email"
            value={userEmail}
            disabled
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-500 cursor-not-allowed"
          />
        </div>

        {/* Member Since */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-400 mb-2">
            <IconCalendar size={18} />
            Member Since
          </label>
          <p className="text-neutral-200">{memberSince}</p>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <IconLock size={24} />
          Privacy
        </h2>

        {/* Profile Visibility */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-200 mb-2">
            Profile Visibility
          </label>
          <p className="text-sm text-neutral-500 mb-3">
            Control who can see your profile and collections
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => updateProfileVisibility("public")}
              disabled={isSaving}
              className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                profileVisibility === "public"
                  ? "bg-lime-400 text-neutral-900 border-lime-400"
                  : "bg-neutral-800 text-neutral-300 border-neutral-700 hover:border-neutral-600"
              } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <IconEye size={18} className="inline mr-2" />
              Public
            </button>
            <button
              onClick={() => updateProfileVisibility("private")}
              disabled={isSaving}
              className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                profileVisibility === "private"
                  ? "bg-lime-400 text-neutral-900 border-lime-400"
                  : "bg-neutral-800 text-neutral-300 border-neutral-700 hover:border-neutral-600"
              } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <IconEyeOff size={18} className="inline mr-2" />
              Private
            </button>
          </div>
        </div>

        {/* Default Collection Privacy */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-200 mb-2">
            Default Collection Privacy
          </label>
          <p className="text-sm text-neutral-500 mb-3">
            New collections will use this privacy setting by default
          </p>
          <div className="flex gap-3">
            <button
              onClick={() =>
                updateSettings({
                  ...settings,
                  default_collection_privacy: "public",
                })
              }
              disabled={isSaving}
              className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                settings.default_collection_privacy === "public"
                  ? "bg-lime-400 text-neutral-900 border-lime-400"
                  : "bg-neutral-800 text-neutral-300 border-neutral-700 hover:border-neutral-600"
              } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Public
            </button>
            <button
              onClick={() =>
                updateSettings({
                  ...settings,
                  default_collection_privacy: "private",
                })
              }
              disabled={isSaving}
              className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                settings.default_collection_privacy === "private"
                  ? "bg-lime-400 text-neutral-900 border-lime-400"
                  : "bg-neutral-800 text-neutral-300 border-neutral-700 hover:border-neutral-600"
              } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Private
            </button>
          </div>
        </div>
      </section>

      {/* Social Privacy Section */}
      <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <IconUsers size={24} />
          Social Privacy
        </h2>

        {/* Show Activity To */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-200 mb-2">
            <IconActivity size={18} />
            Who can see your activity
          </label>
          <p className="text-sm text-neutral-500 mb-3">
            Control who can see your activity feed on your profile
          </p>
          <select
            value={settings.show_activity_to}
            onChange={(e) =>
              updateSettings({
                ...settings,
                show_activity_to: e.target.value as VisibilityLevel,
              })
            }
            disabled={isSaving}
            className={`w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 focus:outline-none focus:border-lime-400 ${
              isSaving ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <option value="everyone">Everyone</option>
            <option value="followers">Followers only</option>
            <option value="mutuals">Mutuals only</option>
            <option value="nobody">Only me</option>
          </select>
        </div>

        {/* Show Watch Progress To */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-200 mb-2">
            <IconUserPlus size={18} />
            Who can see your watch progress
          </label>
          <p className="text-sm text-neutral-500 mb-3">
            Control who can see what you're watching and your progress
          </p>
          <select
            value={settings.show_watch_progress_to}
            onChange={(e) =>
              updateSettings({
                ...settings,
                show_watch_progress_to: e.target.value as VisibilityLevel,
              })
            }
            disabled={isSaving}
            className={`w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 focus:outline-none focus:border-lime-400 ${
              isSaving ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <option value="everyone">Everyone</option>
            <option value="followers">Followers only</option>
            <option value="mutuals">Mutuals only</option>
            <option value="nobody">Only me</option>
          </select>
        </div>

        {/* Show Collections To */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-200 mb-2">
            <IconEye size={18} />
            Who can see your collections
          </label>
          <p className="text-sm text-neutral-500 mb-3">
            Control who can view your public collections
          </p>
          <select
            value={settings.show_collections_to}
            onChange={(e) =>
              updateSettings({
                ...settings,
                show_collections_to: e.target.value as VisibilityLevel,
              })
            }
            disabled={isSaving}
            className={`w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 focus:outline-none focus:border-lime-400 ${
              isSaving ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <option value="everyone">Everyone</option>
            <option value="followers">Followers only</option>
            <option value="mutuals">Mutuals only</option>
            <option value="nobody">Only me</option>
          </select>
        </div>

        {/* Show Achievements To */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-200 mb-2">
            <IconTrophy size={18} />
            Who can see your achievements
          </label>
          <p className="text-sm text-neutral-500 mb-3">
            Control who can view your unlocked achievements
          </p>
          <select
            value={settings.show_achievements_to}
            onChange={(e) =>
              updateSettings({
                ...settings,
                show_achievements_to: e.target.value as VisibilityLevel,
              })
            }
            disabled={isSaving}
            className={`w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 focus:outline-none focus:border-lime-400 ${
              isSaving ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <option value="everyone">Everyone</option>
            <option value="followers">Followers only</option>
            <option value="mutuals">Mutuals only</option>
            <option value="nobody">Only me</option>
          </select>
        </div>

        {/* Allow Messages From */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-200 mb-2">
            <IconMessage size={18} />
            Who can message you
          </label>
          <p className="text-sm text-neutral-500 mb-3">
            Control who can send you direct messages
          </p>
          <select
            value={settings.allow_messages_from}
            onChange={(e) =>
              updateSettings({
                ...settings,
                allow_messages_from: e.target.value as VisibilityLevel,
              })
            }
            disabled={isSaving}
            className={`w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 focus:outline-none focus:border-lime-400 ${
              isSaving ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <option value="everyone">Everyone</option>
            <option value="mutuals">Mutuals only</option>
            <option value="nobody">Nobody</option>
          </select>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <IconBell size={24} />
          Email Notifications
        </h2>

        <p className="text-sm text-neutral-500 mb-6">
          Choose which email notifications you'd like to receive.
        </p>

        {/* New Followers */}
        <div className="mb-4 pb-4 border-b border-neutral-800">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-neutral-200">
                New Followers
              </p>
              <p className="text-sm text-neutral-500 mt-1">
                Get notified when someone follows you
              </p>
            </div>
            <button
              onClick={() =>
                updateSettings({
                  ...settings,
                  email_new_followers: !settings.email_new_followers,
                })
              }
              disabled={isSaving}
              className={`relative inline-flex h-6 min-w-11 items-center rounded-full transition-colors ${
                settings.email_new_followers ? "bg-lime-400" : "bg-neutral-700"
              } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.email_new_followers
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </label>
        </div>

        {/* New Mutuals */}
        <div className="mb-4 pb-4 border-b border-neutral-800">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-neutral-200">
                New Mutuals
              </p>
              <p className="text-sm text-neutral-500 mt-1">
                Get notified when someone you follow follows you back
              </p>
            </div>
            <button
              onClick={() =>
                updateSettings({
                  ...settings,
                  email_new_mutuals: !settings.email_new_mutuals,
                })
              }
              disabled={isSaving}
              className={`relative inline-flex h-6 min-w-11 items-center rounded-full transition-colors ${
                settings.email_new_mutuals ? "bg-lime-400" : "bg-neutral-700"
              } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.email_new_mutuals ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </label>
        </div>

        {/* Messages */}
        <div className="mb-4 pb-4 border-b border-neutral-800">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-neutral-200">Messages</p>
              <p className="text-sm text-neutral-500 mt-1">
                Get notified when you receive a new message (max 1 per hour)
              </p>
            </div>
            <button
              onClick={() =>
                updateSettings({
                  ...settings,
                  email_messages: !settings.email_messages,
                })
              }
              disabled={isSaving}
              className={`relative inline-flex h-6 min-w-11 items-center rounded-full transition-colors ${
                settings.email_messages ? "bg-lime-400" : "bg-neutral-700"
              } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.email_messages ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </label>
        </div>

        {/* Achievements */}
        <div className="mb-4 pb-4 border-b border-neutral-800">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-neutral-200">
                Achievements
              </p>
              <p className="text-sm text-neutral-500 mt-1">
                Get notified when you unlock a new achievement
              </p>
            </div>
            <button
              onClick={() =>
                updateSettings({
                  ...settings,
                  email_achievements: !settings.email_achievements,
                })
              }
              disabled={isSaving}
              className={`relative inline-flex h-6 min-w-11 items-center rounded-full transition-colors ${
                settings.email_achievements ? "bg-lime-400" : "bg-neutral-700"
              } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.email_achievements
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </label>
        </div>

        {/* Weekly Digest */}
        <div>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-neutral-200">
                Weekly Digest
              </p>
              <p className="text-sm text-neutral-500 mt-1">
                Receive a weekly summary of trending content and your stats
                every Friday afternoon
              </p>
            </div>
            <button
              onClick={() =>
                updateSettings({
                  ...settings,
                  email_weekly_digest: !settings.email_weekly_digest,
                })
              }
              disabled={isSaving}
              className={`relative inline-flex h-6 min-w-11 items-center rounded-full transition-colors ${
                settings.email_weekly_digest ? "bg-lime-400" : "bg-neutral-700"
              } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.email_weekly_digest
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </label>
        </div>
      </section>

      {/* Support Section */}
      <section className="bg-gradient-to-br from-amber-950/30 to-neutral-900 rounded-lg p-6 border border-amber-800/30">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <IconHeart size={24} className="text-amber-400" />
          Support JustReel
        </h2>
        <p className="text-neutral-300 mb-4">
          JustReel is built with love and maintained by a small team. If you
          enjoy using the app, consider buying us a coffee to help keep the
          lights on and new features coming.
        </p>
        <p className="text-sm text-neutral-500 mb-6">
          Your support helps cover server costs, development time, and keeps the
          app ad-free.
        </p>
        <a
          href="https://ko-fi.com/justreel"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-900 font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20"
        >
          <IconCoffee size={20} />
          Buy Us a Coffee
        </a>
      </section>

      {/* Data & Account Section */}
      <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
        <h2 className="text-xl font-semibold mb-6">Data & Account</h2>

        {/* Export Data */}
        <div className="mb-6 pb-6 border-b border-neutral-800">
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="w-full sm:w-auto px-4 py-2 bg-neutral-800 text-neutral-200 rounded-lg hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2 border border-neutral-700 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <IconLoader2 size={18} className="animate-spin" />
            ) : (
              <IconDownload size={18} />
            )}
            {isExporting ? "Exporting..." : "Export My Data"}
          </button>
          <p className="text-sm text-neutral-500 mt-2">
            Download all your data including collections, watches, and profile
            information
          </p>
        </div>

        {/* Delete Account */}
        <div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full sm:w-auto px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors flex items-center justify-center gap-2 border border-red-600/50"
          >
            <IconTrash size={18} />
            Delete Account
          </button>
          <p className="text-sm text-neutral-500 mt-2">
            Permanently delete your account and all associated data
          </p>
        </div>
      </section>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <DeleteAccountModal
          onClose={() => setShowDeleteModal(false)}
          userId={userId}
          username={profileData.username}
        />
      )}
    </div>
  );
}
