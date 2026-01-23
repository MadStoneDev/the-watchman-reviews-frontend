import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

import Logo from "@/src/components/logo";
import MainFooter from "@/src/components/main-footer";
import MainNavigation from "@/src/components/main-navigation";

import { IconHome, IconLayout2, IconSearch } from "@tabler/icons-react";

import { createClient } from "@/src/utils/supabase/server";

export const metadata: Metadata = {
  title: "My Account | JustReel",
  description: "Manage your JustReel account",
};

export default async function MeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

      <main className="grow flex flex-col h-full max-h-dvh w-full max-w-[2000px] overflow-x-hidden transition-all duration-300 ease-in-out">
        <div className="px-5 md:px-10 pt-5 md:pt-10 grow overflow-y-auto">
          {children}
        </div>

        <section className={`hidden lg:block`}>
          <MainFooter />
        </section>
      </main>

      <section className="block md:hidden p-5 origin-left w-fit scale-75">
        <Link href="/">
          <Logo />
        </Link>
      </section>
    </>
  );
}
