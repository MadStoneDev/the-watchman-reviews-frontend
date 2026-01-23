import React from "react";
import Link from "next/link";

import Logo from "@/src/components/logo";
import MainFooter from "@/src/components/main-footer";
import MainNavigation from "@/src/components/main-navigation";

import {
  IconChartBar,
  IconHome,
  IconLayout2,
  IconSearch,
} from "@tabler/icons-react";

import { createClient } from "@/src/utils/supabase/server";
import BrowseNavigation from "@/src/components/browse-navigation";
import LogoutButton from "@/src/components/auth/LogoutButton";

export async function generateMetadata() {
  return {
    title: `Settings | JustReel`,
    description: `Change your settings`,
  };
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Supabase
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getClaims();

  const isUser = !!user;

  let profile = null;
  if (isUser) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.claims.sub)
      .single();

    profile = data;
  }

  return (
    <>
      <MainNavigation
        items={[
          { icon: <IconSearch />, label: "Search", href: "/search" },
          { icon: <IconHome />, label: "Home", href: "/" },
          { icon: <IconLayout2 />, label: "Browse", href: "/browse" },
        ]}
        isUser={isUser}
        profile={profile}
      />

      {/* Spacing */}
      <div className={`md:min-w-62.5 min-h-25.5`}></div>

      <main
        className={`grow flex flex-col h-full max-h-dvh w-full max-w-[2000px] overflow-x-hidden transition-all duration-300 ease-in-out`}
      >
        <div className={`px-5 lg:px-10 pt-3 lg:pt-10 grow overflow-y-auto`}>
          {children}
        </div>

        <section className={`hidden lg:block`}>
          <MainFooter />
        </section>
      </main>

      <section
        className={`flex lg:hidden items-center justify-between p-5 w-full`}
      >
        <Link href={`/`} className={`origin-left w-fit scale-75`}>
          <Logo />
        </Link>

        <LogoutButton />
      </section>
    </>
  );
}
