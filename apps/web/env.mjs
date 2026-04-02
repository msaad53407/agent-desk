import { z } from "zod";

const buildEnvSchema = z.object({
  CI: z.enum(["true", "false", "1", "0"]).optional().default("false"),
});

const parsedBuildEnv = buildEnvSchema.safeParse({
  CI: process.env.CI,
});

if (!parsedBuildEnv.success) {
  const details = Object.entries(parsedBuildEnv.error.flatten().fieldErrors)
    .map(([key, value]) => `- ${key}: ${value?.join(", ")}`)
    .join("\n");

  throw new Error(`Invalid web build environment variables:\n${details}`);
}

export const buildEnv = parsedBuildEnv.data;

