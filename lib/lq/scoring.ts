import { getCharacterComment } from "@/lib/lq/guide";
import { LQ_QUESTIONS, MAX_RAW_SCORE } from "@/lib/lq/questions";

export type PersonalityId =
  | "power-couple"
  | "soulmates"
  | "best-friends-in-love"
  | "chaotic-lovebirds"
  | "adorable-disaster";

export interface RelationshipPersonality {
  id: PersonalityId;
  label: string;
  min: number;
  max: number;
  emoji: string;
  tagline: string;
  gradient: string;
}

export const RELATIONSHIP_TYPES: RelationshipPersonality[] = [
  {
    id: "adorable-disaster",
    label: "Adorable Disaster",
    min: 0,
    max: 39,
    emoji: "🌪️💕",
    tagline: "Messy, hilarious, and somehow perfect together.",
    gradient: "from-violet-500 to-fuchsia-600",
  },
  {
    id: "chaotic-lovebirds",
    label: "Chaotic Lovebirds",
    min: 40,
    max: 59,
    emoji: "🎢",
    tagline: "Unpredictable, passionate, never boring.",
    gradient: "from-orange-500 to-pink-600",
  },
  {
    id: "best-friends-in-love",
    label: "Best Friends In Love",
    min: 60,
    max: 74,
    emoji: "🤝💗",
    tagline: "Comfort, laughter, and real connection.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: "soulmates",
    label: "Soulmates",
    min: 75,
    max: 89,
    emoji: "✨",
    tagline: "Deep bond. You just get each other.",
    gradient: "from-rose-400 via-pink-500 to-purple-500",
  },
  {
    id: "power-couple",
    label: "Power Couple",
    min: 90,
    max: 100,
    emoji: "👑",
    tagline: "Main character energy. Goals.",
    gradient: "from-amber-400 via-pink-500 to-purple-600",
  },
];

export function calculateCompatibilityScore(selectedScores: number[]): number {
  const raw = selectedScores.reduce((sum, s) => sum + s, 0);
  return Math.round((raw / MAX_RAW_SCORE) * 100);
}

export function getRelationshipPersonality(
  score: number,
): RelationshipPersonality {
  const sorted = [...RELATIONSHIP_TYPES].sort((a, b) => a.min - b.min);
  return (
    sorted.find((t) => score >= t.min && score <= t.max) ?? sorted[0]
  );
}

export function validateAnswers(answerScores: number[]): boolean {
  return (
    answerScores.length === LQ_QUESTIONS.length &&
    answerScores.every((s) => s >= 1 && s <= 5)
  );
}

export function buildResultSummary(score: number) {
  const personality = getRelationshipPersonality(score);
  const characterComment = getCharacterComment(score);
  return { personality, characterComment };
}
