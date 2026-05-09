import { z } from "zod";

/**
 * Auth form schemas — single source of truth used by both the form
 * actions (server-side) and any future client-side validation.
 *
 * Password rules per D015 + D020:
 *   - Minimum 8 characters
 *   - No max enforced — let users use passphrases
 *   - No complexity rules at this layer; Supabase enforces defaults
 *
 * Email validation is intentionally permissive (just `string().email()`) —
 * Supabase's confirmation flow is the authoritative validity check.
 */

export const SignInSchema = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide" }),
  password: z.string().min(1, { message: "Mot de passe requis" }),
});

export const SignUpSchema = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide" }),
  password: z.string().min(8, {
    message: "Le mot de passe doit contenir au moins 8 caractères",
  }),
});

export type SignInInput = z.infer<typeof SignInSchema>;
export type SignUpInput = z.infer<typeof SignUpSchema>;

export type AuthFormState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; message: string };
