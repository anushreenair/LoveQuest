import { auth } from "@/auth";
import { getProfile } from "@/app/onboarding/actions";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { FloatingHearts } from "@/components/landing/FloatingHearts";
import type { Gender } from "@/lib/db/types";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Onboarding — LoveQuest",
  description: "Set up your LoveQuest profile",
};

/**
 * Protected onboarding page — multi-step form saved to Neon PostgreSQL.
 */
export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const profile = await getProfile();

  const defaultValues = {
    name: profile?.name ?? session.user.name ?? "",
    email: profile?.email ?? session.user.email ?? "",
    phone: profile?.phone ?? "",
    gender: (profile?.gender ?? "") as Gender | "",
    partnerName: profile?.partner_name ?? "",
    partnerEmail: profile?.partner_email ?? "",
  };

  return (
    <div className="love-gradient love-glow relative min-h-screen overflow-hidden">
      <FloatingHearts count={10} />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-xl shadow-lg shadow-pink-500/25">
            ♥
          </div>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Let&apos;s set up your quest
          </h1>
          <p className="mt-2 text-sm text-pink-100/60">
            A few details so we can personalize your LoveQuest experience.
          </p>
        </div>

        <OnboardingWizard
          defaultValues={defaultValues}
          userName={session.user.name}
        />
      </div>
    </div>
  );
}
