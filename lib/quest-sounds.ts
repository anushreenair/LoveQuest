type SoundId = "enter" | "walk" | "jump" | "burst" | "dialogue" | "world";

let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.08,
  delay = 0
) {
  const ctx = getContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + delay);

  gain.gain.setValueAtTime(0, ctx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.02);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + delay + duration
  );

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(ctx.currentTime + delay);
  oscillator.stop(ctx.currentTime + delay + duration);
}

function playOptionalFile(src: string, volume = 0.35) {
  if (typeof window === "undefined") return;
  const audio = new Audio(src);
  audio.volume = volume;
  audio.play().catch(() => {});
}

export async function playQuestSound(id: SoundId) {
  const ctx = getContext();
  if (ctx?.state === "suspended") {
    await ctx.resume().catch(() => {});
  }

  switch (id) {
    case "enter":
      playTone(523, 0.15, "sine", 0.06);
      playTone(659, 0.2, "sine", 0.05, 0.08);
      break;
    case "walk":
      playTone(180, 0.05, "triangle", 0.03);
      break;
    case "jump":
      playTone(330, 0.12, "sine", 0.07);
      playTone(880, 0.25, "sine", 0.06, 0.1);
      playOptionalFile("/sounds/quest-jump.mp3", 0.25);
      break;
    case "burst":
      playTone(220, 0.4, "sawtooth", 0.04);
      playTone(440, 0.5, "sine", 0.07, 0.05);
      playTone(880, 0.6, "sine", 0.05, 0.15);
      playTone(1320, 0.8, "sine", 0.04, 0.25);
      playOptionalFile("/sounds/quest-burst.mp3", 0.4);
      break;
    case "dialogue":
      playTone(784, 0.2, "sine", 0.05);
      playTone(988, 0.25, "sine", 0.04, 0.12);
      break;
    case "world":
      playTone(392, 0.6, "sine", 0.05);
      playTone(523, 0.8, "sine", 0.04, 0.2);
      playTone(659, 1, "sine", 0.03, 0.4);
      playOptionalFile("/sounds/quest-world.mp3", 0.3);
      break;
  }
}
