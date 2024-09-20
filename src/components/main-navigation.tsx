"use client";

import React, { useState } from "react";
import Link from "next/link";

import Logo from "@/components/logo";
import { usePathname } from "next/navigation";

interface NavigationItem {
  icon: React.JSX.Element;
  label: string;
  href: string;
}

export default function MainNavigation({
  items = [],
}: {
  items?: NavigationItem[];
}) {
  // Hooks
  const pathname = usePathname();

  return (
    <nav className={`px-10 py-5 md:p-10 min-w-[250px] bg-neutral-800`}>
      <Logo className={`hidden md:block`} />

      <section className={`md:mt-20 flex md:flex-col justify-between`}>
        {items.map(({ icon, label, href }) => (
          <Link
            key={href}
            href={href}
            className={`flex gap-7 max-w-fit ${
              href === "/"
                ? pathname === href
                  ? "text-lime-400"
                  : "text-neutral-500 hover:text-neutral-50"
                : pathname.includes(href)
                  ? "text-lime-400"
                  : "text-neutral-500 hover:text-neutral-50"
            } font-bold transition-all duration-300 ease-in-out`}
          >
            {icon}
            <span className={`hidden md:block`}>{label}</span>
          </Link>
        ))}
      </section>
    </nav>
  );
}
