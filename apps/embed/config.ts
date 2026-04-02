import { env } from "./env";

export const EMBED_CONFIG = {
  WIDGET_URL: env.VITE_WIDGET_URL,
  DEFAULT_ORG_ID: "org_31QtvqJKwhtvop04esLJMkmFouB",
  DEFAULT_POSITION: "bottom-right" as const,
};
