"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { APP_NAME } from "@/lib/brand";

export default function AuthCallbackLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <GlassCard glow className="p-10 text-center max-w-sm">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mx-auto mb-6 h-12 w-12 rounded-full border-2 border-pink-500/30 border-t-pink-500"
        />
        <h1 className="text-xl font-semibold text-white mb-2">
          Signing you in…
        </h1>
        <p className="text-sm text-white/50">
          Setting up your {APP_NAME} account. This should only take a moment.
        </p>
      </GlassCard>
    </main>
  );
}
