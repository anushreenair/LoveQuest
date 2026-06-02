/**
 * Adds LoveQuest redirect URIs to your Google OAuth client (one-time).
 * You approve access once in the browser; then URIs are saved automatically.
 *
 *   npm run google:fix-oauth
 */
import { execSync } from "child_process";
import http from "http";
import { URL } from "url";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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
const clientId =
  env.GOOGLE_CLIENT_ID ??
  "791568444572-9bqnrn14j67gq0ahvih48ee48of9jads.apps.googleusercontent.com";

const projectNumber = clientId.split("-")[0];

const REDIRECT_URIS = [
  "http://localhost:3000/api/auth/callback/google",
  "https://lovequest-omega.vercel.app/api/auth/callback/google",
  "https://lovequest.vercel.app/api/auth/callback/google",
  "https://lovequest-anushrees-projects-a8054a74.vercel.app/api/auth/callback/google",
];

const JS_ORIGINS = [
  "http://localhost:3000",
  "https://lovequest-omega.vercel.app",
  "https://lovequest.vercel.app",
  "https://lovequest-anushrees-projects-a8054a74.vercel.app",
];

/** gcloud CLI OAuth client (for managing your project). */
const GCLOUD_CLIENT_ID =
  "764086051850-6qr4p6gpi6hn506pt8ejuo29dc35f9d.apps.googleusercontent.com";
const GCLOUD_CLIENT_SECRET = "d-FL95Q19q7MQmFpd7fHC0cr";

const SCOPES = ["https://www.googleapis.com/auth/cloud-platform"];

function openBrowser(url) {
  try {
    execSync(`open "${url}"`, { stdio: "ignore" });
  } catch {
    console.log("Open this URL in your browser:\n", url);
  }
}

function getAccessToken() {
  return new Promise((resolve, reject) => {
    const oauth2Client = {
      clientId: GCLOUD_CLIENT_ID,
      clientSecret: GCLOUD_CLIENT_SECRET,
    };

    const redirectUri = "http://localhost:8765/oauth2callback";
    const state = Math.random().toString(36).slice(2);

    const server = http.createServer(async (req, res) => {
      try {
        const url = new URL(req.url ?? "/", "http://localhost:8765");
        if (url.pathname !== "/oauth2callback") return;

        if (url.searchParams.get("error")) {
          res.writeHead(400, { "Content-Type": "text/html" });
          res.end("<h1>Authorization failed. Close this tab.</h1>");
          reject(new Error(url.searchParams.get("error_description")));
          server.close();
          return;
        }

        const code = url.searchParams.get("code");
        if (!code || url.searchParams.get("state") !== state) return;

        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            code,
            client_id: GCLOUD_CLIENT_ID,
            client_secret: GCLOUD_CLIENT_SECRET,
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
          }),
        });

        const tokens = await tokenRes.json();
        if (!tokenRes.ok) {
          throw new Error(tokens.error_description ?? "Token exchange failed");
        }

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          "<h1>Done — you can close this tab and return to the terminal.</h1>",
        );
        server.close();
        resolve(tokens.access_token);
      } catch (err) {
        reject(err);
        server.close();
      }
    });

    server.listen(8765, () => {
      const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      authUrl.searchParams.set("client_id", GCLOUD_CLIENT_ID);
      authUrl.searchParams.set("redirect_uri", redirectUri);
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set("scope", SCOPES.join(" "));
      authUrl.searchParams.set("access_type", "offline");
      authUrl.searchParams.set("prompt", "consent");
      authUrl.searchParams.set("state", state);

      console.log("\nOpening Google sign-in to update OAuth redirect URIs…");
      console.log("Sign in as the owner of your Google Cloud project.\n");
      openBrowser(authUrl.toString());
    });

    server.on("error", reject);
  });
}

async function api(token, path, options = {}) {
  const res = await fetch(`https://clientauthconfig.googleapis.com/v1/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      body.error?.message ?? `API ${path} failed (${res.status})`,
    );
  }
  return body;
}

async function findClientResource(token) {
  const brands = await api(
    token,
    `brands?projectNumber=${projectNumber}&pageSize=20`,
  );

  for (const brand of brands.brands ?? []) {
    const name = brand.name;
    const clients = await api(
      token,
      `${name}/clients?pageSize=50`,
    ).catch(() => ({ clients: [] }));

    for (const client of clients.clients ?? []) {
      if (client.clientId === clientId) {
        return client.name;
      }
    }
  }

  throw new Error(
    `OAuth client ${clientId} not found in project ${projectNumber}.`,
  );
}

async function patchClient(token, clientResourceName) {
  const current = await api(token, clientResourceName);
  const existingRedirects = current.redirectUris ?? [];
  const existingOrigins = current.javascriptOrigins ?? [];

  const redirectUris = [...new Set([...existingRedirects, ...REDIRECT_URIS])];
  const javascriptOrigins = [
    ...new Set([...existingOrigins, ...JS_ORIGINS]),
  ];

  await api(
    token,
    `${clientResourceName}?updateMask=redirect_uris,javascript_origins`,
    {
      method: "PATCH",
      body: JSON.stringify({ redirectUris, javascriptOrigins }),
    },
  );

  console.log("\n✅ Saved redirect URIs:");
  for (const u of REDIRECT_URIS) console.log("  •", u);
  console.log("\nWait 1–2 minutes, then sign in at http://localhost:3000");
}

try {
  const token = await getAccessToken();
  console.log("Finding your OAuth client…");
  const resource = await findClientResource(token);
  console.log("Updating", resource, "…");
  await patchClient(token, resource);
} catch (err) {
  console.error("\n❌", err.message);
  console.log(`
Manual fix (2 min):
1. Open https://console.cloud.google.com/apis/credentials
2. Edit your OAuth Web client
3. Add redirect URI: http://localhost:3000/api/auth/callback/google
4. Add redirect URI: https://lovequest-omega.vercel.app/api/auth/callback/google
5. Save
`);
  process.exit(1);
}
