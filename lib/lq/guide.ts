/** Original guide character — Lumi (not based on any copyrighted mascot). */

export const GUIDE_NAME = "Lumi";

export const INTRO_SCRIPT = [
  "Hiiii! I'm Lumi, your LoveQuest guide!",
  "You will answer fun questions about your relationship.",
  "Try to score as high as possible!",
  "At the end, you'll receive your Couple Compatibility Score out of 100.",
  "Ready? Let's make some magic together!",
] as const;

export const QUESTION_INTROS: string[] = [
  "Okay okay — picture this scenario…",
  "Ooh, this one's about your vibe as a couple!",
  "Quick! Use your partner instincts!",
  "Hypothetically… chaos has entered the chat.",
  "If you two were a movie, which scene is this?",
  "Food thoughts! What would they pick?",
  "Dream mode activated!",
  "Couple habits check — be honest!",
  "Pet adoption energy! What fits you two?",
  "Disaster scenario incoming… how do you survive?",
  "Pick the image that screams 'us'!",
  "Weekend warrior question!",
  "Kitchen chaos or culinary romance?",
  "Who does what in this relationship?",
  "Sunday morning mood board!",
  "Your partner is in their feelings. Go!",
  "Gift-giving style — choose wisely!",
  "Tech tragedy on date night. React!",
  "Last stretch — this one's about your bond!",
  "Final question! Give it everything!",
];

export const REACTION_LINES: string[] = [
  "Noted! Interesting choice…",
  "Ooh, I felt that one!",
  "Your partner is lucky, honestly.",
  "Bold! I respect the energy.",
  "Okay okay, moving on!",
  "Love that for you!",
  "The compatibility algorithm is purring.",
  "Iconic behavior.",
];

export function getGuideLineForQuestion(index: number): string {
  return QUESTION_INTROS[index % QUESTION_INTROS.length];
}

export function getReactionLine(seed: number): string {
  return REACTION_LINES[seed % REACTION_LINES.length];
}

export function getCharacterComment(score: number): string {
  if (score >= 90) return "You two are ridiculously cute together. Like, annoyingly perfect.";
  if (score >= 75) return "Soulmate energy detected. I'm literally glowing.";
  if (score >= 60) return "Best friends AND in love? That's the dream combo.";
  if (score >= 40) return "Chaotic but adorable. Never a dull moment with you two!";
  return "Adorable disaster couple — and I mean that with love!";
}
