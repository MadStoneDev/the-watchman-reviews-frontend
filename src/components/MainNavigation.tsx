"use client";

import React from "react";
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
  const pathname = usePathname();
  console.log(pathname);

  return (
    <nav className={`p-10 min-w-[250px] bg-neutral-800`}>
      <Logo />

      <section className={`mt-20 flex flex-col gap-14`}>
        {items.map(({ icon, label, href }) => (
          <Link
            href={href}
            className={`flex gap-7 max-w-fit ${
              pathname === href
                ? "text-lime-400"
                : "text-neutral-500 hover:text-neutral-50"
            } font-bold transition-all duration-300 ease-in-out`}
          >
            {icon}
            <span>{label}</span>
          </Link>
        ))}
      </section>
    </nav>
  );
}
