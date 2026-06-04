/**
 * Set up free Gmail SMTP for LoveQuest (no domain purchase needed).
 *
 *   npm run email:setup
 *   npm run email:setup -- your_gmail@gmail.com your_app_password
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");

function loadEnvLocal() {
  const env = {};
  if (!fs.existsSync(envPath)) return env;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i > 0) env[t.slice(0, i)] = t.slice(i + 1);
  }
  return env;
}

const guide = `
LoveQuest — Free email setup (Gmail, no domain needed)

1. Use a Gmail account you check regularly.
2. Turn on 2-Step Verification:
   https://myaccount.google.com/security
3. Create an App Password (Mail → Other → "LoveQuest"):
   https://myaccount.google.com/apppasswords
4. Run (replace with your Gmail + 16-character app password):

   npm run email:setup -- you@gmail.com xxxx-xxxx-xxxx-xxxx

After the quiz, your partner AND you both get an automated email.
`;

const argv = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const existing = loadEnvLocal();
const gmail = argv[0] ?? existing.SMTP_USER;
const appPassword = argv[1]?.replace(/\s/g, "") ?? existing.SMTP_PASS;

if (!gmail || !appPassword) {
  console.log(guide);
  try {
    execSync("open https://myaccount.google.com/apppasswords", {
      stdio: "ignore",
    });
  } catch {
    /* optional */
  }
  process.exit(0);
}

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: { user: gmail, pass: appPassword },
});

console.log("Testing Gmail SMTP…");
await transport.verify();
console.log("✓ Gmail connection works");

let lines = [];
if (fs.existsSync(envPath)) {
  lines = fs.readFileSync(envPath, "utf8").split("\n").filter(
    (line) =>
      !line.startsWith("SMTP_PASS=") &&
      !line.startsWith("SMTP_USER=") &&
      !line.startsWith("SMTP_HOST=") &&
      !line.startsWith("SMTP_PORT=") &&
      !line.startsWith("SMTP_SECURE=") &&
      !line.startsWith("MAIL_FROM=") &&
      !line.startsWith("RESEND_"),
  );
}

lines.push(
  "",
  "# Gmail SMTP — sends to partner + you (no domain needed)",
  `SMTP_USER=${gmail}`,
  `GMAIL_SENDER=${gmail}`,
  "SMTP_HOST=smtp.gmail.com",
  "SMTP_PORT=587",
  "SMTP_SECURE=false",
  `SMTP_PASS=${appPassword}`,
  `MAIL_FROM=LoveQuest <${gmail}>`,
);

fs.writeFileSync(envPath, lines.join("\n").trim() + "\n");
console.log("✅ Saved SMTP settings to .env.local");

console.log("\nSending test email to your Gmail…");
await transport.sendMail({
  from: `LoveQuest <${gmail}>`,
  to: gmail,
  subject: "LoveQuest email setup works ✅",
  text: "Partner emails will now send automatically after the quiz.",
  html: "<p>Partner emails will now send automatically after the quiz.</p>",
});
console.log("✅ Test email sent");

console.log(
  "\nAdd the same SMTP_* and GMAIL_SENDER vars to Vercel → Settings → Environment Variables, then redeploy.",
);
