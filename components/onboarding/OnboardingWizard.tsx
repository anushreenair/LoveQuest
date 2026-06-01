"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveOnboardingProfile } from "@/app/onboarding/actions";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { PartnerDetailsStep } from "@/components/onboarding/steps/PartnerDetailsStep";
import { ReviewStep } from "@/components/onboarding/steps/ReviewStep";
import { YourDetailsStep } from "@/components/onboarding/steps/YourDetailsStep";
import { GlassCard } from "@/components/ui/GlassCard";
import type { OnboardingFormData } from "@/lib/db/types";
import {
  validateStep1,
  validateStep2,
} from "@/lib/validations/onboarding";

interface OnboardingWizardProps {
  defaultValues: Partial<OnboardingFormData>;
  userName?: string | null;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
};

const emptyForm: OnboardingFormData = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  partnerName: "",
  partnerEmail: "",
};

/**
 * Multi-step onboarding wizard — collects user + partner details and saves to Neon.
 */
export function OnboardingWizard({
  defaultValues,
  userName,
}: OnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>({
    ...emptyForm,
    ...defaultValues,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof OnboardingFormData, string>>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isPending, startTransition] = useTransition();

  function updateField(field: keyof OnboardingFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitError(null);
  }

  function goToStep(nextStep: number) {
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
  }

  function handleNext() {
    if (step === 1) {
      const stepErrors = validateStep1(formData);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
      goToStep(2);
      return;
    }

    if (step === 2) {
      const stepErrors = validateStep2(formData);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
      goToStep(3);
    }
  }

  function handleBack() {
    if (step > 1) goToStep(step - 1);
  }

  function handleSubmit() {
    startTransition(async () => {
      const result = await saveOnboardingProfile(formData);

      if (!result.success) {
        setSubmitError(result.error);
        if (result.fieldErrors) setErrors(result.fieldErrors);
        return;
      }

      setIsComplete(true);
      router.push("/game");
    });
  }

  if (isComplete) {
    return (
      <GlassCard className="py-12 text-center">
        <p className="text-sm text-pink-200/70">Redirecting to your cat guide…</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="overflow-hidden">
      <StepIndicator currentStep={step} />

      <div className="relative min-h-[320px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {step === 1 && (
              <YourDetailsStep
                data={formData}
                errors={errors}
                onChange={updateField}
              />
            )}
            {step === 2 && (
              <PartnerDetailsStep
                data={formData}
                errors={errors}
                onChange={updateField}
              />
            )}
            {step === 3 && <ReviewStep data={formData} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {submitError && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          role="alert"
        >
          {submitError}
        </motion.p>
      )}

      <div className="mt-8 flex items-center justify-between gap-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            disabled={isPending}
            className="rounded-full px-5 py-2.5 text-sm font-medium text-pink-200/70 transition-colors hover:text-white disabled:opacity-50"
          >
            ← Back
          </button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <motion.button
            type="button"
            onClick={handleNext}
            className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 transition-opacity hover:opacity-90"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue →
          </motion.button>
        ) : (
          <motion.button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 transition-opacity hover:opacity-90 disabled:opacity-60"
            whileHover={isPending ? undefined : { scale: 1.02 }}
            whileTap={isPending ? undefined : { scale: 0.98 }}
          >
            {isPending ? "Saving…" : "Complete setup ♥"}
          </motion.button>
        )}
      </div>
    </GlassCard>
  );
}
