import { marked } from "marked";

import type { PageText } from "@/lib/content/pages";

/** A page created in the CMS: title, description, an optional cover photo and the text, laid out like a guide article. */
export function CustomPage({ page }: { page: PageText }) {
  return (
    <article className="mx-auto max-w-3xl px-4 pt-10 pb-16 sm:px-6">
      <header>
        <h1 className="text-large-title sm:text-hero">{page.title}</h1>
        <p className="mt-4 text-title3 font-normal text-label-secondary">{page.description}</p>
      </header>
      {page.cover && (
        // eslint-disable-next-line @next/next/no-img-element -- a static export can't optimise images; the CMS already saves uploads as resized WebP.
        <img src={page.cover} alt={page.coverAlt} className="mt-10 w-full rounded-md" />
      )}
      {/* The text is Markdown written in the CMS by the site's own editors, turned into HTML at build time. */}
      <div className="page-body mt-10" dangerouslySetInnerHTML={{ __html: marked.parse(page.body, { async: false }) }} />
    </article>
  );
}
