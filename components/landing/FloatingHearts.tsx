"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface Heart {
  id: number;
  left: string;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

/**
 * Ambient floating hearts — rendered once per page load with random positions.
 */
export function FloatingHearts({ count = 18 }: { count?: number }) {
  const hearts = useMemo<Heart[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 12 + Math.random() * 20,
      delay: Math.random() * 8,
      duration: 10 + Math.random() * 12,
      opacity: 0.15 + Math.random() * 0.35,
    }));
  }, [count]);

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {hearts.map((heart) => (
        <motion.span
          key={heart.id}
          className="absolute bottom-[-10%] text-pink-400/80"
          style={{
            left: heart.left,
            fontSize: heart.size,
            opacity: heart.opacity,
          }}
          initial={{ y: 0, rotate: 0 }}
          animate={{
            y: "-110vh",
            rotate: [0, 15, -10, 20, 0],
            x: [0, 20, -15, 10, 0],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          ♥
        </motion.span>
      ))}
    </div>
  );
}
