import type { Metadata } from "next";

/** The production origin. Canonical URLs, the sitemap, hreflang links and structured data are all built from it. */
export const SITE_URL = "https://malakawine.com";
export const SITE_NAME = "Malaka Wine";

/**
 * Where the "register your interest" form sends each sign-up: the `/exec` URL of the Google Apps Script web app in
 * `scripts/google-sheet/Code.gs`, which adds a row to a Google Sheet (set-up steps are in the README). The URL is
 * public by nature, since the browser posts to it. While it is empty the form shows an error instead of sending.
 */
export const INTEREST_ENDPOINT = "https://script.google.com/macros/s/AKfycbwVdsLVFgoXWWYeG3cG0od7kFOK1Y5zBWozeUz8IZO459jrlwcvqXuFDzDtHTH_FzZqLg/exec";

/**
 * Who is responsible for the personal data the site collects. The privacy policy prints these values.
 * TODO: replace every "[…]" placeholder with the real details before the site goes live.
 */
export const CONTROLLER = {
  name: "MalakaWine",
  taxId: "[NIF/CIF]",
  address: "29016, Malaga",
  email: "info@malakawine.com",
};
/** Date of the current privacy policy. It is saved with each sign-up as the version the person agreed to. */
export const PRIVACY_UPDATED = "2026-11-13";

/** Spanish is the default language and lives at the root; English lives under `/en`. */
export const LANGS = ["es", "en"] as const;
export type Lang = (typeof LANGS)[number];

export type PageKey = "home" | "interest" | "guide" | "privacy";

const PATHS: Record<Lang, Record<PageKey, string>> = {
  es: { home: "/", interest: "/apuntate", guide: "/vinos-de-malaga", privacy: "/privacidad" },
  en: { home: "/en", interest: "/en/register", guide: "/en/malaga-wines", privacy: "/en/privacy" },
};

export const pagePath = (lang: Lang, page: PageKey) => PATHS[lang][page];
/** A page of the wine guide about one area or grape. Slugs are the same in both languages. */
export const topicPath = (lang: Lang, slug: string) => `${PATHS[lang].guide}/${slug}`;
/** A page's path in each language, for its hreflang links and its sitemap entry. */
export const pagePaths = (page: PageKey): Record<Lang, string> => ({ es: pagePath("es", page), en: pagePath("en", page) });
export const topicPaths = (slug: string): Record<Lang, string> => ({ es: topicPath("es", slug), en: topicPath("en", slug) });

/** Ids of the homepage sections that the navigation links to. */
export const ANCHORS: Record<Lang, { how: string; plans: string }> = {
  es: { how: "como-funciona", plans: "planes" },
  en: { how: "how-it-works", plans: "plans" },
};
/** A link to a section of the homepage, e.g. `homeAnchor("en", "plans")` is `/en#plans`. */
export const homeAnchor = (lang: Lang, section: keyof (typeof ANCHORS)[Lang]) =>
  `${PATHS[lang].home}#${ANCHORS[lang][section]}`;

export const absoluteUrl = (path: string) => `${SITE_URL}${path}`;

/** The same page in the other language, for the language switch. Unknown paths go to that language's homepage. */
export function alternatePath(pathname: string, target: Lang) {
  const from: Lang = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "es";
  if (from === target) return pathname;
  // Longest paths first, so a guide page isn't mistaken for the homepage.
  const pages = (Object.keys(PATHS[from]) as PageKey[]).sort((a, b) => PATHS[from][b].length - PATHS[from][a].length);
  for (const page of pages) {
    const base = PATHS[from][page];
    if (pathname === base) return PATHS[target][page];
    if (page !== "home" && pathname.startsWith(`${base}/`)) return PATHS[target][page] + pathname.slice(base.length);
  }
  return PATHS[target].home;
}

const OG_LOCALE: Record<Lang, string> = { es: "es_ES", en: "en_GB" };
/** The social card: the homepage hero in each language. `scripts/3d/posters.mjs` regenerates both. */
export const ogImage = (lang: Lang) => ({ url: `/og-${lang}.jpg`, width: 1200, height: 630 });

/**
 * Metadata for one page: its title and description, its canonical URL, the hreflang links to both language
 * versions, and the social cards. `paths` holds the page's path in each language.
 */
export function pageMetadata({
  lang,
  title,
  description,
  keywords,
  paths,
  type = "website",
}: {
  lang: Lang;
  title: string;
  description: string;
  keywords?: string[];
  paths: Record<Lang, string>;
  type?: "website" | "article";
}): Metadata {
  const other: Lang = lang === "es" ? "en" : "es";
  const image = ogImage(lang);
  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: {
      canonical: paths[lang],
      languages: { es: paths.es, en: paths.en, "x-default": paths.es },
    },
    openGraph: {
      title,
      description,
      url: paths[lang],
      siteName: SITE_NAME,
      locale: OG_LOCALE[lang],
      alternateLocale: OG_LOCALE[other],
      type,
      images: [{ ...image, alt: SITE_NAME }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}
