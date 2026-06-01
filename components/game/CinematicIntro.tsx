"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { INTRO_SCRIPT, GUIDE_NAME } from "@/lib/lq/guide";
import { LumiCharacter } from "@/components/game/mascot/LumiCharacter";
import { GuideBubble } from "@/components/game/mascot/GuideBubble";

interface CinematicIntroProps {
  onComplete: () => void;
}

type IntroPhase = "walk-in" | "fullscreen" | "done";

/**
 * Full-screen intro: Lumi walks in, takes over screen, explains the game.
 */
export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState<IntroPhase>("walk-in");
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    if (phase !== "walk-in") return;
    const t = setTimeout(() => setPhase("fullscreen"), 2200);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "fullscreen") return;
    if (lineIndex < INTRO_SCRIPT.length - 1) {
      const t = setTimeout(() => setLineIndex((i) => i + 1), 2200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 1800);
    return () => clearTimeout(t);
  }, [phase, lineIndex, onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#4a1942]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.25),transparent_50%)]" />

          {phase === "walk-in" && (
            <motion.div
              className="flex flex-col items-center"
              initial={{ x: "-120vw" }}
              animate={{ x: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 18 }}
            >
              <LumiCharacter pose="walk" size={200} />
              <p className="mt-4 text-sm font-medium text-pink-200/60">
                {GUIDE_NAME} is arriving…
              </p>
            </motion.div>
          )}

          {phase === "fullscreen" && (
            <motion.div
              className="flex w-full max-w-lg flex-col items-center px-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <LumiCharacter pose="talk" size={220} />
              <div className="mt-8 w-full">
                <GuideBubble message={INTRO_SCRIPT[lineIndex]} large />
              </div>
              <div className="mt-6 flex gap-2">
                {INTRO_SCRIPT.map((_, i) => (
                  <div
                    key={i}
                    className={[
                      "h-1.5 rounded-full transition-all duration-300",
                      i === lineIndex
                        ? "w-8 bg-pink-400"
                        : "w-1.5 bg-white/20",
                    ].join(" ")}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
