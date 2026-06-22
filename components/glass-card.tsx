"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  glow?: boolean;
  hover?: boolean;
}

export function GlassCard({
  children,
  className = "",
  glow = false,
  hover = true,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
      className={`
        relative overflow-hidden rounded-2xl
        border border-white/10
        bg-white/5 backdrop-blur-xl
        shadow-2xl shadow-black/20
        ${glow ? "before:absolute before:inset-0 before:bg-gradient-to-br before:from-pink-500/10 before:via-purple-500/5 before:to-blue-500/10 before:pointer-events-none" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
