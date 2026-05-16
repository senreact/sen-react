import type { MetadataRoute } from "next";

import {
  listAnnouncements,
  listEvents,
  listFormalisationSteps,
  listNews,
  listPublications,
  listResources,
  listTrainings,
  listVideos,
} from "@/lib/cms";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://senreact.vercel.app";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
  {
    url: `${BASE_URL}/opportunites`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/annuaire`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/actualites`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/evenements`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/annonces`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  },
  { url: `${BASE_URL}/forum`, lastModified: new Date(), changeFrequency: "daily", priority: 0.6 },
  {
    url: `${BASE_URL}/groupes`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/mentorat`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/sondages`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/formations`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/ressources`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/renforcement`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/formalisation`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/publications`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  },
  { url: `${BASE_URL}/videos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
  {
    url: `${BASE_URL}/secteurs`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/partenaires`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/a-propos`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.4,
  },
  {
    url: `${BASE_URL}/mentions-legales`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/conditions-utilisation`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/confidentialite`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/cookies`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, events, publications, videos, announcements, trainings, resources, formSteps] =
    await Promise.all([
      listNews(200),
      listEvents({ limit: 100 }),
      listPublications(100),
      listVideos(100),
      listAnnouncements(100),
      listTrainings(100),
      listResources(100),
      listFormalisationSteps(),
    ]);

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...news.map((n) => ({
      url: `${BASE_URL}/actualites/${n.slug}`,
      lastModified: new Date(n.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...events.map((e) => ({
      url: `${BASE_URL}/evenements/${e.slug}`,
      lastModified: new Date(e.startsAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...publications.map((p) => ({
      url: `${BASE_URL}/publications/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...videos.map((v) => ({
      url: `${BASE_URL}/videos/${v.slug}`,
      lastModified: new Date(v.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...announcements.map((a) => ({
      url: `${BASE_URL}/annonces/${a.slug}`,
      lastModified: new Date(a.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...trainings.map((t) => ({
      url: `${BASE_URL}/formations/${t.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...resources.map((r) => ({
      url: `${BASE_URL}/ressources/${r.slug}`,
      lastModified: new Date(r.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...formSteps.map((f) => ({
      url: `${BASE_URL}/formalisation/${f.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  return [...STATIC_ROUTES, ...dynamicRoutes];
}
