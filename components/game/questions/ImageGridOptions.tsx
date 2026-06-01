"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import type { QuestionOption } from "@/lib/lq/questions";

interface ImageGridOptionsProps {
  options: QuestionOption[];
  selectedIndex: number | null;
  onSelect: (index: number, score: number) => void;
}

function ImageOptionCard({
  opt,
  selected,
  onSelect,
  index,
}: {
  opt: QuestionOption;
  selected: boolean;
  onSelect: () => void;
  index: number;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showFallback = !opt.imageUrl || imageFailed;
  const gradient = opt.gradient ?? "from-pink-500 to-purple-700";
  const fallbackEmoji = opt.imageFallbackEmoji ?? opt.emoji ?? "✨";

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={[
        "group relative aspect-[4/5] overflow-hidden rounded-2xl border-2 text-left transition-all",
        selected
          ? "border-pink-400 shadow-xl shadow-pink-500/30"
          : "border-white/15 hover:border-pink-400/50",
      ].join(" ")}
    >
      {/* Gradient + emoji always visible as base layer */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br ${gradient}`}
      >
        {showFallback && (
          <span className="text-5xl drop-shadow-lg" aria-hidden>
            {fallbackEmoji}
          </span>
        )}
      </div>

      {opt.imageUrl && !imageFailed && (
        <Image
          src={opt.imageUrl}
          alt={opt.label}
          fill
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 280px"
          onError={() => setImageFailed(true)}
          priority={index < 2}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="font-semibold text-white drop-shadow-md">{opt.label}</p>
      </div>

      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-pink-500 text-white shadow-lg"
        >
          ✓
        </motion.div>
      )}
    </motion.button>
  );
}

export function ImageGridOptions({
  options,
  selectedIndex,
  onSelect,
}: ImageGridOptionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt, i) => (
        <ImageOptionCard
          key={`${opt.label}-${i}`}
          opt={opt}
          index={i}
          selected={selectedIndex === i}
          onSelect={() => onSelect(i, opt.score)}
        />
      ))}
    </div>
  );
}
