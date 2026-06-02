/**
 * Opens Google Cloud Console to enable Gmail API (required once).
 * Usage: npm run gmail:enable
 */
import { execSync } from "child_process";

const url =
  "https://console.cloud.google.com/apis/library/gmail.googleapis.com";

console.log(`
Enable Gmail API for LoveQuest (one-time, free):

1. Open: ${url}
2. Select the same Google Cloud project as your OAuth client
3. Click "Enable"
4. Sign out of LoveQuest, then sign in again with Google
`);

try {
  execSync(`open "${url}"`, { stdio: "ignore" });
} catch {
  console.log("Open the link above in your browser.");
}
