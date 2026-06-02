import {
  buildLQResultEmailHtml,
  buildLQResultEmailText,
} from "@/lib/email/lq-result-template";
import {
  hasGoogleMailTokens,
  sendViaGmailOAuth,
  type GoogleMailTokens,
} from "@/lib/email/gmail-oauth";
import { isResendConfigured, sendViaResendFallback } from "@/lib/email/resend-fallback";
import { isSmtpConfigured, sendMail } from "@/lib/email/smtp";
import {
  buildUserSummaryHtml,
  buildUserSummaryText,
} from "@/lib/email/user-summary-template";

export interface QuizEmailPayload {
  userName: string;
  userEmail: string;
  partnerName: string;
  partnerEmail: string;
  score: number;
  personalityLabel: string;
  personalityEmoji: string;
  characterComment: string;
  shareUrl?: string;
}

export interface QuizEmailResult {
  sent: boolean;
  partnerSent: boolean;
  userSent: boolean;
  error?: string;
}

async function sendPartnerMessage(
  payload: QuizEmailPayload,
  googleTokens: GoogleMailTokens | undefined,
  delivery: (opts: {
    to: string;
    subject: string;
    html: string;
    text: string;
  }) => Promise<void>,
): Promise<void> {
  const html = buildLQResultEmailHtml({
    userName: payload.userName,
    partnerName: payload.partnerName,
    score: payload.score,
    personalityLabel: payload.personalityLabel,
    personalityEmoji: payload.personalityEmoji,
    characterComment: payload.characterComment,
    shareUrl: payload.shareUrl,
  });

  const text = buildLQResultEmailText({
    userName: payload.userName,
    partnerName: payload.partnerName,
    score: payload.score,
    personalityLabel: payload.personalityLabel,
    personalityEmoji: payload.personalityEmoji,
    characterComment: payload.characterComment,
    shareUrl: payload.shareUrl,
  });

  await delivery({
    to: payload.partnerEmail,
    subject: `${payload.userName} completed LoveQuest for you ❤️`,
    html,
    text,
  });
}

async function sendUserMessage(
  payload: QuizEmailPayload,
  delivery: (opts: {
    to: string;
    subject: string;
    html: string;
    text: string;
  }) => Promise<void>,
): Promise<void> {
  await delivery({
    to: payload.userEmail,
    subject: `Your LoveQuest results — ${payload.score}/100 ${payload.personalityEmoji}`,
    html: buildUserSummaryHtml({
      userName: payload.userName,
      partnerName: payload.partnerName,
      partnerEmail: payload.partnerEmail,
      score: payload.score,
      personalityLabel: payload.personalityLabel,
      personalityEmoji: payload.personalityEmoji,
      characterComment: payload.characterComment,
      shareUrl: payload.shareUrl,
    }),
    text: buildUserSummaryText({
      userName: payload.userName,
      partnerName: payload.partnerName,
      partnerEmail: payload.partnerEmail,
      score: payload.score,
      personalityLabel: payload.personalityLabel,
      personalityEmoji: payload.personalityEmoji,
      characterComment: payload.characterComment,
      shareUrl: payload.shareUrl,
    }),
  });
}

/**
 * Sends results to partner + player.
 * Priority: Gmail (Google sign-in) → SMTP app password → Resend fallback.
 */
export async function sendQuizResultEmails(
  payload: QuizEmailPayload,
  googleTokens?: GoogleMailTokens,
): Promise<QuizEmailResult> {
  const partnerPayload = payload;

  if (hasGoogleMailTokens(googleTokens)) {
    try {
      await sendPartnerMessage(partnerPayload, googleTokens, (opts) =>
        sendViaGmailOAuth(googleTokens!, opts),
      );
      let userSent = false;
      if (payload.userEmail) {
        try {
          await sendUserMessage(payload, (opts) =>
            sendViaGmailOAuth(googleTokens!, opts),
          );
          userSent = true;
        } catch (err) {
          console.error("User Gmail send failed:", err);
        }
      }
      return { sent: true, partnerSent: true, userSent };
    } catch (err) {
      console.error("Gmail OAuth send failed:", err);
    }
  }

  if (isSmtpConfigured()) {
    let partnerSent = false;
    let userSent = false;
    let lastError: string | undefined;

    try {
      await sendPartnerMessage(partnerPayload, googleTokens, sendMail);
      partnerSent = true;
    } catch (err) {
      console.error("Partner SMTP failed:", err);
      lastError =
        err instanceof Error ? err.message : "Could not email your partner.";
    }

    if (payload.userEmail) {
      try {
        await sendUserMessage(payload, sendMail);
        userSent = true;
      } catch (err) {
        console.error("User SMTP failed:", err);
      }
    }

    if (partnerSent) {
      return { sent: true, partnerSent, userSent };
    }

    if (isResendConfigured()) {
      const resend = await sendViaResendFallback(payload);
      return {
        sent: resend.partnerSent,
        partnerSent: resend.partnerSent,
        userSent: resend.userSent || userSent,
        error: resend.error ?? lastError,
      };
    }

    return {
      sent: false,
      partnerSent: false,
      userSent,
      error: lastError,
    };
  }

  if (isResendConfigured()) {
    const resend = await sendViaResendFallback(payload);
    return {
      sent: resend.partnerSent,
      partnerSent: resend.partnerSent,
      userSent: resend.userSent,
      error: resend.error,
    };
  }

  return {
    sent: false,
    partnerSent: false,
    userSent: false,
    error: hasGoogleMailTokens(googleTokens)
      ? "Gmail send failed. Enable Gmail API in Google Cloud, then sign out and sign in again."
      : "Sign out and sign in again (allow Gmail), or run npm run email:setup for Gmail SMTP.",
  };
}
