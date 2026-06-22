import {
  getGoogleOAuthRedirectUri,
  getGoogleOAuthConfig,
  isGoogleAuthEnabled,
} from "@/lib/env";
import { signIn } from "@/lib/auth";
import { LoginPageClient } from "@/components/login-page-client";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<{ autoGoogle?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  if (params.autoGoogle === "1" && !params.error && isGoogleAuthEnabled()) {
    await signIn("google", { redirectTo: "/quest" });
  }

  const google = getGoogleOAuthConfig();

  return (
    <LoginPageClient
      googleEnabled={isGoogleAuthEnabled()}
      googleRedirectUri={getGoogleOAuthRedirectUri()}
      googleClientId={google?.clientId}
      googleConsoleUrl={
        google
          ? `https://console.cloud.google.com/apis/credentials/oauthclient/${google.clientId}?project=${google.clientId.split("-")[0]}`
          : undefined
      }
    />
  );
}
