﻿"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import Logo from "@/src/components/logo";
import MainFooter from "@/src/components/main-footer";

import { IconPower, IconUser } from "@tabler/icons-react";

import { createClient } from "@/src/utils/supabase/client";

interface NavigationItem {
  icon: React.JSX.Element;
  label: string;
  href: string;
}

// Define a proper user type based on your database schema
interface Profile {
  id: string;
  username: string;
  created_at: string;
  settings: any | null;
}

interface MainNavigationProps {
  items?: NavigationItem[];
  isUser?: boolean;
  profile?: Profile | null;
}

export default function MainNavigation({
  items = [],
  isUser = false,
}: MainNavigationProps) {
  // Hooks
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav
      className={`fixed md:top-0 bottom-0 left-0 right-0 md:right-auto px-10 pb-2 pt-5 md:p-10 min-h-[70px] md:min-h-auto md:min-w-[250px] bg-neutral-800 z-50`}
    >
      <section
        className={`flex flex-row md:flex-col gap-10 md:gap-0 justify-center md:justify-start items-center md:items-start w-full h-full`}
      >
        <Logo className={`hidden md:block`} />

        <article
          className={`md:flex-grow md:mt-20 flex md:flex-col justify-center md:justify-start items-center md:items-start gap-10 md:gap-14`}
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

        <article className={`flex items-center gap-2 md:w-full`}>
          {isUser ? (
            <div
              className={`flex-grow flex flex-row-reverse items-center gap-2`}
            >
              <Link
                href={"/me"}
                className={`flex-grow p-2 flex items-center justify-center gap-2 bg-lime-400 rounded-lg border-2 border-lime-400 text-neutral-900 font-bold transition-all duration-300 ease-in-out`}
                title={`Profile`}
              >
                <IconUser size={26} />
              </Link>

              <button
                onClick={async () => {
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  router.push("/");
                  router.refresh();
                }}
                className={`fixed top-5 md:top-auto right-5 md:right-auto md:relative p-2 flex items-center justify-center ${
                  pathname === "/logout"
                    ? "text-lime-400"
                    : "text-neutral-600 hover:text-lime-400"
                } font-bold transition-all duration-300 ease-in-out`}
                title="Logout"
              >
                <IconPower size={26} />
              </button>
            </div>
          ) : (
            <Link
              href={"/auth/portal"}
              className={`flex-grow p-2 flex items-center justify-center gap-2 bg-lime-400 rounded-lg border-2 border-lime-400 text-neutral-900 font-bold transition-all duration-300 ease-in-out`}
              title={`Login`}
            >
              <IconUser size={26} />
              <span className={`hidden md:block text-sm`}>Login</span>
            </Link>
          )}
        </article>
      </section>
      <MainFooter className={`flex md:hidden`} />
    </nav>
  );
}
