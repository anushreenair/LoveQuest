import { handlers } from "@/auth";

/**
 * NextAuth.js API route — handles all auth endpoints:
 *   GET/POST /api/auth/signin/google
 *   GET/POST /api/auth/callback/google
 *   GET/POST /api/auth/signout
 *   GET      /api/auth/session
 */
export const { GET, POST } = handlers;
