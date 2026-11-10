import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { fontVariables } from "@/app/fonts";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_NAME, SITE_URL, type Lang } from "@/lib/site";
import { siteJsonLd } from "@/lib/structured-data";

import { AgeGate } from "./age-gate";
import { Footer } from "./footer";
import { NavBar } from "./nav-bar";

import "@/app/globals.css";

/**
 * The site has one root layout per language (`app/(es)/layout.tsx` and `app/en/layout.tsx`) so that each page's
 * `<html lang>` is right in the static HTML. Both render this document and export this metadata and viewport.
 */
export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  formatDetection: { telephone: false },
};

export const rootViewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export function RootDocument({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <html lang={lang} className={fontVariables} data-scroll-behavior="smooth">
      <body className="flex min-h-dvh flex-col font-sans">
        <JsonLd data={siteJsonLd(lang)} />
        <NavBar lang={lang} />
        <main className="flex-1">{children}</main>
        <Footer lang={lang} />
        <AgeGate lang={lang} />
      </body>
    </html>
  );
}
