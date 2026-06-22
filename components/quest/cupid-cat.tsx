"use client";

import { motion } from "framer-motion";

interface HelloKittyProps {
  phase?: "enter" | "walk" | "jump" | "idle" | "hidden";
  variant?: "stage" | "inline";
}

export function HelloKitty({ phase = "idle", variant = "stage" }: HelloKittyProps) {
  const isWalking = phase === "walk";
  const isJumping = phase === "jump";
  const isHidden = phase === "hidden";

  const svg = (
    <svg
      viewBox="0 0 200 220"
      className="h-44 w-44 sm:h-56 sm:w-56 drop-shadow-[0_16px_48px_rgba(255,105,180,0.45)]"
      aria-label="Hello Kitty"
    >
        <defs>
          <linearGradient id="hkBow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4d6d" />
            <stop offset="100%" stopColor="#c9184a" />
          </linearGradient>
          <linearGradient id="hkShirt" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff8fab" />
            <stop offset="100%" stopColor="#fb6f92" />
          </linearGradient>
          <filter id="hkSoftGlow">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#ffb3c6" floodOpacity="0.5" />
          </filter>
        </defs>

        <g filter="url(#hkSoftGlow)">
          {/* Left ear */}
          <ellipse cx="62" cy="52" rx="22" ry="26" fill="#fff" stroke="#111" strokeWidth="2.5" />
          {/* Right ear */}
          <ellipse cx="138" cy="52" rx="22" ry="26" fill="#fff" stroke="#111" strokeWidth="2.5" />

          {/* Classic red bow on left ear */}
          <g transform="translate(38, 28)">
            <circle cx="18" cy="16" r="11" fill="url(#hkBow)" />
            <circle cx="34" cy="10" r="9" fill="url(#hkBow)" />
            <circle cx="34" cy="22" r="9" fill="url(#hkBow)" />
            <circle cx="26" cy="16" r="5" fill="#fff" opacity="0.35" />
            <ellipse cx="26" cy="16" rx="4" ry="3" fill="#ff758f" />
          </g>

          {/* Head — iconic round white face, no mouth */}
          <ellipse cx="100" cy="88" rx="58" ry="52" fill="#fff" stroke="#111" strokeWidth="2.5" />

          {/* Whiskers */}
          <g stroke="#111" strokeWidth="2" strokeLinecap="round">
            <line x1="42" y1="82" x2="68" y2="86" />
            <line x1="40" y1="94" x2="68" y2="94" />
            <line x1="42" y1="106" x2="68" y2="102" />
            <line x1="158" y1="82" x2="132" y2="86" />
            <line x1="160" y1="94" x2="132" y2="94" />
            <line x1="158" y1="106" x2="132" y2="102" />
          </g>

          {/* Eyes — black ovals */}
          <ellipse cx="82" cy="86" rx="5" ry="7" fill="#111" />
          <ellipse cx="118" cy="86" rx="5" ry="7" fill="#111" />

          {/* Yellow nose */}
          <ellipse cx="100" cy="98" rx="5" ry="4" fill="#f9c74f" stroke="#e8b923" strokeWidth="0.5" />

          {/* Blush */}
          <ellipse cx="68" cy="102" rx="9" ry="5" fill="#ffb3c6" opacity="0.55" />
          <ellipse cx="132" cy="102" rx="9" ry="5" fill="#ffb3c6" opacity="0.55" />

          {/* Body / pink shirt */}
          <path
            d="M 58 132 Q 100 128 142 132 L 148 168 Q 100 176 52 168 Z"
            fill="url(#hkShirt)"
            stroke="#111"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Overalls strap detail */}
          <path d="M 72 132 L 68 155 M 128 132 L 132 155" stroke="#111" strokeWidth="2" strokeLinecap="round" />
          <circle cx="100" cy="152" r="4" fill="#ffd166" stroke="#111" strokeWidth="1.5" />

          {/* Heart on shirt */}
          <path
            d="M 100 145 C 96 140 88 142 90 149 C 92 155 100 160 100 160 C 100 160 108 155 110 149 C 112 142 104 140 100 145 Z"
            fill="#fff"
            opacity="0.9"
          />

          {/* Arms */}
          <motion.g
            animate={isWalking ? { rotate: [18, -18, 18] } : { rotate: 0 }}
            transition={{ duration: 0.35, repeat: isWalking ? Infinity : 0 }}
            style={{ transformOrigin: "52px 145px" }}
          >
            <ellipse cx="44" cy="148" rx="12" ry="16" fill="#fff" stroke="#111" strokeWidth="2" />
          </motion.g>
          <motion.g
            animate={isWalking ? { rotate: [-18, 18, -18] } : { rotate: 0 }}
            transition={{ duration: 0.35, repeat: isWalking ? Infinity : 0 }}
            style={{ transformOrigin: "148px 145px" }}
          >
            <ellipse cx="156" cy="148" rx="12" ry="16" fill="#fff" stroke="#111" strokeWidth="2" />
          </motion.g>

          {/* Legs / feet */}
          <motion.g
            animate={isWalking ? { rotate: [12, -12, 12] } : { rotate: 0 }}
            transition={{ duration: 0.35, repeat: isWalking ? Infinity : 0 }}
            style={{ transformOrigin: "82px 178px" }}
          >
            <ellipse cx="78" cy="188" rx="14" ry="10" fill="#fff" stroke="#111" strokeWidth="2" />
            <ellipse cx="78" cy="198" rx="16" ry="8" fill="#fff" stroke="#111" strokeWidth="2" />
          </motion.g>
          <motion.g
            animate={isWalking ? { rotate: [-12, 12, -12] } : { rotate: 0 }}
            transition={{ duration: 0.35, repeat: isWalking ? Infinity : 0 }}
            style={{ transformOrigin: "118px 178px" }}
          >
            <ellipse cx="122" cy="188" rx="14" ry="10" fill="#fff" stroke="#111" strokeWidth="2" />
            <ellipse cx="122" cy="198" rx="16" ry="8" fill="#fff" stroke="#111" strokeWidth="2" />
          </motion.g>
        </g>

        {/* Sparkle accents */}
        <motion.g
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <path d="M 168 60 L 170 66 L 176 68 L 170 70 L 168 76 L 166 70 L 160 68 L 166 66 Z" fill="#ffd166" />
          <path d="M 28 120 L 29 124 L 33 125 L 29 126 L 28 130 L 27 126 L 23 125 L 27 124 Z" fill="#ff8fab" />
        </motion.g>
      </svg>
  );

  const jumpShadow = isJumping && (
    <motion.div
      className="absolute -bottom-1 left-1/2 h-4 w-24 -translate-x-1/2 rounded-full bg-pink-400/25 blur-md"
      animate={{ scaleX: [1, 0.45, 1], opacity: [0.6, 0.2, 0.5] }}
      transition={{ duration: 0.65 }}
    />
  );

  if (variant === "inline") {
    return (
      <div className="relative flex justify-center">
        {svg}
        {jumpShadow}
      </div>
    );
  }

  const leftPercent =
    phase === "enter"
      ? 8
      : phase === "walk" || isJumping || phase === "idle"
        ? 50
        : -20;

  return (
    <motion.div
      className="absolute bottom-[20vh] z-[205]"
      style={{ translateX: "-50%" }}
      initial={{ left: "-15%", opacity: 0, y: 0 }}
      animate={{
        left: `${leftPercent}%`,
        opacity: isHidden ? 0 : 1,
        y: isJumping ? [0, -110, -75, 0] : 0,
        scale: isJumping ? [1, 0.94, 1.08, 1] : 1,
      }}
      transition={{
        left: {
          duration: phase === "enter" ? 0.8 : phase === "walk" ? 1.2 : 0.4,
          ease: [0.22, 1, 0.36, 1],
        },
        y: { duration: 0.65, ease: [0.34, 1.56, 0.64, 1] },
        scale: { duration: 0.65, ease: [0.34, 1.56, 0.64, 1] },
        opacity: { duration: 0.3 },
      }}
    >
      {svg}
      {jumpShadow}
    </motion.div>
  );
}

/* Keep alias for existing imports during transition */
export const CupidCat = HelloKitty;
