#!/usr/bin/env node
/**
 * Uses logged-in Chrome + AppleScript to add OAuth redirect URIs in Google Console.
 */
import { execSync } from "child_process";

const CLIENT_ID =
  "791568444572-9bqnrn14j67gq0ahvih48ee48of9jads.apps.googleusercontent.com";
const PROJECT = CLIENT_ID.split("-")[0];
const CONSOLE_URL = `https://console.cloud.google.com/apis/credentials/oauthclient/${CLIENT_ID}?project=${PROJECT}`;

const REDIRECT_URIS = [
  "https://lovequest-omega.vercel.app/api/auth/callback/google",
  "http://localhost:3000/api/auth/callback/google",
];
const JS_ORIGINS = [
  "https://lovequest-omega.vercel.app",
  "http://localhost:3000",
];

const js = `
(function() {
  const values = ${JSON.stringify([...REDIRECT_URIS, ...JS_ORIGINS])};
  const existing = new Set(
    Array.from(document.querySelectorAll("input")).map((i) => (i.value || "").trim())
  );
  let added = 0;
  for (const value of values) {
    if (existing.has(value)) continue;
    const buttons = Array.from(document.querySelectorAll("button"))
      .filter((b) => /add uri/i.test(b.textContent || ""));
    if (buttons.length) buttons[buttons.length - 1].click();
    const inputs = Array.from(document.querySelectorAll('input[type="url"], input[aria-label*="URI" i]'));
    const empty = inputs.find((i) => !(i.value || "").trim());
    if (empty) {
      empty.focus();
      empty.value = value;
      empty.dispatchEvent(new Event("input", { bubbles: true }));
      empty.dispatchEvent(new Event("change", { bubbles: true }));
      existing.add(value);
      added++;
    }
  }
  const save = Array.from(document.querySelectorAll("button"))
    .find((b) => /^save$/i.test((b.textContent || "").trim()));
  if (save && added > 0) save.click();
  return JSON.stringify({ added, existing: [...existing], saved: !!(save && added > 0) });
})()
`.replace(/\n/g, " ");

const appleScript = `
tell application "Google Chrome"
  activate
  if (count of windows) = 0 then make new window
  set URL of active tab of front window to "${CONSOLE_URL}"
  delay 8
  set result to execute active tab of front window javascript ${JSON.stringify(js)}
  return result
end tell
`;

try {
  console.log("Opening Google Cloud Console in Chrome…");
  const out = execSync(`osascript -e ${JSON.stringify(appleScript)}`, {
    encoding: "utf8",
    timeout: 120000,
  }).trim();
  console.log("Chrome result:", out);
  const parsed = JSON.parse(out);
  if (parsed.added > 0 && parsed.saved) {
    console.log("Added", parsed.added, "URI(s) and clicked Save.");
    process.exit(0);
  }
  if (parsed.added === 0) {
    console.log("URIs already present — nothing to add.");
    process.exit(0);
  }
  console.log("Could not auto-save. Please click Save in Chrome.");
} catch (err) {
  console.error("AppleScript failed:", err.message);
  execSync(`open -a "Google Chrome" "${CONSOLE_URL}"`, { stdio: "ignore" });
  process.exit(1);
}
