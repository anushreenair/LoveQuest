import { isGoogleRedirectUriRegistered } from "@/lib/google-oauth-health";
import { getGoogleOAuthRedirectUri, getGoogleOAuthConfig } from "@/lib/env";

export async function GET() {
  const google = getGoogleOAuthConfig();
  if (!google) {
    return Response.json({ ready: false, reason: "no_credentials" });
  }

  const ready = await isGoogleRedirectUriRegistered();

  return Response.json({
    ready,
    redirectUri: getGoogleOAuthRedirectUri(),
    clientId: google.clientId,
    consoleUrl: `https://console.cloud.google.com/apis/credentials/oauthclient/${google.clientId}?project=${google.clientId.split("-")[0]}`,
  });
}
