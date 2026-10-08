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

// Optional trimmed text — blank string or missing → null.
const optionalTrimmed = (max: number) =>
  z
    .string()
    .max(max)
    .or(z.literal(""))
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : null));

// Three-state boolean select ("true" / "false" / "" | undefined → true / false / null).
const optionalBooleanSelect = z
  .enum(["true", "false", ""])
  .or(z.undefined())
  .transform((v) => (v === "true" ? true : v === "false" ? false : null));

// Optional integer — blank / missing → null; validates range when present.
const optionalAge = z
  .string()
  .or(z.literal(""))
  .optional()
  .transform((v) => {
    if (!v || v.trim() === "") return null;
    const n = Math.trunc(Number(v));
    return isNaN(n) ? null : n;
  })
  .refine((v) => v === null || (v >= 15 && v <= 120), {
    message: "L'âge doit être entre 15 et 120 ans",
  });

const SignUpEntrepreneurSchema = SignUpBase.extend({
  profile_type: z.literal("entrepreneur"),
  project_name: z.string().min(1, { message: "Nom du projet requis" }).max(200),
  age: z.coerce
    .number({ invalid_type_error: "Âge requis" })
    .int()
    .min(15, { message: "L'âge minimum est 15 ans" })
    .max(120, { message: "L'âge maximum est 120 ans" }),
  region: z.string().min(1, { message: "Région requise" }).max(120),
  sector_slug: optionalTrimmed(64),
  is_formal: optionalBooleanSelect,
  address: optionalTrimmed(255),
  phone: optionalTrimmed(40),
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
    if (data.profile_type === "entrepreneur") {
      const isMinor = data.is_minor || (typeof data.age === "number" && data.age < 18);
      if (isMinor && !data.parental_consent) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["parental_consent"],
          message: "Le consentement parental est requis pour les mineurs (15–17 ans).",
        });
      }
    }
  });

export type SignInInput = z.infer<typeof SignInSchema>;
export type SignUpInput = z.infer<typeof SignUpSchema>;

export type AuthFormState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; message: string };

/**
 * Profile-edit schema (PR-6c). Single shape covering every field the
 * user may update — type-specific fields are accepted on every type
 * because the form only renders the relevant ones and the server picks
 * out which to persist based on the row's `profile_type` (which can't
 * change via this action — the DB trigger blocks it).
 *
 * Empty strings normalise to null so the UI's blank inputs clear values
 * cleanly. URL validation is strict on photo_url (must be http/https)
 * but accepts empty string. Email-public is a checkbox.
 */
export const ProfileUpdateSchema = z.object({
  display_name: z.string().min(1, { message: "Nom requis" }).max(120),
  project_name: optionalTrimmed(200),
  age: optionalAge,
  sector_slug: optionalTrimmed(64),
  region: optionalTrimmed(120),
  photo_url: z
    .string()
    .url({ message: "URL d'image invalide — doit commencer par http(s)://" })
    .or(z.literal(""))
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : null)),
  summary: optionalTrimmed(2000),
  phone: optionalTrimmed(40),
  email_public: checkboxFlag,
  organisation_name: optionalTrimmed(200),
  organisation_legal_form: optionalTrimmed(120),
  organisation_size: optionalTrimmed(60),
  ministry_name: optionalTrimmed(200),
  government_role: optionalTrimmed(120),
  partner_org_name: optionalTrimmed(200),
  is_formal: optionalBooleanSelect,
  address: optionalTrimmed(255),
  is_minor: checkboxFlag,
  parental_consent: checkboxFlag,
  parent_email: z
    .string()
    .email({ message: "Adresse e-mail invalide pour le parent" })
    .or(z.literal(""))
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
});

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide" }),
});

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
    confirm: z.string().min(1, { message: "Confirmez le mot de passe" }),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirm"],
  });
