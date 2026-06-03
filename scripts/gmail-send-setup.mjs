/**
 * One-time setup: authorize Gmail send for LoveQuest (separate from login).
 * Saves GOOGLE_MAIL_REFRESH_TOKEN to .env.local — sends to ANY email address.
 *
 *   npm run gmail:send-setup
 */
import { execSync } from "child_process";
import fs from "fs";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");

function loadEnv() {
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

const env = loadEnv();
const clientId = env.GOOGLE_CLIENT_ID;
const clientSecret = env.GOOGLE_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error("❌ Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local first.");
  process.exit(1);
}

const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];
const REDIRECT_URI = "http://localhost:8766/oauth2callback";

function openBrowser(url) {
  try {
    execSync(`open "${url}"`, { stdio: "ignore" });
  } catch {
    console.log("Open in browser:", url);
  }
}

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  REDIRECT_URI,
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: SCOPES,
});

console.log(`
LoveQuest — Gmail send setup (one-time)

This lets LoveQuest email your partner from your Gmail.
Login is NOT affected — this is a separate permission.

1. Enable Gmail API (if not done): npm run gmail:enable
2. Sign in below and click Allow
`);

const refreshToken = await new Promise((resolve, reject) => {
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", "http://localhost:8766");
      if (url.pathname !== "/oauth2callback") return;

      const code = url.searchParams.get("code");
      const err = url.searchParams.get("error");
      if (err) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end(`<h1>Error: ${err}</h1><p>Close tab.</p>`);
        reject(new Error(err));
        server.close();
        return;
      }

      if (!code) return;

      const { tokens } = await oauth2Client.getToken(code);
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("<h1>Gmail connected! Close this tab.</h1>");
      server.close();
      resolve(tokens.refresh_token);
    } catch (e) {
      reject(e);
      server.close();
    }
  });

  server.listen(8766, () => {
    console.log("Opening Google authorization…");
    openBrowser(authUrl);
  });

  server.on("error", reject);
});

if (!refreshToken) {
  console.error("❌ No refresh token received. Try again with prompt=consent.");
  process.exit(1);
}

oauth2Client.setCredentials({ refresh_token: refreshToken });
const gmail = google.gmail({ version: "v1", auth: oauth2Client });
await gmail.users.getProfile({ userId: "me" });
console.log("✓ Gmail send verified");

let lines = fs.existsSync(envPath)
  ? fs.readFileSync(envPath, "utf8").split("\n").filter(
      (l) => !l.startsWith("GOOGLE_MAIL_REFRESH_TOKEN="),
    )
  : [];

lines.push("", "# Gmail send (partner emails) — from npm run gmail:send-setup");
lines.push(`GOOGLE_MAIL_REFRESH_TOKEN=${refreshToken}`);

fs.writeFileSync(envPath, lines.join("\n").trim() + "\n");
console.log("✅ Saved GOOGLE_MAIL_REFRESH_TOKEN to .env.local");
console.log("\nAdd the same variable on Vercel → Environment Variables → Production");
console.log("Then redeploy. Partner emails will work for any address.");
