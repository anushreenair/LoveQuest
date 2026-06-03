import {
  buildLQResultEmailHtml,
  buildLQResultEmailText,
} from "@/lib/email/lq-result-template";
import {
  hasEnvGmailSend,
  sendViaEnvGmail,
} from "@/lib/email/gmail-env";
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

type MailDelivery = (opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) => Promise<void>;

function partnerContent(payload: QuizEmailPayload) {
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

  return {
    subject: `${payload.userName} completed LoveQuest for you ❤️`,
    html,
    text,
  };
}

async function sendPartnerMessage(
  payload: QuizEmailPayload,
  delivery: MailDelivery,
): Promise<void> {
  const { subject, html, text } = partnerContent(payload);
  await delivery({ to: payload.partnerEmail, subject, html, text });
}

async function sendUserMessage(
  payload: QuizEmailPayload,
  delivery: MailDelivery,
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

/** When partner send fails, email user the partner version to forward manually. */
async function sendPartnerForwardToUser(
  payload: QuizEmailPayload,
  delivery: MailDelivery,
): Promise<void> {
  const { html, text } = partnerContent(payload);
  await delivery({
    to: payload.userEmail,
    subject: `Forward to ${payload.partnerName}: LoveQuest results ❤️`,
    html: `<p>We couldn't auto-send to <strong>${payload.partnerEmail}</strong>. Forward this email to them:</p>${html}`,
    text: `Forward to ${payload.partnerName} (${payload.partnerEmail}):\n\n${text}`,
  });
}

async function tryDelivery(
  payload: QuizEmailPayload,
  delivery: MailDelivery,
): Promise<QuizEmailResult> {
  let partnerSent = false;
  let userSent = false;
  let lastError: string | undefined;

  try {
    await sendPartnerMessage(payload, delivery);
    partnerSent = true;
  } catch (err) {
    console.error("Partner email failed:", err);
    lastError =
      err instanceof Error ? err.message : "Could not email your partner.";
  }

  if (payload.userEmail) {
    try {
      await sendUserMessage(payload, delivery);
      userSent = true;
    } catch (err) {
      console.error("User email failed:", err);
    }
  }

  if (!partnerSent && payload.userEmail) {
    try {
      await sendPartnerForwardToUser(payload, delivery);
    } catch (err) {
      console.error("Forward-to-user email failed:", err);
    }
  }

  if (partnerSent) {
    return { sent: true, partnerSent: true, userSent };
  }

  return {
    sent: false,
    partnerSent: false,
    userSent,
    error:
      lastError ??
      `Could not email ${payload.partnerEmail}. Use the share link below.`,
  };
}

/**
 * Sends results to partner + player.
 * Priority: Gmail env token → SMTP → Resend (limited in test mode).
 */
export async function sendQuizResultEmails(
  payload: QuizEmailPayload,
): Promise<QuizEmailResult> {
  if (hasEnvGmailSend()) {
    const result = await tryDelivery(payload, sendViaEnvGmail);
    if (result.partnerSent) return result;
  }

  if (isSmtpConfigured()) {
    const result = await tryDelivery(payload, sendMail);
    if (result.partnerSent) return result;
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
    error:
      "Email not configured. Run: npm run gmail:send-setup (then add token to Vercel).",
  };
}
