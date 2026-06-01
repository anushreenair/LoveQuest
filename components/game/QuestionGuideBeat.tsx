"use client";

import { motion } from "framer-motion";
import { LumiCharacter } from "@/components/game/mascot/LumiCharacter";
import { GuideBubble } from "@/components/game/mascot/GuideBubble";

interface QuestionGuideBeatProps {
  message: string;
  category: string;
}

/**
 * Lumi slides in before each question with unique dialogue.
 */
export function QuestionGuideBeat({ message, category }: QuestionGuideBeatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="mb-6 flex items-end gap-3 sm:gap-4"
    >
      <motion.div
        initial={{ x: -80 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
      >
        <LumiCharacter pose="talk" size={100} />
      </motion.div>
      <div className="flex-1 pb-2">
        <span className="mb-2 inline-block rounded-full bg-pink-500/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-pink-300">
          {category}
        </span>
        <GuideBubble message={message} />
      </div>
    </motion.div>
  );
}
