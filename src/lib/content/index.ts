import aboutFile from "@content/site/about.json";
import faqFile from "@content/site/faq.json";
import generalFile from "@content/site/general.json";
import homeFile from "@content/site/home.json";
import interestFile from "@content/site/interest.json";
import type { Lang } from "@/lib/site";

import { faqBlocks } from "./faq";
import { TASTE } from "./taste";

// The site's text lives in `content/site/`, where the CMS edits it, each file with the same fields in Spanish and
// English. Typing both languages as the Spanish one fails the build if the English is missing a field.
const GENERAL: Record<Lang, typeof generalFile.es> = generalFile;
const HOME: Record<Lang, typeof homeFile.es> = homeFile;
const FAQ: Record<Lang, typeof faqFile.es> = faqFile;
const INTEREST: Record<Lang, typeof interestFile.es> = interestFile;
const ABOUT: Record<Lang, typeof aboutFile.es> = aboutFile;

/** A text as the CMS saves it, with a blank line between paragraphs, as a list of paragraphs. */
const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

/** Every piece of text on the site in one language, outside the wine guide, the plans and the privacy policy. */
function build(lang: Lang) {
  const { meta: generalMeta, ...general } = GENERAL[lang];
  const { meta: homeMeta, ...home } = HOME[lang];
  const { meta: interestMeta, ...interest } = INTEREST[lang];
  const { meta: aboutMeta, ...about } = ABOUT[lang];
  const faq = FAQ[lang];
  return {
    meta: { home: homeMeta, interest: interestMeta, about: aboutMeta, ...generalMeta },
    ...general,
    home: { ...home, faq: { title: faq.title, questions: faq.questions.map(({ q, a }) => ({ q, a: faqBlocks(a) })) } },
    interest,
    about: {
      ...about,
      founder: { ...about.founder, body: paragraphs(about.founder.body) },
      projects: {
        ...about.projects,
        items: about.projects.items.map(({ name, description }): [string, string] => [name, description]),
      },
      why: { ...about.why, body: paragraphs(about.why.body) },
    },
    taste: TASTE[lang],
  };
}

export type Dictionary = ReturnType<typeof build>;

const DICTIONARIES: Record<Lang, Dictionary> = { es: build("es"), en: build("en") };

export const getDictionary = (lang: Lang) => DICTIONARIES[lang];
