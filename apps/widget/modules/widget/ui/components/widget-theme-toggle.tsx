"use client";

import { useEffect, useState } from "react";
import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { cn } from "@workspace/ui/lib/utils";

const THEME_OPTIONS = [
  {
    label: "System",
    value: "system",
    icon: MonitorIcon,
  },
  {
    label: "Light",
    value: "light",
    icon: SunIcon,
  },
  {
    label: "Dark",
    value: "dark",
    icon: MoonIcon,
  },
] as const;

export const WidgetThemeToggle = () => {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = mounted ? theme ?? "system" : "system";
  const resolvedIconTheme =
    mounted && resolvedTheme === "dark" ? "dark" : "light";
  const TriggerIcon = resolvedIconTheme === "dark" ? MoonIcon : SunIcon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Change theme"
          className="border border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15"
          size="icon"
          variant="transparent"
        >
          <TriggerIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {THEME_OPTIONS.map(({ icon: Icon, label, value }) => {
          const isActive = activeTheme === value;

          return (
            <DropdownMenuItem
              className="justify-between"
              key={value}
              onClick={() => setTheme(value)}
            >
              <span className="flex items-center gap-2">
                <Icon className="size-4" />
                {label}
              </span>
              <CheckIcon
                className={cn(
                  "size-4 text-primary transition-opacity",
                  isActive ? "opacity-100" : "opacity-0",
                )}
              />
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
