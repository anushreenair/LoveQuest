import { Resend } from "resend";

let resendClient: Resend | null = null;

export function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set in environment variables");
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

export function getResendFromEmail(): string {
  return (
    process.env.RESEND_FROM_EMAIL ?? "LoveQuest <onboarding@resend.dev>"
  );
}
