"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/button";
import { signInWithGoogle } from "@/actions/auth";

function GoogleSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="secondary"
      size="lg"
      className="w-full"
      loading={pending}
      disabled={pending}
    >
      Continue with Google
    </Button>
  );
}

export function GoogleSignInButton() {
  return (
    <form action={signInWithGoogle}>
      <GoogleSubmitButton />
    </form>
  );
}
