"use client";

import { FormField, FormSelect } from "@/components/onboarding/FormField";
import { GENDER_OPTIONS } from "@/lib/validations/onboarding";
import type { OnboardingFormData } from "@/lib/db/types";

interface YourDetailsStepProps {
  data: OnboardingFormData;
  errors: Partial<Record<keyof OnboardingFormData, string>>;
  onChange: (field: keyof OnboardingFormData, value: string) => void;
}

export function YourDetailsStep({ data, errors, onChange }: YourDetailsStepProps) {
  return (
    <div className="space-y-5">
      <FormField
        label="Your name"
        name="name"
        placeholder="Alex Johnson"
        value={data.name}
        onChange={(e) => onChange("name", e.target.value)}
        error={errors.name}
        autoComplete="name"
      />

      <FormField
        label="Email address"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={data.email}
        onChange={(e) => onChange("email", e.target.value)}
        error={errors.email}
        autoComplete="email"
      />

      <FormField
        label="Phone number"
        name="phone"
        type="tel"
        placeholder="+1 (555) 123-4567"
        value={data.phone}
        onChange={(e) => onChange("phone", e.target.value)}
        error={errors.phone}
        autoComplete="tel"
      />

      <FormSelect
        label="Gender"
        name="gender"
        value={data.gender}
        onChange={(e) => onChange("gender", e.target.value)}
        error={errors.gender}
        options={GENDER_OPTIONS}
        placeholder="Select your gender"
      />
    </div>
  );
}
