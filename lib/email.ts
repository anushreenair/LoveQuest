import type { ReactElement } from "react";
import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import { sendViaBrevo } from "@/lib/brevo";
import { sendViaMacMail } from "@/lib/mail-apple";
import { sendResendEmail } from "@/lib/resend";
import { APP_NAME, appFromEmail } from "@/lib/brand";

function clean(value: string | undefined) {
  if (!value) return undefined;
  const trimmed = value.trim().replace(/^["']|["']$/g, "");
  return trimmed || undefined;
}

function getGmailConfig() {
  const user = clean(process.env.GMAIL_USER);
  const pass = clean(process.env.GMAIL_APP_PASSWORD);

  if (!user || !pass) return null;
  return { user, pass };
}

function getSmtpConfig() {
  const host = clean(process.env.SMTP_HOST);
  const user = clean(process.env.SMTP_USER);
  const pass = clean(process.env.SMTP_PASS);

  if (!host || !user || !pass) return null;

  const port = Number(clean(process.env.SMTP_PORT) ?? "587");
  const secure = process.env.SMTP_SECURE === "true";
  const from =
    clean(process.env.MAIL_FROM) ??
    clean(process.env.GMAIL_SENDER) ??
    appFromEmail(user);

  return { host, port, secure, user, pass, from };
}

async function sendViaSmtp({
  host,
  port,
  secure,
  user,
  pass,
  from,
  to,
  subject,
  html,
  text,
}: {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  try {
    const transport = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    const info = await transport.sendMail({
      from,
      to,
      subject,
      html,
      text,
    });

    return { success: true as const, data: { id: info.messageId } };
  } catch (error) {
    console.error("SMTP send failed:", error);
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to send email via SMTP",
    };
  }
}

async function sendViaGmail({
  user,
  pass,
  to,
  subject,
  html,
  text,
}: {
  user: string;
  pass: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    const info = await transport.sendMail({
      from: appFromEmail(user),
      to,
      subject,
      html,
      text,
    });

    return { success: true as const, data: { id: info.messageId } };
  } catch (error) {
    console.error("Gmail send failed:", error);
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to send email via Gmail",
    };
  }
}

export type SendEmailResult =
  | {
      success: true;
      data?: { id?: string };
      deliveredTo: string;
      method: string;
      partnerDelivered: boolean;
    }
  | { success: false; error: string };

function buildPlainText({
  partnerName,
  userName,
  score,
  shareUrl,
}: {
  partnerName: string;
  userName: string;
  score: number;
  shareUrl: string;
}) {
  return `Hey ${partnerName}!

${userName} played ${APP_NAME} about you — your compatibility is ${score}%.

See your full result here:
${shareUrl}

${APP_NAME}`;
}

export async function sendEmail({
  to,
  subject,
  react,
  shareUrl,
  partnerName,
  userName,
  score,
}: {
  to: string;
  subject: string;
  react: ReactElement;
  shareUrl: string;
  partnerName: string;
  userName: string;
  score: number;
}): Promise<SendEmailResult> {
  const html = await render(react);
  const htmlWithLink = `${html}<p style="margin-top:24px;text-align:center;"><a href="${shareUrl}" style="color:#ff6b9d;font-weight:bold;font-size:16px;">View your ${APP_NAME} result →</a></p>`;
  const text = buildPlainText({ partnerName, userName, score, shareUrl });

  const attempts: Array<() => Promise<SendEmailResult | null>> = [];

  const smtp = getSmtpConfig();
  if (smtp) {
    attempts.push(async () => {
      const result = await sendViaSmtp({
        ...smtp,
        to,
        subject,
        html: htmlWithLink,
        text,
      });
      return result.success
        ? { ...result, deliveredTo: to, method: "smtp", partnerDelivered: true }
        : null;
    });
  }

  const gmail = getGmailConfig();
  if (gmail) {
    attempts.push(async () => {
      const result = await sendViaGmail({
        ...gmail,
        to,
        subject,
        html: htmlWithLink,
        text,
      });
      return result.success
        ? { ...result, deliveredTo: to, method: "gmail", partnerDelivered: true }
        : null;
    });
  }

  if (
    process.platform === "darwin" &&
    process.env.ENABLE_MAC_MAIL !== "false" &&
    !process.env.VERCEL
  ) {
    attempts.push(async () => {
      const result = await sendViaMacMail({ to, subject, text });
      return result.success
        ? { ...result, deliveredTo: to, method: "mac-mail", partnerDelivered: true }
        : null;
    });
  }

  attempts.push(async () => {
    const result = await sendViaBrevo({ to, subject, html: htmlWithLink });
    return result.success
      ? { ...result, deliveredTo: to, method: "brevo", partnerDelivered: true }
      : null;
  });

  attempts.push(async () => {
    const result = await sendResendEmail({ to, subject, html: htmlWithLink });
    return result.success
      ? { ...result, deliveredTo: to, method: "resend", partnerDelivered: true }
      : null;
  });

  let lastError = "Could not send email to your partner.";

  for (const attempt of attempts) {
    const result = await attempt();
    if (result?.success) {
      return result;
    }
  }

  const resendTry = await sendResendEmail({ to, subject, html: htmlWithLink });
  if (!resendTry.success && resendTry.error) {
    lastError = resendTry.error;
  }

  return { success: false, error: lastError };
}
