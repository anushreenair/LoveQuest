"use server";

import { auth } from "@/auth";
import { getProfileByAuthUserId, upsertProfile } from "@/lib/db/profiles";
import type { OnboardingFormData, ProfileRow } from "@/lib/db/types";
import {
  validateStep1,
  validateStep2,
} from "@/lib/validations/onboarding";
import { revalidatePath } from "next/cache";

export type ActionResult =
  | { success: true; profile: ProfileRow }
  | { success: false; error: string; fieldErrors?: Partial<Record<keyof OnboardingFormData, string>> };

/**
 * Fetch existing profile for the logged-in user (if they've started onboarding before).
 */
export async function getProfile(): Promise<ProfileRow | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    return await getProfileByAuthUserId(session.user.id);
  } catch (err) {
    console.error("getProfile error:", err);
    return null;
  }
}

/**
 * Validate and save onboarding profile to Neon PostgreSQL.
 */
export async function saveOnboardingProfile(
  formData: OnboardingFormData,
): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in to continue." };
  }

  const step1Errors = validateStep1(formData);
  const step2Errors = validateStep2(formData);
  const fieldErrors = { ...step1Errors, ...step2Errors };

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      error: "Please fix the errors below.",
      fieldErrors,
    };
  }

  try {
    const profile = await upsertProfile({
      auth_user_id: session.user.id,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      gender: formData.gender,
      partner_name: formData.partnerName.trim(),
      partner_email: formData.partnerEmail.trim().toLowerCase(),
      onboarding_completed: true,
    });

    revalidatePath("/onboarding");

    return { success: true, profile };
  } catch (err) {
    console.error("saveOnboardingProfile:", err);
    const message =
      err instanceof Error ? err.message : "Unknown database error";

    if (message.includes("DATABASE_URL")) {
      return { success: false, error: message };
    }

    if (message.includes("does not exist") || message.includes("relation")) {
      return {
        success: false,
        error: "Database tables are missing. Run: npm run db:setup",
      };
    }

    return {
      success: false,
      error: "Could not save your profile. Please try again in a moment.",
    };
  }
}
