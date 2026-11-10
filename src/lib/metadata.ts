import type { Metadata } from "next";

import { getDictionary } from "./content";
import { getGuide, type Topic } from "./content/guide";
import { pageMetadata, pagePath, topicPath, type Lang, type PageKey } from "./site";

const paths = (page: PageKey) => ({ es: pagePath("es", page), en: pagePath("en", page) });

export function homeMetadata(lang: Lang): Metadata {
  return pageMetadata({ lang, ...getDictionary(lang).meta.home, paths: paths("home") });
}

export function tasteMetadata(lang: Lang): Metadata {
  return pageMetadata({ lang, ...getDictionary(lang).meta.taste, paths: paths("taste") });
}

export function guideMetadata(lang: Lang): Metadata {
  const { metaTitle, description, keywords } = getGuide(lang);
  return pageMetadata({ lang, title: metaTitle, description, keywords, paths: paths("guide"), type: "article" });
}

export function topicMetadata(lang: Lang, topic: Topic): Metadata {
  return pageMetadata({
    lang,
    title: topic.metaTitle,
    description: topic.description,
    paths: { es: topicPath("es", topic.slug), en: topicPath("en", topic.slug) },
    type: "article",
  });
}
