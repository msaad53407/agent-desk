"use client";

import { shadcn } from "@clerk/themes";
import { useTheme } from "next-themes";

export const useClerkAppearance = (): any => {
  const { resolvedTheme } = useTheme();

  return {
    baseTheme: resolvedTheme === "dark" ? shadcn : undefined,
    theme: resolvedTheme === "dark" ? shadcn : undefined,
    variables: {
      colorPrimary: "var(--primary)",
      colorBackground: "var(--background)",
      colorText: "var(--foreground)",
      colorTextSecondary: "var(--muted-foreground)",
      colorInputBackground: "var(--background)",
      colorInputText: "var(--foreground)",
      colorNeutral: "var(--muted)",
      colorDanger: "var(--destructive)",
      borderRadius: "0.95rem",
    },
    elements: {
      cardBox: "shadow-none!",
      card: "border bg-background shadow-sm rounded-[1.5rem]",
      headerTitle: "text-foreground tracking-tight",
      headerSubtitle: "text-muted-foreground",
      socialButtonsBlockButton:
        "border bg-background text-foreground shadow-none hover:bg-accent hover:text-accent-foreground",
      socialButtonsBlockButtonText: "text-inherit",
      dividerLine: "bg-border",
      dividerText: "text-muted-foreground",
      formFieldLabel: "text-foreground",
      formFieldInput:
        "border-input bg-background text-foreground shadow-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20",
      formButtonPrimary:
        "bg-primary text-primary-foreground shadow-none hover:bg-primary/90 focus-visible:ring-4 focus-visible:ring-primary/25",
      footerActionLink: "text-primary hover:text-primary/80",
      formFieldAction: "text-primary hover:text-primary/80",
      identityPreviewEditButton: "text-primary hover:text-primary/80",
      formResendCodeLink: "text-primary hover:text-primary/80",
      otpCodeFieldInput:
        "border-input bg-background text-foreground shadow-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20",
      organizationSwitcherPopoverCard:
        "border bg-background text-foreground shadow-xl rounded-[1.25rem]",
      organizationSwitcherPopoverActionButton:
        "text-foreground hover:bg-accent hover:text-accent-foreground rounded-xl",
      organizationSwitcherPopoverActionButtonIcon: "text-primary",
      organizationPreviewMainIdentifier: "text-foreground",
      organizationPreviewSecondaryIdentifier: "text-muted-foreground",
      userButtonPopoverCard:
        "border bg-background text-foreground shadow-xl rounded-[1.25rem]",
      userButtonPopoverActionButton:
        "text-foreground hover:bg-accent hover:text-accent-foreground rounded-xl",
      userButtonPopoverActionButtonIcon: "text-primary",
      userButtonPopoverFooter: "border-t bg-background",
      userPreviewMainIdentifier: "text-foreground",
      userPreviewSecondaryIdentifier: "text-muted-foreground",
      navbar: "border-r bg-background",
      navbarButton:
        "text-foreground hover:bg-accent hover:text-accent-foreground rounded-xl",
      pageScrollBox: "bg-background",
      profileSectionPrimaryButton:
        "bg-primary text-primary-foreground shadow-none hover:bg-primary/90",
      badge: "bg-primary/12 text-primary border border-primary/15",
      badge__primary: "bg-primary/12 text-primary border border-primary/15",
      modalContent: "border bg-background text-foreground shadow-xl rounded-[1.5rem]",
      organizationListCreateOrganizationActionButton:
        "border bg-background text-foreground shadow-none hover:bg-accent hover:text-accent-foreground rounded-xl",
      organizationListItem:
        "border bg-background text-foreground shadow-none hover:bg-accent/60 rounded-2xl",
      organizationListItemBox: "rounded-2xl",
      organizationListItemPreviewMainIdentifier: "text-foreground",
      organizationListItemPreviewSecondaryIdentifier: "text-muted-foreground",
    },
  } as const;
};
