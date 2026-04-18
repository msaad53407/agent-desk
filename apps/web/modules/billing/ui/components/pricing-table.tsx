"use client";

import { PricingTable as ClerkPricingTable } from "@clerk/nextjs";
import { useClerkAppearance } from "@/lib/clerk-appearance";

export const PricingTable = () => {
  const clerkAppearance = useClerkAppearance();

  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4">
      <ClerkPricingTable
        for="organization"
        appearance={{
          ...clerkAppearance,
          elements: {
            ...clerkAppearance.elements,
            pricingTable: "grid! w-full! grid-cols-1! gap-6! xl:grid-cols-2!",
            pricingTableCard:
              "shadow-none! border! rounded-[1.5rem]! overflow-hidden! bg-background/95! backdrop-blur! transition-all! duration-200! hover:-translate-y-1! hover:border-primary/30! hover:shadow-[0_18px_50px_-24px_hsl(var(--primary)/0.45)]!",
            pricingTableCardHeader:
              "bg-background! px-6! pt-6! pb-5! border-b! border-border!",
            pricingTableCardBody: "bg-background! px-6! py-6! border-0!",
            pricingTableCardFooter:
              "bg-background! px-6! py-5! border-t! border-border!",
            pricingTableCardTitle: "text-2xl! font-semibold! tracking-tight!",
            pricingTableCardDescription: "text-muted-foreground! text-sm!",
            pricingTableCardPrice: "text-4xl! font-semibold! tracking-tight! text-foreground!",
            pricingTableCardPriceSuffix: "text-muted-foreground! text-sm!",
            pricingTableCardPriceInterval: "text-muted-foreground! text-sm!",
            pricingTableCardButton:
              "rounded-xl! shadow-none! bg-primary! text-primary-foreground! hover:bg-primary/90! border-0! focus-visible:ring-4! focus-visible:ring-primary/25!",
            pricingTableCardBadge:
              "bg-primary/12! text-primary! border border-primary/15! rounded-full! px-2.5! py-1! shadow-none!",
            pricingTableFeatureList: "gap-3!",
            pricingTableFeatureListItem: "text-sm! text-foreground!",
            pricingTableFeatureListItemIcon: "text-primary!",
            pricingTableFeatureListItemText: "text-foreground!",
            pricingTablePeriodToggle: "rounded-2xl! border! bg-muted/60! p-1! shadow-none!",
            pricingTablePeriodToggleButton:
              "rounded-xl! text-muted-foreground! data-[state=active]:bg-background! data-[state=active]:text-foreground! data-[state=active]:shadow-sm!",
          },
        }}
      />
    </div>
  );
};
