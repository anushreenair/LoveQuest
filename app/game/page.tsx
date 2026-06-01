import { auth } from "@/auth";
import { getProfile } from "@/app/onboarding/actions";
import { AdventureGame } from "@/components/game/AdventureGame";
import { redirect } from "next/navigation";

export const metadata = {
  title: "LoveQuest Adventure",
  description: "Couple compatibility adventure guided by Lumi",
};

export default async function GamePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const profile = await getProfile();

  if (!profile?.onboarding_completed) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0a2e] via-[#2d1b4e] to-[#0f0618]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(236,72,153,0.15),transparent_55%)]" />

      <div className="relative z-10 mx-auto min-h-screen max-w-lg px-4 py-6 sm:px-6 sm:py-8">
        <header className="mb-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-pink-400/80">
            LoveQuest Adventure
          </p>
        </header>

        <AdventureGame
          partnerName={profile.partner_name}
          partnerEmail={profile.partner_email}
        />
      </div>
    </div>
  );
}
