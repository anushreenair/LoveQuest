import { PRODUCTION_HOST } from "@/lib/env";

export const PRODUCTION_APP_URL = `https://${PRODUCTION_HOST}`;

function isLanHostname(hostname: string): boolean {
  return (
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
  );
}

/** Local/preview hosts must use production OAuth — Google only has the live callback URI. */
export function shouldUseProductionGoogleOAuth(hostname: string): boolean {
  if (hostname === PRODUCTION_HOST) return false;
  if (hostname === "localhost" || hostname === "127.0.0.1") return true;
  if (hostname.endsWith(".vercel.app") && hostname !== PRODUCTION_HOST) return true;
  return isLanHostname(hostname);
}

export function getProductionGoogleLoginUrl(): string {
  return `${PRODUCTION_APP_URL}/login?autoGoogle=1`;
}
