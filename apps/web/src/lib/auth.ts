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

const SignUpBase = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide" }),
  password: z.string().min(8, {
    message: "Le mot de passe doit contenir au moins 8 caractères",
  }),
  display_name: z.string().min(1, { message: "Nom requis" }).max(120),
});

/**
 * Per-type signup schemas. Discriminated by `profile_type` so the server
 * action gets correctly-typed data for the user_profiles insert.
 *
 * admin is intentionally NOT exposed via this public form — REACT staff
 * are seeded server-side. The 4 types here are the public signup paths.
 */
// Form `<input type="checkbox">` posts "on" when checked, omits the key
// when not. Normalise both forms (plus "true" for testability) to boolean.
const checkboxFlag = z
  .union([z.literal("on"), z.literal("true"), z.literal(""), z.undefined()])
  .transform((v) => v === "on" || v === "true");

const SignUpEntrepreneurSchema = SignUpBase.extend({
  profile_type: z.literal("entrepreneur"),
  is_minor: checkboxFlag,
  parental_consent: checkboxFlag,
  parent_email: z
    .string()
    .email({ message: "Adresse e-mail invalide pour le parent" })
    .or(z.literal(""))
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
});

const SignUpOrganisationSchema = SignUpBase.extend({
  profile_type: z.literal("organisation"),
  organisation_name: z.string().min(1, { message: "Nom de l'organisation requis" }).max(200),
});

const SignUpGovernmentSchema = SignUpBase.extend({
  profile_type: z.literal("government"),
  ministry_name: z.string().min(1, { message: "Nom du ministère ou agence requis" }).max(200),
  government_role: z.string().max(120).optional(),
});

const SignUpPartnerSchema = SignUpBase.extend({
  profile_type: z.literal("partner"),
  partner_org_name: z
    .string()
    .min(1, { message: "Nom de l'organisation partenaire requis" })
    .max(200),
});

// Discriminated union over plain object schemas, then a top-level
// `superRefine` for the cross-field minor/consent rule (Zod's discriminator
// detection requires plain ZodObject shapes — applying .refine() to a
// branch upgrades it to ZodEffects which the union rejects).
export const SignUpSchema = z
  .discriminatedUnion("profile_type", [
    SignUpEntrepreneurSchema,
    SignUpOrganisationSchema,
    SignUpGovernmentSchema,
    SignUpPartnerSchema,
  ])
  .superRefine((data, ctx) => {
    if (data.profile_type === "entrepreneur" && data.is_minor && !data.parental_consent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["parental_consent"],
        message: "Le consentement parental est requis pour les mineurs (15–17 ans).",
      });
    }
  });

export type SignInInput = z.infer<typeof SignInSchema>;
export type SignUpInput = z.infer<typeof SignUpSchema>;

export type AuthFormState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; message: string };
