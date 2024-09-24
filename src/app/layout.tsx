import "./globals.css";

import React from "react";
import localFont from "next/font/local";

import {
  IconSearch,
  IconHome,
  IconLayout2,
  IconChartBar,
} from "@tabler/icons-react";

import MainNavigation from "@/components/main-navigation";
import { ThemeProvider } from "@/components/theme-provider";
import Logo from "@/components/logo";
import MainFooter from "@/components/main-footer";

const montserrat = localFont({
  src: "./fonts/Montserrat.ttf",
  variable: "--font-montserrat",
  weight: "400 600 700",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} antialiased flex flex-col-reverse md:flex-row min-h-dvh bg-neutral-900 text-neutral-50`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainNavigation
            items={[
              { icon: <IconSearch />, label: "Search", href: "/search" },
              { icon: <IconHome />, label: "Home", href: "/" },
              { icon: <IconLayout2 />, label: "Browse", href: "/browse" },
              {
                icon: <IconChartBar />,
                label: "Statistics",
                href: "/statistics",
              },
            ]}
          />

          {/* Spacing */}
          <div className={`mt-16 md:mt-0 md:min-w-[250px] min-h-[120px]`}></div>

          <main
            className={`px-5 md:px-10 xl:px-24 pt-5 md:pt-10 flex flex-col w-full overflow-x-hidden transition-all duration-300 ease-in-out`}
          >
            <div className={`flex-grow`}>{children}</div>

            <MainFooter className={` hidden md:flex`} />
          </main>

          <section className={`block md:hidden p-5 origin-left scale-75`}>
            <Logo />
          </section>
        </ThemeProvider>
      </body>
    </html>
  );
}
