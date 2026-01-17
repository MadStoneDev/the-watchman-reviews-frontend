"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IconX, IconSearch, IconMessagePlus, IconUser } from "@tabler/icons-react";
import { getMessageableUsers, getOrCreateConversation } from "@/src/app/actions/messaging";
import { createClient } from "@/src/utils/supabase/client";

interface MessageableUser {
  id: string;
  username: string;
  avatar_path: string | null;
  hasExistingConversation: boolean;
}

interface NewConversationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewConversationDialog({
  isOpen,
  onClose,
}: NewConversationDialogProps) {
  const router = useRouter();
  const supabase = createClient();
  const [users, setUsers] = useState<MessageableUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<MessageableUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter((user) => user.username.toLowerCase().includes(query))
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);

    const result = await getMessageableUsers();

    if (result.success && result.users) {
      setUsers(result.users);
      setFilteredUsers(result.users);
    } else {
      setError(result.error || "Failed to load users");
    }

    setIsLoading(false);
  };

  const startConversation = async (userId: string) => {
    setIsStarting(true);
    setError(null);

    const result = await getOrCreateConversation(userId);

    if (result.success && result.conversationId) {
      onClose();
      router.push(`/messages/${result.conversationId}`);
    } else {
      setError(result.error || "Failed to start conversation");
      setIsStarting(false);
    }
  };

  const getAvatarUrl = (avatarPath: string | null) => {
    if (avatarPath) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(avatarPath);
      return data.publicUrl;
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-neutral-800 rounded-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-700">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <IconMessagePlus size={20} />
            New Message
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-neutral-700">
          <div className="relative">
            <IconSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:border-lime-400 text-white placeholder-neutral-400"
            />
          </div>
        </div>

        {/* User list */}
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-400">{error}</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-neutral-400">
              {searchQuery
                ? "No users found"
                : "No users available to message. Follow some people to start chatting!"}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredUsers.map((user) => {
                const avatarUrl = getAvatarUrl(user.avatar_path);

                return (
                  <button
                    key={user.id}
                    onClick={() => startConversation(user.id)}
                    disabled={isStarting}
                    className="w-full flex items-center gap-3 p-3 hover:bg-neutral-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {/* Avatar */}
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={user.username}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-lime-400 flex items-center justify-center text-neutral-900 font-bold">
                        {user.username[0].toUpperCase()}
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 text-left">
                      <p className="font-medium">{user.username}</p>
                      {user.hasExistingConversation && (
                        <p className="text-xs text-neutral-400">
                          Continue conversation
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
