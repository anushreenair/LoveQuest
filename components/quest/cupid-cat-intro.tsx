"use client";

import { useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { HelloKitty } from "./cupid-cat";
import { FantasyWorldBg } from "./fantasy-world-bg";
import { Button } from "@/components/button";

const INSTRUCTIONS = [
  "Enter their name, birthday, and email.",
  "Tap the best answer for each question.",
  "We'll send them the result automatically!",
];

interface CupidCatIntroProps {
  onComplete: () => void;
}

export function CupidCatIntro({ onComplete }: CupidCatIntroProps) {
  const completedRef = useRef(false);

  const finishIntro = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <FantasyWorldBg visible fullScreen />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16">
        {/* Kitty pop-in */}
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 18,
            delay: 0.15,
          }}
          className="relative mb-6"
        >
          <motion.div
            className="absolute inset-0 -z-10 rounded-full bg-pink-500/20 blur-3xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1.5 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          />
          <div className="relative">
            <HelloKitty variant="inline" />
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          <div className="relative rounded-2xl border border-white/20 bg-black/40 p-6 backdrop-blur-xl shadow-2xl shadow-pink-500/20">
            <div className="absolute -top-3 left-8 rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-3 py-1 text-xs font-semibold text-white">
              Hello Kitty
            </div>

            <p className="mb-4 text-lg font-semibold text-white">
              Follow my instructions! 💕
            </p>

            <ol className="space-y-3 text-left text-white/75">
              {INSTRUCTIONS.map((step, i) => (
                <motion.li
                  key={step}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.12 }}
                  className="flex gap-3 text-sm sm:text-base"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-500/20 text-xs font-bold text-pink-300">
                    {i + 1}
                  </span>
                  {step}
                </motion.li>
              ))}
            </ol>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.95 }}
              className="mt-6"
            >
              <Button size="lg" className="w-full" onClick={finishIntro}>
                Got it — let&apos;s go! ✨
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
