"use client"

import * as React from "react"
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ClerkProvider, useAuth } from '@clerk/nextjs'
import { Provider } from "jotai";
import { clientEnv } from "@/lib/env/client";
import { ThemeProvider } from "@workspace/ui/components/theme-provider";
import { WebAppThemeSync } from "@/components/web-app-theme-sync";
import { useClerkAppearance } from "@/lib/clerk-appearance";

const convex = new ConvexReactClient(clientEnv.NEXT_PUBLIC_CONVEX_URL);

const ProvidersContent = ({ children }: { children: React.ReactNode }) => {
  const clerkAppearance = useClerkAppearance();

  return (
    <ClerkProvider
      appearance={clerkAppearance}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <WebAppThemeSync>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          {children}
        </ConvexProviderWithClerk>
      </WebAppThemeSync>
    </ClerkProvider>
  );
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Provider>
        <ProvidersContent>{children}</ProvidersContent>
      </Provider>
    </ThemeProvider>
  );
};
