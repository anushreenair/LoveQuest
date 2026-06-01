"use client";

import { motion } from "framer-motion";
import { ONBOARDING_STEPS } from "@/lib/validations/onboarding";

interface StepIndicatorProps {
  currentStep: number;
}

/**
 * Visual progress bar showing which onboarding step the user is on.
 */
export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-2">
        {ONBOARDING_STEPS.map((step, index) => {
          const isActive = currentStep === step.id;
          const isComplete = currentStep > step.id;

          return (
            <div key={step.id} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                {index > 0 && (
                  <div
                    className={[
                      "h-0.5 flex-1 transition-colors duration-300",
                      isComplete || isActive ? "bg-pink-400" : "bg-white/15",
                    ].join(" ")}
                  />
                )}

                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isComplete
                      ? "rgb(236 72 153)"
                      : isActive
                        ? "rgb(168 85 247)"
                        : "rgba(255,255,255,0.1)",
                  }}
                  className={[
                    "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    "text-xs font-semibold text-white",
                    "border border-white/20",
                  ].join(" ")}
                >
                  {isComplete ? "✓" : step.id}
                </motion.div>

                {index < ONBOARDING_STEPS.length - 1 && (
                  <div
                    className={[
                      "h-0.5 flex-1 transition-colors duration-300",
                      isComplete ? "bg-pink-400" : "bg-white/15",
                    ].join(" ")}
                  />
                )}
              </div>

              <span
                className={[
                  "mt-2 hidden text-center text-xs sm:block",
                  isActive ? "font-medium text-pink-200" : "text-pink-200/40",
                ].join(" ")}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <h2 className="font-display text-2xl font-bold text-white">
          {ONBOARDING_STEPS[currentStep - 1]?.title}
        </h2>
        <p className="mt-1 text-sm text-pink-100/60">
          {ONBOARDING_STEPS[currentStep - 1]?.subtitle}
        </p>
      </div>
    </div>
  );
}
