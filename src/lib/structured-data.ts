import { getCatalog } from "./catalog";
import { getDictionary } from "./content";
import { faqAnswerText, type FaqQuestion } from "./content/faq";
import { GUIDE_UPDATED, getGuide, type Section, type Topic } from "./content/guide";
import { LINKEDIN_URL, SITE_NAME, SITE_URL, absoluteUrl, homeAnchor, ogImage, pagePath, topicPath, type Lang } from "./site";

/**
 * schema.org descriptions of the site's pages, published as JSON-LD so search engines and AI assistants can read
 * what Malaka is without guessing from the layout. Everything here repeats text that is visible on the page.
 */

type Thing = Record<string, unknown>;

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const graph = (...things: Thing[]) => ({ "@context": "https://schema.org", "@graph": things });

/** Who runs the site. Add social profiles to `sameAs` as they open. */
export function siteJsonLd(lang: Lang) {
  const { meta } = getDictionary(lang);
  return graph(
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
      alternateName: "Malaka",
      url: SITE_URL,
      logo: absoluteUrl("/logo.png"),
      image: absoluteUrl(ogImage(lang).url),
      description: meta.home.description,
      address: { "@type": "PostalAddress", addressLocality: "Málaga", addressRegion: "Andalucía", addressCountry: "ES" },
      areaServed: { "@type": "Country", name: "Spain" },
      sameAs: [LINKEDIN_URL],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: ["es", "en"],
      publisher: { "@id": ORGANIZATION_ID },
    },
  );
}

const faqPage = (questions: { q: string; a: string }[]): Thing => ({
  "@type": "FAQPage",
  mainEntity: questions.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
});

export function homeFaqJsonLd(lang: Lang) {
  const questions = getDictionary(lang).home.faq.questions.map(({ q, a }: FaqQuestion) => ({ q, a: faqAnswerText(a) }));
  return graph(faqPage(questions));
}

/**
 * The subscription plans and their prices. Only publish this once the catalog holds the real plans: structured
 * prices that don't match what a customer can actually buy break search engines' rules.
 */
export function plansJsonLd(lang: Lang) {
  return graph(
    ...getCatalog(lang).plans.map((plan) => ({
      "@type": "Product",
      name: `${SITE_NAME} ${plan.name}`,
      description: `${plan.tagline} ${plan.contents}`,
      image: absoluteUrl(ogImage(lang).url),
      brand: { "@id": ORGANIZATION_ID },
      offers: {
        "@type": "Offer",
        url: absoluteUrl(homeAnchor(lang, "plans")),
        price: (plan.priceCents / 100).toFixed(2),
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        eligibleRegion: { "@type": "Country", name: "Spain" },
        seller: { "@id": ORGANIZATION_ID },
      },
    })),
  );
}

const breadcrumbs = (items: [name: string, path: string][]): Thing => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], index) => ({
    "@type": "ListItem",
    position: index + 1,
    name,
    item: absoluteUrl(path),
  })),
});

const article = (lang: Lang, headline: string, description: string, path: string): Thing => ({
  "@type": "Article",
  headline,
  description,
  inLanguage: lang,
  url: absoluteUrl(path),
  mainEntityOfPage: absoluteUrl(path),
  image: absoluteUrl(ogImage(lang).url),
  datePublished: GUIDE_UPDATED,
  dateModified: GUIDE_UPDATED,
  author: { "@id": ORGANIZATION_ID },
  publisher: { "@id": ORGANIZATION_ID },
});

/** The guide's headings are questions, so each section doubles as a question and its answer. */
const sectionsFaq = (sections: Section[]) => faqPage(sections.map(({ heading, body }) => ({ q: heading, a: body.join(" ") })));

export function guideJsonLd(lang: Lang) {
  const guide = getGuide(lang);
  const path = pagePath(lang, "guide");
  return graph(
    article(lang, guide.title, guide.description, path),
    breadcrumbs([
      [guide.labels.breadcrumbHome, pagePath(lang, "home")],
      [guide.title, path],
    ]),
    sectionsFaq([...guide.opening, guide.zones, guide.grapes, ...guide.closing]),
  );
}

export function topicJsonLd(lang: Lang, topic: Topic) {
  const guide = getGuide(lang);
  const path = topicPath(lang, topic.slug);
  return graph(
    article(lang, topic.title, topic.description, path),
    breadcrumbs([
      [guide.labels.breadcrumbHome, pagePath(lang, "home")],
      [guide.labels.backToGuide, pagePath(lang, "guide")],
      [topic.name, path],
    ]),
    sectionsFaq(topic.sections),
  );
}
