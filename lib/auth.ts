import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { getGoogleOAuthConfig, ensureAuthUrl } from "@/lib/env";
import { verifyPassword } from "@/lib/password";
import { upsertOAuthUser } from "@/lib/auth-users";
import { signInSchema } from "@/lib/validations";
import type { Provider } from "next-auth/providers";

ensureAuthUrl();

const googleConfig = getGoogleOAuthConfig();

const providers: Provider[] = [
  Credentials({
    id: "credentials",
    name: "Email and Password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const parsed = signInSchema.safeParse(credentials);
      if (!parsed.success) return null;

      const email = parsed.data.email.toLowerCase().trim();
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user?.passwordHash) return null;

      const valid = await verifyPassword(
        parsed.data.password,
        user.passwordHash
      );

      if (!valid) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      };
    },
  }),
];

if (googleConfig) {
  providers.push(
    Google({
      clientId: googleConfig.clientId,
      clientSecret: googleConfig.clientSecret,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "online",
        },
      },
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        try {
          const googleProfile = profile as {
            email: string;
            name?: string | null;
            picture?: string | null;
          };
          await upsertOAuthUser({
            email: googleProfile.email,
            name: googleProfile.name,
            image: googleProfile.picture,
          });
        } catch (error) {
          // Google already approved the user — don't show "blocked" for a DB hiccup
          console.error("Google sign-in user sync failed:", error);
        }
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: profile.email.toLowerCase().trim() },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.email = dbUser.email;
          token.name = dbUser.name;
          token.picture = dbUser.image;
        }
      } else if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
});
