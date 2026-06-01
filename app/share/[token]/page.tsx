import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LumiCharacter } from "@/components/game/mascot/LumiCharacter";
import { GuideBubble } from "@/components/game/mascot/GuideBubble";
import { getSharedLQResult } from "@/lib/db/lq-results";
import { getRelationshipPersonality } from "@/lib/lq/scoring";

interface SharePageProps {
  params: Promise<{ token: string }>;
}

export const metadata: Metadata = {
  title: "Your LoveQuest Results",
  description: "Someone completed LoveQuest for you.",
};

export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params;
  const result = await getSharedLQResult(token);

  if (!result) {
    notFound();
  }

  const personality = getRelationshipPersonality(result.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#4a1942] px-6 py-12">
      <div className="mx-auto flex max-w-lg flex-col items-center">
        <LumiCharacter pose="celebrate" size={140} />

        <p className="mt-6 text-center text-sm font-semibold uppercase tracking-[0.2em] text-pink-300">
          LoveQuest results for {result.partner_name}
        </p>

        <p className="mt-2 text-center text-pink-100/80">
          <span className="font-semibold text-white">{result.user_name}</span>{" "}
          completed the adventure about you two
        </p>

        <p
          className={`mt-8 bg-gradient-to-r bg-clip-text font-display text-7xl font-bold text-transparent ${personality.gradient}`}
        >
          {result.score}
          <span className="text-3xl text-pink-200/50">/100</span>
        </p>

        <div className="mt-8 w-full rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-pink-300">
            Relationship Type
          </p>
          <p className="mt-2 text-center font-display text-2xl font-bold text-white">
            {personality.emoji} {result.tier_label}
          </p>
          <p className="mt-2 text-center text-sm text-pink-100/70">
            {personality.tagline}
          </p>
        </div>

        <div className="mt-6 w-full">
          <GuideBubble message={result.cat_verdict} large />
        </div>

        <p className="mt-10 text-center text-sm text-pink-200/60">
          Made with ♥ on LoveQuest
        </p>
      </div>
    </div>
  );
}
