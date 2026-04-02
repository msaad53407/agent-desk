import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_CONVEX_URL: z
    .string()
    .min(1, "NEXT_PUBLIC_CONVEX_URL is required"),
});

const parsedClientEnv = clientEnvSchema.safeParse({
  NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
});

if (!parsedClientEnv.success) {
  const details = Object.entries(parsedClientEnv.error.flatten().fieldErrors)
    .map(([key, value]) => `- ${key}: ${value?.join(", ")}`)
    .join("\n");

  throw new Error(`Invalid web client environment variables:\n${details}`);
}

export const clientEnv = parsedClientEnv.data;

