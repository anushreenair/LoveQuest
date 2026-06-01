"use server";

import { auth } from "@/auth";
import { getProfileByAuthUserId } from "@/lib/db/profiles";
import { saveLQResult } from "@/lib/db/lq-results";
import { sendPartnerResultEmail } from "@/lib/email/send-partner-result";
import { buildResultSummary } from "@/lib/lq/scoring";
import {
  calculateCompatibilityScore,
  validateAnswers,
} from "@/lib/lq/scoring";

export type SubmitLQResult =
  | {
      success: true;
      score: number;
      personalityLabel: string;
      personalityEmoji: string;
      personalityTagline: string;
      personalityGradient: string;
      characterComment: string;
      emailSent: boolean;
      emailError?: string;
      partnerEmail: string;
    }
  | { success: false; error: string };

/**
 * Calculate compatibility, save to Neon, email partner via Resend.
 */
export async function submitLoveQuotient(
  answerScores: number[],
): Promise<SubmitLQResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in." };
  }

  if (!validateAnswers(answerScores)) {
    return {
      success: false,
      error: "Please answer all 20 questions to see your score.",
    };
  }

  const profile = await getProfileByAuthUserId(session.user.id);

  if (!profile?.partner_email) {
    return {
      success: false,
      error: "Complete onboarding first so we know your partner's email.",
    };
  }

  const score = calculateCompatibilityScore(answerScores);
  const { personality, characterComment } = buildResultSummary(score);

  const emailResult = await sendPartnerResultEmail({
    userName: profile.name,
    partnerName: profile.partner_name,
    partnerEmail: profile.partner_email,
    score,
    personalityLabel: personality.label,
    personalityEmoji: personality.emoji,
    characterComment,
  });

  try {
    await saveLQResult({
      authUserId: session.user.id,
      score,
      tierId: personality.id,
      tierLabel: personality.label,
      catId: "lumi",
      catVerdict: characterComment,
      answerScores,
      emailSent: emailResult.sent,
    });
  } catch (err) {
    console.error("saveLQResult:", err);
    return {
      success: false,
      error: "Could not save your results. Check your database connection.",
    };
  }

  return {
    success: true,
    score,
    personalityLabel: personality.label,
    personalityEmoji: personality.emoji,
    personalityTagline: personality.tagline,
    personalityGradient: personality.gradient,
    characterComment,
    emailSent: emailResult.sent,
    emailError: emailResult.error,
    partnerEmail: profile.partner_email,
  };
}

/**
 * Resend compatibility results to partner (e.g. if first send failed).
 */
export async function resendPartnerEmail(
  score: number,
  personalityLabel: string,
  personalityEmoji: string,
  characterComment: string,
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in." };
  }

  const profile = await getProfileByAuthUserId(session.user.id);
  if (!profile?.partner_email) {
    return { success: false, error: "Partner email not found." };
  }

  const result = await sendPartnerResultEmail({
    userName: profile.name,
    partnerName: profile.partner_name,
    partnerEmail: profile.partner_email,
    score,
    personalityLabel,
    personalityEmoji,
    characterComment,
  });

  return result.sent
    ? { success: true }
    : { success: false, error: result.error };
}
