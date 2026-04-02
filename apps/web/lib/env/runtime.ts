import { z } from "zod";

const runtimeEnvSchema = z.object({
  NEXT_RUNTIME: z.enum(["nodejs", "edge"]).optional(),
});

const parsedRuntimeEnv = runtimeEnvSchema.safeParse({
  NEXT_RUNTIME: process.env.NEXT_RUNTIME,
});

if (!parsedRuntimeEnv.success) {
  const details = Object.entries(parsedRuntimeEnv.error.flatten().fieldErrors)
    .map(([key, value]) => `- ${key}: ${value?.join(", ")}`)
    .join("\n");

  throw new Error(`Invalid web runtime environment variables:\n${details}`);
}

export const runtimeEnv = parsedRuntimeEnv.data;

