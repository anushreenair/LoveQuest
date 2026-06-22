"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/use-window-size";

interface ConfettiCelebrationProps {
  active: boolean;
  duration?: number;
}

export function ConfettiCelebration({
  active,
  duration = 5000,
}: ConfettiCelebrationProps) {
  const { width, height } = useWindowSize();
  const [show, setShow] = useState(active);

  useEffect(() => {
    if (active) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), duration);
      return () => clearTimeout(timer);
    }
  }, [active, duration]);

  if (!show || width === 0) return null;

  return (
    <Confetti
      width={width}
      height={height}
      recycle={false}
      numberOfPieces={300}
      colors={["#ff6b9d", "#c44dff", "#6b8cff", "#ffd700", "#ff69b4"]}
    />
  );
}
