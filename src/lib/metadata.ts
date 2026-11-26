import type { Metadata } from "next";

import { getDictionary } from "./content";
import { getGuide, type Topic } from "./content/guide";
import { pageMetadata, pagePaths, topicPaths, type Lang } from "./site";

export function homeMetadata(lang: Lang): Metadata {
  return pageMetadata({ lang, ...getDictionary(lang).meta.home, paths: pagePaths("home") });
}

export function interestMetadata(lang: Lang): Metadata {
  return pageMetadata({ lang, ...getDictionary(lang).meta.interest, paths: pagePaths("interest") });
}

export function privacyMetadata(lang: Lang): Metadata {
  return pageMetadata({ lang, ...getDictionary(lang).meta.privacy, paths: pagePaths("privacy") });
}

export function guideMetadata(lang: Lang): Metadata {
  const { metaTitle, description, keywords } = getGuide(lang);
  return pageMetadata({ lang, title: metaTitle, description, keywords, paths: pagePaths("guide"), type: "article" });
}

export function topicMetadata(lang: Lang, topic: Topic): Metadata {
  return pageMetadata({
    lang,
    title: topic.metaTitle,
    description: topic.description,
    paths: topicPaths(topic.slug),
    type: "article",
  });
}
