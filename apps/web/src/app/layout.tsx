import type { Metadata } from "next";
import Script from "next/script";
import { DEFAULT_LOCALE } from "@sen-react/shared";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteFooter, getSiteHeader } from "@/lib/cms";

import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://senreact.vercel.app";
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Sen React",
    template: "%s — Sen React",
  },
  description:
    "Plateforme dédiée à la transition numérique et écologique des entrepreneurs sénégalais et africains.",
  openGraph: {
    siteName: "Sen React",
    locale: "fr_SN",
    type: "website",
    title: "Sen React",
    description:
      "Plateforme dédiée à la transition numérique et écologique des entrepreneurs sénégalais et africains.",
    url: BASE_URL,
    images: [
      {
        url: "/logo-react.jpg",
        width: 1200,
        height: 630,
        alt: "Sen React — Réseau des Entrepreneurs Actifs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sen React",
    description:
      "Plateforme dédiée à la transition numérique et écologique des entrepreneurs sénégalais et africains.",
    images: ["/logo-react.jpg"],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [headerData, footerData] = await Promise.all([getSiteHeader(), getSiteFooter()]);

  return (
    <html lang={DEFAULT_LOCALE}>
      <body className="flex min-h-screen flex-col">
        <SiteHeader data={headerData} />
        <div className="flex-1">{children}</div>
        <SiteFooter data={footerData} />
        {GA_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
