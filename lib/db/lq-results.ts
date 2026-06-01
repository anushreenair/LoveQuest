import { randomBytes } from "crypto";
import { getSql } from "@/lib/db/neon";
import type { PersonalityId } from "@/lib/lq/scoring";

export interface LQResultRow {
  id: string;
  auth_user_id: string;
  score: number;
  tier_id: string;
  tier_label: string;
  cat_id: string;
  cat_verdict: string;
  answer_scores: number[];
  email_sent: boolean;
  share_token: string | null;
  created_at: string;
}

export interface SharedLQResult {
  score: number;
  tier_label: string;
  cat_verdict: string;
  user_name: string;
  partner_name: string;
  created_at: string;
}

export interface SaveLQResultInput {
  authUserId: string;
  score: number;
  tierId: PersonalityId;
  tierLabel: string;
  catId: string;
  catVerdict: string;
  answerScores: number[];
  emailSent: boolean;
}

function newShareToken(): string {
  return randomBytes(16).toString("hex");
}

export async function saveLQResult(
  input: SaveLQResultInput,
): Promise<LQResultRow> {
  const sql = getSql();
  const shareToken = newShareToken();

  const rows = await sql`
    insert into lq_results (
      auth_user_id,
      score,
      tier_id,
      tier_label,
      cat_id,
      cat_verdict,
      answer_scores,
      email_sent,
      share_token
    ) values (
      ${input.authUserId},
      ${input.score},
      ${input.tierId},
      ${input.tierLabel},
      ${input.catId},
      ${input.catVerdict},
      ${JSON.stringify(input.answerScores)},
      ${input.emailSent},
      ${shareToken}
    )
    returning *
  `;

  const row = rows[0] as LQResultRow | undefined;
  if (!row) throw new Error("Failed to save LQ result");
  return row;
}

export async function getLatestLQResult(
  authUserId: string,
): Promise<LQResultRow | null> {
  const sql = getSql();

  const rows = await sql`
    select *
    from lq_results
    where auth_user_id = ${authUserId}
    order by created_at desc
    limit 1
  `;

  return (rows[0] as LQResultRow | undefined) ?? null;
}

/** Ensures the latest result has a share token (for results saved before this feature). */
export async function ensureLatestShareToken(
  authUserId: string,
): Promise<string | null> {
  const latest = await getLatestLQResult(authUserId);
  if (!latest) return null;

  if (latest.share_token) {
    return latest.share_token;
  }

  const sql = getSql();
  const token = newShareToken();

  const rows = await sql`
    update lq_results
    set share_token = ${token}
    where id = ${latest.id}
    returning share_token
  `;

  const row = rows[0] as { share_token: string } | undefined;
  return row?.share_token ?? null;
}

export async function getSharedLQResult(
  shareToken: string,
): Promise<SharedLQResult | null> {
  const sql = getSql();

  const rows = await sql`
    select
      r.score,
      r.tier_label,
      r.cat_verdict,
      r.created_at,
      p.name as user_name,
      p.partner_name
    from lq_results r
    join profiles p on p.auth_user_id = r.auth_user_id
    where r.share_token = ${shareToken}
    limit 1
  `;

  return (rows[0] as SharedLQResult | undefined) ?? null;
}

export async function updateLQResultEmailSent(
  resultId: string,
  emailSent: boolean,
): Promise<void> {
  const sql = getSql();
  await sql`
    update lq_results
    set email_sent = ${emailSent}
    where id = ${resultId}
  `;
}
