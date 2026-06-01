export type QuestionType =
  | "scenario"
  | "image-grid"
  | "icon-cards";

export interface QuestionOption {
  label: string;
  score: number;
  emoji?: string;
  imageUrl?: string;
  gradient?: string;
  /** Shown if the image fails to load */
  imageFallbackEmoji?: string;
}

export interface LQQuestion {
  id: number;
  type: QuestionType;
  category: string;
  prompt: string;
  options: QuestionOption[];
}

/** Unsplash images — w=800 for sharper cards; emoji fallback if load fails */
const IMG = {
  beach:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  mountain:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
  cafe:
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
  movie:
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
  paris:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
  bali:
    "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80",
  japan:
    "https://images.unsplash.com/photo-1493976040374-85c8e545a06e?auto=format&fit=crop&w=800&q=80",
  roadtrip:
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
  cozy:
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
  modern:
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
  plants:
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
  adventure:
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
};

export const LQ_QUESTIONS: LQQuestion[] = [
  {
    id: 1,
    type: "scenario",
    category: "Scenario",
    prompt: "If your partner is upset, what do you usually do?",
    options: [
      { label: "Give them space to cool down", score: 3, emoji: "🌙" },
      { label: "Talk it through right away", score: 4, emoji: "💬" },
      { label: "Show up with their favorite food", score: 5, emoji: "🍕" },
      { label: "Send memes until they smile", score: 4, emoji: "😂" },
    ],
  },
  {
    id: 2,
    type: "image-grid",
    category: "Date Vibe",
    prompt: "What kind of date feels most like your relationship?",
    options: [
      {
        label: "Beach sunset",
        score: 4,
        imageUrl: IMG.beach,
        imageFallbackEmoji: "🏖️",
        gradient: "from-sky-400 to-blue-600",
      },
      {
        label: "Mountain escape",
        score: 4,
        imageUrl: IMG.mountain,
        imageFallbackEmoji: "⛰️",
        gradient: "from-emerald-500 to-teal-700",
      },
      {
        label: "Cozy café date",
        score: 5,
        imageUrl: IMG.cafe,
        imageFallbackEmoji: "☕",
        gradient: "from-amber-600 to-orange-800",
      },
      {
        label: "Movie night in",
        score: 5,
        imageUrl: IMG.movie,
        imageFallbackEmoji: "🎬",
        gradient: "from-indigo-600 to-purple-900",
      },
    ],
  },
  {
    id: 3,
    type: "icon-cards",
    category: "Food",
    prompt: "What would your partner probably choose right now?",
    options: [
      { label: "Pizza", score: 3, emoji: "🍕", gradient: "from-red-500 to-orange-600" },
      { label: "Pasta", score: 4, emoji: "🍝", gradient: "from-amber-500 to-yellow-600" },
      { label: "Burger", score: 3, emoji: "🍔", gradient: "from-orange-600 to-red-700" },
      { label: "Sushi", score: 4, emoji: "🍣", gradient: "from-rose-400 to-pink-600" },
    ],
  },
  {
    id: 4,
    type: "scenario",
    category: "Chaos",
    prompt: "You accidentally lose your partner's favorite hoodie. What happens?",
    options: [
      { label: "Apologize immediately", score: 4, emoji: "🙏" },
      { label: "Replace it with something better", score: 5, emoji: "🎁" },
      { label: "Hide forever and hope they forget", score: 1, emoji: "🫣" },
      { label: "Pretend it never existed", score: 1, emoji: "😇" },
    ],
  },
  {
    id: 5,
    type: "image-grid",
    category: "Dream",
    prompt: "Which vacation sounds most like you both?",
    options: [
      {
        label: "Paris",
        score: 5,
        imageUrl: IMG.paris,
        imageFallbackEmoji: "🗼",
        gradient: "from-pink-400 to-rose-600",
      },
      {
        label: "Bali",
        score: 4,
        imageUrl: IMG.bali,
        imageFallbackEmoji: "🏝️",
        gradient: "from-teal-400 to-emerald-600",
      },
      {
        label: "Japan",
        score: 5,
        imageUrl: IMG.japan,
        imageFallbackEmoji: "🗾",
        gradient: "from-red-400 to-rose-700",
      },
      {
        label: "Road trip",
        score: 4,
        imageUrl: IMG.roadtrip,
        imageFallbackEmoji: "🚗",
        gradient: "from-amber-500 to-orange-600",
      },
    ],
  },
  {
    id: 6,
    type: "scenario",
    category: "Couple Habits",
    prompt: "Who usually texts first?",
    options: [
      { label: "Me", score: 3, emoji: "📱" },
      { label: "My partner", score: 3, emoji: "💌" },
      { label: "Both equally", score: 5, emoji: "⚖️" },
      { label: "Depends on the day", score: 4, emoji: "🎲" },
    ],
  },
  {
    id: 7,
    type: "icon-cards",
    category: "Movie Night",
    prompt: "What movie night best describes you both?",
    options: [
      { label: "Action", score: 3, emoji: "💥", gradient: "from-red-600 to-orange-700" },
      { label: "Romance", score: 5, emoji: "💕", gradient: "from-pink-500 to-rose-600" },
      { label: "Comedy", score: 4, emoji: "😂", gradient: "from-yellow-500 to-amber-600" },
      { label: "Horror", score: 3, emoji: "👻", gradient: "from-slate-700 to-purple-900" },
    ],
  },
  {
    id: 8,
    type: "scenario",
    category: "Scenario",
    prompt: "You want to surprise them on a random Tuesday. You…",
    options: [
      { label: "Plan a whole surprise date", score: 5, emoji: "✨" },
      { label: "Send a sweet voice note", score: 4, emoji: "🎙️" },
      { label: "Order delivery to their door", score: 4, emoji: "📦" },
      { label: "Wait for a special occasion", score: 2, emoji: "📅" },
    ],
  },
  {
    id: 9,
    type: "icon-cards",
    category: "Pets",
    prompt: "If you adopted a pet together, what would it be?",
    options: [
      { label: "Dog", score: 5, emoji: "🐕", gradient: "from-amber-500 to-orange-500" },
      { label: "Cat", score: 4, emoji: "🐈", gradient: "from-violet-500 to-purple-600" },
      { label: "Rabbit", score: 4, emoji: "🐇", gradient: "from-pink-400 to-rose-500" },
      { label: "Hamster", score: 3, emoji: "🐹", gradient: "from-yellow-400 to-amber-500" },
    ],
  },
  {
    id: 10,
    type: "scenario",
    category: "Chaos",
    prompt: "You call your partner the wrong name once. Your survival plan?",
    options: [
      { label: "Own it and apologize", score: 4, emoji: "😅" },
      { label: "Make a joke out of it", score: 3, emoji: "🤡" },
      { label: "Distract with food", score: 4, emoji: "🧁" },
      { label: "Move to a new city", score: 1, emoji: "✈️" },
    ],
  },
  {
    id: 11,
    type: "image-grid",
    category: "Lifestyle",
    prompt: "Your dream shared space looks like…",
    options: [
      { label: "Cozy & candlelit", score: 5, imageUrl: IMG.cozy, gradient: "from-amber-700 to-rose-900" },
      { label: "Modern & minimal", score: 4, imageUrl: IMG.modern, gradient: "from-slate-400 to-zinc-700" },
      { label: "Plants everywhere", score: 5, imageUrl: IMG.plants, gradient: "from-green-500 to-emerald-800" },
      { label: "Adventure basecamp", score: 4, imageUrl: IMG.adventure, gradient: "from-orange-500 to-red-700" },
    ],
  },
  {
    id: 12,
    type: "scenario",
    category: "Fun Choice",
    prompt: "Friends invite you out but you planned a cozy night in together. You…",
    options: [
      { label: "Cancel plans — date night wins", score: 5, emoji: "🏠" },
      { label: "Go out but leave early", score: 3, emoji: "⏰" },
      { label: "Bring your partner to the party", score: 4, emoji: "🎉" },
      { label: "Go solo and catch up later", score: 2, emoji: "🚶" },
    ],
  },
  {
    id: 13,
    type: "icon-cards",
    category: "Food",
    prompt: "Cooking together usually turns into…",
    options: [
      { label: "A cute team effort", score: 5, emoji: "👨‍🍳", gradient: "from-pink-500 to-rose-600" },
      { label: "One person cooks, one tastes", score: 4, emoji: "🥄", gradient: "from-amber-500 to-orange-600" },
      { label: "Ordering takeout instead", score: 3, emoji: "📱", gradient: "from-red-500 to-pink-600" },
      { label: "Kitchen chaos & laughter", score: 4, emoji: "🔥", gradient: "from-orange-500 to-red-600" },
    ],
  },
  {
    id: 14,
    type: "scenario",
    category: "Couple Habits",
    prompt: "After a small disagreement, you usually…",
    options: [
      { label: "Talk it out same day", score: 5, emoji: "🤝" },
      { label: "Need a little space first", score: 3, emoji: "🌿" },
      { label: "Send a peace-offering text", score: 4, emoji: "☮️" },
      { label: "Act like nothing happened", score: 2, emoji: "🙃" },
    ],
  },
  {
    id: 15,
    type: "image-grid",
    category: "Dream",
    prompt: "Your perfect Sunday morning together is…",
    options: [
      { label: "Brunch date", score: 5, imageUrl: IMG.cafe, gradient: "from-amber-500 to-orange-700" },
      { label: "Sleep in & cuddle", score: 5, imageUrl: IMG.cozy, gradient: "from-purple-500 to-pink-700" },
      { label: "Outdoor adventure", score: 4, imageUrl: IMG.mountain, gradient: "from-green-500 to-teal-700" },
      { label: "Separate hobbies, same couch", score: 4, imageUrl: IMG.movie, gradient: "from-indigo-500 to-violet-800" },
    ],
  },
  {
    id: 16,
    type: "scenario",
    category: "Personality",
    prompt: "Your partner is in their feelings. Your move?",
    options: [
      { label: "Listen without fixing", score: 5, emoji: "👂" },
      { label: "Cheer them up with plans", score: 4, emoji: "🎈" },
      { label: "Give physical comfort", score: 5, emoji: "🤗" },
      { label: "Give space until they're ready", score: 3, emoji: "🕊️" },
    ],
  },
  {
    id: 17,
    type: "icon-cards",
    category: "Lifestyle",
    prompt: "Your gift-giving style as a couple is…",
    options: [
      { label: "Thoughtful surprises", score: 5, emoji: "🎁", gradient: "from-pink-500 to-purple-600" },
      { label: "Inside-joke gifts", score: 5, emoji: "😜", gradient: "from-yellow-500 to-orange-500" },
      { label: "Practical things they need", score: 4, emoji: "🛍️", gradient: "from-blue-500 to-indigo-600" },
      { label: "We're still figuring it out", score: 2, emoji: "🤷", gradient: "from-slate-500 to-gray-600" },
    ],
  },
  {
    id: 18,
    type: "scenario",
    category: "Chaos",
    prompt: "Your phone dies mid-date. You…",
    options: [
      { label: "Laugh it off — be present", score: 5, emoji: "😄" },
      { label: "Borrow theirs for photos", score: 3, emoji: "📸" },
      { label: "Panic and find a charger", score: 2, emoji: "🔌" },
      { label: "Turn it into a game", score: 4, emoji: "🎲" },
    ],
  },
  {
    id: 19,
    type: "scenario",
    category: "Guessing Game",
    prompt: "Your partner's love language in action is probably…",
    options: [
      { label: "Words of affirmation", score: 4, emoji: "💬" },
      { label: "Quality time", score: 5, emoji: "⏳" },
      { label: "Acts of service", score: 5, emoji: "🫶" },
      { label: "Physical touch", score: 5, emoji: "✨" },
    ],
  },
  {
    id: 20,
    type: "scenario",
    category: "Bond",
    prompt: "Right now, how does your connection feel?",
    options: [
      { label: "Still discovering each other", score: 3, emoji: "🌱" },
      { label: "Growing stronger every day", score: 4, emoji: "📈" },
      { label: "Deeply connected", score: 5, emoji: "💞" },
      { label: "They're my person — no doubt", score: 5, emoji: "🔥" },
    ],
  },
];

export const MAX_RAW_SCORE = LQ_QUESTIONS.length * 5;
