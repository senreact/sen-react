import type { Metadata } from "next";
import { DEFAULT_LOCALE } from "@sen-react/shared";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sen React",
  description:
    "Plateforme dédiée à la transition numérique et écologique des entrepreneurs sénégalais et africains.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={DEFAULT_LOCALE}>
      <body>{children}</body>
    </html>
  );
}
