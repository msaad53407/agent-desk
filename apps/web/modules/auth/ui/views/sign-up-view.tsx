"use client";

import { SignUp } from "@clerk/nextjs";
import { useClerkAppearance } from "@/lib/clerk-appearance";

export const SignUpView = () => {
  const appearance = useClerkAppearance();

  return ( 
    <SignUp
      appearance={appearance}
      path="/sign-up"
      routing="path"
      signInUrl="/sign-in"
    />
  );
};
