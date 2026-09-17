"use client";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { AuthLayout } from "../layouts/auth-layout";
import { SignInView } from "../views/sign-in-view";
import { Loader2Icon } from "lucide-react";

export const AuthGuard = ({
  children,
  allowUnauthenticated = false,
}: {
  children: React.ReactNode;
  allowUnauthenticated?: boolean;
}) => {
  if (allowUnauthenticated) return <>{children}</>;
  return (
    <>
      <AuthLoading>
        <AuthLayout>
          <Loader2Icon size={32} />
        </AuthLayout>
      </AuthLoading>
      <Authenticated>{children}</Authenticated>
      <Unauthenticated>
        <AuthLayout>
          <SignInView />
        </AuthLayout>
      </Unauthenticated>
    </>
  );
};
