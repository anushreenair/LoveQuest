import { google } from "googleapis";
import { buildGmailRawMessage } from "@/lib/email/gmail-raw";

export interface GoogleMailTokens {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

function getOAuthClient(tokens: GoogleMailTokens) {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );

  client.setCredentials({
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
    expiry_date: tokens.expiresAt ? tokens.expiresAt * 1000 : undefined,
  });

  return client;
}

export function hasGoogleMailTokens(tokens?: GoogleMailTokens): boolean {
  return Boolean(tokens?.refreshToken);
}

export async function sendViaGmailOAuth(
  tokens: GoogleMailTokens,
  options: { to: string; subject: string; html: string; text: string },
): Promise<void> {
  if (!tokens.refreshToken) {
    throw new Error("Gmail not connected. Sign out and sign in again.");
  }

  const auth = getOAuthClient(tokens);
  const gmail = google.gmail({ version: "v1", auth });

  const profile = await gmail.users.getProfile({ userId: "me" });
  const fromAddress = profile.data.emailAddress;

  if (!fromAddress) {
    throw new Error("Could not read your Gmail address.");
  }

  const from = `LoveQuest <${fromAddress}>`;

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
