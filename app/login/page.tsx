import {
  getGoogleOAuthRedirectUri,
  getGoogleOAuthConfig,
  isGoogleAuthEnabled,
} from "@/lib/env";
import { LoginPageClient } from "@/components/login-page-client";

export const dynamic = "force-dynamic";

export default function LoginPage() {
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
