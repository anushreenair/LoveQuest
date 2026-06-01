"use client";

import { motion, type Variants } from "framer-motion";

export type LumiPose = "idle" | "walk" | "talk" | "celebrate" | "peek";

interface LumiCharacterProps {
  pose?: LumiPose;
  size?: number;
  className?: string;
}

/**
 * Lumi — original cute guide character (inspired by kawaii style, not any IP).
 * Simple SVG: round face, pink bow, blush, dot eyes.
 */
export function LumiCharacter({
  pose = "idle",
  size = 160,
  className = "",
}: LumiCharacterProps) {
  const bodyVariants: Variants = {
    idle: { y: [0, -6, 0], transition: { duration: 2, repeat: Infinity } },
    walk: { y: [0, -4, 0], transition: { duration: 0.4, repeat: Infinity } },
    talk: { scale: [1, 1.02, 1], transition: { duration: 0.6, repeat: Infinity } },
    celebrate: {
      rotate: [-3, 3, -3],
      y: [0, -12, 0],
      transition: { duration: 0.5, repeat: Infinity },
    },
    peek: { x: [20, 0], opacity: [0, 1] },
  };

  return (
    <motion.div
      className={className}
      variants={bodyVariants}
      animate={pose}
      style={{ width: size, height: size * 1.15 }}
    >
      <svg
        viewBox="0 0 200 230"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full drop-shadow-[0_12px_32px_rgba(236,72,153,0.35)]"
        aria-label="Lumi, your LoveQuest guide"
      >
        {/* Body / dress */}
        <ellipse cx="100" cy="195" rx="52" ry="28" fill="#f9a8d4" />
        <path
          d="M58 155 Q100 175 142 155 L142 195 Q100 215 58 195 Z"
          fill="#ec4899"
        />
        {/* Head */}
        <circle cx="100" cy="95" r="72" fill="#fff5f7" stroke="#fce7f3" strokeWidth="3" />
        {/* Ears */}
        <ellipse cx="42" cy="55" rx="18" ry="22" fill="#fff5f7" stroke="#fce7f3" strokeWidth="2" />
        <ellipse cx="158" cy="55" rx="18" ry="22" fill="#fff5f7" stroke="#fce7f3" strokeWidth="2" />
        {/* Bow on left ear */}
        <path
          d="M28 48 C15 38 8 55 22 58 C8 62 15 78 28 68 C35 62 35 54 28 48Z"
          fill="#ec4899"
        />
        <circle cx="26" cy="58" r="5" fill="#db2777" />
        {/* Blush */}
        <ellipse cx="62" cy="108" rx="14" ry="8" fill="#fda4af" opacity="0.55" />
        <ellipse cx="138" cy="108" rx="14" ry="8" fill="#fda4af" opacity="0.55" />
        {/* Eyes */}
        <ellipse cx="72" cy="92" rx="8" ry="10" fill="#1e1b4b" />
        <ellipse cx="128" cy="92" rx="8" ry="10" fill="#1e1b4b" />
        <circle cx="75" cy="88" r="2.5" fill="white" />
        <circle cx="131" cy="88" r="2.5" fill="white" />
        {/* Nose */}
        <ellipse cx="100" cy="102" rx="5" ry="4" fill="#f9a8d4" />
        {/* Mouth */}
        <path
          d="M88 115 Q100 124 112 115"
          stroke="#be185d"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Arms */}
        <ellipse cx="48" cy="158" rx="12" ry="18" fill="#fff5f7" stroke="#fce7f3" strokeWidth="2" />
        <ellipse cx="152" cy="158" rx="12" ry="18" fill="#fff5f7" stroke="#fce7f3" strokeWidth="2" />
        {/* Feet */}
        <ellipse cx="78" cy="218" rx="16" ry="8" fill="#fff5f7" stroke="#fce7f3" strokeWidth="2" />
        <ellipse cx="122" cy="218" rx="16" ry="8" fill="#fff5f7" stroke="#fce7f3" strokeWidth="2" />
      </svg>
    </motion.div>
  );
}
