"use client";

import { motion } from "framer-motion";
import type { LQQuestion } from "@/lib/lq/questions";
import { ImageGridOptions } from "@/components/game/questions/ImageGridOptions";
import { IconCardOptions } from "@/components/game/questions/IconCardOptions";
import { ScenarioOptions } from "@/components/game/questions/ScenarioOptions";

interface QuestionStageProps {
  question: LQQuestion;
  selectedIndex: number | null;
  onSelect: (index: number, score: number) => void;
  onContinue: () => void;
  onBack?: () => void;
  canGoBack?: boolean;
  isLast: boolean;
  isLoading?: boolean;
}

export function QuestionStage({
  question,
  selectedIndex,
  onSelect,
  onContinue,
  onBack,
  canGoBack = false,
  isLast,
  isLoading,
}: QuestionStageProps) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:p-6"
    >
      <h2 className="font-display text-xl font-bold leading-snug text-white sm:text-2xl">
        {question.prompt}
      </h2>

      <div className="mt-6">
        {question.type === "scenario" && (
          <ScenarioOptions
            options={question.options}
            selectedIndex={selectedIndex}
            onSelect={onSelect}
          />
        )}
        {question.type === "image-grid" && (
          <ImageGridOptions
            options={question.options}
            selectedIndex={selectedIndex}
            onSelect={onSelect}
          />
        )}
        {question.type === "icon-cards" && (
          <IconCardOptions
            options={question.options}
            selectedIndex={selectedIndex}
            onSelect={onSelect}
          />
        )}
      </div>

      <div className="mt-8 flex gap-3">
        {canGoBack && onBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="shrink-0 rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-sm font-semibold text-pink-100 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            ← Back
          </button>
        )}

        <motion.button
          type="button"
          onClick={onContinue}
          disabled={selectedIndex === null || isLoading}
          className="flex-1 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 py-4 text-base font-bold text-white shadow-lg shadow-pink-500/30 disabled:cursor-not-allowed disabled:opacity-40"
          whileHover={selectedIndex !== null ? { scale: 1.02 } : undefined}
          whileTap={selectedIndex !== null ? { scale: 0.98 } : undefined}
        >
          {isLoading
            ? "Calculating your score…"
            : isLast
              ? "Reveal our compatibility ✨"
              : "Continue adventure →"}
        </motion.button>
      </div>
    </motion.div>
  );
}
