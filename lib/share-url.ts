/**
 * Base URL for share links and emails (production, preview, local).
 */
export function getAppBaseUrl(): string {
  if (process.env.AUTH_URL) {
    return process.env.AUTH_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export function buildShareUrl(shareToken: string): string {
  return `${getAppBaseUrl()}/share/${shareToken}`;
}
