import { getGoogleOAuthConfig, getGoogleOAuthRedirectUri } from "@/lib/env";

export async function GET() {
  const google = getGoogleOAuthConfig();

  if (!google) {
    return Response.json({ enabled: false });
  }

  return Response.json({
    enabled: true,
    clientId: google.clientId,
    redirectUri: getGoogleOAuthRedirectUri(),
    consoleUrl: `https://console.cloud.google.com/apis/credentials/oauthclient/${google.clientId}?project=${google.clientId.split("-")[0]}`,
  });
}
