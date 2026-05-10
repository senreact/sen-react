"use client";

import { useActionState } from "react";

import { getProfileType, SECTORS, type ProfileTypeSlug } from "@sen-react/shared";

import type { AuthFormState } from "@/lib/auth";

interface ProfileEditFormProps {
  action: (prevState: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  profile: {
    profile_type: ProfileTypeSlug;
    display_name: string;
    sector_slug: string | null;
    region: string | null;
    photo_url: string | null;
    summary: string | null;
    phone: string | null;
    email_public: boolean;
    organisation_name: string | null;
    organisation_legal_form: string | null;
    organisation_size: string | null;
    ministry_name: string | null;
    government_role: string | null;
    partner_org_name: string | null;
    is_minor: boolean;
    parental_consent: boolean | null;
    parent_email: string | null;
  };
}

const INITIAL_STATE: AuthFormState = { status: "idle" };

/**
 * Edit form for the signed-in user's own profile. Renders only the
 * type-specific fields that apply to the profile's `profile_type`
 * (locked — can't change via this form).
 *
 * Defaults are populated from the server-fetched row. Nullable text
 * fields convert blank → null at the schema layer.
 */
export function ProfileEditForm({ action, profile }: ProfileEditFormProps) {
  const [state, formAction, pending] = useActionState(action, INITIAL_STATE);
  const meta = getProfileType(profile.profile_type);
  const profileLabel = meta?.fr ?? profile.profile_type;

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <section className="rounded-md border border-slate-200 bg-slate-50/50 p-4 text-sm">
        <p className="font-semibold">Type de profil — {profileLabel}</p>
        <p className="mt-1 text-xs text-[color:var(--color-muted)]">
          Le type de profil est défini à l&apos;inscription et ne peut pas être modifié ici.
          Contactez REACT si vous avez besoin d&apos;un changement.
        </p>
      </section>

      <div>
        <label htmlFor="display_name" className="mb-1 block text-sm font-medium">
          Nom à afficher <span className="text-[color:var(--color-accent)]">*</span>
        </label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          required
          maxLength={120}
          defaultValue={profile.display_name}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="sector_slug" className="mb-1 block text-sm font-medium">
            Secteur
          </label>
          <select
            id="sector_slug"
            name="sector_slug"
            defaultValue={profile.sector_slug ?? ""}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
          >
            <option value="">— Aucun —</option>
            {SECTORS.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.fr}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="region" className="mb-1 block text-sm font-medium">
            Région
          </label>
          <input
            id="region"
            name="region"
            type="text"
            maxLength={120}
            defaultValue={profile.region ?? ""}
            placeholder="Dakar, Thiès, Saint-Louis…"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="summary" className="mb-1 block text-sm font-medium">
          Présentation courte
        </label>
        <textarea
          id="summary"
          name="summary"
          maxLength={2000}
          rows={4}
          defaultValue={profile.summary ?? ""}
          placeholder="2-3 phrases qui décrivent qui vous êtes et ce que vous faites."
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="photo_url" className="mb-1 block text-sm font-medium">
          URL de la photo de profil
        </label>
        <input
          id="photo_url"
          name="photo_url"
          type="url"
          defaultValue={profile.photo_url ?? ""}
          placeholder="https://…"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
        />
        <p className="mt-1 text-xs text-[color:var(--color-muted)]">
          Lien direct vers une image (téléversement intégré à venir).
        </p>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold">Contact</legend>
        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium">
            Téléphone (format international)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            maxLength={40}
            defaultValue={profile.phone ?? ""}
            placeholder="+221 77 …"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
          />
        </div>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            name="email_public"
            defaultChecked={profile.email_public}
            className="mt-1"
          />
          <span>
            Afficher mon adresse e-mail aux autres membres connectés. Décoché par défaut pour
            respecter la confidentialité (D020).
          </span>
        </label>
      </fieldset>

      {profile.profile_type === "organisation" ? (
        <fieldset className="space-y-4 rounded-md border border-slate-200 p-4">
          <legend className="px-1 text-sm font-semibold">Détails de l&apos;organisation</legend>
          <div>
            <label htmlFor="organisation_name" className="mb-1 block text-sm font-medium">
              Nom de l&apos;organisation
            </label>
            <input
              id="organisation_name"
              name="organisation_name"
              type="text"
              maxLength={200}
              defaultValue={profile.organisation_name ?? ""}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="organisation_legal_form" className="mb-1 block text-sm font-medium">
                Forme juridique
              </label>
              <input
                id="organisation_legal_form"
                name="organisation_legal_form"
                type="text"
                maxLength={120}
                defaultValue={profile.organisation_legal_form ?? ""}
                placeholder="ASBL, SARL, GIE…"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="organisation_size" className="mb-1 block text-sm font-medium">
                Taille / effectif
              </label>
              <input
                id="organisation_size"
                name="organisation_size"
                type="text"
                maxLength={60}
                defaultValue={profile.organisation_size ?? ""}
                placeholder="1-5, 6-20, 21-100…"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
              />
            </div>
          </div>
        </fieldset>
      ) : null}

      {profile.profile_type === "government" ? (
        <fieldset className="space-y-4 rounded-md border border-slate-200 p-4">
          <legend className="px-1 text-sm font-semibold">Détails de l&apos;institution</legend>
          <div>
            <label htmlFor="ministry_name" className="mb-1 block text-sm font-medium">
              Ministère / agence
            </label>
            <input
              id="ministry_name"
              name="ministry_name"
              type="text"
              maxLength={200}
              defaultValue={profile.ministry_name ?? ""}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="government_role" className="mb-1 block text-sm font-medium">
              Fonction
            </label>
            <input
              id="government_role"
              name="government_role"
              type="text"
              maxLength={120}
              defaultValue={profile.government_role ?? ""}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
            />
          </div>
        </fieldset>
      ) : null}

      {profile.profile_type === "partner" ? (
        <fieldset className="space-y-4 rounded-md border border-slate-200 p-4">
          <legend className="px-1 text-sm font-semibold">Organisation partenaire</legend>
          <div>
            <label htmlFor="partner_org_name" className="mb-1 block text-sm font-medium">
              Nom de l&apos;organisation
            </label>
            <input
              id="partner_org_name"
              name="partner_org_name"
              type="text"
              maxLength={200}
              defaultValue={profile.partner_org_name ?? ""}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
            />
          </div>
        </fieldset>
      ) : null}

      {profile.profile_type === "entrepreneur" ? (
        <fieldset className="space-y-3 rounded-md border border-slate-200 p-4">
          <legend className="px-1 text-sm font-semibold">Mineur (15–17 ans)</legend>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="is_minor"
              defaultChecked={profile.is_minor}
              className="mt-1"
            />
            <span>J&apos;ai entre 15 et 17 ans (consentement parental requis)</span>
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="parental_consent"
              defaultChecked={profile.parental_consent ?? false}
              className="mt-1"
            />
            <span>Mon parent ou tuteur autorise la création de ce compte</span>
          </label>
          <div>
            <label htmlFor="parent_email" className="mb-1 block text-sm font-medium">
              E-mail du parent / tuteur{" "}
              <span className="text-[color:var(--color-muted)]">(facultatif)</span>
            </label>
            <input
              id="parent_email"
              name="parent_email"
              type="email"
              maxLength={200}
              defaultValue={profile.parent_email ?? ""}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
            />
          </div>
        </fieldset>
      ) : null}

      {state.status === "error" ? (
        <p
          role="alert"
          className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {state.message}
        </p>
      ) : null}
      {state.status === "success" ? (
        <p
          role="status"
          className="rounded-md border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-700"
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 sm:w-auto"
      >
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
