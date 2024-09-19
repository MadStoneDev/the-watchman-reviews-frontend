import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

export default function BrowseNavigation() {
  const pathname = usePathname();
  return (
    <section>
      <Link
        href={`/`}
        className={`flex gap-7 max-w-fit ${
          pathname === href
            ? "text-lime-400"
            : "text-neutral-500 hover:text-neutral-50"
        } font-bold transition-all duration-300 ease-in-out`}
      >
        <span>{label}</span>
      </Link>
    </section>
  );
}
