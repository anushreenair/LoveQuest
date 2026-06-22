"use client";

import { motion } from "framer-motion";

const HEARTS = [
  { emoji: "💕", x: "8%", y: "15%", size: "text-2xl", delay: 0, duration: 5 },
  { emoji: "💖", x: "88%", y: "22%", size: "text-3xl", delay: 0.8, duration: 6 },
  { emoji: "💗", x: "15%", y: "72%", size: "text-xl", delay: 1.4, duration: 4.5 },
  { emoji: "💕", x: "78%", y: "68%", size: "text-2xl", delay: 2, duration: 5.5 },
  { emoji: "❤️", x: "50%", y: "8%", size: "text-lg", delay: 0.5, duration: 4 },
  { emoji: "💕", x: "92%", y: "48%", size: "text-xl", delay: 1.2, duration: 5 },
  { emoji: "💖", x: "4%", y: "45%", size: "text-2xl", delay: 1.8, duration: 6 },
  { emoji: "💗", x: "62%", y: "82%", size: "text-3xl", delay: 0.3, duration: 5 },
] as const;

export function FloatingHearts() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {HEARTS.map((heart, i) => (
        <motion.span
          key={i}
          className={`absolute ${heart.size} select-none`}
          style={{ left: heart.x, top: heart.y }}
          animate={{
            y: [0, -28, 0],
            x: [0, i % 2 === 0 ? 12 : -12, 0],
            opacity: [0.15, 0.45, 0.15],
            rotate: [0, 8, -8, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {heart.emoji}
        </motion.span>
      ))}
    </div>
  );
}
