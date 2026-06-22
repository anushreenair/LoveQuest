"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface ParticleFieldProps {
  count?: number;
  className?: string;
  active?: boolean;
}

export function ParticleField({
  count = 40,
  className = "",
  active = true,
}: ParticleFieldProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: ((i * 17 + 7) % 97) + 1,
        y: ((i * 23 + 11) % 93) + 1,
        size: 2 + (i % 4),
        delay: (i % 10) * 0.4,
        duration: 3 + (i % 5),
        color:
          i % 3 === 0
            ? "rgba(255, 107, 157, 0.8)"
            : i % 3 === 1
              ? "rgba(196, 77, 255, 0.7)"
              : "rgba(255, 215, 0, 0.6)",
      })),
    [count]
  );

  if (!active) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.9, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
