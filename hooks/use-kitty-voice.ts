"use client";

import { useCallback } from "react";
import { speakKittyHi, stopKittyVoice } from "@/lib/kitty-voice";

export function useKittyVoice() {
  const sayHi = useCallback(() => {
    speakKittyHi().catch(() => {});
  }, []);

  const stop = useCallback(() => {
    stopKittyVoice();
  }, []);

  return { sayHi, stop };
}
