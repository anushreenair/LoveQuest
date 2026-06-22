import { z } from "zod";

export const partnerSchema = z.object({
  partnerName: z.string().min(2, "Name must be at least 2 characters"),
  partnerBirthdate: z.string().min(1, "Birthdate is required"),
  partnerEmail: z.string().email("Enter a valid email address"),
});

export const answerSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1, "Please provide an answer"),
});

export const gameSessionSchema = z.object({
  partnerName: z.string().min(2),
  partnerBirthdate: z.string(),
  partnerEmail: z.string().email("Enter a valid email address"),
  answers: z.array(answerSchema).min(1),
});

export type PartnerFormData = z.infer<typeof partnerSchema>;
export type AnswerFormData = z.infer<typeof answerSchema>;
export type GameSessionFormData = z.infer<typeof gameSessionSchema>;

export const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Za-z]/, "Password must include a letter")
      .regex(/[0-9]/, "Password must include a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
