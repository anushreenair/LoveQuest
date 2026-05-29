import { type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

/**
 * Reusable glassmorphism card — frosted glass with a soft border.
 * Used across the landing page for features, stats, and content blocks.
 */
export function GlassCard({
  children,
  className = "",
  hover = false,
}: GlassCardProps) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/15 bg-white/8 p-6 backdrop-blur-xl",
        "shadow-[0_8px_32px_rgba(0,0,0,0.25)]",
        hover &&
          "transition-all duration-300 hover:border-pink-400/30 hover:bg-white/12 hover:shadow-[0_12px_40px_rgba(236,72,153,0.15)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
