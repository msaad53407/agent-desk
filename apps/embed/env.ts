import { z } from "zod";

const envSchema = z.object({
  VITE_WIDGET_URL: z
    .string()
    .url("VITE_WIDGET_URL must be a valid URL")
    .default("http://localhost:3001"),
});

const parsedEnv = envSchema.safeParse({
  VITE_WIDGET_URL: import.meta.env.VITE_WIDGET_URL,
});

if (!parsedEnv.success) {
  const details = Object.entries(parsedEnv.error.flatten().fieldErrors)
    .map(([key, value]) => `- ${key}: ${value?.join(", ")}`)
    .join("\n");

  throw new Error(`Invalid embed environment variables:\n${details}`);
}

export const env = parsedEnv.data;

