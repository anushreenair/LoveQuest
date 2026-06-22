import { encode, decode } from "@auth/core/jwt";
import {
  ensureAuthUrl,
  getGoogleOAuthConfig,
  getGoogleOAuthRedirectUri,
  getOAuthBaseUrl,
} from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  ensureAuthUrl();
  const secret = process.env.AUTH_SECRET;
  const google = getGoogleOAuthConfig();

  let jwtRoundtrip = false;
  if (secret) {
    try {
      const token = await encode({
        token: { ok: true },
        secret,
        salt: "lovequest-diag",
      });
      const parsed = await decode({ token, secret, salt: "lovequest-diag" });
      jwtRoundtrip = parsed?.ok === true;
    } catch {
      jwtRoundtrip = false;
    }
  }

  let googleSecretStatus: "missing" | "invalid_client" | "ok" | "unknown" =
    "missing";
  if (google) {
    try {
      const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code: "invalid-test-code",
          client_id: google.clientId,
          client_secret: google.clientSecret,
          redirect_uri: getGoogleOAuthRedirectUri(),
          grant_type: "authorization_code",
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (data.error === "invalid_client") googleSecretStatus = "invalid_client";
      else if (data.error === "invalid_grant") googleSecretStatus = "ok";
      else googleSecretStatus = "unknown";
    } catch {
      googleSecretStatus = "unknown";
    }
  }

  return Response.json({
    oauthBaseUrl: getOAuthBaseUrl(),
    authUrl: process.env.AUTH_URL,
    authSecretConfigured: Boolean(secret),
    authSecretLength: secret?.length ?? 0,
    jwtRoundtrip,
    googleClientConfigured: Boolean(google),
    googleSecretStatus,
    redirectUri: getGoogleOAuthRedirectUri(),
    ready: Boolean(
      secret &&
        jwtRoundtrip &&
        google &&
        googleSecretStatus === "ok"
    ),
  });
}
