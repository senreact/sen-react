import type { Metadata } from "next";

import { ContactChannel } from "@/components/contact/ContactChannel";
import {
  CONTACT_ADDRESS_LINES,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  MAILTO_LINK,
  TEL_LINK,
  WHATSAPP_LINK,
} from "@/data/contact";

export const metadata: Metadata = {
  title: "Contact — Sen React",
  description: "Joindre l'équipe REACT — par WhatsApp, par e-mail ou en personne à Dakar.",
};

/**
 * /contact — Phase 2 step 5 per the roadmap §4.
 *
 * Three actionable channels (WhatsApp · Email · Telephone) plus the
 * physical address. WhatsApp is the canonical channel per D011 Q3
 * (Amadou's preferred medium for routine updates), so it sits first
 * in the grid and gets the canal-principal note.
 *
 * No backend form — wa.me + mailto + tel: deeplinks open the user's
 * native client, which is both the lightest path and the one Amadou
 * actually responds to. Adding a server-action form is deferred until
 * we have an email provider configured (likely Phase 11 alongside
 * legal compliance).
 */
export default function ContactPage() {
  return (
    <main>
      <section className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            Contact
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">Échangeons directement.</h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">
            L&apos;équipe REACT répond plus vite via WhatsApp pour les échanges courants. Pour une
            demande détaillée, l&apos;e-mail reste la meilleure option. Notre bureau est à Dakar et
            accueille les visites sur rendez-vous.
          </p>
        </div>
      </section>

      <section className="border-b border-[color:var(--color-border)]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ContactChannel
              label="WhatsApp"
              value={CONTACT_PHONE_DISPLAY}
              hint="Canal principal — réponse plus rapide"
              href={WHATSAPP_LINK}
              ctaLabel="Ouvrir WhatsApp"
            />

            <ContactChannel
              label="E-mail"
              value={CONTACT_EMAIL}
              hint="Pour les demandes détaillées"
              href={MAILTO_LINK}
              ctaLabel="Écrire un e-mail"
            />

            <ContactChannel
              label="Téléphone"
              value={CONTACT_PHONE_DISPLAY}
              hint="Pour les clarifications par voix"
              href={TEL_LINK}
              ctaLabel="Appeler"
            />

            <ContactChannel label="Adresse" value="">
              {CONTACT_ADDRESS_LINES.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </ContactChannel>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-6 py-12">
          <h2 className="mb-3 text-lg font-semibold">Quel canal pour quoi ?</h2>
          <ul className="space-y-2 text-sm text-[color:var(--color-muted)]">
            <li>
              <strong className="text-[color:var(--color-fg)]">WhatsApp</strong> — questions
              courantes, partage de documents légers, messages vocaux. C&apos;est le canal
              qu&apos;Amadou consulte le plus souvent.
            </li>
            <li>
              <strong className="text-[color:var(--color-fg)]">E-mail</strong> — demandes
              partenariat, dossiers de candidature, échanges nécessitant une trace écrite.
            </li>
            <li>
              <strong className="text-[color:var(--color-fg)]">Téléphone</strong> — clarification
              quand un message écrit risque l&apos;ambiguïté, sur rendez-vous de préférence.
            </li>
            <li>
              <strong className="text-[color:var(--color-fg)]">Visite au bureau</strong> — sur
              rendez-vous uniquement, dans le quartier de Sacrée Coeur 3 à Dakar.
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
