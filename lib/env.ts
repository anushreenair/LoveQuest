function cleanEnv(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim().replace(/^["']|["']$/g, "");
  return trimmed || undefined;
}

export function getGoogleOAuthConfig() {
  const PLACEHOLDER_PATTERNS = [
    "your-google-client-id",
    "your-client-id",
    "your-google-client-secret",
    "your-client-secret",
    "GOCSPX-your-client-secret",
    "generate-with-openssl",
  ];

  const clientId =
    cleanEnv(process.env.AUTH_GOOGLE_ID) ??
    cleanEnv(process.env.GOOGLE_CLIENT_ID) ??
    cleanEnv(process.env.GOOGLE_ID);

  const clientSecret =
    cleanEnv(process.env.AUTH_GOOGLE_SECRET) ??
    cleanEnv(process.env.GOOGLE_CLIENT_SECRET) ??
    cleanEnv(process.env.GOOGLE_SECRET);

  if (!clientId || !clientSecret) {
    return null;
  }

  const isPlaceholder = PLACEHOLDER_PATTERNS.some(
    (pattern) => clientId.includes(pattern) || clientSecret.includes(pattern)
  );

  if (isPlaceholder || !clientId.endsWith(".apps.googleusercontent.com")) {
    return null;
  }

  return { clientId, clientSecret };
}

export function isGoogleAuthEnabled() {
  return getGoogleOAuthConfig() !== null;
}

const PRODUCTION_HOST = "lovequest-omega.vercel.app";

/** Stable public URL — never use per-deployment VERCEL_URL for OAuth. */
export function getAuthBaseUrl() {
  const productionHost = cleanEnv(process.env.VERCEL_PROJECT_PRODUCTION_URL);

  if (process.env.VERCEL === "1") {
    const host = (productionHost ?? PRODUCTION_HOST).replace(/^https?:\/\//, "");
    return `https://${host.replace(/\/$/, "")}`;
  }

  return (
    cleanEnv(process.env.AUTH_URL) ??
    cleanEnv(process.env.NEXTAUTH_URL) ??
    cleanEnv(process.env.APP_PUBLIC_URL) ??
    cleanEnv(process.env.NEXT_PUBLIC_APP_URL) ??
    undefined
  );
}

export function getGoogleOAuthRedirectUri() {
  const base = getAuthBaseUrl() ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/api/auth/callback/google`;
}

/** Pin OAuth to the stable production domain on Vercel. */
export function ensureAuthUrl() {
  const base = getAuthBaseUrl();
  if (base) {
    process.env.AUTH_URL = base;
  }
}
