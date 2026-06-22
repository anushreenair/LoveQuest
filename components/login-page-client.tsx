"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense, useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { PageTransition } from "@/components/page-transition";

const AUTH_ERRORS: Record<string, string> = {
  CredentialsSignin: "Invalid email or password. Please try again.",
  OAuthSignin: "Could not start Google sign-in. Please try again.",
  OAuthCallback:
    "Google sign-in was interrupted. Please try again (don't use a private window).",
  OAuthAccountNotLinked:
    "This email is already registered with a password. Sign in with email instead.",
  AccessDenied:
    "Google blocked sign-in. If the app is in Testing mode, add your Gmail under OAuth consent screen → Test users.",
  Configuration:
    "Google sign-in failed. Clear cookies for this site and try again.",
  Default: "Sign-in failed. Please try again.",
};

interface LoginFormProps {
  googleEnabled: boolean;
  googleSetupPending?: boolean;
  googleRedirectUri?: string;
  googleClientId?: string;
  googleConsoleUrl?: string;
}

function LoginForm({
  googleEnabled,
  googleSetupPending,
  googleRedirectUri,
  googleClientId,
  googleConsoleUrl,
}: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isGoogleRedirecting, setIsGoogleRedirecting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [showGoogle, setShowGoogle] = useState(googleEnabled);
  const [setupPending, setSetupPending] = useState(!!googleSetupPending);

  useEffect(() => {
    fetch("/api/auth/oauth-health", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { ready?: boolean; clientId?: string }) => {
        const ready = !!data.ready;
        setShowGoogle(ready);
        setSetupPending(!ready && !!data.clientId);
      })
      .catch(() => {});
  }, []);

  const errorCode = searchParams.get("error");
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
              Sign in with your email and password
            </p>
          </div>

          {registered && (
            <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
              Account created! Sign in with your new password.
            </div>
          )}

          {setupPending && (
            <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              Google sign-in needs a one-time setup in Google Cloud.{" "}
              <Link href="/setup/google" className="font-medium underline">
                Fix it here (2 min)
              </Link>
              {" — or use email + password below."}
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
              {googleEnabled && googleRedirectUri && errorCode?.startsWith("OAuth") && (
                <div className="mt-3 space-y-2 text-xs text-red-200/90">
                  <p>
                    In{" "}
                    {googleConsoleUrl ? (
                      <a
                        href={googleConsoleUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        Google Cloud Console
                      </a>
                    ) : (
                      "Google Cloud Console"
                    )}
                    , add this <strong>exact</strong> redirect URI:
                  </p>
                  <p className="break-all rounded bg-black/30 p-2 font-mono text-[11px]">
                    {googleRedirectUri}
                  </p>
                  {googleClientId && (
                    <p className="break-all opacity-80">
                      OAuth client: {googleClientId}
                    </p>
                  )}
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

          {showGoogle && (
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
  googleSetupPending,
  googleRedirectUri,
  googleClientId,
  googleConsoleUrl,
}: LoginFormProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Suspense>
        <LoginForm
          googleEnabled={googleEnabled}
          googleSetupPending={googleSetupPending}
          googleRedirectUri={googleRedirectUri}
          googleClientId={googleClientId}
          googleConsoleUrl={googleConsoleUrl}
        />
      </Suspense>
    </main>
  );
}
