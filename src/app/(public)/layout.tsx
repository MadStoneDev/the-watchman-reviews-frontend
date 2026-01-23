import React from "react";

import Logo from "@/src/components/logo";
import MainFooter from "@/src/components/main-footer";
import MainNavigation from "@/src/components/main-navigation";

import {
  IconHome,
  IconLayout2,
  IconPower,
  IconSearch,
} from "@tabler/icons-react";
import Link from "next/link";

import { createClient } from "@/src/utils/supabase/server";
import LogoutButton from "@/src/components/auth/LogoutButton";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Supabase
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getClaims();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.claims.sub)
      .single();

    profile = data;
  }

  const isUser = !!user;

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
        className={`grow relative flex flex-col h-full max-h-dvh w-full max-w-500 overflow-x-hidden transition-all duration-300 ease-in-out`}
      >
        <div className={`grow pb-4 overflow-y-auto`}>{children}</div>

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
