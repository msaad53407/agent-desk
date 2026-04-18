"use client";

import {
  BadgeCheckIcon,
  PhoneCallIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";
import { PricingTable } from "../components/pricing-table";

const inclusions = [
  "Unlimited branded conversations",
  "Knowledge base powered responses",
  "Voice assistant and phone workflows",
  "Team-ready admin dashboard",
];

export const BillingView = () => {
  return (
    <div className="min-h-screen bg-muted/40 px-6 py-8 md:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="relative overflow-hidden rounded-[2rem] border bg-background px-8 py-10 shadow-sm">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_30%),radial-gradient(circle_at_85%_15%,hsl(var(--accent)/0.75),transparent_22%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/85 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                <SparklesIcon className="size-3.5 text-primary" />
                Plans & Billing
              </div>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
                  Pick the plan that matches your customer support motion.
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                  Start free, upgrade when you need voice, richer customization,
                  and production-ready workflows across your customer support stack.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {inclusions.map((item) => (
                  <div
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-2 text-sm text-foreground"
                  >
                    <BadgeCheckIcon className="size-4 text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[1.5rem] border bg-card/95 p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <ShieldCheckIcon className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium">Predictable pricing</p>
                    <p className="text-sm text-muted-foreground">
                      Clear monthly billing for organizations.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.5rem] border bg-card/95 p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                    <PhoneCallIcon className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium">Upgrade path built in</p>
                    <p className="text-sm text-muted-foreground">
                      Move into voice and premium workflows when ready.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border bg-background p-4 shadow-sm md:p-6">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-5 space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                Compare plans
              </h2>
              <p className="text-sm text-muted-foreground">
                Billing controls and upgrade actions are powered directly by Clerk.
              </p>
            </div>

            <PricingTable />
          </div>
        </section>
      </div>
    </div>
  );
};
