import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/button";
import { getDictionary } from "@/lib/content";
import { LANGS, pagePath } from "@/lib/site";

import { fontVariables } from "./fonts";

import "./globals.css";

export const metadata: Metadata = { title: "404 · Malaka Wine" };

/**
 * The 404 page for any URL the site doesn't have. Each language has its own root layout, so there is no single
 * layout to build this page from: it is a whole document, and it answers in both languages because an unknown URL
 * doesn't say which one the visitor reads.
 */
export default function GlobalNotFound() {
  return (
    <html lang="es" className={fontVariables}>
      <body className="font-sans">
        <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-14 px-4 py-20 text-center">
          {LANGS.map((lang) => {
            const text = getDictionary(lang).notFound;
            return (
              <section key={lang} lang={lang}>
                {lang === LANGS[0] && <p className="text-headline text-tint">{text.eyebrow}</p>}
                <h1 className="mt-2 text-large-title">{text.title}</h1>
                <p className="mt-3 text-body text-label-secondary">{text.body}</p>
                <ButtonLink href={pagePath(lang, "home")} className="mt-6">
                  {text.cta}
                </ButtonLink>
              </section>
            );
          })}
        </main>
      </body>
    </html>
  );
}
