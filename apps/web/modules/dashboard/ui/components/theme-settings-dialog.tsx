"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { SidebarMenuButton } from "@workspace/ui/components/sidebar";
import { Label } from "@workspace/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group";

export function ThemeSettingsDialog() {
  const { theme, setTheme } = useTheme();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuButton tooltip="Settings">
          <Settings className="size-4" />
          <span>Settings</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Theme Settings</DialogTitle>
          <DialogDescription>
            Customize your dashboard's appearance.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <RadioGroup
            value={theme}
            onValueChange={setTheme}
            className="grid gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="theme-light" />
              <Label htmlFor="theme-light" className="flex items-center gap-2 cursor-pointer">
                <Sun className="size-4" />
                <span>Light</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="theme-dark" />
              <Label htmlFor="theme-dark" className="flex items-center gap-2 cursor-pointer">
                <Moon className="size-4" />
                <span>Dark</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="theme-system" />
              <Label htmlFor="theme-system" className="flex items-center gap-2 cursor-pointer">
                <Monitor className="size-4" />
                <span>System</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
}
