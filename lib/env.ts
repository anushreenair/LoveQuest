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

export const PRODUCTION_HOST = "lovequest-omega.vercel.app";
const LOCAL_OAUTH_ORIGIN = "http://localhost:3000";

function isPrivateLanHost(host: string): boolean {
  return (
    host.startsWith("192.168.") ||
    host.startsWith("10.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  );
}

/** OAuth callback origin — Google only allows localhost in dev, never LAN IPs. */
export function getOAuthBaseUrl(): string {
  if (process.env.VERCEL === "1") {
    const host = (
      cleanEnv(process.env.VERCEL_PROJECT_PRODUCTION_URL) ?? PRODUCTION_HOST
    ).replace(/^https?:\/\//, "");
    return `https://${host.replace(/\/$/, "")}`;
  }

  const fromEnv =
    cleanEnv(process.env.AUTH_URL) ??
    cleanEnv(process.env.NEXTAUTH_URL) ??
    cleanEnv(process.env.APP_PUBLIC_URL);

  if (fromEnv) {
    try {
      const { hostname, port, protocol } = new URL(fromEnv);
      if (!isPrivateLanHost(hostname) && hostname !== "0.0.0.0") {
        return fromEnv.replace(/\/$/, "");
      }
    } catch {
      // fall through to localhost
    }
  }

  return LOCAL_OAUTH_ORIGIN;
}

/** Stable public URL for OAuth — never use per-deployment VERCEL_URL or LAN IPs. */
export function getAuthBaseUrl() {
  return getOAuthBaseUrl();
}

export function getGoogleOAuthRedirectUri() {
  return `${getOAuthBaseUrl().replace(/\/$/, "")}/api/auth/callback/google`;
}

/** Pin OAuth to localhost in dev and stable production domain on Vercel. */
export function ensureAuthUrl() {
  const base = getOAuthBaseUrl();
  process.env.AUTH_URL = base;
  process.env.NEXTAUTH_URL = base;
}

export function isPrivateLanAccess(hostname: string): boolean {
  return isPrivateLanHost(hostname);
}
