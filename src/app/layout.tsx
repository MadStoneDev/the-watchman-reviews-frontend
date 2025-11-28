import "./globals.css";

import React from "react";
import localFont from "next/font/local";

import { Toaster } from "sonner";
import { ThemeProvider } from "@/src/components/providers/theme-provider";

import mixpanel from "mixpanel-browser";

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
  // Create an instance of the Mixpanel object, your token is already added to this snippet
  mixpanel.init('6e7486bfdb45e97af1c275b9a0a6fd45', {
    autocapture: true,
    record_sessions_percent: 100,
  });

  
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} antialiased flex flex-col-reverse lg:flex-row min-h-dvh bg-neutral-900 text-neutral-50`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position={"bottom-right"}
            theme={"dark"}
            richColors
            closeButton
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
