"use client";

import { motion } from "framer-motion";
import type { QuestionOption } from "@/lib/lq/questions";

interface IconCardOptionsProps {
  options: QuestionOption[];
  selectedIndex: number | null;
  onSelect: (index: number, score: number) => void;
}

export function IconCardOptions({
  options,
  selectedIndex,
  onSelect,
}: IconCardOptionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt, i) => {
        const selected = selectedIndex === i;
        return (
          <motion.button
            key={i}
            type="button"
            onClick={() => onSelect(i, opt.score)}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.96 }}
            className={[
              "relative flex min-h-[120px] flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all",
              `bg-gradient-to-br ${opt.gradient ?? "from-pink-500 to-purple-700"}`,
              selected
                ? "border-white shadow-xl ring-2 ring-pink-300"
                : "border-white/20 opacity-90 hover:opacity-100",
            ].join(" ")}
          >
            <span className="text-5xl drop-shadow-md">{opt.emoji}</span>
            <span className="mt-3 text-center text-sm font-bold text-white drop-shadow">
              {opt.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
