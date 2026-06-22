import { Resend } from "resend";
import { appFromEmail } from "@/lib/brand";

let resendClient: Resend | null = null;

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export async function sendResendEmail({
  to,
  subject,
  react,
  html,
}: {
  to: string;
  subject: string;
  react?: React.ReactElement;
  html?: string;
}) {
  const resend = getResend();

  if (!resend) {
    console.warn("RESEND_API_KEY not configured, skipping email");
    return {
      success: false as const,
      error:
        "Email not configured. Add GMAIL_USER + GMAIL_APP_PASSWORD to .env (free, sends to anyone) or verify a domain on Resend.",
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? appFromEmail("onboarding@resend.dev"),
      to,
      subject,
      ...(html ? { html } : { react }),
    });

    if (error) {
      console.error("Resend error:", error);
      const needsDomain =
        error.message?.includes("verify a domain") ||
        error.message?.includes("testing emails to your own");
      return {
        success: false as const,
        error: needsDomain
          ? "Resend can only email you in test mode. Add GMAIL_USER and GMAIL_APP_PASSWORD to .env to send to anyone for free."
          : error.message,
      };
    }

    return { success: true as const, data };
  } catch (error) {
    console.error("Email send failed:", error);
    return { success: false as const, error: "Failed to send email" };
  }
}
