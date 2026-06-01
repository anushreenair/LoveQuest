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

export async function saveLQResult(
  input: SaveLQResultInput,
): Promise<LQResultRow> {
  const sql = getSql();

  const rows = await sql`
    insert into lq_results (
      auth_user_id,
      score,
      tier_id,
      tier_label,
      cat_id,
      cat_verdict,
      answer_scores,
      email_sent
    ) values (
      ${input.authUserId},
      ${input.score},
      ${input.tierId},
      ${input.tierLabel},
      ${input.catId},
      ${input.catVerdict},
      ${JSON.stringify(input.answerScores)},
      ${input.emailSent}
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
