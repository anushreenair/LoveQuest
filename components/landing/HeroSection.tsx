"use client";

import { motion, type Variants } from "framer-motion";
import { GoogleButton } from "@/components/ui/GoogleButton";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: "easeOut" },
  }),
};

/**
 * Hero section — headline, subcopy, and primary Google sign-in CTA.
 */
export function HeroSection() {
  return (
    <section className="relative z-10 flex flex-col items-center px-6 pt-16 text-center sm:pt-24 md:pt-32">
      {/* Badge */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-400/30 bg-pink-500/10 px-4 py-1.5 text-xs font-medium tracking-wide text-pink-200 backdrop-blur-sm sm:text-sm"
      >
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-pink-400" />
        Interactive love stories, made for two
      </motion.div>

      {/* Headline */}
      <motion.h1
        custom={0.1}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="font-display max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
      >
        Turn your love story into an{" "}
        <span className="bg-gradient-to-r from-pink-300 via-rose-300 to-purple-300 bg-clip-text text-transparent">
          unforgettable quest
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        custom={0.2}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mt-6 max-w-2xl text-base leading-relaxed text-pink-100/80 sm:text-lg md:text-xl"
      >
        LoveQuest helps couples create personalized, interactive romantic
        experiences — puzzles, surprises, and moments they&apos;ll never forget.
      </motion.p>

      {/* CTA */}
      <motion.div
        custom={0.35}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mt-10 flex w-full max-w-sm flex-col items-center gap-4 sm:max-w-none"
      >
        <GoogleButton />
        <p className="text-xs text-pink-200/50 sm:text-sm">
          Free to start · No credit card required
        </p>
      </motion.div>
    </section>
  );
}
