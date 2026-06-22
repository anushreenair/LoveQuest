"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { signUpSchema } from "@/lib/validations";
import {
  getProductionGoogleLoginUrl,
  shouldUseProductionGoogleOAuth,
} from "@/lib/google-sign-in";

export async function signInWithGoogle() {
  const host = (await headers()).get("host")?.split(":")[0] ?? "";
  if (shouldUseProductionGoogleOAuth(host)) {
    redirect(getProductionGoogleLoginUrl());
  }
  await signIn("google", { redirectTo: "/quest" });
}

export type AuthActionResult =
  | { success: true }
  | { success: false; error: string };

export async function registerUser(
  formData: FormData
): Promise<AuthActionResult> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? "Invalid form data",
    };
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing?.passwordHash) {
    return {
      success: false,
      error: "An account with this email already exists. Please sign in.",
    };
  }

  if (existing && !existing.passwordHash) {
    return {
      success: false,
      error:
        "This email is already registered. Sign in with your password.",
    };
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      emailVerified: new Date(),
    },
  });

  return { success: true };
}
