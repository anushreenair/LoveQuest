import { neon } from "@neondatabase/serverless";

/**
 * Server-only Neon PostgreSQL client.
 * Uses DATABASE_URL from your Neon project dashboard.
 */
const PLACEHOLDER_HOSTS = ["ep-xxx", "localhost/neondb"];

export function getSql() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add your Neon connection string to .env.local",
    );
  }

  if (PLACEHOLDER_HOSTS.some((h) => connectionString.includes(h))) {
    throw new Error(
      "DATABASE_URL is still a placeholder. Run: npm run db:setup after configuring Neon",
    );
  }

  return neon(connectionString);
}
