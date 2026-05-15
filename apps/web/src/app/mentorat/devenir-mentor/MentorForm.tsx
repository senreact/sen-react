"use client";

import { useActionState } from "react";

import { SECTORS } from "@sen-react/shared";

import type { MentorActionState } from "../actions";
import { saveMentorProfileAction } from "../actions";

const initial: MentorActionState = { status: "idle" };

export function MentorForm() {
  const [state, formAction, pending] = useActionState(saveMentorProfileAction, initial);

  if (state.status === "success") {
    return (
      <div className="rounded-lg border border-[color:var(--color-border)] bg-white p-6 text-sm">
        <p className="font-semibold text-[color:var(--color-accent)]">Profil enregistré ✓</p>
        <p className="mt-1 text-[color:var(--color-muted)]">
          Votre profil est maintenant visible dans la liste des mentors.
        </p>
        <a
          href="/mentorat"
          className="mt-4 inline-block text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
        >
          ← Voir la liste des mentors
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.status === "error" ? (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">{state.message}</p>
      ) : null}

      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="display_name">
          Nom d&apos;affichage <span className="text-red-500">*</span>
        </label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          required
          maxLength={100}
          className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
          placeholder="Ex. : Fatou Diallo"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="bio">
          Biographie (max 500 caractères)
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          maxLength={500}
          className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
          placeholder="Décrivez votre parcours et ce que vous pouvez apporter comme mentor…"
        />
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold">
          Secteurs d&apos;expertise <span className="text-red-500">*</span>
        </legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SECTORS.map((s) => (
            <label key={s.slug} className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" name="sectors" value={s.slug} className="accent-[color:var(--color-accent)]" />
              {s.fr}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="expertise">
          Compétences clés (séparées par des virgules)
        </label>
        <input
          id="expertise"
          name="expertise"
          type="text"
          maxLength={300}
          className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
          placeholder="Ex. : levée de fonds, e-commerce, gestion de projet"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="region">
          Région / Ville
        </label>
        <input
          id="region"
          name="region"
          type="text"
          maxLength={100}
          className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
          placeholder="Ex. : Dakar, Thiès, International"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold" htmlFor="contact_email">
            Email de contact
          </label>
          <input
            id="contact_email"
            name="contact_email"
            type="email"
            maxLength={200}
            className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold" htmlFor="contact_phone">
            Téléphone
          </label>
          <input
            id="contact_phone"
            name="contact_phone"
            type="tel"
            maxLength={30}
            className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
            placeholder="+221 XX XXX XX XX"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold" htmlFor="contact_wa">
            WhatsApp
          </label>
          <input
            id="contact_wa"
            name="contact_wa"
            type="tel"
            maxLength={30}
            className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
            placeholder="+221 XX XXX XX XX"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold" htmlFor="linkedin_url">
            LinkedIn
          </label>
          <input
            id="linkedin_url"
            name="linkedin_url"
            type="url"
            maxLength={300}
            className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm focus:border-[color:var(--color-accent)] focus:outline-none"
            placeholder="https://linkedin.com/in/..."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-[color:var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Enregistrement…" : "Enregistrer mon profil"}
      </button>
    </form>
  );
}
