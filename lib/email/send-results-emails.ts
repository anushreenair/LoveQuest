import {
  buildLQResultEmailHtml,
  buildLQResultEmailText,
} from "@/lib/email/lq-result-template";
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
  /** True when the partner email was sent successfully. */
  sent: boolean;
  partnerSent: boolean;
  userSent: boolean;
  error?: string;
}

/**
 * Sends results to the partner and a confirmation copy to the player.
 * Uses Gmail SMTP (free) — no custom domain required.
 */
export async function sendQuizResultEmails(
  payload: QuizEmailPayload,
): Promise<QuizEmailResult> {
  if (!isSmtpConfigured()) {
    return {
      sent: false,
      partnerSent: false,
      userSent: false,
      error:
        "Email is not set up yet. Run npm run email:setup (free Gmail — takes 2 minutes).",
    };
  }

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
  let lastError: string | undefined;

  try {
    await sendMail({
      to: payload.partnerEmail,
      subject: `${payload.userName} completed LoveQuest for you ❤️`,
      html: partnerHtml,
      text: partnerText,
    });
    partnerSent = true;
  } catch (err) {
    console.error("Partner email failed:", err);
    lastError =
      err instanceof Error ? err.message : "Could not email your partner.";
  }

  if (payload.userEmail) {
    try {
      await sendMail({
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
      userSent = true;
    } catch (err) {
      console.error("User summary email failed:", err);
      if (!partnerSent) {
        lastError =
          err instanceof Error ? err.message : "Could not send email.";
      }
    }
  }

  if (partnerSent) {
    return { sent: true, partnerSent, userSent };
  }

  return {
    sent: false,
    partnerSent: false,
    userSent,
    error:
      lastError ??
      "Partner email failed. Use the share link below or check Gmail app password.",
  };
}
