﻿import Link from "next/link";
import React, { useState } from "react";

import {
  IconCheck,
  IconCloud,
  IconMovie,
  IconPencil,
  IconTrash,
  IconX,
} from "@tabler/icons-react";

import { MediaCollection } from "@/src/lib/types";

export const UserCollectionRow = ({
  collection,
  onUpdate,
  onDelete,
  currentUserId,
}: {
  collection: MediaCollection;
  onUpdate: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
  currentUserId: string | undefined;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(collection.title);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Only allow editing if the user is the owner AND the current user
  const canEdit = collection.owner === currentUserId;

  const imageBasePath = "https://image.tmdb.org/t/p/original/";

  const handleEdit = () => {
    if (!canEdit) return;
    setEditTitle(collection.title);
    setIsEditing(true);
    setError("");
  };

  const handleDelete = () => {
    if (!canEdit) return;
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(collection.id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);

    // Validate input - only letters, numbers, hyphens, and spaces
    if (!/^[a-zA-Z0-9\- ]*$/.test(e.target.value)) {
      setError("Only letters, numbers, hyphens, and spaces are allowed");
    } else {
      setError("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !error) {
      confirmEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const confirmEdit = () => {
    if (editTitle.trim() && !error) {
      onUpdate(collection.id, editTitle.trim());
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditTitle(collection.title);
    setError("");
  };

  return (
    <article
      className={`group p-1 flex items-center gap-1 h-20 w-full ${
        isEditing ? "bg-neutral-100" : "hover:bg-neutral-700"
      } rounded-md transition-all duration-300 ease-in-out relative overflow-hidden`}
    >
      {/* Background Image Layer */}
      {collection.backdrop_path && (
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: `url(${imageBasePath}${collection.backdrop_path})`,
            backgroundSize: `cover`,
            backgroundPosition: `center center`,
          }}
        />
      )}

      {/* Gradient Overlay */}
      <div
        className={`absolute inset-0 ${
          showDeleteConfirm
            ? "bg-neutral-200"
            : "bg-gradient-to-r from-neutral-900 via-neutral-900/50 to-transparent"
        }`}
      />

      {/* Content Layer */}
      <div className="relative z-10 flex items-center gap-2 w-full">
        {showDeleteConfirm ? (
          <>
            <div className="flex-grow px-2 text-red-600">
              <p>Are you sure you want to delete "{collection.title}"?</p>
            </div>
            <div className={`flex gap-1`}>
              <button
                onClick={confirmDelete}
                className={`p-1 hover:bg-rose-600 text-red-600 hover:text-neutral-100 rounded transition-all duration-300 ease-in-out`}
              >
                <IconCheck size={20} />
              </button>
              <button
                onClick={cancelDelete}
                className={`p-1 hover:bg-neutral-300 text-neutral-400 hover:text-neutral-900 rounded transition-all duration-300 ease-in-out`}
              >
                <IconX size={20} />
              </button>
            </div>
          </>
        ) : (
          <>
            {collection.shared ? (
              <IconCloud className="text-neutral-300 transition-all duration-300 ease-in-out" />
            ) : (
              <IconMovie
                className={`${
                  isEditing ? "text-neutral-600" : "text-neutral-300"
                } transition-all duration-300 ease-in-out`}
              />
            )}

            {isEditing ? (
              <>
                <div className="flex-grow">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className={`w-full p-1 border ${
                      error ? "border-red-500" : "border-neutral-300"
                    } rounded focus:outline-none focus:border-lime-400`}
                    autoFocus
                  />
                </div>
                <div className={`flex items-center gap-0`}>
                  <button
                    onClick={confirmEdit}
                    disabled={!!error || !editTitle.trim()}
                    className={`p-1 text-lime-400 ${
                      !!error || !editTitle.trim()
                        ? "text-neutral-600 cursor-not-allowed"
                        : "hover:text-neutral-900 hover:bg-lime-400"
                    } rounded transition-all duration-300 ease-in-out`}
                  >
                    <IconCheck size={20} />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className={`p-1 hover:bg-neutral-300 text-neutral-200 hover:text-neutral-900 rounded transition-all duration-300 ease-in-out`}
                  >
                    <IconX size={20} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href={`/collections/${collection.id}`}
                  className={`flex-grow flex flex-col justify-center h-10 hover:text-lime-400 transition-all duration-300 ease-in-out`}
                >
                  <div className={`text-sm font-medium`}>
                    {collection.title}
                  </div>
                  <div className="text-xs text-neutral-400">
                    {collection.item_count || 0}{" "}
                    {collection.item_count === 1 ? "title" : "titles"}
                  </div>
                </Link>

                {canEdit && (
                  <div
                    className={`flex text-neutral-400 group-hover:text-neutral-400 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out`}
                  >
                    <button
                      onClick={handleEdit}
                      className={`p-1 grid place-content-center w-10 h-10 hover:bg-lime-400 hover:text-neutral-900 rounded transition-all duration-300 ease-in-out`}
                    >
                      <IconPencil size={20} />
                    </button>
                    <button
                      onClick={handleDelete}
                      className={`p-1 grid place-content-center w-10 h-10 hover:bg-red-600 hover:text-neutral-50 rounded transition-all duration-300 ease-in-out`}
                    >
                      <IconTrash size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </article>
  );
};
