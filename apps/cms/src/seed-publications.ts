/**
 * Seed the 6 REACT publications migrated from the old site's Google Docs.
 *
 * Each publication is now web-native: the doc's rich text becomes the
 * Lexical `body` (with inline images), the largest image becomes the hero
 * (`coverImage`), and the doc's PDF export is attached as the optional
 * downloadable `file`.
 *
 * Source content is fetched live from Google Docs' public export endpoints
 * (HTML for the body/images, PDF for the download) and converted by
 * `convertGoogleDocHtml`. Idempotent: media items are deduped by `alt` and
 * publications are upserted by `slug`, so re-running is safe.
 *
 *   pnpm --filter @sen-react/cms exec tsx src/seed-publications.ts
 *
 * NODE_ENV is forced to "production" so the postgres adapter skips dev-mode
 * schema push (same rationale as src/seed.ts).
 */

(process.env as Record<string, string>).NODE_ENV = "production";

import { getPayload } from "payload";
import { fileURLToPath } from "url";

import config from "./payload.config";
import { convertGoogleDocHtml, type ExtractedImage } from "./lib/gdoc-to-lexical";

type Payload = Awaited<ReturnType<typeof getPayload>>;

interface PubSeed {
  docId: string;
  slug: string;
  title: string;
  summary: string;
  sector: string | null;
  authors: { name: string; role?: string }[];
  publishedAt: string; // ISO date
}

const REACT_AUTHOR = { name: "REACT", role: "Réseau des Entrepreneurs Actifs" };

const PUBLICATIONS: PubSeed[] = [
  {
    docId: "1J56cWywOE2gnAXXBI1C-zsnYn7mPbIhO",
    slug: "entrepreneuriat-numerique-emplois-verts-senegal",
    title:
      "Promouvoir l'entrepreneuriat numérique et les emplois verts pour une économie durable au Sénégal",
    summary:
      "Comment l'entrepreneuriat numérique et les emplois verts peuvent accélérer la transformation économique du Sénégal tout en priorisant la durabilité environnementale — en libérant le potentiel des jeunes et des femmes.",
    sector: "digitalisation-technologie",
    authors: [REACT_AUTHOR],
    publishedAt: "2025-12-01",
  },
  {
    docId: "1B7beRr26sepbAzgMQ0DSmvD_h83YbWYZ",
    slug: "defi-ia-afrique-adopter-adapter",
    title: "Le défi de l'IA en Afrique : adopter et adapter dès maintenant",
    summary:
      "L'Afrique face au tournant de l'intelligence artificielle : adopter et adapter dès maintenant les avantages de l'IA, ou risquer d'en subir les effets. Une réflexion sur la souveraineté technologique du continent.",
    sector: "digitalisation-technologie",
    authors: [REACT_AUTHOR],
    publishedAt: "2025-11-10",
  },
  {
    docId: "1_lC08ovhryILJYz1niGtFBSeCVMb4zSx",
    slug: "inclusion-numerique-agriculture-transition-ecologique",
    title:
      "Tirer profit de l'inclusion numérique comme levier de croissance durable dans le secteur agricole",
    summary:
      "L'inclusion numérique comme levier de croissance durable dans l'agriculture sénégalaise : données, prise de décision et transition écologique au service des filières fruits et légumes.",
    sector: "agroecologie",
    authors: [REACT_AUTHOR],
    publishedAt: "2023-04-10",
  },
  {
    docId: "1ykA_-T4mN_RlEF8ePWovycCyfn4F48yM",
    slug: "formalisation-autonomisation-femmes-jeunes",
    title:
      "La formalisation et l'autonomisation des femmes et des jeunes : un impératif pour un développement durable",
    summary:
      "Formaliser et autonomiser les femmes et les jeunes entrepreneurs : un impératif pour un développement économique durable au Sénégal, à l'heure de la double transition numérique et écologique.",
    sector: "entrepreneuriat-local",
    authors: [REACT_AUTHOR],
    publishedAt: "2025-12-01",
  },
  {
    docId: "1bvZhcs0UG-Hs3vuzlpQVaxTZXF_DbUpW",
    slug: "politique-digitale-no-cash",
    title:
      "La politique digitale « no cash » : un levier de transparence, d'inclusion et de développement durable",
    summary:
      "La politique digitale « no cash » comme levier de transparence, d'inclusion financière et de développement durable — modernisation des paiements, traçabilité et opportunités pour tous.",
    sector: "digitalisation-technologie",
    authors: [REACT_AUTHOR],
    publishedAt: "2026-02-20",
  },
  {
    docId: "13QfoTEHo6QLLrDe5eZZ3EFOUPmAcl-D8",
    slug: "presentation-directeur-executif-react-amadou-samb",
    title: "Présentation du Directeur Exécutif du REACT — Elhadj Amadou Samb",
    summary:
      "Portrait d'Elhadj Amadou Samb, Directeur Exécutif du REACT — spécialiste en gouvernance démocratique, participation citoyenne et économie digitale, acteur de changement africain.",
    sector: null,
    authors: [],
    publishedAt: "2025-12-01",
  },
];

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`Fetch ${url} → HTTP ${res.status}`);
  return res.text();
}

async function fetchBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`Fetch ${url} → HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

/** Dedupe media by `alt`; upload the buffer the first time, reuse thereafter. */
async function ensureMedia(
  payload: Payload,
  alt: string,
  buffer: Buffer,
  mimetype: string,
  name: string,
): Promise<number> {
  const existing = await payload.find({
    collection: "media",
    where: { alt: { equals: alt } },
    limit: 1,
    depth: 0,
  });
  if (existing.docs[0]) {
    return existing.docs[0].id as number;
  }
  const created = await payload.create({
    collection: "media",
    data: { alt },
    file: { data: buffer, mimetype, name, size: buffer.length },
  });
  return created.id as number;
}

interface LexChild {
  type: string;
  children?: { text?: string }[];
}

const stripAccents = (s: string): string => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
const norm = (s: string): string =>
  stripAccents(s)
    .toLowerCase()
    .replace(/^\s*th[eè]me\s*:\s*/i, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const DATE_LINE = /^\s*\d{1,2}\s+[a-zA-ZÀ-ÿ]+\s+\d{4}\s*$/;

/**
 * Drop the leading date line and title line(s) the doc repeats at the top —
 * they duplicate the publication's `publishedAt` and `title` metadata. Only
 * trims the first few blocks, stopping at the first real content paragraph.
 */
function trimLeadingChrome(root: Record<string, unknown>, title: string): void {
  const wrapper = root.root as { children: LexChild[] };
  const children = wrapper.children;
  const titleKey = norm(title).slice(0, 40);
  let cut = 0;
  for (let i = 0; i < Math.min(children.length, 4); i++) {
    const c = children[i];
    if (!c) break;
    if (c.type === "upload") break; // reached the hero/inline image; stop
    const text = (c.children ?? []).map((t) => t.text ?? "").join("").trim();
    if (!text) {
      cut = i + 1;
      continue;
    }
    if (DATE_LINE.test(text)) {
      cut = i + 1;
      continue;
    }
    const nt = norm(text);
    if (titleKey.length > 8 && (nt.includes(titleKey) || titleKey.includes(nt))) {
      cut = i + 1;
      continue;
    }
    break;
  }
  if (cut > 0) wrapper.children = children.slice(cut);
}

async function upsertPublication(payload: Payload, data: Record<string, unknown>): Promise<void> {
  const slug = data.slug as string;
  const existing = await payload.find({
    collection: "publications",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  });
  const payloadData = { ...data, _status: "published" } as never;
  if (existing.docs[0]) {
    await payload.update({ collection: "publications", id: existing.docs[0].id, data: payloadData });
  } else {
    await payload.create({ collection: "publications", data: payloadData });
  }
}

async function seedOne(payload: Payload, pub: PubSeed): Promise<void> {
  const htmlUrl = `https://docs.google.com/document/d/${pub.docId}/export?format=html`;
  const pdfUrl = `https://docs.google.com/document/d/${pub.docId}/export?format=pdf`;

  payload.logger.info(`[pub-seed] ${pub.slug}: fetching source`);
  const [html, pdf] = await Promise.all([fetchText(htmlUrl), fetchBuffer(pdfUrl)]);

  const { images, toLexical } = convertGoogleDocHtml(html);
  const used = images.filter((i): i is ExtractedImage => i.role === "hero" || i.role === "inline");

  // Upload hero + inline images, mapping image index → Media id.
  const mediaIdByIndex = new Map<number, number>();
  let coverImageId: number | null = null;
  for (const img of used) {
    const role = img.role === "hero" ? "couverture" : "illustration";
    const alt = `${pub.title} — ${role} ${img.index + 1}`;
    const id = await ensureMedia(
      payload,
      alt,
      img.buffer,
      img.mime,
      `${pub.slug}-img-${img.index + 1}.${img.ext}`,
    );
    mediaIdByIndex.set(img.index, id);
    if (img.role === "hero") coverImageId = id;
  }

  const body = toLexical(mediaIdByIndex);
  trimLeadingChrome(body, pub.title);

  // Upload the PDF export as the optional downloadable file.
  const pdfId = await ensureMedia(
    payload,
    `${pub.title} — PDF`,
    pdf,
    "application/pdf",
    `${pub.slug}.pdf`,
  );

  await upsertPublication(payload, {
    slug: pub.slug,
    title: pub.title,
    summary: pub.summary,
    sector: pub.sector,
    authors: pub.authors,
    language: "fr",
    publishedAt: new Date(pub.publishedAt).toISOString(),
    body,
    coverImage: coverImageId,
    file: pdfId,
  });

  payload.logger.info(
    `[pub-seed] ${pub.slug}: done (images used=${used.length}, hero=${coverImageId != null}, pdf=${(
      pdf.length / 1024
    ).toFixed(0)}KB)`,
  );
}

async function main(): Promise<void> {
  const payload = await getPayload({ config });
  for (const pub of PUBLICATIONS) {
    await seedOne(payload, pub);
  }
  payload.logger.info("[pub-seed] All publications seeded.");
}

if (import.meta.url === `file://${fileURLToPath(import.meta.url)}`) {
  main()
    .then(() => process.exit(0))
    .catch((err: unknown) => {
      console.error("[pub-seed] failed:", err);
      process.exit(1);
    });
}
