"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense, useState, useTransition, useEffect, useRef } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { PageTransition } from "@/components/page-transition";
import {
  getProductionGoogleLoginUrl,
  shouldUseProductionGoogleOAuth,
} from "@/lib/google-sign-in";

const AUTH_ERRORS: Record<string, string> = {
  CredentialsSignin: "Invalid email or password. Please try again.",
  OAuthSignin: "Could not start Google sign-in. Please try again.",
  OAuthCallback: "Google sign-in was interrupted. Please try again.",
  OAuthAccountNotLinked:
    "This email is already registered with a password. Sign in with email instead.",
  AccessDenied:
    "Google blocked sign-in. Add your Gmail as a test user in Google OAuth consent screen, or use email + password.",
  Configuration: "Google sign-in failed. Please try again.",
  Default: "Sign-in failed. Please try again.",
};

interface LoginFormProps {
  googleEnabled: boolean;
  googleRedirectUri?: string;
  googleClientId?: string;
  googleConsoleUrl?: string;
}

function LoginForm({
  googleEnabled,
  googleRedirectUri,
  googleClientId,
  googleConsoleUrl,
}: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isGoogleRedirecting, setIsGoogleRedirecting] = useState(false);
  const autoGoogleStarted = useRef(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const errorCode = searchParams.get("error");
  const autoGoogle = searchParams.get("autoGoogle") === "1";

  useEffect(() => {
    if (!autoGoogle || !googleEnabled || autoGoogleStarted.current) return;
    autoGoogleStarted.current = true;
    setIsGoogleRedirecting(true);
    signIn("google", { callbackUrl: "/quest" });
  }, [autoGoogle, googleEnabled]);
  const urlError = errorCode
    ? AUTH_ERRORS[errorCode] ?? AUTH_ERRORS.Default
    : null;
  const registered = searchParams.get("registered") === "true";

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/quest",
      });

      if (result?.error) {
        setFormError(AUTH_ERRORS.CredentialsSignin);
        return;
      }

      router.push("/quest");
      router.refresh();
    });
  };

  const handleGoogleSignIn = () => {
    if (shouldUseProductionGoogleOAuth(window.location.hostname)) {
      window.location.href = getProductionGoogleLoginUrl();
      return;
    }
    setIsGoogleRedirecting(true);
    signIn("google", { callbackUrl: "/quest" });
  };

  return (
    <PageTransition className="w-full max-w-md">
      <GlassCard glow className="p-8 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block">
              <span className="text-4xl">💕</span>
            </Link>
            <h1 className="mt-4 text-2xl font-bold text-white">
              Welcome back
            </h1>
            <p className="mt-2 text-white/50">
              Sign in with Google or your email
            </p>
          </div>

          {registered && (
            <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
              Account created! Sign in with your new password.
            </div>
          )}

          {(urlError || formError) && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <p>{formError ?? urlError}</p>
              {errorCode === "AccessDenied" && (
                <div className="mt-3 space-y-2 text-xs text-red-200/90">
                  <p>
                    In{" "}
                    <a
                      href="https://console.cloud.google.com/auth/audience?project=791568444572"
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      Google OAuth consent screen
                    </a>
                    , add your Gmail under <strong>Test users</strong> if the app is in
                    Testing mode.
                  </p>
                  <p>
                    Or use{" "}
                    <Link href="/signup" className="underline">
                      email + password
                    </Link>{" "}
                    instead.
                  </p>
                </div>
              )}
              {googleEnabled &&
                googleRedirectUri &&
                (errorCode?.startsWith("OAuth") || errorCode === "Configuration") && (
                <div className="mt-3 space-y-2 text-xs text-red-200/90">
                  <p>
                    <Link href="/setup/google" className="underline">
                      Google setup guide
                    </Link>
                    {" · "}
                    {googleConsoleUrl ? (
                      <a
                        href={googleConsoleUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        Open Console
                      </a>
                    ) : (
                      "Google Cloud Console"
                    )}
                  </p>
                  <p className="break-all rounded bg-black/30 p-2 font-mono text-[11px]">
                    {googleRedirectUri}
                  </p>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={isPending}
              disabled={isPending}
            >
              Sign in
            </Button>
          </form>

          {googleEnabled && (
            <>
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-white/40">or</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              {isGoogleRedirecting ? (
                <div className="flex flex-col items-center gap-3 py-4 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="h-8 w-8 rounded-full border-2 border-pink-500/30 border-t-pink-500"
                  />
                  <p className="text-sm text-white/50">Redirecting to Google…</p>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                >
                  Continue with Google
                </Button>
              )}
            </>
          )}

          <p className="mt-6 text-center text-sm text-white/50">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-pink-400 hover:text-pink-300"
            >
              Create one
            </Link>
          </p>
        </motion.div>
      </GlassCard>
    </PageTransition>
  );
}

export function LoginPageClient({
  googleEnabled,
  googleRedirectUri,
  googleClientId,
  googleConsoleUrl,
}: LoginFormProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Suspense>
        <LoginForm
          googleEnabled={googleEnabled}
          googleRedirectUri={googleRedirectUri}
          googleClientId={googleClientId}
          googleConsoleUrl={googleConsoleUrl}
        />
      </Suspense>
    </main>
  );
}
