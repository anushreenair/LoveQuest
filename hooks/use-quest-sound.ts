"use client";

import { useCallback } from "react";
import { playQuestSound } from "@/lib/quest-sounds";

export function useQuestSound() {
  const play = useCallback((sound: Parameters<typeof playQuestSound>[0]) => {
    playQuestSound(sound).catch(() => {});
  }, []);

  return { play };
}
