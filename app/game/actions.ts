"use server";

import { auth } from "@/auth";
import { getGoogleMailTokensFromSession } from "@/lib/auth/google-mail-tokens";
import {
  ensureLatestShareToken,
  saveLQResult,
  updateLQResultEmailSent,
} from "@/lib/db/lq-results";
import { getProfileByAuthUserId } from "@/lib/db/profiles";
import { sendQuizResultEmails } from "@/lib/email/send-results-emails";
import { buildResultSummary } from "@/lib/lq/scoring";
import {
  calculateCompatibilityScore,
  validateAnswers,
} from "@/lib/lq/scoring";
import { buildShareUrl } from "@/lib/share-url";

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
      userEmailSent: boolean;
      emailError?: string;
      partnerEmail: string;
      shareUrl: string;
    }
  | { success: false; error: string };

/**
 * Calculate compatibility, save to Neon, email partner + user via Gmail SMTP.
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

  let saved;
  try {
    saved = await saveLQResult({
      authUserId: session.user.id,
      score,
      tierId: personality.id,
      tierLabel: personality.label,
      catId: "lumi",
      catVerdict: characterComment,
      answerScores,
      emailSent: false,
    });
  } catch (err) {
    console.error("saveLQResult:", err);
    return {
      success: false,
      error: "Could not save your results. Check your database connection.",
    };
  }

  const shareUrl = buildShareUrl(saved.share_token!);

  const emailResult = await sendQuizResultEmails(
    {
      userName: profile.name,
      userEmail: profile.email,
      partnerName: profile.partner_name,
      partnerEmail: profile.partner_email,
      score,
      personalityLabel: personality.label,
      personalityEmoji: personality.emoji,
      characterComment,
      shareUrl,
    },
    getGoogleMailTokensFromSession(session),
  );

  try {
    await updateLQResultEmailSent(saved.id, emailResult.sent);
  } catch (err) {
    console.error("updateLQResultEmailSent:", err);
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
    userEmailSent: emailResult.userSent,
    emailError: emailResult.error,
    partnerEmail: profile.partner_email,
    shareUrl,
  };
}

/**
 * Resend compatibility results (partner + your copy).
 */
export async function resendPartnerEmail(
  score: number,
  personalityLabel: string,
  personalityEmoji: string,
  characterComment: string,
): Promise<{
  success: boolean;
  error?: string;
  shareUrl?: string;
  userEmailSent?: boolean;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in." };
  }

  const profile = await getProfileByAuthUserId(session.user.id);
  if (!profile?.partner_email) {
    return { success: false, error: "Partner email not found." };
  }

  const shareToken = await ensureLatestShareToken(session.user.id);
  const shareUrl = shareToken ? buildShareUrl(shareToken) : undefined;

  const result = await sendQuizResultEmails(
    {
      userName: profile.name,
      userEmail: profile.email,
      partnerName: profile.partner_name,
      partnerEmail: profile.partner_email,
      score,
      personalityLabel,
      personalityEmoji,
      characterComment,
      shareUrl,
    },
    getGoogleMailTokensFromSession(session),
  );

  return result.sent
    ? { success: true, shareUrl, userEmailSent: result.userSent }
    : { success: false, error: result.error, shareUrl };
}

/** Share link for the most recent quiz. */
export async function getLatestShareUrl(): Promise<string | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const token = await ensureLatestShareToken(session.user.id);
  return token ? buildShareUrl(token) : null;
}
