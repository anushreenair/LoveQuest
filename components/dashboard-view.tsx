"use client";

import { APP_NAME } from "@/lib/brand";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTransition } from "react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/button";
import { PageTransition } from "@/components/page-transition";
import { deleteGameSession } from "@/actions/game";
import { QuestEntryButton } from "@/components/quest/quest-entry-button";

interface SessionSummary {
  id: string;
  partnerName: string;
  compatibilityScore: number;
  createdAt: string;
  answerCount: number;
}

interface DashboardViewProps {
  sessions: SessionSummary[];
  userName: string;
}

function getScoreColor(score: number) {
  if (score >= 85) return "from-pink-500 to-purple-500";
  if (score >= 70) return "from-purple-500 to-indigo-500";
  return "from-indigo-500 to-blue-500";
}

export function DashboardView({ sessions, userName }: DashboardViewProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (!confirm("Delete this quest result?")) return;
    startTransition(async () => {
      await deleteGameSession(id);
    });
  };

  return (
    <PageTransition className="mx-auto max-w-3xl">
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white"
        >
          Hey {userName} 👋
        </motion.h1>
        <p className="text-white/50 mt-2">Your {APP_NAME} history</p>
      </div>

      <div className="mb-8">
        <QuestEntryButton />
      </div>

      {sessions.length === 0 ? (
        <GlassCard glow className="p-12 text-center">
          <span className="text-5xl mb-4 block">💫</span>
          <h2 className="text-xl font-semibold text-white mb-2">
            No quests yet
          </h2>
          <p className="text-white/50 mb-6">
            Start your first round
          </p>
          <QuestEntryButton size="md">Start</QuestEntryButton>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {sessions.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard hover className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${getScoreColor(s.compatibilityScore)} text-lg font-bold text-white`}
                    >
                      {s.compatibilityScore}%
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white truncate">
                        {s.partnerName}
                      </h3>
                      <p className="text-sm text-white/40">
                        {new Date(s.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        · {s.answerCount} answers
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/results/${s.id}`}>
                      <Button variant="secondary" size="sm">
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(s.id)}
                      disabled={isPending}
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
