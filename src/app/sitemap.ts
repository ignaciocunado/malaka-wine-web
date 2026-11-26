import type { MetadataRoute } from "next";

import { GUIDE_UPDATED, TOPIC_SLUGS } from "@/lib/content/guide";
import { LANGS, absoluteUrl, pagePaths, topicPaths, type Lang } from "@/lib/site";

// The site is a static export, so the sitemap is written once at build time.
export const dynamic = "force-static";

/** Every page in both languages, each entry pointing at its translation so search engines pair them up. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { paths: Record<Lang, string>; priority: number }[] = [
    { paths: pagePaths("home"), priority: 1 },
    { paths: pagePaths("guide"), priority: 0.9 },
    ...TOPIC_SLUGS.map((slug) => ({ paths: topicPaths(slug), priority: 0.7 })),
    { paths: pagePaths("interest"), priority: 0.6 },
    { paths: pagePaths("privacy"), priority: 0.2 },
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
