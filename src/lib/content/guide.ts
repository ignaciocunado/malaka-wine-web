import fs from "node:fs";
import path from "node:path";

import overviewFile from "@content/guide/overview.json";
import province from "@/components/scene/data/province.json";
import type { Lang } from "@/lib/site";

/**
 * The guide to Málaga wines: one overview page plus a page for each wine area and grape. Unlike the catalog, this
 * is real reference content about the province, written to answer the questions people search for. Headings are
 * phrased as questions and each section opens with the direct answer.
 */

export type Section = { heading: string; body: string[] };
export type TopicKind = "zone" | "grape";

export type Topic = {
  slug: string;
  kind: TopicKind;
  /** Short name, used in links and breadcrumbs. */
  name: string;
  /** One line under the name on the overview page. */
  summary: string;
  title: string;
  metaTitle: string;
  description: string;
  intro: string;
  /** Quick reference table: label and value. */
  facts: [string, string][];
  sections: Section[];
};

export type Guide = {
  metaTitle: string;
  description: string;
  keywords: string[];
  eyebrow: string;
  title: string;
  intro: string;
  /** Sections before the lists of areas and grapes. */
  opening: Section[];
  zones: Section;
  grapes: Section;
  /** Sections after them. */
  closing: Section[];
  cta: { title: string; body: string; button: string };
  labels: {
    breadcrumbHome: string;
    kind: Record<TopicKind, string>;
    facts: string;
    related: string;
    backToGuide: string;
    updated: string;
    /** The relief table of the province at the top of the areas section. */
    table: { alt: string; hint: string; whole: string; city: string; credit: string };
  };
  topics: Topic[];
};

// The guide lives in `content/guide/`, where the CMS edits it: `overview.json` for the overview page and one file
// per area or grape in `topics/`, named after its slug. Each holds the same fields in Spanish and English.

/** A section as the CMS saves it: its paragraphs in one text, separated by blank lines. */
type SectionText = { heading: string; body: string };
/** A topic's file in `content/guide/topics/`, in one language. */
type TopicText = Omit<Topic, "slug" | "kind" | "facts" | "sections"> & {
  /** Its place in the guide's lists. */
  order: number;
  facts: { label: string; value: string }[];
  sections: SectionText[];
};

const section = ({ heading, body }: SectionText): Section => ({
  heading,
  body: body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean),
});

// Typing both languages as the Spanish one fails the build if the English is missing a field.
const OVERVIEW: Record<Lang, typeof overviewFile.es> = overviewFile;

// Topic files are read at build time, so a new file is a new page. Only server code imports this module.
const TOPICS_DIR = path.join(process.cwd(), "content/guide/topics");
const TOPIC_FILES = fs
  .readdirSync(TOPICS_DIR)
  .filter((file) => file.endsWith(".json"))
  .map((file) => ({
    slug: file.slice(0, -".json".length),
    text: JSON.parse(fs.readFileSync(path.join(TOPICS_DIR, file), "utf8")) as Record<Lang, TopicText>,
  }))
  .sort((a, b) => a.text.es.order - b.text.es.order || a.slug.localeCompare(b.slug));

function build(lang: Lang): Guide {
  const overview = OVERVIEW[lang];
  return {
    ...overview,
    opening: overview.opening.map(section),
    zones: section(overview.zones),
    grapes: section(overview.grapes),
    closing: overview.closing.map(section),
    topics: TOPIC_FILES.map(({ slug, text }): Topic => ({
      ...text[lang],
      slug,
      // The wine areas are the places on the relief table; any other topic, such as one added in the CMS, is a grape.
      kind: slug in province.places ? "zone" : "grape",
      facts: text[lang].facts.map(({ label, value }) => [label, value]),
      sections: text[lang].sections.map(section),
    })),
  };
}

const GUIDES: Record<Lang, Guide> = { es: build("es"), en: build("en") };

/** Shown on the pages and published in their structured data. Update it when the guide's content changes. */
export const GUIDE_UPDATED = OVERVIEW.es.updated;

export const getGuide = (lang: Lang) => GUIDES[lang];
export const TOPIC_SLUGS = TOPIC_FILES.map((topic) => topic.slug);
