export { auth as middleware } from "@/auth";

/**
 * Only run auth middleware on protected routes.
 * Public pages (landing, API auth) are skipped for performance.
 */
export const config = {
  matcher: ["/onboarding/:path*"],
};
