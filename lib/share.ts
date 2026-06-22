import { headers } from "next/headers";
import os from "os";
import { buildShareUrl } from "@/lib/share-links";
import { getAuthBaseUrl } from "@/lib/env";

export { buildShareUrl, buildMailtoLink, buildWhatsAppLink } from "@/lib/share-links";

function getLanIp() {
  const nets = os.networkInterfaces();

  for (const name of Object.keys(nets)) {
    for (const net of nets[name] ?? []) {
      if (
        net.family === "IPv4" &&
        !net.internal &&
        (net.address.startsWith("192.168.") ||
          net.address.startsWith("10.") ||
          net.address.startsWith("172."))
      ) {
        return net.address;
      }
    }
  }

  return null;
}

export async function getAppBaseUrl() {
  const vercelBase = getAuthBaseUrl();
  if (vercelBase) {
    return vercelBase.replace(/\/$/, "");
  }

  const publicUrl =
    process.env.APP_PUBLIC_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (publicUrl) {
    return publicUrl.replace(/\/$/, "");
  }

  if (process.env.AUTH_URL) {
    return process.env.AUTH_URL.replace(/\/$/, "");
  }

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");

  if (!host) {
    const lan = getLanIp();
    return lan ? `http://${lan}:3000` : "http://localhost:3000";
  }

  if (host.startsWith("localhost") || host.startsWith("127.0.0.1")) {
    const lan = getLanIp();
    if (lan) {
      return `http://${lan}:3000`;
    }
  }

  const protocol =
    headerList.get("x-forwarded-proto") ??
    (host.includes("localhost") || host.startsWith("127.") ? "http" : "https");

  return `${protocol}://${host}`;
}
