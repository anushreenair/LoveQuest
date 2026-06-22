"use client";

import { motion } from "framer-motion";

interface McqOptionsProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}

export function McqOptions({ options, selected, onSelect }: McqOptionsProps) {
  return (
    <div className="space-y-3">
      {options.map((option, i) => {
        const isSelected = selected === option;

        return (
          <motion.button
            key={option}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(option)}
            className={`
              group flex w-full items-center gap-3 rounded-xl border px-4 py-3.5
              text-left text-sm transition-all duration-200 sm:text-base
              ${
                isSelected
                  ? "border-pink-500/60 bg-pink-500/15 text-white shadow-lg shadow-pink-500/10"
                  : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10"
              }
            `}
          >
            <span
              className={`
                flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold
                ${
                  isSelected
                    ? "bg-gradient-to-br from-pink-500 to-purple-500 text-white"
                    : "bg-white/10 text-white/50 group-hover:bg-white/15"
                }
              `}
            >
              {String.fromCharCode(65 + i)}
            </span>
            <span className="flex-1">{option}</span>
            {isSelected && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-pink-400"
              >
                ✓
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
