import { prisma } from "@/lib/prisma";

export async function upsertOAuthUser({
  email,
  name,
  image,
}: {
  email: string;
  name?: string | null;
  image?: string | null;
}) {
  const normalizedEmail = email.toLowerCase().trim();

  return prisma.user.upsert({
    where: { email: normalizedEmail },
    update: {
      name: name ?? undefined,
      image: image ?? undefined,
      emailVerified: new Date(),
    },
    create: {
      email: normalizedEmail,
      name: name ?? null,
      image: image ?? null,
      emailVerified: new Date(),
    },
  });
}
