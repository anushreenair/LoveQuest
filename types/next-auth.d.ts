import { type DefaultSession } from "next-auth";

/**
 * Extend NextAuth types so TypeScript knows about custom session fields.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
  }
}
