import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const GMAIL_SEND_SCOPE = "https://www.googleapis.com/auth/gmail.send";

/**
 * Central NextAuth.js configuration.
 * Exports helpers used across server components, API routes, and middleware.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: `openid email profile ${GMAIL_SEND_SCOPE}`,
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],

  pages: {
    signIn: "/",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60,
  },

  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected =
        nextUrl.pathname.startsWith("/onboarding") ||
        nextUrl.pathname.startsWith("/game");

      if (isProtected) {
        return isLoggedIn;
      }

      return true;
    },

    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (new URL(url).origin === baseUrl) {
        return url;
      }

      return `${baseUrl}/onboarding`;
    },

    jwt({ token, account, user }) {
      if (account) {
        token.access_token = account.access_token;
        if (account.refresh_token) {
          token.refresh_token = account.refresh_token;
        }
        token.expires_at = account.expires_at;
      }

      if (user?.id) {
        token.sub = user.id;
      }

      return token;
    },

    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      session.googleAccessToken =
        typeof token.access_token === "string" ? token.access_token : undefined;
      session.googleRefreshToken =
        typeof token.refresh_token === "string"
          ? token.refresh_token
          : undefined;
      session.googleExpiresAt =
        typeof token.expires_at === "number" ? token.expires_at : undefined;

      return session;
    },
  },

  trustHost: true,
});
