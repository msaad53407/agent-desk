"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { useAtomValue } from "jotai";
import { useTheme } from "next-themes";
import {
  getAccentThemeStyle,
  normalizeWidgetAccentColor,
} from "@workspace/ui/lib/widget-theme";
import { webAppAccentColorAtom } from "@/modules/dashboard/atoms";

const getResolvedThemeStyle = (
  accentColor: string,
  resolvedTheme?: string,
): CSSProperties => {
  const baseStyle = getAccentThemeStyle(accentColor) as Record<string, string>;

  if (resolvedTheme !== "dark") {
    return baseStyle as CSSProperties;
  }

  return {
    ...baseStyle,
    "--accent": baseStyle["--widget-accent-dark"],
    "--accent-foreground": baseStyle["--widget-accent-dark-foreground"],
    "--sidebar-accent": baseStyle["--widget-accent-dark"],
    "--sidebar-accent-foreground": baseStyle["--widget-accent-dark-foreground"],
  } as CSSProperties;
};

export const WebAppThemeSync = ({ children }: { children: ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const accentColor = useAtomValue(webAppAccentColorAtom);

  const themeStyle = useMemo(() => {
    return getResolvedThemeStyle(
      normalizeWidgetAccentColor(accentColor),
      resolvedTheme,
    );
  }, [accentColor, resolvedTheme]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const entries = Object.entries(themeStyle) as Array<[string, string]>;

    entries.forEach(([property, value]) => {
      root.style.setProperty(property, value);
      body.style.setProperty(property, value);
    });

    return () => {
      entries.forEach(([property]) => {
        root.style.removeProperty(property);
        body.style.removeProperty(property);
      });
    };
  }, [themeStyle]);

  return <>{children}</>;
};
