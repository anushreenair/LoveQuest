const CUTE_VOICE_HINTS = [
  "samantha",
  "karen",
  "victoria",
  "zira",
  "fiona",
  "tessa",
  "moira",
  "google uk english female",
  "female",
  "girl",
];

let voicesReady = false;

function pickCuteVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  for (const hint of CUTE_VOICE_HINTS) {
    const match = voices.find(
      (v) =>
        v.name.toLowerCase().includes(hint) ||
        v.voiceURI.toLowerCase().includes(hint)
    );
    if (match) return match;
  }

  return (
    voices.find(
      (v) => v.lang.startsWith("en") && !v.name.toLowerCase().includes("male")
    ) ??
    voices.find((v) => v.lang.startsWith("en")) ??
    voices[0] ??
    null
  );
}

function ensureVoicesLoaded(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }

    if (window.speechSynthesis.getVoices().length > 0) {
      voicesReady = true;
      resolve();
      return;
    }

    const onVoicesChanged = () => {
      voicesReady = true;
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      resolve();
    };

    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      resolve();
    }, 500);
  });
}

export function stopKittyVoice() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

/** One short cute "Hi" — nothing else */
export async function speakKittyHi(): Promise<void> {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  if (!voicesReady) await ensureVoicesLoaded();

  stopKittyVoice();

  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }

  const utterance = new SpeechSynthesisUtterance("Hi!");
  const voice = pickCuteVoice();

  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang ?? "en-US";
  utterance.pitch = 1.55;
  utterance.rate = 0.88;
  utterance.volume = 1;

  return new Promise((resolve) => {
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}
