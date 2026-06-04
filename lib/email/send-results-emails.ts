import {
  buildLQResultEmailHtml,
  buildLQResultEmailText,
} from "@/lib/email/lq-result-template";
import { sendViaBrevo, isBrevoConfigured } from "@/lib/email/brevo";
import {
  hasGoogleMailTokens,
  sendViaGmailOAuth,
  type GoogleMailTokens,
} from "@/lib/email/gmail-oauth";
import {
  isGmailServiceConfigured,
  sendViaGmailService,
} from "@/lib/email/gmail-service";
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

type MailSender = (opts: {
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
    html,
    text,
    subject: `${payload.userName} completed LoveQuest for you ❤️`,
  };
}

function userContent(payload: QuizEmailPayload) {
  return {
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
    subject: `Your LoveQuest results — ${payload.score}/100 ${payload.personalityEmoji}`,
  };
}

async function sendPartnerMessage(
  payload: QuizEmailPayload,
  send: MailSender,
): Promise<void> {
  const { html, text, subject } = partnerContent(payload);
  await send({ to: payload.partnerEmail, subject, html, text });
}

async function sendUserMessage(
  payload: QuizEmailPayload,
  send: MailSender,
): Promise<void> {
  const { html, text, subject } = userContent(payload);
  await send({ to: payload.userEmail, subject, html, text });
}

async function trySendBoth(
  payload: QuizEmailPayload,
  send: MailSender,
): Promise<QuizEmailResult> {
  let partnerSent = false;
  let userSent = false;
  let lastError: string | undefined;

  try {
    await sendPartnerMessage(payload, send);
    partnerSent = true;
  } catch (err) {
    console.error("Partner email failed:", err);
    lastError =
      err instanceof Error ? err.message : "Could not email your partner.";
  }

  if (payload.userEmail) {
    try {
      await sendUserMessage(payload, send);
      userSent = true;
    } catch (err) {
      console.error("User email failed:", err);
    }
  }

  return { sent: partnerSent, partnerSent, userSent, error: lastError };
}

/**
 * Sends results to partner + player.
 * Priority: SMTP → Gmail service token → Brevo → session Gmail → Resend.
 */
export async function sendQuizResultEmails(
  payload: QuizEmailPayload,
  googleTokens?: GoogleMailTokens,
): Promise<QuizEmailResult> {
  const senders: MailSender[] = [];

  if (isSmtpConfigured()) senders.push(sendMail);
  if (isGmailServiceConfigured()) senders.push(sendViaGmailService);
  if (isBrevoConfigured()) senders.push(sendViaBrevo);

  if (hasGoogleMailTokens(googleTokens)) {
    senders.push((opts) => sendViaGmailOAuth(googleTokens!, opts));
  }

  for (const send of senders) {
    const result = await trySendBoth(payload, send);
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
      "Partner email is not configured yet. Run: npm run email:setup -- your@gmail.com your-app-password",
  };
}
