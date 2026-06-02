import { google } from "googleapis";

export interface GoogleMailTokens {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

function buildRawMessage(
  from: string,
  to: string,
  subject: string,
  html: string,
  text: string,
): string {
  const boundary = "lovequest_boundary";
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;

  const body = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=utf-8",
    "",
    text,
    `--${boundary}`,
    "Content-Type: text/html; charset=utf-8",
    "",
    html,
    `--${boundary}--`,
  ].join("\r\n");

  return Buffer.from(body)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
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
      raw: buildRawMessage(
        from,
        options.to,
        options.subject,
        options.html,
        options.text,
      ),
    },
  });
}
