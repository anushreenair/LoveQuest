"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useTransition } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { PageTransition } from "@/components/page-transition";
import { registerUser } from "@/actions/auth";
import { APP_NAME } from "@/lib/brand";
import {
  getProductionGoogleLoginUrl,
  shouldUseProductionGoogleOAuth,
} from "@/lib/google-sign-in";

interface SignUpPageClientProps {
  googleEnabled: boolean;
}

export function SignUpPageClient({ googleEnabled }: SignUpPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isGoogleRedirecting, setIsGoogleRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("password", password);
    formData.set("confirmPassword", confirmPassword);

    startTransition(async () => {
      const result = await registerUser(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/quest",
      });

      if (signInResult?.error) {
        router.push("/login?registered=true");
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
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
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
                Create your account
              </h1>
              <p className="mt-2 text-white/50">
                Save your email and password to use {APP_NAME}
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
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
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <Input
                label="Confirm password"
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />

              <p className="text-xs text-white/40">
                Password must be 8+ characters with a letter and a number.
              </p>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={isPending}
                disabled={isPending}
              >
                Create account
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
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-pink-400 hover:text-pink-300"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </GlassCard>
      </PageTransition>
    </main>
  );
}
