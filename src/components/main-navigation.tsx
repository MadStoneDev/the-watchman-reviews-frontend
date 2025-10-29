"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import Logo from "@/src/components/logo";
import MainFooter from "@/src/components/main-footer";

import {
  IconChartBar,
  IconDeviceTv,
  IconPower,
  IconUser,
} from "@tabler/icons-react";

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
  profile = null,
}: MainNavigationProps) {
  // Hooks
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav
      className={`fixed lg:top-0 bottom-0 left-0 right-0 lg:right-auto px-5 pb-3 lg:pb-5 pt-3 lg:pt-10 min-h-[70px] lg:min-h-auto lg:min-w-[250px] bg-neutral-800 z-50`}
    >
      <section
        className={`flex flex-row lg:flex-col gap-10 lg:gap-0 justify-center lg:justify-start items-center lg:items-start w-full h-full`}
      >
        <Logo className={`hidden lg:block`} />

        <article
          className={`lg:flex-grow lg:mt-20 flex lg:flex-col justify-center lg:justify-start items-center lg:items-start gap-10 lg:gap-14`}
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
              <span className={`hidden lg:block`}>{label}</span>
            </Link>
          ))}

          {profile && (
            <Link
              href={`/${profile?.username}/reel-deck`}
              className={`flex gap-6 max-w-fit ${
                pathname === `/reel-deck`
                  ? "text-lime-400"
                  : "text-neutral-500 hover:text-neutral-200"
              } font-bold transition-all duration-300 ease-in-out`}
            >
              <IconDeviceTv />
              <span className={`hidden lg:block`}>Reel Deck</span>
            </Link>
          )}

          <Link
            href={`/how-it-works`}
            className={`flex gap-6 max-w-fit ${
              pathname === `/how-it-works`
                ? "text-lime-400"
                : "text-neutral-500 hover:text-neutral-200"
            } font-bold transition-all duration-300 ease-in-out`}
          >
            <IconChartBar />
            <span className={`hidden lg:block`}>How it Works</span>
          </Link>
        </article>

        <article className={`flex items-center gap-2 lg:w-full`}>
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
                className={`fixed top-5 lg:top-auto right-5 lg:right-auto lg:relative p-2 flex items-center justify-center ${
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
              <span className={`hidden lg:block text-sm`}>Login</span>
            </Link>
          )}
        </article>
      </section>
    </nav>
  );
}
