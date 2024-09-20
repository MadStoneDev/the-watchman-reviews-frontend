"use client";

import { IconArrowNarrowLeft } from "@tabler/icons-react";

export default function GoBack() {
  return (
    <button
      onClick={() => window.history.back()}
      className={`text-neutral-400 md:text-neutral-500 hover:text-neutral-50 transition-all duration-300 ease-in-out`}
    >
      <IconArrowNarrowLeft size={30} />
    </button>
  );
}
