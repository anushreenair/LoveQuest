# LoveQuest AI

A premium startup-quality web application for discovering cosmic compatibility with someone special.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma ORM** + **Neon PostgreSQL**
- **NextAuth/Auth.js** (Google OAuth)
- **Framer Motion**
- **React Confetti**
- **Resend Email API**

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `AUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `AUTH_URL` | `http://localhost:3000` (dev) |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Verified sender email |

### 3. Set up the database

```bash
npm run db:push
npm run db:generate
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── app/              # Next.js App Router pages & API routes
├── components/       # Reusable UI components
├── lib/              # Utilities (auth, prisma, zodiac, resend)
├── prisma/           # Database schema
├── actions/          # Server actions
├── hooks/            # Custom React hooks
└── emails/           # React Email templates
```

## Features

- Google OAuth authentication
- Multi-step compatibility quest flow
- Zodiac-based compatibility scoring
- Animated glassmorphism UI with dark mode
- Confetti celebration on high scores
- Email results to partners via Resend
- Dashboard to view past quests

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Secret to `.env`

## Deployment

Deploy to Vercel and set all environment variables. Update `AUTH_URL` to your production domain.
