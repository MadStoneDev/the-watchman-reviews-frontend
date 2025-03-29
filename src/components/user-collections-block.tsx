"use client";

import {
  IconMovie,
  IconPencil,
  IconSquarePlus,
  IconCheck,
  IconX,
  IconTrash,
  IconCloud,
} from "@tabler/icons-react";
import React, { useState } from "react";
import Link from "next/link";

type MediaCollection = {
  id?: string;
  title: string;
  isOwner?: boolean;
};

const CollectionItem = ({
  collection,
  onUpdate,
  onDelete,
}: {
  collection: MediaCollection;
  onUpdate: (id: string | undefined, newTitle: string) => void;
  onDelete: (id: string | undefined) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(collection.title);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Default to true if isOwner is undefined
  const isOwner = collection.isOwner !== false;

  const handleEdit = () => {
    if (!isOwner) return;
    setEditTitle(collection.title);
    setIsEditing(true);
    setError("");
  };

  const handleDelete = () => {
    if (!isOwner) return;
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
      className={`flex items-center gap-2 p-2 ${
        isEditing || showDeleteConfirm ? "bg-neutral-100" : ""
      } rounded-md transition-all duration-300 ease-in-out`}
    >
      {showDeleteConfirm ? (
        <>
          <div className="flex-grow px-2 text-red-600">
            <p>Are you sure you want to delete "{collection.title}"?</p>
          </div>
          <div className={`flex gap-4`}>
            <button
              onClick={confirmDelete}
              className="p-1 text-rose-600 hover:bg-rose-100 rounded"
            >
              <IconCheck size={20} />
            </button>
            <button
              onClick={cancelDelete}
              className="p-1 text-neutral-600 hover:bg-neutral-100 rounded"
            >
              <IconX size={20} />
            </button>
          </div>
        </>
      ) : (
        <>
          {isOwner ? (
            <IconMovie
              className={`${
                isEditing ? "text-neutral-600" : "text-neutral-300"
              } transition-all duration-300 ease-in-out`}
            />
          ) : (
            <IconCloud className="text-neutral-300 transition-all duration-300 ease-in-out" />
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
                  className={`p-1 text-lime-600 ${
                    !!error || !editTitle.trim()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-lime-200/70"
                  } rounded`}
                >
                  <IconCheck size={20} />
                </button>
                <button
                  onClick={cancelEdit}
                  className="p-1 text-rose-500 hover:bg-rose-100 rounded"
                >
                  <IconX size={20} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href={`/collections/${collection.id}`}
                className={`flex-grow hover:text-lime-400 transition-all duration-300 ease-in-out`}
              >
                {collection.title}
              </Link>
              {isOwner && (
                <>
                  <button
                    onClick={handleEdit}
                    className="p-1 text-neutral-600 hover:bg-neutral-100 hover:text-lime-400 rounded transition-colors"
                  >
                    <IconPencil size={20} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-1 text-neutral-600 hover:bg-neutral-100 hover:text-red-500 rounded transition-colors"
                  >
                    <IconTrash size={20} />
                  </button>
                </>
              )}
            </>
          )}
        </>
      )}
    </article>
  );
};

export default function UserCollectionsBlock() {
  // States
  const [collections, setCollections] = useState<MediaCollection[]>([
    { id: "1", title: "My Favorites", isOwner: true },
    { id: "2", title: "Watch Later", isOwner: true },
    { id: "3", title: "Friend's Recommendations", isOwner: false },
  ]);

  const updateCollection = (id: string | undefined, newTitle: string) => {
    setCollections(
      collections.map((col) =>
        col.id === id ? { ...col, title: newTitle } : col,
      ),
    );
  };

  const deleteCollection = (id: string | undefined) => {
    setCollections(collections.filter((col) => col.id !== id));
  };

  const createNewCollection = () => {
    const newCollection = {
      id: Date.now().toString(), // Simple ID generation for example
      title: "New Collection",
      isOwner: true,
    };
    setCollections([...collections, newCollection]);
  };

  return (
    <div className="my-4">
      <button
        onClick={createNewCollection}
        className="p-2 flex justify-center items-center gap-1 w-full border hover:border-lime-400 hover:text-lime-400 opacity-70 hover:opacity-100 transition-all duration-300 ease-in-out rounded"
      >
        <IconSquarePlus size={32} />
        <span>Create a new collection</span>
      </button>

      <section className="my-4 space-y-2">
        {collections.map((collection) => (
          <CollectionItem
            key={collection.id}
            collection={collection}
            onUpdate={updateCollection}
            onDelete={deleteCollection}
          />
        ))}
      </section>
    </div>
  );
}
