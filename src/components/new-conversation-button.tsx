"use client";

import React, { useState } from "react";
import { IconMessagePlus } from "@tabler/icons-react";
import NewConversationDialog from "./new-conversation-dialog";

export default function NewConversationButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-lime-400 text-neutral-900 font-medium rounded-lg hover:bg-lime-300 transition-colors"
      >
        <IconMessagePlus size={20} />
        <span className="hidden sm:inline">New Message</span>
      </button>

      <NewConversationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
