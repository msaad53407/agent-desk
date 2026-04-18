import { z } from "zod";

const envSchema = z.object({
  CLERK_SECRET_KEY: z.string().min(1, "CLERK_SECRET_KEY is required"),
  CLERK_WEBHOOK_SECRET: z.string().min(1, "CLERK_WEBHOOK_SECRET is required"),
  CLERK_JWT_ISSUER_DOMAIN: z
    .string()
    .min(1, "CLERK_JWT_ISSUER_DOMAIN is required"),
  SECRETS_ENCRYPTION_KEY: z
    .string()
    .length(64, "SECRETS_ENCRYPTION_KEY must be a 64-character hex string (32 bytes)"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const details = Object.entries(parsedEnv.error.flatten().fieldErrors)
    .map(([key, value]) => `- ${key}: ${value?.join(", ")}`)
    .join("\n");

  throw new Error(`Invalid backend environment variables:\n${details}`);
}

export const env = parsedEnv.data;
