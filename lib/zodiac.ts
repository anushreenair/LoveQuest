const ZODIAC_SIGNS = [
  { name: "Aries", start: [3, 21], end: [4, 19], element: "Fire" },
  { name: "Taurus", start: [4, 20], end: [5, 20], element: "Earth" },
  { name: "Gemini", start: [5, 21], end: [6, 20], element: "Air" },
  { name: "Cancer", start: [6, 21], end: [7, 22], element: "Water" },
  { name: "Leo", start: [7, 23], end: [8, 22], element: "Fire" },
  { name: "Virgo", start: [8, 23], end: [9, 22], element: "Earth" },
  { name: "Libra", start: [9, 23], end: [10, 22], element: "Air" },
  { name: "Scorpio", start: [10, 23], end: [11, 21], element: "Water" },
  { name: "Sagittarius", start: [11, 22], end: [12, 21], element: "Fire" },
  { name: "Capricorn", start: [12, 22], end: [1, 19], element: "Earth" },
  { name: "Aquarius", start: [1, 20], end: [2, 18], element: "Air" },
  { name: "Pisces", start: [2, 19], end: [3, 20], element: "Water" },
] as const;

const ELEMENT_COMPATIBILITY: Record<string, Record<string, number>> = {
  Fire: { Fire: 85, Earth: 60, Air: 90, Water: 55 },
  Earth: { Fire: 60, Earth: 80, Air: 55, Water: 85 },
  Air: { Fire: 90, Earth: 55, Air: 75, Water: 65 },
  Water: { Fire: 55, Earth: 85, Air: 65, Water: 88 },
};

export { QUEST_MCQ, LOVE_QUESTIONS } from "./quest-questions";

function getZodiacSign(date: Date): (typeof ZODIAC_SIGNS)[number] {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const sign of ZODIAC_SIGNS) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;

    if (startMonth === endMonth) {
      if (month === startMonth && day >= startDay && day <= endDay) return sign;
    } else if (startMonth > endMonth) {
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay)
      ) {
        return sign;
      }
    } else {
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay) ||
        (month > startMonth && month < endMonth)
      ) {
        return sign;
      }
    }
  }

  return ZODIAC_SIGNS[0];
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function calculateCompatibility(
  userBirthdate: Date | null,
  partnerBirthdate: Date,
  answers: { question: string; answer: string }[]
): { score: number; zodiacReason: string } {
  const partnerSign = getZodiacSign(partnerBirthdate);
  const userSign = userBirthdate ? getZodiacSign(userBirthdate) : null;

  let baseScore = 70;

  if (userSign) {
    const elementScore =
      ELEMENT_COMPATIBILITY[userSign.element][partnerSign.element];
    baseScore = elementScore;
  }

  const answerBonus = answers.reduce((acc, { answer }) => {
    const len = answer.length;
    const sentiment = hashString(answer) % 15;
    return acc + Math.min(5, Math.floor(len / 20)) + sentiment / 5;
  }, 0);

  const score = Math.min(99, Math.round(baseScore + answerBonus));

  const zodiacReason = userSign
    ? `As a ${userSign.name} (${userSign.element}) connecting with a ${partnerSign.name} (${partnerSign.element}), your cosmic energies create a ${score >= 85 ? "powerful" : score >= 70 ? "harmonious" : "intriguing"} dynamic. ${userSign.element} and ${partnerSign.element} elements ${score >= 80 ? "naturally complement each other, creating sparks of passion and understanding." : "bring unique perspectives that can lead to deep growth together."}`
    : `Your partner is a ${partnerSign.name} (${partnerSign.element} sign) — known for ${partnerSign.element === "Fire" ? "passion and adventure" : partnerSign.element === "Earth" ? "stability and devotion" : partnerSign.element === "Air" ? "intellectual connection and communication" : "emotional depth and intuition"}. The stars suggest a ${score >= 85 ? "remarkably aligned" : "promising"} connection awaits.`;

  return { score, zodiacReason };
}

export function getZodiacEmoji(signName: string): string {
  const emojis: Record<string, string> = {
    Aries: "♈",
    Taurus: "♉",
    Gemini: "♊",
    Cancer: "♋",
    Leo: "♌",
    Virgo: "♍",
    Libra: "♎",
    Scorpio: "♏",
    Sagittarius: "♐",
    Capricorn: "♑",
    Aquarius: "♒",
    Pisces: "♓",
  };
  return emojis[signName] ?? "✨";
}

export { getZodiacSign, ZODIAC_SIGNS };
