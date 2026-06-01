"use client";

import { GENDER_OPTIONS } from "@/lib/validations/onboarding";
import type { OnboardingFormData } from "@/lib/db/types";

interface ReviewStepProps {
  data: OnboardingFormData;
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/8 py-3 last:border-0">
      <span className="text-sm text-pink-200/50">{label}</span>
      <span className="text-right text-sm font-medium text-white">{value}</span>
    </div>
  );
}

export function ReviewStep({ data }: ReviewStepProps) {
  const genderLabel =
    GENDER_OPTIONS.find((g) => g.value === data.gender)?.label ?? data.gender;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-pink-300/70">
          Your details
        </p>
        <ReviewRow label="Name" value={data.name} />
        <ReviewRow label="Email" value={data.email} />
        <ReviewRow label="Phone" value={data.phone} />
        <ReviewRow label="Gender" value={genderLabel} />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-pink-300/70">
          Partner details
        </p>
        <ReviewRow label="Name" value={data.partnerName} />
        <ReviewRow label="Email" value={data.partnerEmail} />
      </div>

      <p className="text-center text-xs text-pink-200/40">
        You can go back to edit any field before submitting.
      </p>
    </div>
  );
}
