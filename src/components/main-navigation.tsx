"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "@/src/components/logo";
import MainFooter from "@/src/components/main-footer";

import { IconPower, IconUser } from "@tabler/icons-react";
import { User } from "@supabase/supabase-js";

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
  user?: User | null;
  profile?: Profile | null;
}

export default function MainNavigation({
  items = [],
  user = null,
  profile = null,
}: MainNavigationProps) {
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
          className={`fixed top-5 right-5 md:right-auto md:relative flex items-center gap-2 md:w-full`}
        >
          {user ? (
            <div
              className={`flex-grow flex flex-row-reverse md:flex-row items-center gap-2`}
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
                }}
                className={`p-2 flex items-center justify-center ${
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
