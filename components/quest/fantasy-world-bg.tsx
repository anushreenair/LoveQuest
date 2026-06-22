"use client";

import { motion } from "framer-motion";
import { ParticleField } from "./particle-field";

interface FantasyWorldBgProps {
  visible?: boolean;
  fullScreen?: boolean;
}

export function FantasyWorldBg({
  visible = true,
  fullScreen = false,
}: FantasyWorldBgProps) {
  if (!visible) return null;

  return (
    <div
      className={`pointer-events-none overflow-hidden ${
        fullScreen ? "fixed inset-0 z-0" : "absolute inset-0 z-0"
      }`}
    >
      {/* Aurora sky */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background:
            "linear-gradient(180deg, #0a0520 0%, #1a0a3e 25%, #2d1b69 45%, #4a1942 65%, #1a0a2e 100%)",
        }}
      />

      <motion.div
        className="absolute inset-0 opacity-40"
        animate={{
          background: [
            "radial-gradient(ellipse at 20% 20%, rgba(255,107,157,0.3) 0%, transparent 50%)",
            "radial-gradient(ellipse at 80% 30%, rgba(196,77,255,0.35) 0%, transparent 50%)",
            "radial-gradient(ellipse at 50% 10%, rgba(107,140,255,0.3) 0%, transparent 50%)",
            "radial-gradient(ellipse at 20% 20%, rgba(255,107,157,0.3) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Moon */}
      <motion.div
        className="absolute right-[12%] top-[8%] h-20 w-20 rounded-full sm:h-28 sm:w-28"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.9, y: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        style={{
          background:
            "radial-gradient(circle at 35% 35%, #fff9e6, #ffd700 40%, #ffb347 100%)",
          boxShadow: "0 0 60px 20px rgba(255,215,0,0.3)",
        }}
      />

      {/* Floating castle silhouettes */}
      <svg
        className="absolute bottom-0 left-0 w-full opacity-30"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0 200 L0 120 L80 80 L120 120 L160 60 L200 100 L240 40 L280 90 L320 50 L360 110 L400 70 L440 130 L480 80 L520 140 L560 90 L600 150 L640 100 L680 160 L720 80 L760 140 L800 60 L840 120 L880 70 L920 130 L960 50 L1000 110 L1040 80 L1080 140 L1120 60 L1160 120 L1200 90 L1240 150 L1280 70 L1320 130 L1360 80 L1440 120 L1440 200 Z"
          fill="url(#castleGrad)"
        />
        <defs>
          <linearGradient id="castleGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6b4c9a" />
            <stop offset="100%" stopColor="#1a0a2e" />
          </linearGradient>
        </defs>
      </svg>

      {/* Star field */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white"
          style={{
            left: `${(i * 17 + 5) % 100}%`,
            top: `${(i * 23 + 3) % 45}%`,
          }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{
            duration: 2 + (i % 3),
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}

      <ParticleField count={25} />

      {/* Ground glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3"
        style={{
          background:
            "linear-gradient(to top, rgba(255,107,157,0.15), transparent)",
        }}
      />
    </div>
  );
}
