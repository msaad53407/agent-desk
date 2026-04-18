import { atomWithStorage } from "jotai/utils";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { normalizeWidgetAccentColor } from "@workspace/ui/lib/widget-theme";
import { STATUS_FILTER_KEY, WEB_APP_ACCENT_COLOR_KEY } from "./constants";

export const statusFilterAtom = atomWithStorage<
  Doc<"conversations">["status"] | "all"
>(STATUS_FILTER_KEY, "all");

export const webAppAccentColorAtom = atomWithStorage(
  WEB_APP_ACCENT_COLOR_KEY,
  normalizeWidgetAccentColor(),
);
