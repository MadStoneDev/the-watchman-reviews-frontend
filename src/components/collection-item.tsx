import React from "react";
import { IconTrash } from "@tabler/icons-react";

type CollectionItemProps = {
  title: string;
  imageUrl?: string;
  onDelete: () => void;
};

const CollectionItem = ({ title, imageUrl, onDelete }: CollectionItemProps) => {
  return (
    <article className="flex items-center gap-2 p-2 rounded-md transition-all duration-300 ease-in-out">
      <div className="h-16 w-16 flex-shrink-0 bg-neutral-700 rounded overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full" />
        )}
      </div>

      <span className="flex-grow hover:text-lime-400 transition-all duration-300 ease-in-out">
        {title}
      </span>

      <button
        onClick={onDelete}
        className="p-1 text-neutral-600 hover:bg-neutral-100 hover:text-red-500 rounded transition-colors"
        aria-label="Delete item"
      >
        <IconTrash size={20} />
      </button>
    </article>
  );
};

export default CollectionItem;
