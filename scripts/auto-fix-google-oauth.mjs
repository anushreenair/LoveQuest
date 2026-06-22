#!/usr/bin/env node
/**
 * Automates adding LOVE % OAuth redirect URIs in Google Cloud Console.
 * Uses your existing Chrome login session when possible.
 */
import { chromium } from "playwright";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

const CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  process.env.AUTH_GOOGLE_ID ||
  "791568444572-9bqnrn14j67gq0ahvih48ee48of9jads.apps.googleusercontent.com";

const PROJECT_NUMBER = CLIENT_ID.split("-")[0];
const CONSOLE_URL = `https://console.cloud.google.com/apis/credentials/oauthclient/${CLIENT_ID}?project=${PROJECT_NUMBER}`;

const REDIRECT_URIS = [
  "https://lovequest-omega.vercel.app/api/auth/callback/google",
  "http://localhost:3000/api/auth/callback/google",
];
const JS_ORIGINS = [
  "https://lovequest-omega.vercel.app",
  "http://localhost:3000",
];

function chromeUserDataDir() {
  const base = path.join(
    os.homedir(),
    "Library/Application Support/Google/Chrome"
  );
  if (!fs.existsSync(base)) return null;
  if (fs.existsSync(path.join(base, "Default"))) return base;
  return null;
}

async function fillUriFields(page, values) {
  for (const value of values) {
    const existing = await page
      .locator(`input[value="${value}"]`)
      .count()
      .catch(() => 0);
    if (existing > 0) continue;

    const addButtons = page.getByRole("button", { name: /add uri/i });
    const count = await addButtons.count();
    for (let i = 0; i < count; i++) {
      await addButtons.nth(i).click({ timeout: 3000 }).catch(() => {});
    }

    const emptyInputs = page.locator('input[type="url"], input[aria-label*="URI" i]');
    const inputCount = await emptyInputs.count();
    let filled = false;
    for (let i = 0; i < inputCount; i++) {
      const input = emptyInputs.nth(i);
      const current = (await input.inputValue().catch(() => "")) || "";
      if (!current.trim()) {
        await input.fill(value);
        filled = true;
        break;
      }
      if (current.trim() === value) {
        filled = true;
        break;
      }
    }

    if (!filled) {
      const lastInput = emptyInputs.last();
      await lastInput.fill(value).catch(() => {});
    }
  }
}

async function main() {
  const userDataDir = chromeUserDataDir();
  const launchOptions = {
    headless: false,
    channel: "chrome",
    args: ["--disable-blink-features=AutomationControlled"],
  };

  let context;
  if (userDataDir) {
    console.log("Launching Chrome with your profile…");
    context = await chromium.launchPersistentContext(userDataDir, {
      ...launchOptions,
      viewport: { width: 1280, height: 900 },
    });
  } else {
    context = await chromium.launch(launchOptions).then((b) => b.newContext());
  }

  const page = context.pages()[0] ?? (await context.newPage());
  console.log("Opening Google Cloud OAuth client…");
  await page.goto(CONSOLE_URL, { waitUntil: "domcontentloaded", timeout: 120000 });

  await page.waitForTimeout(4000);

  if (page.url().includes("accounts.google.com")) {
    console.log("Please sign in to Google in the browser window…");
    await page.waitForURL(/console\.cloud\.google\.com/, { timeout: 300000 });
    await page.goto(CONSOLE_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3000);
  }

  const bodyText = await page.locator("body").innerText().catch(() => "");
  if (/permission|don't have access|not found/i.test(bodyText)) {
    throw new Error(
      "No access to this OAuth client. Create a new Web OAuth client for LOVE % in Google Cloud."
    );
  }

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);

  console.log("Adding redirect URIs…");
  await fillUriFields(page, REDIRECT_URIS);

  console.log("Adding JavaScript origins…");
  await fillUriFields(page, JS_ORIGINS);

  const saveButton = page.getByRole("button", { name: /^save$/i });
  if (await saveButton.count()) {
    await saveButton.first().click();
    await page.waitForTimeout(3000);
    console.log("Saved OAuth client settings.");
  } else {
    console.log("Save button not found — please click Save manually in the browser.");
    await page.waitForTimeout(120000);
  }

  await context.close();
  console.log("Done. Google sign-in should work in ~1 minute.");
}

main().catch((err) => {
  console.error("Automation failed:", err.message);
  try {
    execSync(
      `open "${CONSOLE_URL}"`,
      { stdio: "ignore" }
    );
  } catch {}
  process.exit(1);
});
