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

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { username } = await params;

  return {
    title: `${username} | The Watchman Reviews`,
    description: `Follow ${username} on The Watchman Reviews`,
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
          {
            icon: <IconChartBar />,
            label: "How It Works",
            href: "/how-it-works",
          },
        ]}
        isUser={isUser}
        profile={profile}
      />

      {/* Spacing */}
      <div className={`mt-16 md:mt-0 md:min-w-[250px] min-h-[120px]`}></div>

      <main
        className={`flex-grow px-5 md:px-10 xl:px-24 pt-5 md:pt-10 flex flex-col w-full max-w-[2000px] overflow-x-hidden transition-all duration-300 ease-in-out`}
      >
        <div className={`flex-grow`}>{children}</div>

        <MainFooter className={`hidden lg:flex`} />
      </main>

      <section className={`block md:hidden p-5 origin-left w-fit scale-75`}>
        <Link href={`/`}>
          <Logo />
        </Link>
      </section>
    </>
  );
}
