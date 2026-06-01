export type Gender =
  | "male"
  | "female"
  | "non-binary"
  | "other"
  | "prefer-not-to-say";

export interface OnboardingFormData {
  name: string;
  email: string;
  phone: string;
  gender: Gender | "";
  partnerName: string;
  partnerEmail: string;
}

export interface ProfileRow {
  id: string;
  auth_user_id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  partner_name: string;
  partner_email: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  auth_user_id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  partner_name: string;
  partner_email: string;
  onboarding_completed?: boolean;
}
