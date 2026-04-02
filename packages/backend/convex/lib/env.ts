import { z } from "zod";

const envSchema = z.object({
  CLERK_SECRET_KEY: z.string().min(1, "CLERK_SECRET_KEY is required"),
  CLERK_WEBHOOK_SECRET: z.string().min(1, "CLERK_WEBHOOK_SECRET is required"),
  CLERK_JWT_ISSUER_DOMAIN: z
    .string()
    .min(1, "CLERK_JWT_ISSUER_DOMAIN is required"),
  AWS_REGION: z.string().min(1, "AWS_REGION is required"),
  AWS_ACCESS_KEY_ID: z.string().min(1, "AWS_ACCESS_KEY_ID is required"),
  AWS_SECRET_ACCESS_KEY: z
    .string()
    .min(1, "AWS_SECRET_ACCESS_KEY is required"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const details = Object.entries(parsedEnv.error.flatten().fieldErrors)
    .map(([key, value]) => `- ${key}: ${value?.join(", ")}`)
    .join("\n");

  throw new Error(`Invalid backend environment variables:\n${details}`);
}

export const env = parsedEnv.data;

