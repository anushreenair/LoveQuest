"use client";

import { FormField } from "@/components/onboarding/FormField";
import type { OnboardingFormData } from "@/lib/db/types";

interface PartnerDetailsStepProps {
  data: OnboardingFormData;
  errors: Partial<Record<keyof OnboardingFormData, string>>;
  onChange: (field: keyof OnboardingFormData, value: string) => void;
}

export function PartnerDetailsStep({
  data,
  errors,
  onChange,
}: PartnerDetailsStepProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-pink-400/20 bg-pink-500/10 px-4 py-3 text-sm text-pink-100/80">
        💕 Tell us about the special person you&apos;re creating this quest for.
      </div>

      <FormField
        label="Partner's name"
        name="partnerName"
        placeholder="Jamie Smith"
        value={data.partnerName}
        onChange={(e) => onChange("partnerName", e.target.value)}
        error={errors.partnerName}
        autoComplete="off"
      />

      <FormField
        label="Partner's email"
        name="partnerEmail"
        type="email"
        placeholder="partner@example.com"
        value={data.partnerEmail}
        onChange={(e) => onChange("partnerEmail", e.target.value)}
        error={errors.partnerEmail}
        autoComplete="off"
      />

      <p className="text-xs text-pink-200/40">
        We&apos;ll use this to invite your partner to the quest when it&apos;s ready.
      </p>
    </div>
  );
}
