"use client";

import React, { useState } from "react";
import Link from "next/link";

import Logo from "@/src/components/logo";
import { usePathname } from "next/navigation";
import MainFooter from "@/src/components/main-footer";
import {
  IconLogin,
  IconLogout,
  IconPower,
  IconUser,
} from "@tabler/icons-react";

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
    <nav
      className={`fixed md:top-0 bottom-0 left-0 right-0 md:right-auto px-10 pb-2 pt-5 md:p-10 min-h-[70px] md:min-h-auto md:min-w-[250px] bg-neutral-800 z-50`}
    >
      <section className={`flex flex-col h-full`}>
        <Logo className={`hidden md:block`} />

        <article
          className={`flex-grow md:mt-20 flex md:flex-col justify-between md:justify-start items-center md:items-start md:gap-14`}
        >
          {items.map(({ icon, label, href }) => (
            <Link
              key={href}
              href={href}
              className={`flex gap-6 max-w-fit ${
                href === "/"
                  ? pathname === href
                    ? "text-lime-400"
                    : "text-neutral-500 hover:text-neutral-200"
                  : !pathname.includes("/admin") && pathname.includes(href)
                    ? "text-lime-400"
                    : "text-neutral-500 hover:text-neutral-200"
              } font-bold transition-all duration-300 ease-in-out`}
            >
              {icon}
              <span className={`hidden md:block`}>{label}</span>
            </Link>
          ))}
        </article>

        <article
          className={`fixed top-5 right-5 md:relative flex items-center md:w-full`}
        >
          <Link
            href={"/auth/portal"}
            className={`flex-grow p-2 flex items-center justify-center gap-2 bg-lime-400 rounded-lg border-2 border-lime-400 text-neutral-900 font-bold transition-all duration-300 ease-in-out`}
            title={`Login`}
          >
            <IconUser size={26} />
            <span className={`hidden md:block text-sm`}>Login</span>
          </Link>
          {/* Logout */}
          {/*<Link*/}
          {/*  href={"/logout"}*/}
          {/*  className={`flex-grow grid place-items-center ${*/}
          {/*    pathname === "/logout"*/}
          {/*      ? "text-lime-400"*/}
          {/*      : "text-neutral-600 hover:text-neutral-200"*/}
          {/*  } font-bold transition-all duration-300 ease-in-out`}*/}
          {/*>*/}
          {/*  <IconPower size={26} />*/}
          {/*</Link>*/}
        </article>
      </section>
      <MainFooter className={`flex md:hidden`} />
    </nav>
  );
}
