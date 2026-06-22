import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gameSessions = await prisma.gameSession.findMany({
    where: { userId: session.user.id },
    include: {
      questionAnswers: true,
      _count: { select: { questionAnswers: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(gameSessions);
}
