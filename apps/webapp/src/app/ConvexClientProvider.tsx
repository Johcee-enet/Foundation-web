"use client";

import type { ReactNode } from "react";
import { env } from "@/env";
import { SessionProvider } from "@convex-dev/convex-lucia-auth/react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

import { AfterSSR } from "@acme/ui/src/components/helpers/AfterSSR";

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AfterSSR>
      <ConvexProvider client={convex}>
        <SessionProvider>{children}</SessionProvider>
      </ConvexProvider>
    </AfterSSR>
  );
}
