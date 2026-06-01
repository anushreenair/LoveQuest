"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export function ConfettiCelebration() {
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#ec4899", "#f472b6", "#a855f7", "#fbbf24"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#ec4899", "#f472b6", "#a855f7", "#fbbf24"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#ec4899", "#f472b6", "#a855f7", "#fff"],
    });

    frame();
  }, []);

  return null;
}
