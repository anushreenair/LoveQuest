import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { getSessionById } from "@/actions/game";
import { ResultsView } from "@/components/results-view";
import { buildShareUrl, getAppBaseUrl } from "@/lib/share";

interface ResultsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    sent?: string;
    partner?: string;
    to?: string;
    error?: string;
    celebrate?: string;
  }>;
}

export default async function ResultsPage({
  params,
  searchParams,
}: ResultsPageProps) {
  const session = await auth();
  const { id } = await params;
  const { partner, to, error, celebrate } = await searchParams;

  if (!session) {
    redirect("/login");
  }

  const gameSession = await getSessionById(id);

  if (!gameSession) {
    redirect("/dashboard");
  }

  const baseUrl = await getAppBaseUrl();
  const shareUrl = buildShareUrl(baseUrl, gameSession.id);

  return (
    <>
      <Navbar user={session.user} />
      <main className="min-h-screen px-4 pb-12 pt-24">
        <ResultsView
          partnerName={gameSession.partnerName}
          partnerEmail={gameSession.partnerEmail}
          userName={session.user?.name ?? "Someone"}
          score={gameSession.compatibilityScore}
          shareUrl={shareUrl}
          answers={gameSession.questionAnswers}
          partnerDelivered={partner === "1"}
          deliveredTo={to ? decodeURIComponent(to) : undefined}
          emailError={error ? decodeURIComponent(error) : undefined}
          celebrate={celebrate === "1"}
        />
      </main>
    </>
  );
}
