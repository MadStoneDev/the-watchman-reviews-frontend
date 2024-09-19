"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationItem {
  label: string;
  href: string;
}

export default function BrowseNavigation({
  items = [],
}: {
  items?: NavigationItem[];
}) {
  const pathname = usePathname();

  return (
    <section className={`flex gap-16`}>
      {items.map(({ label, href }) => (
        <Link
          href={href}
          className={`flex gap-7 max-w-fit ${
            pathname === href
              ? "text-lime-400"
              : "text-neutral-500 hover:text-neutral-50"
          } font-bold transition-all duration-300 ease-in-out`}
        >
          <span>{label}</span>
        </Link>
      ))}
    </section>
  );
}
