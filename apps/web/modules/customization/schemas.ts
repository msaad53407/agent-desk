import { z } from "zod";
import { WIDGET_ACCENT_COLOR_PATTERN } from "@workspace/ui/lib/widget-theme";

export const widgetSettingsSchema = z.object({
  greetMessage: z.string().min(1, "Greeting message is required"),
  accentColor: z.string().regex(
    WIDGET_ACCENT_COLOR_PATTERN,
    "Accent color must be a valid hex color",
  ),
  defaultSuggestions: z.object({
    suggestion1: z.string().optional(),
    suggestion2: z.string().optional(),
    suggestion3: z.string().optional(),
  }),
  vapiSettings: z.object({
    assistantId: z.string().optional(),
    phoneNumber: z.string().optional(),
  }),
});
