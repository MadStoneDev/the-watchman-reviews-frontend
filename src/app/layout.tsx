import "./globals.css";

import React from "react";
import localFont from "next/font/local";

<<<<<<< HEAD
import {
  IconSearch,
  IconHome,
  IconLayout2,
  IconChartBar,
} from "@tabler/icons-react";

import MainNavigation from "@/src/components/main-navigation";
import { ThemeProvider } from "@/src/components/theme-provider";
import Logo from "@/src/components/logo";
import MainFooter from "@/src/components/main-footer";
=======
import { ThemeProvider } from "@/src/components/theme-provider";
>>>>>>> supabase

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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
