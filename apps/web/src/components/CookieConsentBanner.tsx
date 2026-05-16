"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie-consent";
type ConsentStatus = "accepted" | "declined" | null;

export function CookieConsentBanner({ gaId }: { gaId?: string }) {
  const [status, setStatus] = useState<ConsentStatus | "loading">("loading");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ConsentStatus;
    setStatus(stored ?? null);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setStatus("accepted");
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setStatus("declined");
  }

  const showBanner = status === null;
  const loadGa = status === "accepted" && !!gaId;

  return (
    <>
      {loadGa && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      )}
      {showBanner && (
        <div
          role="dialog"
          aria-label="Préférences de cookies"
          aria-live="polite"
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white px-4 py-4 shadow-lg sm:px-6"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[color:var(--color-fg)]">
              Nous utilisons des cookies analytiques (Google Analytics) pour comprendre comment la
              plateforme est utilisée.{" "}
              <a
                href="/cookies"
                className="text-[color:var(--color-accent)] underline hover:no-underline"
              >
                En savoir plus
              </a>
              .
            </p>
            <div className="flex shrink-0 gap-3">
              <button
                onClick={decline}
                className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-[color:var(--color-fg)] hover:bg-gray-50"
              >
                Refuser
              </button>
              <button
                onClick={accept}
                className="rounded bg-[color:var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Accepter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
