/**
 * Configure Resend for LoveQuest partner emails.
 *
 * Usage:
 *   npm run resend:setup                    # opens API keys page + shows steps
 *   npm run resend:setup -- re_your_key     # saves key to .env.local
 *   RESEND_API_KEY=re_xxx npm run resend:setup
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");

const keyFromArg = process.argv[2]?.startsWith("re_")
  ? process.argv[2]
  : process.env.RESEND_API_KEY;

if (!keyFromArg) {
  console.log(`
LoveQuest — Resend setup
────────────────────────
1. Create a free account: https://resend.com/signup
2. Create an API key:     https://resend.com/api-keys
3. Run ONE of these:

   npm run resend:setup -- re_your_api_key_here

   (or add to .env.local manually)

Testing note: with onboarding@resend.dev you can only send
to the email on your Resend account until you verify a domain.
`);
  try {
    execSync("open https://resend.com/api-keys", { stdio: "ignore" });
  } catch {
    /* headless */
  }
  process.exit(0);
}

async function validateKey(apiKey) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "LoveQuest <onboarding@resend.dev>",
      to: ["delivered@resend.dev"],
      subject: "LoveQuest Resend setup test",
      html: "<p>If you see this in Resend logs, your key works.</p>",
    }),
  });

  if (res.status === 200 || res.status === 201) {
    return { ok: true };
  }

  const body = await res.text();
  if (res.status === 403 && body.includes("testing")) {
    return { ok: true, note: "Key valid (Resend test mode restrictions apply)." };
  }
  if (res.status === 422 || res.status === 400) {
    return { ok: true, note: "Key accepted by Resend API." };
  }

  return { ok: false, error: `${res.status}: ${body}` };
}

function updateEnvFile(apiKey) {
  const fromEmail = "LoveQuest <onboarding@resend.dev>";
  let content = existsSync(envPath)
    ? readFileSync(envPath, "utf8")
    : "";

  const lines = content.split("\n").filter((line) => {
    return (
      !line.startsWith("RESEND_API_KEY=") &&
      !line.startsWith("RESEND_FROM_EMAIL=")
    );
  });

  while (lines.length && lines[lines.length - 1] === "") lines.pop();

  lines.push(
    "",
    "# Resend — partner result emails",
    `RESEND_API_KEY=${apiKey}`,
    `RESEND_FROM_EMAIL=${fromEmail}`,
    "",
  );

  writeFileSync(envPath, lines.join("\n"));
}

console.log("Validating Resend API key…");
const validation = await validateKey(keyFromArg);

if (!validation.ok) {
  console.error("❌ Invalid API key:", validation.error);
  process.exit(1);
}

updateEnvFile(keyFromArg);
console.log("✅ Saved RESEND_API_KEY to .env.local");
if (validation.note) console.log("ℹ️ ", validation.note);
console.log("Restart your dev server: npm run dev");
