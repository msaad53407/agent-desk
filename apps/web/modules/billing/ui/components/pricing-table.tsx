"use client";

import { PricingTable as ClerkPricingTable } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";
import { useTheme } from "next-themes";

export const PricingTable = () => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      <ClerkPricingTable
        for="organization"
        appearance={{
          baseTheme: resolvedTheme === "dark" ? shadcn : undefined,
          theme: resolvedTheme === "dark" ? shadcn : undefined,
          elements: {
            pricingTableCard: "shadow-none! border! rounded-lg!",
            pricingTableCardHeader: "bg-background!",
            pricingTableCardBody: "bg-background!",
            pricingTableCardFooter: "bg-background!",
          },
        }}
      />
    </div>
  );
};
