import "./globals.css";

import React from "react";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";

import { Toaster } from "sonner";
import { ThemeProvider } from "@/src/components/providers/theme-provider";
import { AnalyticsProvider } from "@/src/components/providers/analytics-provider";

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
      <GoogleAnalytics gaId={"G-CTMZTR1EL5"} />
      <body
        className={`${montserrat.variable} antialiased flex flex-col-reverse lg:flex-row min-h-dvh bg-neutral-900 text-neutral-50`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AnalyticsProvider>
            {children}
            <Toaster
              position={"bottom-right"}
              theme={"dark"}
              richColors
              closeButton
            />
          </AnalyticsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
