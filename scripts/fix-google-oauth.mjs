#!/usr/bin/env node
/**
 * One-time fix: Google sign-in → API updates LOVE % OAuth redirect URIs.
 * Run: npm run fix:google-oauth
 */
import http from "http";
import { URL } from "url";
import { execSync } from "child_process";

const REDIRECT_URIS = [
  "https://lovequest-omega.vercel.app/api/auth/callback/google",
  "http://localhost:3000/api/auth/callback/google",
];
const JS_ORIGINS = [
  "https://lovequest-omega.vercel.app",
  "http://localhost:3000",
];

const CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  process.env.AUTH_GOOGLE_ID ||
  "791568444572-9bqnrn14j67gq0ahvih48ee48of9jads.apps.googleusercontent.com";

const PROJECT_NUMBER = CLIENT_ID.split("-")[0];
const SCOPES = ["https://www.googleapis.com/auth/cloud-platform"];
const OOB_REDIRECT = "http://127.0.0.1:4527/oauth/callback";

// Google Cloud SDK OAuth client (used by gcloud auth login)
const GCLOUD_CLIENT_ID =
  "764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com";
const GCLOUD_CLIENT_SECRET = "d-FL95Q19q7MQmFpd7hHD0Ty";

function openBrowser(url) {
  try {
    execSync(`open "${url}"`, { stdio: "ignore" });
  } catch {
    console.log("\nOpen this URL in your browser:\n", url, "\n");
  }
}

function getAuthCodeUrl() {
  const params = new URLSearchParams({
    client_id: GCLOUD_CLIENT_ID,
    redirect_uri: OOB_REDIRECT,
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

async function exchangeCode(code) {
  const body = new URLSearchParams({
    code,
    client_id: GCLOUD_CLIENT_ID,
    client_secret: GCLOUD_CLIENT_SECRET,
    redirect_uri: OOB_REDIRECT,
    grant_type: "authorization_code",
  });
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error_description || data.error || "Token exchange failed");
  }
  return data.access_token;
}

async function api(token, path, options = {}) {
  const res = await fetch(`https://clientauthconfig.googleapis.com/v1/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    throw new Error(
      `API ${path} failed (${res.status}): ${data.error?.message || text}`
    );
  }
  return data;
}

function mergeUnique(existing = [], additions = []) {
  return [...new Set([...existing, ...additions])];
}

async function waitForAuthCode() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, OOB_REDIRECT);
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");
      res.writeHead(200, { "Content-Type": "text/html" });
      if (error) {
        res.end(`<h2>Sign-in failed: ${error}</h2><p>You can close this tab.</p>`);
        server.close();
        reject(new Error(error));
        return;
      }
      if (code) {
        res.end(
          "<h2>Signed in — updating OAuth client…</h2><p>You can close this tab.</p>"
        );
        server.close();
        resolve(code);
      } else {
        res.end("<h2>Waiting for authorization…</h2>");
      }
    });
    server.listen(4527, "127.0.0.1", () => {
      console.log("Opening Google sign-in in your browser…");
      openBrowser(getAuthCodeUrl());
    });
    server.on("error", reject);
    setTimeout(() => {
      server.close();
      reject(new Error("Timed out waiting for Google sign-in (5 min)"));
    }, 300000);
  });
}

async function main() {
  console.log("LOVE % — Google OAuth redirect fix\n");
  console.log("Client ID:", CLIENT_ID);
  console.log("Project:", PROJECT_NUMBER, "\n");

  const code = await waitForAuthCode();
  const token = await exchangeCode(code);
  console.log("Authenticated with Google Cloud.\n");

  const brands = await api(token, `projects/${PROJECT_NUMBER}/brands`);
  const brandList = brands.brands || [];
  if (!brandList.length) {
    throw new Error("No OAuth brands found in this Google Cloud project.");
  }

  let updated = false;
  for (const brand of brandList) {
    const brandName = brand.name.split("/").pop();
    const clients = await api(
      token,
      `projects/${PROJECT_NUMBER}/brands/${brandName}/clients`
    );
    for (const client of clients.clients || []) {
      const fullName = client.name;
      const shortId = fullName.split("/").pop();
      const matches =
        client.clientId === CLIENT_ID ||
        shortId === CLIENT_ID.replace(".apps.googleusercontent.com", "");

      if (!matches) continue;

      const apiPath = fullName.replace(/^.*\/v1\//, "");
      const current = await api(token, apiPath);
      const next = {
        ...current,
        redirectUris: mergeUnique(current.redirectUris, REDIRECT_URIS),
        javascriptOrigins: mergeUnique(current.javascriptOrigins, JS_ORIGINS),
      };

      await api(token, apiPath, {
        method: "PUT",
        body: JSON.stringify(next),
      });

      console.log("Updated OAuth client:", client.clientId || shortId);
      console.log("Redirect URIs:\n ", next.redirectUris.join("\n  "));
      updated = true;
    }
  }

  if (!updated) {
    throw new Error(
      "Client not found via API — you may need to create a new Web OAuth client."
    );
  }

  console.log("\nDone! Google sign-in should work in ~1 minute at:");
  console.log("  https://lovequest-omega.vercel.app/login");
}

main().catch((err) => {
  console.error("\nError:", err.message);
  const consoleUrl = `https://console.cloud.google.com/apis/credentials/oauthclient/${CLIENT_ID}?project=${PROJECT_NUMBER}`;
  console.log("\nFallback — add redirect URIs manually:");
  REDIRECT_URIS.forEach((u) => console.log(" ", u));
  openBrowser(consoleUrl);
  process.exit(1);
});
