import {
  buildLQResultEmailHtml,
  buildLQResultEmailText,
} from "@/lib/email/lq-result-template";
import {
  buildUserSummaryHtml,
  buildUserSummaryText,
} from "@/lib/email/user-summary-template";
import type { QuizEmailPayload } from "@/lib/email/send-results-emails";

async function resendSend(
  to: string,
  subject: string,
  html: string,
  text: string,
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "Resend not configured" };

  const from =
    process.env.RESEND_FROM_EMAIL ?? "LoveQuest <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html, text }),
  });

  const body = (await res.json()) as { message?: string };

  if (!res.ok) {
    return { ok: false, error: body.message ?? "Resend error" };
  }

  return { ok: true };
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/** Resend test mode only delivers to the account owner email. */
export async function sendViaResendFallback(
  payload: QuizEmailPayload,
): Promise<{
  partnerSent: boolean;
  userSent: boolean;
  error?: string;
}> {
  const partnerHtml = buildLQResultEmailHtml({
    userName: payload.userName,
    partnerName: payload.partnerName,
    score: payload.score,
    personalityLabel: payload.personalityLabel,
    personalityEmoji: payload.personalityEmoji,
    characterComment: payload.characterComment,
    shareUrl: payload.shareUrl,
  });

  const partnerText = buildLQResultEmailText({
    userName: payload.userName,
    partnerName: payload.partnerName,
    score: payload.score,
    personalityLabel: payload.personalityLabel,
    personalityEmoji: payload.personalityEmoji,
    characterComment: payload.characterComment,
    shareUrl: payload.shareUrl,
  });

  let partnerSent = false;
  let userSent = false;

  const partnerResult = await resendSend(
    payload.partnerEmail,
    `${payload.userName} completed LoveQuest for you ❤️`,
    partnerHtml,
    partnerText,
  );
  partnerSent = partnerResult.ok;

  const userResult = await resendSend(
    payload.userEmail,
    `Your LoveQuest results — ${payload.score}/100 ${payload.personalityEmoji}`,
    buildUserSummaryHtml({
      userName: payload.userName,
      partnerName: payload.partnerName,
      partnerEmail: payload.partnerEmail,
      score: payload.score,
      personalityLabel: payload.personalityLabel,
      personalityEmoji: payload.personalityEmoji,
      characterComment: payload.characterComment,
      shareUrl: payload.shareUrl,
    }),
    buildUserSummaryText({
      userName: payload.userName,
      partnerName: payload.partnerName,
      partnerEmail: payload.partnerEmail,
      score: payload.score,
      personalityLabel: payload.personalityLabel,
      personalityEmoji: payload.personalityEmoji,
      characterComment: payload.characterComment,
      shareUrl: payload.shareUrl,
    }),
  );
  userSent = userResult.ok;

  return {
    partnerSent,
    userSent,
    error:
      !partnerSent && !userSent
        ? (partnerResult.error ??
          "Email blocked. Sign out, sign in again (Gmail), or use the share link.")
        : !partnerSent
          ? `Could not email ${payload.partnerEmail}. Share the link below — or sign out and sign in again to send from Gmail.`
          : undefined,
  };
}
