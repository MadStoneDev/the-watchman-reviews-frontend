"use client";

import React, { useState, useEffect } from "react";
import { IconCheck, IconPencil, IconX } from "@tabler/icons-react";
import { createClient } from "@/src/utils/supabase/client";
import { useRouter } from "next/navigation";

interface EditableUsernameProps {
  username: string;
  lastUsernameChange: string | null;
  daysSinceLastChange: number;
  profileId: string;
  currentUserId: string;
}

export default function EditableUsername({
  username,
  lastUsernameChange,
  daysSinceLastChange,
  profileId,
  currentUserId,
}: EditableUsernameProps) {
  // States
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(username);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastChangeInfo, setLastChangeInfo] = useState({
    lastChange: lastUsernameChange,
    daysSince: daysSinceLastChange,
  });

  // Variables
  const isCurrentUserProfile = currentUserId === profileId;

  const canEdit =
    isCurrentUserProfile && (daysSinceLastChange >= 30 || !lastUsernameChange);

  // Functions
  const handleEdit = () => {
    if (!canEdit) return;
    setEditUsername(username);
    setIsEditing(true);
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditUsername(value);

    if (!/^[a-zA-Z0-9]*$/.test(value)) {
      setError("Only letters and numbers allowed");
    } else if (value.length < 3) {
      setError("Username must be at least 3 characters");
    } else if (value.length > 20) {
      setError("Username must be less than 20 characters");
    } else {
      setError("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !error && editUsername.trim()) {
      confirmEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const confirmEdit = async () => {
    if (!isCurrentUserProfile) {
      setError("You don't have permission to edit this profile");
      return;
    }

    if (editUsername.trim() === username) {
      cancelEdit();
      return;
    }

    if (editUsername.trim() && !error) {
      const newUsername = editUsername.trim();
      setIsSubmitting(true);
      const supabase = createClient();

      const { data: existingUsers, error: checkError } = await supabase
        .from("profiles")
        .select("username")
        .ilike("username", newUsername);

      const existingUser = existingUsers?.some(
        (user) => user.username.toLowerCase() === newUsername.toLowerCase(),
      );

      if (checkError) {
        setError("Error checking username availability");
        setIsSubmitting(false);
        return;
      }

      if (
        existingUser &&
        newUsername.toLowerCase() !== username.toLowerCase()
      ) {
        setError("Username already taken");
        setIsSubmitting(false);
        return;
      }

      const now = new Date().toISOString();
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          username: newUsername,
          last_username_change: now,
        })
        .eq("id", profileId);

      if (updateError) {
        setError("Error updating username");
        setIsSubmitting(false);
        return;
      }

      setLastChangeInfo({
        lastChange: now,
        daysSince: 0,
      });
      setIsEditing(false);
      setIsSubmitting(false);

      router.push(`/${newUsername}`);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditUsername(username);
    setError("");
  };

  // Effects
  useEffect(() => {
    setLastChangeInfo({
      lastChange: lastUsernameChange,
      daysSince: daysSinceLastChange,
    });
  }, [lastUsernameChange, daysSinceLastChange]);

  return (
    <section>
      {isEditing ? (
        <div className={`flex flex-col gap-1`}>
          <article
            className={`p-2 flex flex-col gap-2 w-fit rounded-sm bg-neutral-600 transition-all duration-300 ease-in-out`}
          >
            <div className={`flex items-center gap-2`}>
              <input
                type="text"
                value={editUsername}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className={`p-2 border ${
                  error ? "border-red-500" : "border-neutral-300"
                } bg-neutral-900 rounded focus:outline-hidden focus:border-lime-400 font-bold text-2xl sm:3xl md:text-4xl`}
                autoFocus
                disabled={isSubmitting}
              />
              <div className="flex items-center gap-1">
                <button
                  onClick={confirmEdit}
                  disabled={!!error || !editUsername.trim() || isSubmitting}
                  className={`p-1 text-lime-400 ${
                    !!error || !editUsername.trim() || isSubmitting
                      ? "text-neutral-600 cursor-not-allowed"
                      : "hover:text-neutral-900 hover:bg-lime-400"
                  } rounded transition-all duration-300 ease-in-out`}
                >
                  <IconCheck size={20} />
                </button>
                <button
                  onClick={cancelEdit}
                  disabled={isSubmitting}
                  className={`p-1 hover:bg-neutral-400 text-neutral-400 hover:text-neutral-900 rounded-sm transition-all duration-300 ease-in-out`}
                >
                  <IconX size={20} />
                </button>
              </div>
            </div>
            {isCurrentUserProfile &&
              (lastChangeInfo.lastChange ? (
                <p
                  className={`block w-full mt-0 text-sm text-neutral-400 italic`}
                >
                  Last change: {lastChangeInfo.daysSince} days ago
                  {lastChangeInfo.daysSince < 30 && (
                    <span className="ml-1">
                      (can change again in {30 - lastChangeInfo.daysSince} days)
                    </span>
                  )}
                </p>
              ) : (
                <p
                  className={`block w-full mt-2 text-sm text-neutral-400 italic`}
                >
                  You can change your username once every 30 days.
                </p>
              ))}
          </article>
          <article>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </article>
        </div>
      ) : (
        <article className={`flex items-center gap-2`}>
          <h1 className={`text-2xl sm:3xl md:text-4xl font-bold`}>
            {isCurrentUserProfile && "Hi "}
            {username}
            {isCurrentUserProfile ? "!" : "'s Profile"}
          </h1>
          {canEdit ? (
            <button
              onClick={handleEdit}
              className={`p-1 hover:bg-lime-400 text-neutral-500 hover:text-neutral-900 rounded-sm transition-all duration-300 ease-in-out`}
              title={`Edit username`}
            >
              <IconPencil size={20} />
            </button>
          ) : isCurrentUserProfile ? (
            <span
              className={`p-1 text-neutral-500 cursor-not-allowed`}
              title={`Username can only be changed once every 30 days`}
            >
              <IconPencil size={20} />
            </span>
          ) : null}
        </article>
      )}
    </section>
  );
}
