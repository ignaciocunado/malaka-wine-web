import type { Metadata } from "next";

/** The production origin. Canonical URLs, the sitemap, hreflang links and structured data are all built from it. */
export const SITE_URL = "https://malakawine.com";
export const SITE_NAME = "Malaka Wine";

/** Spanish is the default language and lives at the root; English lives under `/en`. */
export const LANGS = ["es", "en"] as const;
export type Lang = (typeof LANGS)[number];

export type PageKey = "home" | "taste" | "guide";

const PATHS: Record<Lang, Record<PageKey, string>> = {
  es: { home: "/", taste: "/taste", guide: "/vinos-de-malaga" },
  en: { home: "/en", taste: "/en/taste", guide: "/en/malaga-wines" },
};

export const pagePath = (lang: Lang, page: PageKey) => PATHS[lang][page];
/** A page of the wine guide about one area or grape. Slugs are the same in both languages. */
export const topicPath = (lang: Lang, slug: string) => `${PATHS[lang].guide}/${slug}`;

/** Ids of the homepage sections that the navigation links to. */
export const ANCHORS: Record<Lang, { how: string; plans: string; producers: string }> = {
  es: { how: "como-funciona", plans: "planes", producers: "bodegas" },
  en: { how: "how-it-works", plans: "plans", producers: "wineries" },
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
/** The social card: the homepage hero in each language. Regenerate both if the hero or the bottles change. */
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
