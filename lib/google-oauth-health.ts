import {
  getGoogleOAuthConfig,
  getGoogleOAuthRedirectUri,
} from "@/lib/env";

let cached: { ok: boolean; checkedAt: number } | null = null;
const CACHE_MS = 60 * 1000;

export async function isGoogleRedirectUriRegistered() {
  const google = getGoogleOAuthConfig();
  if (!google) return false;

  if (cached && Date.now() - cached.checkedAt < CACHE_MS) {
    return cached.ok;
  }

  const redirectUri = getGoogleOAuthRedirectUri();
  const params = new URLSearchParams({
    client_id: google.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
  });

  try {
    const res = await fetch(
      `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
      { redirect: "follow", cache: "no-store" }
    );
    const html = await res.text();
    const ok = !html.includes("redirect_uri_mismatch");
    cached = { ok, checkedAt: Date.now() };
    return ok;
  } catch {
    return false;
  }
}

export async function isGoogleAuthReady() {
  if (!getGoogleOAuthConfig()) return false;
  return isGoogleRedirectUriRegistered();
}
