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

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col-reverse md:flex-row min-h-screen bg-neutral-900 text-neutral-50`}
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

          <main
            className={`flex-grow px-10 lg:px-24 py-10 transition-all duration-300 ease-in-out`}
          >
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
