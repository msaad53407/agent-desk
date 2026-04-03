"use client"

import * as React from "react"
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { useAuth } from '@clerk/nextjs'
import { clientEnv } from "@/lib/env/client";
import { ThemeProvider } from "@workspace/ui/components/theme-provider";

const convex = new ConvexReactClient(clientEnv.NEXT_PUBLIC_CONVEX_URL);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ThemeProvider>
  );
};
