import { google } from "googleapis";
import {
  sendViaGmailOAuth,
  type GoogleMailTokens,
} from "@/lib/email/gmail-oauth";

export function hasEnvGmailSend(): boolean {
  return Boolean(process.env.GOOGLE_MAIL_REFRESH_TOKEN);
}

export function getEnvGmailTokens(): GoogleMailTokens | undefined {
  const refreshToken = process.env.GOOGLE_MAIL_REFRESH_TOKEN;
  if (!refreshToken) return undefined;

  return { refreshToken };
}

export async function sendViaEnvGmail(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const tokens = getEnvGmailTokens();
  if (!tokens) {
    throw new Error("GOOGLE_MAIL_REFRESH_TOKEN is not set.");
  }

  await sendViaGmailOAuth(tokens, options);
}
