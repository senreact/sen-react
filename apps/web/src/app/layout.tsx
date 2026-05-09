import type { Metadata } from "next";
import { DEFAULT_LOCALE } from "@sen-react/shared";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteFooter, getSiteHeader } from "@/lib/cms";

import "./globals.css";

export const metadata: Metadata = {
  title: "Sen React",
  description:
    "Plateforme dédiée à la transition numérique et écologique des entrepreneurs sénégalais et africains.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [headerData, footerData] = await Promise.all([getSiteHeader(), getSiteFooter()]);

  return (
    <html lang={DEFAULT_LOCALE}>
      <body className="flex min-h-screen flex-col">
        <SiteHeader data={headerData} />
        <div className="flex-1">{children}</div>
        <SiteFooter data={footerData} />
      </body>
    </html>
  );
}
