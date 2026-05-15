import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://senreact.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/connexion", "/inscription", "/admin", "/api/", "/mon-profil"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
