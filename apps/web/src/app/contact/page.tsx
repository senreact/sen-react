import type { Metadata } from "next";

import { ContactChannel } from "@/components/contact/ContactChannel";
import { getContactInfo, getContactPage } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Contact — Sen React",
  description: "Joindre l'équipe REACT — par WhatsApp, par e-mail ou en personne à Dakar.",
};

/**
 * /contact — Phase 2 step 5. Coordinates from `contact-info` global,
 * editorial copy from `contact-page` global. Three actionable channels
 * (WhatsApp · Email · Telephone) plus the physical address.
 *
 * No backend form — wa.me + mailto + tel: deeplinks open the user's
 * native client, which is both the lightest path and the one Amadou
 * actually responds to. Adding a server-action form is deferred until
 * we have an email provider configured (likely Phase 11 alongside
 * legal compliance).
 */
export default async function ContactPage() {
  const [contact, copy] = await Promise.all([getContactInfo(), getContactPage()]);
  const phoneDigits = contact.phoneE164.replace(/^\+/, "");
  const whatsappLink = `https://wa.me/${phoneDigits}`;
  const mailtoLink = `mailto:${contact.email}`;
  const telLink = `tel:${contact.phoneE164}`;
  const addressLines = contact.addressLines.map((a) => a.line);

  return (
    <main>
      <section className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            {copy.eyebrow}
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">{copy.headline}</h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-muted)]">
            {copy.leadParagraph}
          </p>
        </div>
      </section>

      <section className="border-b border-[color:var(--color-border)]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ContactChannel
              label="WhatsApp"
              value={contact.phoneDisplay}
              hint={copy.channelHints.whatsapp}
              href={whatsappLink}
              ctaLabel="Ouvrir WhatsApp"
            />

            <ContactChannel
              label="E-mail"
              value={contact.email}
              hint={copy.channelHints.email}
              href={mailtoLink}
              ctaLabel="Écrire un e-mail"
            />

            <ContactChannel
              label="Téléphone"
              value={contact.phoneDisplay}
              hint={copy.channelHints.phone}
              href={telLink}
              ctaLabel="Appeler"
            />

            <ContactChannel label="Adresse" value="">
              {addressLines.map((line) => (
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
          <h2 className="mb-3 text-lg font-semibold">{copy.channelGuideHeading}</h2>
          <ul className="space-y-2 text-sm text-[color:var(--color-muted)]">
            {copy.channelGuide.map((item) => (
              <li key={item.channel}>
                <strong className="text-[color:var(--color-fg)]">{item.channel}</strong> —{" "}
                {item.guidance}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
