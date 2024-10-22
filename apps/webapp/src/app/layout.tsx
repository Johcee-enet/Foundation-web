import { Plus_Jakarta_Sans as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

import type { Viewport } from "next";
import ConvexClientProvider from "@/app/ConvexClientProvider";
import { Toaster } from "@/components/ui/toaster";
import SessionProvider from "@/lib/sessionContext";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Foundation || A New Web3 Experience",
  description:
    "Foundation is designed to usher newcomers into the dynamic world of Web3. With an emphasis on web3 education, practical experience and Campaigns",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 0.7,
  maximumScale: 0.7,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "background min-h-screen font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ConvexClientProvider>
            <SessionProvider>{children}</SessionProvider>
          </ConvexClientProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
