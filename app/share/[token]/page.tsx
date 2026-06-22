import { notFound } from "next/navigation";
import { getSessionByShareToken } from "@/actions/game";
import { ResultsView } from "@/components/results-view";
import { buildShareUrl, getAppBaseUrl } from "@/lib/share";
import { GradientBackground } from "@/components/gradient-background";

interface SharePageProps {
  params: Promise<{ token: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params;
  const gameSession = await getSessionByShareToken(token);

  if (!gameSession) {
    notFound();
  }

  const baseUrl = await getAppBaseUrl();
  const shareUrl = buildShareUrl(baseUrl, gameSession.id);

  return (
    <>
      <GradientBackground />
      <main className="min-h-screen px-4 pb-12 pt-16">
        <ResultsView
          partnerName={gameSession.partnerName}
          partnerEmail={gameSession.partnerEmail}
          userName={gameSession.user.name ?? "Someone special"}
          score={gameSession.compatibilityScore}
          shareUrl={shareUrl}
          answers={[]}
          publicView
        />
      </main>
    </>
  );
}
