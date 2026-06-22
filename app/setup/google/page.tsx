import Link from "next/link";
import { APP_NAME } from "@/lib/brand";
import { getGoogleOAuthConfig, getGoogleOAuthRedirectUri } from "@/lib/env";

const REDIRECT_URI = "https://lovequest-omega.vercel.app/api/auth/callback/google";
const JS_ORIGIN = "https://lovequest-omega.vercel.app";
const CONSENT_URL =
  "https://console.cloud.google.com/auth/audience?project=791568444572";

export default function GoogleSetupPage() {
  const google = getGoogleOAuthConfig();
  const clientId = google?.clientId ?? "791568444572-9bqnrn14j67gq0ahvih48ee48of9jads.apps.googleusercontent.com";
  const project = clientId.split("-")[0];
  const consoleUrl = `https://console.cloud.google.com/apis/credentials/oauthclient/${clientId}?project=${project}`;

  return (
    <main className="mx-auto min-h-screen max-w-lg px-4 py-16 text-white">
      <h1 className="mb-2 text-2xl font-bold">{APP_NAME} — Google sign-in setup</h1>
      <p className="mb-8 text-white/60">
        One-time fix for <code className="text-pink-300">redirect_uri_mismatch</code>
      </p>

      <ol className="mb-8 list-decimal space-y-4 pl-5 text-sm text-white/80">
        <li>
          Open{" "}
          <a href={consoleUrl} target="_blank" rel="noreferrer" className="text-pink-400 underline">
            Google Cloud OAuth client
          </a>
        </li>
        <li>
          Under <strong>Authorized redirect URIs</strong>, click <strong>+ Add URI</strong> and paste:
          <pre className="mt-2 overflow-x-auto rounded-lg bg-black/40 p-3 text-xs text-pink-200">
            {REDIRECT_URI}
          </pre>
        </li>
        <li>
          Under <strong>Authorized JavaScript origins</strong>, add:
          <pre className="mt-2 overflow-x-auto rounded-lg bg-black/40 p-3 text-xs text-pink-200">
            {JS_ORIGIN}
          </pre>
        </li>
        <li>
          Click <strong>Save</strong> at the bottom. Wait 1–2 minutes.
        </li>
        <li>
          Open{" "}
          <a href={CONSENT_URL} target="_blank" rel="noreferrer" className="text-pink-400 underline">
            OAuth consent screen
          </a>
          . If publishing status is <strong>Testing</strong>, add your Gmail under{" "}
          <strong>Test users</strong> (e.g. <code className="text-pink-300">anushreenair15@gmail.com</code>).
        </li>
      </ol>

      <p className="mb-4 text-xs text-white/40">OAuth client ID: {clientId}</p>

      <div className="flex flex-col gap-3">
        <a
          href={consoleUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl bg-pink-500 px-4 py-3 text-center font-medium text-white"
        >
          Open Google Cloud Console
        </a>
        <Link href="/login" className="rounded-xl bg-white/10 px-4 py-3 text-center">
          Back to sign in (email + password works now)
        </Link>
      </div>
    </main>
  );
}
