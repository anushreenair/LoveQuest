"use server";

import { APP_NAME } from "@/lib/brand";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { calculateCompatibility } from "@/lib/zodiac";
import { gameSessionSchema } from "@/lib/validations";
import { CompatibilityEmail } from "@/emails/compatibility-email";
import { buildShareUrl, getAppBaseUrl } from "@/lib/share";
import { revalidatePath } from "next/cache";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createGameSession(
  formData: FormData
): Promise<
  ActionResult<{
    sessionId: string;
    score: number;
    emailSent: boolean;
    partnerDelivered: boolean;
    shareUrl: string;
    deliveredTo?: string;
    emailError?: string;
  }>
> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Please sign in to continue" };
  }

  const rawAnswers = formData.get("answers");
  let answers: { question: string; answer: string }[] = [];

  try {
    answers = JSON.parse(rawAnswers as string);
  } catch {
    return { success: false, error: "Invalid answers format" };
  }

  const parsed = gameSessionSchema.safeParse({
    partnerName: formData.get("partnerName"),
    partnerBirthdate: formData.get("partnerBirthdate"),
    partnerEmail: formData.get("partnerEmail"),
    answers,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? "Invalid form data",
    };
  }

  const { partnerName, partnerBirthdate, partnerEmail, answers: validAnswers } =
    parsed.data;

  const partnerDate = new Date(partnerBirthdate);
  const { score, zodiacReason } = calculateCompatibility(
    null,
    partnerDate,
    validAnswers
  );

  try {
    const gameSession = await prisma.gameSession.create({
      data: {
        userId: session.user.id,
        partnerName,
        partnerBirthdate: partnerDate,
        partnerEmail,
        compatibilityScore: score,
        zodiacReason,
        questionAnswers: {
          create: validAnswers.map((qa) => ({
            question: qa.question,
            answer: qa.answer,
          })),
        },
      },
    });

    const baseUrl = await getAppBaseUrl();
    const shareUrl = buildShareUrl(baseUrl, gameSession.id);
    const userName = session.user.name ?? "Someone";

    const emailResult = await sendEmail({
      to: partnerEmail,
      subject: `${userName} sent you a ${APP_NAME} result 💕`,
      react: CompatibilityEmail({
        userName,
        partnerName,
        score,
        shareUrl,
      }),
      shareUrl,
      partnerName,
      userName,
      score,
    });

    revalidatePath("/dashboard");
    revalidatePath("/results");

    return {
      success: true,
      data: {
        sessionId: gameSession.id,
        score,
        emailSent: emailResult.success,
        partnerDelivered: emailResult.success
          ? emailResult.partnerDelivered
          : false,
        shareUrl,
        deliveredTo: emailResult.success ? emailResult.deliveredTo : undefined,
        emailError: emailResult.success ? undefined : emailResult.error,
      },
    };
  } catch (error) {
    console.error("Failed to create game session:", error);
    return { success: false, error: "Failed to save your results" };
  }
}

export async function getSessionByShareToken(id: string) {
  return prisma.gameSession.findUnique({
    where: { id },
    include: {
      questionAnswers: true,
      user: { select: { name: true } },
    },
  });
}

export async function deleteGameSession(
  sessionId: string
): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.gameSession.deleteMany({
      where: { id: sessionId, userId: session.user.id },
    });

    revalidatePath("/dashboard");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to delete session" };
  }
}

export async function getUserSessions() {
  const session = await auth();

  if (!session?.user?.id) return [];

  return prisma.gameSession.findMany({
    where: { userId: session.user.id },
    include: { questionAnswers: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getSessionById(id: string) {
  const session = await auth();

  if (!session?.user?.id) return null;

  return prisma.gameSession.findFirst({
    where: { id, userId: session.user.id },
    include: { questionAnswers: true },
  });
}
