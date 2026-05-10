import type { GlobalConfig } from "payload";

/**
 * Auth flow strings — labels, hints, success/error messages used across
 * /connexion, /inscription, the AuthForm component, and the signin/signup
 * server actions.
 *
 * Error messages stay generic per OWASP user-enumeration guidance — the
 * CMS lets editors refine wording but shouldn't be used to expose
 * "email exists" / "wrong password" detail.
 */
export const AuthStrings: GlobalConfig = {
  slug: "auth-strings",
  label: "Authentification — chaînes de caractères",
  access: { read: () => true },
  fields: [
    {
      name: "signin",
      type: "group",
      label: "/connexion",
      fields: [
        { name: "pageTitle", type: "text", required: true },
        { name: "leadParagraph", type: "textarea", required: true },
        { name: "submitLabel", type: "text", required: true },
        {
          name: "signupPrompt",
          type: "text",
          required: true,
          admin: {
            description: "Texte avant le lien vers l'inscription. Ex. 'Pas encore de compte ?'",
          },
        },
        {
          name: "signupLink",
          type: "text",
          required: true,
          admin: { description: "Libellé du lien — ex. 'Créer un compte'" },
        },
      ],
    },
    {
      name: "signup",
      type: "group",
      label: "/inscription",
      fields: [
        { name: "pageTitle", type: "text", required: true },
        { name: "leadParagraph", type: "textarea", required: true },
        { name: "submitLabel", type: "text", required: true },
        { name: "passwordHint", type: "text", required: true },
        {
          name: "signinPrompt",
          type: "text",
          required: true,
          admin: { description: "Texte avant le lien vers la connexion." },
        },
        {
          name: "signinLink",
          type: "text",
          required: true,
          admin: { description: "Libellé du lien — ex. 'Se connecter'" },
        },
      ],
    },
    {
      name: "form",
      type: "group",
      label: "Formulaire",
      fields: [
        { name: "emailLabel", type: "text", required: true },
        { name: "passwordLabel", type: "text", required: true },
        {
          name: "pendingLabel",
          type: "text",
          required: true,
          admin: { description: "Affiché pendant la soumission. Ex. 'Veuillez patienter…'" },
        },
      ],
    },
    {
      name: "errors",
      type: "group",
      label: "Messages d'erreur / succès",
      admin: {
        description:
          "Messages génériques par défaut — ne pas exposer le détail (email existe / mot de passe faux) per OWASP user-enumeration guidance.",
      },
      fields: [
        { name: "signinFailed", type: "text", required: true },
        { name: "signupFailed", type: "text", required: true },
        { name: "signupSuccess", type: "text", required: true },
        {
          name: "validationFailed",
          type: "text",
          required: true,
          admin: { description: "Fallback si Zod ne fournit pas son propre message FR." },
        },
      ],
    },
  ],
};
