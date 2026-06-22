"use client";

import { motion } from "framer-motion";
import { APP_NAME } from "@/lib/brand";
import { ParticleField } from "./particle-field";

interface MagicBurstProps {
  active: boolean;
}

export function MagicBurst({ active }: MagicBurstProps) {
  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center overflow-hidden">
      {/* Core flash */}
      <motion.div
        className="absolute h-4 w-4 rounded-full bg-white"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 3, 80], opacity: [1, 0.9, 0] }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          boxShadow:
            "0 0 60px 30px rgba(255,255,255,0.9), 0 0 120px 60px rgba(255,107,157,0.6)",
        }}
      />

      {/* Expanding rings — Netflix-style */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2"
          style={{
            borderColor:
              i % 2 === 0
                ? "rgba(255, 107, 157, 0.6)"
                : "rgba(196, 77, 255, 0.5)",
          }}
          initial={{ width: 0, height: 0, opacity: 0.9 }}
          animate={{
            width: ["0vmin", `${120 + i * 30}vmin`],
            height: ["0vmin", `${120 + i * 30}vmin`],
            opacity: [0.9, 0.4, 0],
          }}
          transition={{
            duration: 1.2,
            delay: i * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}

      {/* Radial gradient wash */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1] }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,107,157,0.95) 0%, rgba(196,77,255,0.85) 35%, rgba(107,140,255,0.7) 60%, rgba(10,10,15,0.95) 100%)",
        }}
      />

      {/* Spark burst particles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute inset-0"
      >
        <ParticleField count={60} active />
      </motion.div>

      {/* Brand reveal */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 1, 1], scale: [0.5, 1.1, 1] }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="text-5xl sm:text-6xl">💕</span>
        <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
          {APP_NAME}
        </h2>
      </motion.div>
    </div>
  );
}
