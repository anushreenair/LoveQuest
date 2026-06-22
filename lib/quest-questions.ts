export type McqQuestion = {
  question: string;
  options: [string, string, string, string];
};

export const QUEST_MCQ: McqQuestion[] = [
  {
    question: "What's their ideal first date?",
    options: [
      "Coffee and a long walk",
      "Fancy dinner somewhere new",
      "Cozy movie night in",
      "Spontaneous adventure",
    ],
  },
  {
    question: "How do they show love?",
    options: [
      "Thoughtful words & compliments",
      "Quality time together",
      "Little gifts & surprises",
      "Acts of service",
    ],
  },
  {
    question: "What's their love language?",
    options: [
      "Words of affirmation",
      "Physical touch",
      "Quality time",
      "Receiving gifts",
    ],
  },
  {
    question: "Where do they see themselves in 5 years?",
    options: [
      "Building a dream career",
      "Traveling the world",
      "Settled with family",
      "Still figuring it out",
    ],
  },
  {
    question: "Their biggest relationship dealbreaker?",
    options: [
      "Dishonesty",
      "Lack of communication",
      "No ambition",
      "Incompatible lifestyles",
    ],
  },
  {
    question: "How important is spontaneity?",
    options: [
      "Essential — keep it exciting!",
      "Nice sometimes",
      "Prefer planning ahead",
      "Not important at all",
    ],
  },
  {
    question: "Their perfect weekend together?",
    options: [
      "Exploring a new city",
      "Relaxing at home",
      "Outdoor adventure",
      "Parties & social events",
    ],
  },
  {
    question: "How do they handle conflict?",
    options: [
      "Talk it out calmly",
      "Need space first, then discuss",
      "Avoid it if possible",
      "Get passionate, then makeup",
    ],
  },
];

export const LOVE_QUESTIONS = QUEST_MCQ.map((q) => q.question);
