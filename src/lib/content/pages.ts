import fs from "node:fs";
import path from "node:path";

import { LANGS, customPagePath, type Lang } from "@/lib/site";

/** A page created in the CMS, in one language. */
export type PageText = {
  /** The end of its address in this language: `catas` is served at /catas, `tastings` at /en/tastings. */
  slug: string;
  title: string;
  /** Shown under the title, and the description search engines get. */
  description: string;
  /** Cover photo, e.g. `/uploads/bodega.webp`, and what it shows. Empty when the page has none. */
  cover: string;
  coverAlt: string;
  /** The page's text, in Markdown. */
  body: string;
};
export type CustomPage = Record<Lang, PageText>;

// One file per page in `content/pages/`, with every field in Spanish and English, the address included. Read at
// build time, so a new file is a new page. Only server code imports this module.
const PAGES_DIR = path.join(process.cwd(), "content/pages");
export const CUSTOM_PAGES: CustomPage[] = fs.existsSync(PAGES_DIR)
  ? fs
      .readdirSync(PAGES_DIR)
      .filter((file) => file.endsWith(".json"))
      .sort()
      .map((file) => JSON.parse(fs.readFileSync(path.join(PAGES_DIR, file), "utf8")))
  : [];

/**
 * Addresses the site already uses, in either language. The CMS refuses them too (the `slug` pattern in
 * `public/admin/config.yml`, which lists the same words); this catches a file edited by hand.
 */
const RESERVED = [
  "en",
  "apuntate",
  "privacidad",
  "vinos-de-malaga",
  "quienes-somos",
  "register",
  "privacy",
  "malaga-wines",
  "about",
  "admin",
  "uploads",
  "3d",
  "taste",
];
for (const lang of LANGS) {
  const slugs = CUSTOM_PAGES.map((page) => page[lang].slug);
  for (const slug of slugs) {
    if (RESERVED.includes(slug)) throw new Error(`content/pages: the address "${slug}" is already used by the site.`);
    if (slugs.indexOf(slug) !== slugs.lastIndexOf(slug)) throw new Error(`content/pages: two pages have the address "${slug}".`);
  }
}

export const findPage = (lang: Lang, slug: string) => CUSTOM_PAGES.find((page) => page[lang].slug === slug);

/** A page's address in each language. */
export const customPagePaths = (page: CustomPage): Record<Lang, string> => ({
  es: customPagePath("es", page.es.slug),
  en: customPagePath("en", page.en.slug),
});

/** Each page's address mapped to its translation's, for the language switch: the two can't be worked out from each other. */
export const PAGE_ALTERNATES: Record<string, string> = Object.fromEntries(
  CUSTOM_PAGES.flatMap((page) => {
    const paths = customPagePaths(page);
    return [
      [paths.es, paths.en],
      [paths.en, paths.es],
    ];
  }),
);

/**
 * The `[slug]` routes' pages in one language. A static export can't have a dynamic route with no pages, so until
 * there is one this returns a hidden placeholder address, `_`, which renders the 404 page.
 */
export function pageParams(lang: Lang) {
  const params = CUSTOM_PAGES.map((page) => ({ slug: page[lang].slug }));
  return params.length ? params : [{ slug: "_" }];
}
