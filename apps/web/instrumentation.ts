import * as Sentry from '@sentry/nextjs';
import { runtimeEnv } from "@/lib/env/runtime";

export async function register() {
  if (runtimeEnv.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (runtimeEnv.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
