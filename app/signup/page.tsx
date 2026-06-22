import { isGoogleAuthEnabled } from "@/lib/env";
import { SignUpPageClient } from "@/components/signup-page-client";

export const dynamic = "force-dynamic";

export default function SignUpPage() {
  return <SignUpPageClient googleEnabled={isGoogleAuthEnabled()} />;
}
