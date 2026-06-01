# Deploy LoveQuest on Hostinger

LoveQuest is a **Next.js** app. You need a Hostinger plan that supports **Node.js** (Business Web Hosting or Cloud/VPS).

## 1. One-time email setup (free Gmail — no domain purchase)

On your computer, in the `lovequest` folder:

```bash
npm run email:setup -- your@gmail.com your-16-char-app-password
```

This sends automated emails to **your partner** and **you** after the quiz.  
Get an app password: [Google App Passwords](https://myaccount.google.com/apppasswords) (requires 2-Step Verification).

## 2. Push code to GitHub

The repo should already be at `https://github.com/anushreenair/LoveQuest`.

## 3. Hostinger Node.js app

1. Log in to [Hostinger hPanel](https://hpanel.hostinger.com).
2. **Websites** → your site → **Node.js** (or **Advanced** → **Node.js Web App**).
3. **Create application**:
   - **Source:** GitHub → connect `anushreenair/LoveQuest`, branch `main`
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm start`
   - **Node version:** 20 or 22
4. **Environment variables** (same as `.env.local`):

| Variable | Example |
|----------|---------|
| `AUTH_SECRET` | (openssl rand -base64 32) |
| `AUTH_URL` | `https://yourdomain.com` |
| `GOOGLE_CLIENT_ID` | from Google Cloud |
| `GOOGLE_CLIENT_SECRET` | from Google Cloud |
| `DATABASE_URL` | Neon connection string |
| `SMTP_USER` | your@gmail.com |
| `SMTP_PASS` | Gmail app password |
| `SMTP_HOST` | smtp.gmail.com |
| `SMTP_PORT` | 587 |
| `SMTP_SECURE` | false |
| `MAIL_FROM` | LoveQuest \<your@gmail.com\> |

5. Deploy and wait for the build to finish.

## 4. Google OAuth for your Hostinger domain

In [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → OAuth client:

- **Authorized JavaScript origins:** `https://yourdomain.com`
- **Authorized redirect URIs:** `https://yourdomain.com/api/auth/callback/google`

Set `AUTH_URL=https://yourdomain.com` in Hostinger env vars and redeploy.

## 5. Database

Run once from your laptop (with `DATABASE_URL` in `.env.local`):

```bash
npm run db:setup
```

Neon is cloud-hosted — it works from Hostinger without extra DB setup.

## 6. Share with your partner

After deploying:

1. Open `https://yourdomain.com`
2. Sign in with Google → onboarding (your + partner emails)
3. Play the quiz → both of you get emails + partner can use the share link

## Troubleshooting

- **Emails not sending:** Re-run `npm run email:setup` locally, then copy `SMTP_*` and `MAIL_FROM` to Hostinger exactly.
- **Google login fails:** Check `AUTH_URL` matches your live URL and redirect URI in Google Console.
- **Build fails:** Use Node 20+, and ensure `npm run build` works locally first.

## Still on Vercel?

The same `SMTP_*` variables work on Vercel. You can keep Vercel for testing and use Hostinger for your main domain, or use only Hostinger.
