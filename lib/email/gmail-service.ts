import { google } from "googleapis";
import { buildGmailRawMessage } from "@/lib/email/gmail-raw";

export function isGmailServiceConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_MAIL_REFRESH_TOKEN &&
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET,
  );
}

function getFromAddress(): string {
  const configured = process.env.GMAIL_SENDER?.trim();
  if (configured) return `LoveQuest <${configured}>`;
  return "LoveQuest";
}

export async function sendViaGmailService(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const refreshToken = process.env.GOOGLE_MAIL_REFRESH_TOKEN;
  if (!refreshToken) {
    throw new Error("GOOGLE_MAIL_REFRESH_TOKEN is not set");
  }

  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );

  oauth2.setCredentials({ refresh_token: refreshToken });

  const gmail = google.gmail({ version: "v1", auth: oauth2 });

  let from = getFromAddress();
  if (!process.env.GMAIL_SENDER) {
    const profile = await gmail.users.getProfile({ userId: "me" });
    const email = profile.data.emailAddress;
    if (email) from = `LoveQuest <${email}>`;
  }

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: buildGmailRawMessage(
        from,
        options.to,
        options.subject,
        options.html,
        options.text,
      ),
    },
  });
}
