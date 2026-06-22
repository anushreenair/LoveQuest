import { isGoogleAuthReady } from "@/lib/google-oauth-health";
import { SignUpPageClient } from "@/components/signup-page-client";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  const googleEnabled = await isGoogleAuthReady();
  return <SignUpPageClient googleEnabled={googleEnabled} />;
}
