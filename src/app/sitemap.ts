import type { MetadataRoute } from "next";

import { GUIDE_UPDATED, TOPIC_SLUGS } from "@/lib/content/guide";
import { LANGS, absoluteUrl, pagePath, topicPath, type Lang } from "@/lib/site";

// The site is a static export, so the sitemap is written once at build time.
export const dynamic = "force-static";

/** Every page in both languages, each entry pointing at its translation so search engines pair them up. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { paths: Record<Lang, string>; priority: number }[] = [
    { paths: { es: pagePath("es", "home"), en: pagePath("en", "home") }, priority: 1 },
    { paths: { es: pagePath("es", "guide"), en: pagePath("en", "guide") }, priority: 0.9 },
    ...TOPIC_SLUGS.map((slug) => ({ paths: { es: topicPath("es", slug), en: topicPath("en", slug) }, priority: 0.7 })),
    { paths: { es: pagePath("es", "interest"), en: pagePath("en", "interest") }, priority: 0.6 },
    { paths: { es: pagePath("es", "privacy"), en: pagePath("en", "privacy") }, priority: 0.2 },
  ];
  return pages.flatMap(({ paths, priority }) =>
    LANGS.map((lang) => ({
      url: absoluteUrl(paths[lang]),
      lastModified: GUIDE_UPDATED,
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages: { es: absoluteUrl(paths.es), en: absoluteUrl(paths.en) } },
    })),
  );
}
