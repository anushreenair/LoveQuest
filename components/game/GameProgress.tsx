"use client";

import { motion } from "framer-motion";

interface GameProgressProps {
  current: number;
  total: number;
}

export function GameProgress({ current, total }: GameProgressProps) {
  const pct = (current / total) * 100;

  return (
    <div className="mb-6">
      <div className="mb-2 flex justify-between text-xs font-semibold text-pink-200/60">
        <span>Adventure progress</span>
        <span>
          {current}/{total}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
