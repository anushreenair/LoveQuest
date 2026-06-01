"use client";

import { motion } from "framer-motion";
import type { QuestionOption } from "@/lib/lq/questions";

interface ScenarioOptionsProps {
  options: QuestionOption[];
  selectedIndex: number | null;
  onSelect: (index: number, score: number) => void;
}

export function ScenarioOptions({
  options,
  selectedIndex,
  onSelect,
}: ScenarioOptionsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((opt, i) => {
        const selected = selectedIndex === i;
        return (
          <motion.button
            key={i}
            type="button"
            onClick={() => onSelect(i, opt.score)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={[
              "flex items-center gap-4 rounded-2xl border p-4 text-left transition-all",
              selected
                ? "border-pink-400/70 bg-pink-500/25 shadow-lg shadow-pink-500/20"
                : "border-white/12 bg-white/8 hover:border-pink-400/40 hover:bg-white/12",
            ].join(" ")}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl">
              {opt.emoji}
            </span>
            <span className="text-sm font-medium text-white">{opt.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
