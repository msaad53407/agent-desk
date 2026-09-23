"use client";

import { OrganizationList } from "@clerk/nextjs";
import { useClerkAppearance } from "@/lib/clerk-appearance";

export const OrgSelectionView = () => {
  const appearance = useClerkAppearance();

  return (
    <OrganizationList
      appearance={appearance}
      afterCreateOrganizationUrl="/"
      afterSelectOrganizationUrl="/"
      hidePersonal
      skipInvitationScreen
    />
  );
};
