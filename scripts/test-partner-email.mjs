/**
 * Send a test email to partner address using current .env.local config.
 *   npm run email:test -- beehoney413@gmail.com
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import { google } from "googleapis";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");

function loadEnv() {
  const env = {};
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i > 0) env[t.slice(0, i)] = t.slice(i + 1);
  }
  return env;
}

const to = process.argv[2] ?? "beehoney413@gmail.com";
const env = loadEnv();

async function sendViaSmtp() {
  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(env.SMTP_PORT ?? 587),
    secure: env.SMTP_SECURE === "true",
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
  await transport.sendMail({
    from: env.MAIL_FROM ?? `LoveQuest <${env.SMTP_USER}>`,
    to,
    subject: "LoveQuest test — partner email works! ❤️",
    html: "<p>If you see this, LoveQuest can email your partner.</p>",
    text: "If you see this, LoveQuest can email your partner.",
  });
  console.log(`✓ SMTP test sent to ${to}`);
}

async function sendViaGmailToken() {
  const oauth2 = new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
  );
  oauth2.setCredentials({ refresh_token: env.GOOGLE_MAIL_REFRESH_TOKEN });
  const gmail = google.gmail({ version: "v1", auth: oauth2 });
  const profile = await gmail.users.getProfile({ userId: "me" });
  const from = profile.data.emailAddress;
  const raw = Buffer.from(
    [
      `From: LoveQuest <${from}>`,
      `To: ${to}`,
      "Subject: LoveQuest test — partner email works!",
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=utf-8",
      "",
      "<p>If you see this, LoveQuest can email your partner.</p>",
    ].join("\r\n"),
  )
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await gmail.users.messages.send({ userId: "me", requestBody: { raw } });
  console.log(`✓ Gmail API test sent to ${to}`);
}

async function sendViaResend() {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL ?? "LoveQuest <onboarding@resend.dev>",
      to: [to],
      subject: "LoveQuest test",
      html: "<p>test</p>",
    }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message ?? "Resend failed");
  console.log(`✓ Resend test sent to ${to}`);
}

try {
  if (env.GOOGLE_MAIL_REFRESH_TOKEN) {
    await sendViaGmailToken();
  } else if (env.SMTP_USER && env.SMTP_PASS) {
    await sendViaSmtp();
  } else if (env.RESEND_API_KEY) {
    await sendViaResend();
  } else {
    console.error("No email configured. Run: npm run gmail:send-setup");
    process.exit(1);
  }
} catch (err) {
  console.error("❌", err.message);
  process.exit(1);
}
