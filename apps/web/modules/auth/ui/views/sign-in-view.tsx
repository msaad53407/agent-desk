import { SignIn } from "@clerk/nextjs";
import { useClerkAppearance } from "@/lib/clerk-appearance";

export const SignInView = () => {
  const appearance = useClerkAppearance();

  return ( 
    <SignIn
      appearance={appearance}
      path="/sign-in"
      routing="path"
      signUpUrl="/sign-up"
    />
  );
};
 
