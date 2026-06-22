import {
  getGoogleOAuthRedirectUri,
  getGoogleOAuthConfig,
} from "@/lib/env";
import { isGoogleAuthReady } from "@/lib/google-oauth-health";
import { LoginPageClient } from "@/components/login-page-client";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const google = getGoogleOAuthConfig();
  const googleReady = await isGoogleAuthReady();

  return (
    <LoginPageClient
      googleEnabled={googleReady}
      googleSetupPending={!!google && !googleReady}
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
