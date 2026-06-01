/**
 * Adds share_token to existing lq_results rows (one-time).
 * Usage: npm run db:backfill-share
 */
import { randomBytes } from "crypto";
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL required");
  process.exit(1);
}

const sql = neon(connectionString);

const rows = await sql`
  select id from lq_results where share_token is null
`;

for (const row of rows) {
  const token = randomBytes(16).toString("hex");
  await sql`update lq_results set share_token = ${token} where id = ${row.id}`;
}

console.log(`✅ Backfilled ${rows.length} result(s) with share links.`);
