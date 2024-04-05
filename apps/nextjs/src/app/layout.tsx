import "~/app/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@acme/ui/src/components/ui/toaster";

import ConvexClientProvider from "./ConvexClientProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Enet Admin",
  description: "The enet miner admin dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
