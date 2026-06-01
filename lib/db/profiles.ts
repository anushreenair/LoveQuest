import { getSql } from "@/lib/db/neon";
import type { ProfileInsert, ProfileRow } from "@/lib/db/types";

/**
 * Fetch a profile by Google OAuth user id.
 */
export async function getProfileByAuthUserId(
  authUserId: string,
): Promise<ProfileRow | null> {
  const sql = getSql();

  const rows = await sql`
    select *
    from profiles
    where auth_user_id = ${authUserId}
    limit 1
  `;

  return (rows[0] as ProfileRow | undefined) ?? null;
}

/**
 * Insert or update a profile (upsert on auth_user_id).
 */
export async function upsertProfile(
  payload: ProfileInsert,
): Promise<ProfileRow> {
  const sql = getSql();

  const rows = await sql`
    insert into profiles (
      auth_user_id,
      name,
      email,
      phone,
      gender,
      partner_name,
      partner_email,
      onboarding_completed
    ) values (
      ${payload.auth_user_id},
      ${payload.name},
      ${payload.email},
      ${payload.phone},
      ${payload.gender},
      ${payload.partner_name},
      ${payload.partner_email},
      ${payload.onboarding_completed ?? true}
    )
    on conflict (auth_user_id) do update set
      name = excluded.name,
      email = excluded.email,
      phone = excluded.phone,
      gender = excluded.gender,
      partner_name = excluded.partner_name,
      partner_email = excluded.partner_email,
      onboarding_completed = excluded.onboarding_completed,
      updated_at = now()
    returning *
  `;

  const profile = rows[0] as ProfileRow | undefined;

  if (!profile) {
    throw new Error("Upsert did not return a profile row");
  }

  return profile;
}
