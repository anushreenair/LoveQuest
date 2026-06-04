import type { Session } from "next-auth";
import type { GoogleMailTokens } from "@/lib/email/gmail-oauth";

export function getGoogleMailTokensFromSession(
  session: Session | null,
): GoogleMailTokens | undefined {
  if (!session?.googleRefreshToken) return undefined;

  return {
    refreshToken: session.googleRefreshToken,
    accessToken: session.googleAccessToken,
    expiresAt: session.googleExpiresAt,
  };
}
