"use client";

import { motion } from "framer-motion";

/**
 * Minimal top navbar with logo — keeps the landing page feeling polished.
 */
export function LandingNavbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative z-20 flex items-center justify-between px-6 py-6 sm:px-10"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-lg shadow-lg shadow-pink-500/25">
          ♥
        </span>
        <span className="font-display text-xl font-bold tracking-tight text-white">
          LoveQuest
        </span>
      </div>
    </motion.header>
  );
}
