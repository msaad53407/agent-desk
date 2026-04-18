"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { CheckIcon, MonitorIcon, MoonIcon, PaintBucketIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";
import {
  getAccentThemeStyle,
  normalizeWidgetAccentColor,
  WIDGET_ACCENT_COLOR_PATTERN,
} from "@workspace/ui/lib/widget-theme";
import { webAppAccentColorAtom } from "@/modules/dashboard/atoms";

const themeOptions = [
  {
    description: "Bright surfaces and crisp contrast for daytime work.",
    icon: SunIcon,
    title: "Light",
    value: "light",
  },
  {
    description: "Dimmed panels with richer depth for focused sessions.",
    icon: MoonIcon,
    title: "Dark",
    value: "dark",
  },
  {
    description: "Follow your device preference automatically.",
    icon: MonitorIcon,
    title: "System",
    value: "system",
  },
] as const;

const accentOptions = [
  { color: "#3B82F6", name: "Blue" },
  { color: "#0F9D8A", name: "Teal" },
  { color: "#22C55E", name: "Green" },
  { color: "#F97316", name: "Orange" },
  { color: "#EF4444", name: "Red" },
  { color: "#E11D48", name: "Rose" },
  { color: "#8B5CF6", name: "Violet" },
  { color: "#111827", name: "Slate" },
] as const;

export const SettingsView = () => {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [accentColor, setAccentColor] = useAtom(webAppAccentColorAtom);
  const [customAccent, setCustomAccent] = useState(accentColor);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setCustomAccent(accentColor);
  }, [accentColor]);

  const selectedTheme = mounted ? theme ?? "system" : "system";
  const normalizedAccent = normalizeWidgetAccentColor(accentColor);
  const previewStyle = getAccentThemeStyle(normalizedAccent) as CSSProperties;
  const isCustomAccentValid = WIDGET_ACCENT_COLOR_PATTERN.test(customAccent);

  const applyCustomAccent = () => {
    setAccentColor(normalizeWidgetAccentColor(customAccent));
  };

  return (
    <div className="min-h-screen bg-muted/40 px-6 py-8 md:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="relative overflow-hidden rounded-[2rem] border bg-background px-8 py-10 shadow-sm">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_32%),radial-gradient(circle_at_85%_20%,hsl(var(--accent)/0.7),transparent_24%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                <PaintBucketIcon className="size-3.5 text-primary" />
                Dashboard Settings
              </div>
              <div className="space-y-3">
                <h1 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
                  Tune the dashboard look without leaving the workspace.
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                  Pick a theme mode and set a brand accent that flows through
                  navigation, actions, and interactive states across the web app.
                </p>
              </div>
            </div>

            <div
              className="dashboard-theme-scope rounded-[1.75rem] border bg-background p-4 shadow-lg shadow-primary/10"
              style={previewStyle}
            >
              <div className="rounded-[1.25rem] border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Live preview</p>
                    <p className="text-xs text-muted-foreground">
                      {resolvedTheme === "dark" ? "Dark mode" : "Light mode"} with{" "}
                      {normalizedAccent}
                    </p>
                  </div>
                  <div className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Active accent
                  </div>
                </div>
                <div className="mt-5 grid gap-3">
                  <div className="rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm">
                    Sidebar active state
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border bg-background px-4 py-3 text-sm">
                    <span>Hover and selection surfaces</span>
                    <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                      Accent
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-2xl bg-primary shadow-sm" />
                    <div className="flex-1 rounded-2xl border bg-background px-4 py-3">
                      <p className="text-sm font-medium">Buttons and highlights</p>
                      <p className="text-xs text-muted-foreground">
                        Updated instantly as you change the accent.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <section className="rounded-[1.75rem] border bg-background p-6 shadow-sm">
            <div className="space-y-2">
              <p className="text-sm font-medium text-primary">Theme selection</p>
              <h2 className="text-2xl font-semibold tracking-tight">
                Choose how the dashboard feels.
              </h2>
              <p className="text-sm text-muted-foreground">
                Theme mode updates immediately and still respects your selected
                accent.
              </p>
            </div>

            <div className="mt-6 grid gap-4">
              {themeOptions.map(({ description, icon: Icon, title, value }) => {
                const isActive = selectedTheme === value;

                return (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setTheme(value)}
                    className={cn(
                      "group flex items-start justify-between gap-4 rounded-2xl border p-4 text-left transition-all",
                      isActive
                        ? "border-primary bg-primary/8 shadow-sm"
                        : "border-border bg-card hover:border-primary/40 hover:bg-accent/40",
                    )}
                  >
                    <div className="flex gap-4">
                      <div
                        className={cn(
                          "flex size-11 items-center justify-center rounded-2xl border transition-colors",
                          isActive
                            ? "border-primary/20 bg-primary text-primary-foreground"
                            : "border-border bg-muted text-muted-foreground group-hover:border-primary/30 group-hover:text-primary",
                        )}
                      >
                        <Icon className="size-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{title}</p>
                        <p className="text-sm text-muted-foreground">
                          {description}
                        </p>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "mt-1 flex size-6 items-center justify-center rounded-full border",
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-transparent",
                      )}
                    >
                      <CheckIcon className="size-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[1.75rem] border bg-background p-6 shadow-sm">
            <div className="space-y-2">
              <p className="text-sm font-medium text-primary">Accent selection</p>
              <h2 className="text-2xl font-semibold tracking-tight">
                Set the signature color for the web app.
              </h2>
              <p className="text-sm text-muted-foreground">
                This updates navigation highlights, buttons, and accent surfaces
                across the dashboard.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {accentOptions.map(({ color, name }) => {
                const isActive = normalizedAccent === color;

                return (
                  <button
                    type="button"
                    key={color}
                    onClick={() => setAccentColor(color)}
                    className={cn(
                      "rounded-2xl border p-3 text-left transition-all",
                      isActive
                        ? "border-primary bg-primary/8 shadow-sm"
                        : "border-border bg-card hover:border-primary/30 hover:bg-accent/40",
                    )}
                  >
                    <div
                      className="mb-3 h-12 rounded-xl border shadow-inner"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{name}</p>
                        <p className="text-xs text-muted-foreground">{color}</p>
                      </div>
                      {isActive && (
                        <div className="rounded-full bg-primary p-1 text-primary-foreground">
                          <CheckIcon className="size-3" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border bg-card p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <Label htmlFor="web-accent-hex" className="text-sm font-medium">
                    Custom accent
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Use any six-digit hex color like <code>#0F9D8A</code>.
                  </p>
                </div>
                <Input
                  aria-label="Accent color picker"
                  className="h-11 w-16 cursor-pointer rounded-xl border p-1"
                  onChange={(event) => {
                    const next = normalizeWidgetAccentColor(event.target.value);
                    setCustomAccent(next);
                    setAccentColor(next);
                  }}
                  type="color"
                  value={normalizedAccent}
                />
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Input
                  id="web-accent-hex"
                  className="h-11 font-mono uppercase"
                  maxLength={7}
                  onChange={(event) => setCustomAccent(event.target.value.toUpperCase())}
                  placeholder="#3B82F6"
                  value={customAccent}
                />
                <Button
                  className="sm:min-w-28"
                  disabled={!isCustomAccentValid}
                  onClick={applyCustomAccent}
                  type="button"
                >
                  Apply
                </Button>
                <Button
                  onClick={() => setAccentColor(normalizeWidgetAccentColor())}
                  type="button"
                  variant="outline"
                >
                  Reset
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
