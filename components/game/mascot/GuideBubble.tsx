"use client";

import { motion } from "framer-motion";
import { GUIDE_NAME } from "@/lib/lq/guide";

interface GuideBubbleProps {
  message: string;
  large?: boolean;
}

export function GuideBubble({ message, large = false }: GuideBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={[
        "relative rounded-3xl border border-white/20 bg-white/12 px-5 py-4 backdrop-blur-xl",
        "shadow-[0_8px_32px_rgba(236,72,153,0.2)]",
        large ? "max-w-md text-base sm:text-lg" : "max-w-sm text-sm",
      ].join(" ")}
    >
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-pink-300">
        {GUIDE_NAME}
      </p>
      <p className="leading-relaxed text-white">{message}</p>
      <div className="absolute -bottom-2 left-8 h-4 w-4 rotate-45 border-b border-r border-white/20 bg-white/12" />
    </motion.div>
  );
}
