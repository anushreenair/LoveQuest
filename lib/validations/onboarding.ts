import type { Gender, OnboardingFormData } from "@/lib/db/types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s+\-().]{7,20}$/;

export function validateStep1(data: Pick<OnboardingFormData, "name" | "email" | "phone" | "gender">) {
  const errors: Partial<Record<keyof OnboardingFormData, string>> = {};

  if (!data.name.trim()) {
    errors.name = "Name is required";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!data.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!PHONE_REGEX.test(data.phone)) {
    errors.phone = "Enter a valid phone number";
  }

  if (!data.gender) {
    errors.gender = "Please select your gender";
  }

  return errors;
}

export function validateStep2(
  data: Pick<OnboardingFormData, "partnerName" | "partnerEmail">,
) {
  const errors: Partial<Record<keyof OnboardingFormData, string>> = {};

  if (!data.partnerName.trim()) {
    errors.partnerName = "Partner name is required";
  }

  if (!data.partnerEmail.trim()) {
    errors.partnerEmail = "Partner email is required";
  } else if (!EMAIL_REGEX.test(data.partnerEmail)) {
    errors.partnerEmail = "Enter a valid email address";
  }

  return errors;
}

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "non-binary", label: "Non-binary" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

export const ONBOARDING_STEPS = [
  { id: 1, title: "About You", subtitle: "Tell us a little about yourself" },
  { id: 2, title: "Your Partner", subtitle: "Who is this quest for?" },
  { id: 3, title: "Review", subtitle: "Confirm your details" },
] as const;
