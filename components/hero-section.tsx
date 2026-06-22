"use client";

import { APP_NAME } from "@/lib/brand";
import { motion } from "framer-motion";
import Link from "next/link";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/button";
import { QuestEntryButton } from "@/components/quest/quest-entry-button";
import { FloatingHearts } from "@/components/floating-hearts";

interface HeroSectionProps {
  isLoggedIn: boolean;
}

export function HeroSection({ isLoggedIn }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-24">
      <FloatingHearts />

      <PageTransition className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.span
            className="mb-8 inline-block text-6xl sm:text-7xl"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            💕
          </motion.span>

          <h1 className="mb-10 text-6xl font-bold tracking-tight sm:text-8xl">
            <span className="text-gradient">{APP_NAME}</span>
          </h1>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {isLoggedIn ? (
              <QuestEntryButton>Start</QuestEntryButton>
            ) : (
              <Link href="/signup">
                <Button size="lg">Start</Button>
              </Link>
            )}
            <Link href={isLoggedIn ? "/dashboard" : "/login"}>
              <Button variant="secondary" size="lg">
                Past Results
              </Button>
            </Link>
          </div>
        </motion.div>
      </PageTransition>
    </section>
  );
}
