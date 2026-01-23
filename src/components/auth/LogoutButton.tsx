"use client";

import React from "react";
import { IconPower } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/src/utils/supabase/client";

export default function LogoutButton() {
  // Hooks
  const pathname = usePathname();
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        const supabase = await createClient();
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
      }}
      className={`fixed top-3 lg:top-auto right-5 lg:right-auto lg:relative p-2 flex items-center justify-center ${
        pathname === "/logout"
          ? "text-lime-400"
          : "text-neutral-600 hover:text-lime-400"
      } font-bold transition-all duration-300 ease-in-out`}
      title="Logout"
    >
      <IconPower size={26} />
    </button>
  );
}
