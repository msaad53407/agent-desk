"use client"

import * as React from "react"
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Provider } from "jotai";
import { ThemeProvider } from "@workspace/ui/components/theme-provider";
import { clientEnv } from "@/lib/env/client";

const convex = new ConvexReactClient(clientEnv.NEXT_PUBLIC_CONVEX_URL);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <ConvexProvider client={convex}>
        <Provider>{children}</Provider>
      </ConvexProvider>
    </ThemeProvider>
  );
};
