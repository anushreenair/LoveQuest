import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { getUserSessions } from "@/actions/game";
import { DashboardView } from "@/components/dashboard-view";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const gameSessions = await getUserSessions();

  return (
    <>
      <Navbar user={session.user} />
      <main className="min-h-screen pt-24 pb-12 px-4">
        <DashboardView
          sessions={gameSessions.map((s) => ({
            id: s.id,
            partnerName: s.partnerName,
            compatibilityScore: s.compatibilityScore,
            createdAt: s.createdAt.toISOString(),
            answerCount: s.questionAnswers.length,
          }))}
          userName={session.user.name ?? "there"}
        />
      </main>
    </>
  );
}
