"use client";

import { APP_NAME } from "@/lib/brand";
import { motion } from "framer-motion";
import Link from "next/link";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/button";
import { QuestEntryButton } from "@/components/quest/quest-entry-button";
import { ScoreRing } from "@/components/score-ring";
import { ConfettiCelebration } from "@/components/confetti-celebration";
import { PageTransition } from "@/components/page-transition";
import { FloatingHearts } from "@/components/floating-hearts";
import { PartnerDelivery } from "@/components/partner-delivery";

interface ResultsViewProps {
  partnerName: string;
  partnerEmail: string | null;
  userName: string;
  score: number;
  shareUrl: string;
  answers: { question: string; answer: string }[];
  partnerDelivered?: boolean;
  deliveredTo?: string;
  emailError?: string;
  celebrate?: boolean;
  publicView?: boolean;
}

export function ResultsView({
  partnerName,
  partnerEmail,
  userName,
  score,
  shareUrl,
  answers,
  partnerDelivered = false,
  deliveredTo,
  emailError,
  celebrate = false,
  publicView = false,
}: ResultsViewProps) {
  const scoreLabel =
    score >= 90
      ? "Soulmates! 💫"
      : score >= 80
        ? "Amazing Match! ✨"
        : score >= 70
          ? "Great Connection! 💕"
          : score >= 60
            ? "Promising! 🌟"
            : "Intriguing! 💕";

  return (
    <div className="relative">
      <FloatingHearts />
      <ConfettiCelebration active={celebrate || score >= 70} duration={8000} />

      <PageTransition className="relative z-10 mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-medium text-pink-400"
          >
            {APP_NAME}
          </motion.span>
          {publicView ? (
            <>
              <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                {userName} & {partnerName}
              </h1>
              <p className="mt-2 text-white/50">
                {userName} played {APP_NAME} about you
              </p>
            </>
          ) : (
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              You & {partnerName}
            </h1>
          )}
        </motion.div>

        <GlassCard glow className="mb-6 p-8 sm:p-10">
          <div className="flex flex-col items-center">
            <ScoreRing score={score} />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="mt-6 text-xl font-semibold text-gradient"
            >
              {scoreLabel}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="mt-2 text-4xl font-bold text-white"
            >
              {score}%
            </motion.p>
          </div>
        </GlassCard>

        {partnerEmail && !publicView && (
          <PartnerDelivery
            partnerName={partnerName}
            partnerEmail={partnerEmail}
            score={score}
            shareUrl={shareUrl}
            partnerDelivered={partnerDelivered}
            deliveredTo={deliveredTo}
            emailError={emailError}
          />
        )}

        {!publicView && (
          <GlassCard className="mb-8 p-6 sm:p-8">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <span>💬</span> Your Answers
            </h2>
            <div className="space-y-4">
              {answers.map((qa, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 + i * 0.08 }}
                  className="rounded-xl bg-white/5 p-4"
                >
                  <p className="mb-1 text-sm font-medium text-pink-400/80">
                    {qa.question}
                  </p>
                  <p className="text-sm text-white/70">{qa.answer}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        )}

        {!publicView && (
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <QuestEntryButton variant="primary">Play again</QuestEntryButton>
            <Link href="/dashboard">
              <Button variant="secondary" size="lg">
                Dashboard
              </Button>
            </Link>
          </div>
        )}

        {publicView && (
          <div className="text-center">
            <Link href="/signup">
              <Button size="lg">Try {APP_NAME}</Button>
            </Link>
          </div>
        )}
      </PageTransition>
    </div>
  );
}
