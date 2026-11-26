import type { Metadata } from "next";

import { getDictionary } from "./content";
import { getGuide, type Topic } from "./content/guide";
import { customPagePaths, type CustomPage } from "./content/pages";
import { SITE_NAME, pageMetadata, pagePath, topicPath, type Lang, type PageKey } from "./site";

const paths = (page: PageKey) => ({ es: pagePath("es", page), en: pagePath("en", page) });

export function homeMetadata(lang: Lang): Metadata {
  return pageMetadata({ lang, ...getDictionary(lang).meta.home, paths: paths("home") });
}

export function interestMetadata(lang: Lang): Metadata {
  return pageMetadata({ lang, ...getDictionary(lang).meta.interest, paths: paths("interest") });
}

export function privacyMetadata(lang: Lang): Metadata {
  return pageMetadata({ lang, ...getDictionary(lang).meta.privacy, paths: paths("privacy") });
}

export function aboutMetadata(lang: Lang): Metadata {
  return pageMetadata({ lang, ...getDictionary(lang).meta.about, paths: paths("about") });
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

export function customPageMetadata(lang: Lang, page: CustomPage): Metadata {
  const { title, description } = page[lang];
  return pageMetadata({ lang, title: `${title} | ${SITE_NAME}`, description, paths: customPagePaths(page), type: "article" });
}
