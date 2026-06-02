import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
    googleAccessToken?: string;
    googleRefreshToken?: string;
    googleExpiresAt?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
  }
}
