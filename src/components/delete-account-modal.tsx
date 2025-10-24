"use client";

import React, { useState } from "react";
import { createClient } from "@/src/utils/supabase/client";
import { useRouter } from "next/navigation";
import { IconX, IconAlertTriangle } from "@tabler/icons-react";

interface DeleteAccountModalProps {
  onClose: () => void;
  userId: string;
  username: string;
}

export default function DeleteAccountModal({
  onClose,
  userId,
  username,
}: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    if (confirmText !== username) return;

    setIsDeleting(true);

    try {
      // Delete user data (this will cascade based on your DB constraints)
      // Note: You might want to add more cleanup logic here
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (profileError) throw profileError;

      // Sign out and redirect
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again or contact support.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-lg max-w-md w-full p-6 border border-red-600/50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 text-red-400">
            <IconAlertTriangle size={24} />
            <h2 className="text-xl font-semibold">Delete Account</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-200"
            disabled={isDeleting}
          >
            <IconX size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-neutral-300">
            This action cannot be undone. This will permanently delete your
            account and remove all your data including:
          </p>
          <ul className="list-disc list-inside text-sm text-neutral-400 space-y-1">
            <li>Your profile and username</li>
            <li>All your collections</li>
            <li>Your watch history</li>
            <li>Your comments and interactions</li>
          </ul>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Type <span className="font-bold text-red-400">{username}</span> to
              confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-red-500 text-neutral-200"
              placeholder={username}
              disabled={isDeleting}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-neutral-800 text-neutral-200 rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={confirmText !== username || isDeleting}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
