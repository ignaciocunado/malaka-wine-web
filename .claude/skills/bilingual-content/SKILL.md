---
name: bilingual-content
description: How to change anything a visitor sees on the Malaka Wine site in both Spanish and English. Use before editing visible text or copy, page metadata, SEO keywords, alt text, FAQ answers, the wine guide, the privacy policy or the plans in the catalog, and before adding, renaming or removing a page or route.
---

# Bilingual content

Every change a visitor can see is made in Spanish and English in the same change. Spanish is the default language
(served at `/`); English is served under `/en`.

## Where the text lives

| File | What it holds | What TypeScript catches |
| --- | --- | --- |
| `src/lib/content/es.ts`, `en.ts` | All site text outside the guide and the privacy policy, key for key (including page `meta`, FAQ and the 404 page) | A key missing from `en.ts`. Not a Spanish value that changed while the English one went stale |
| `src/lib/content/guide.ts` | The wine guide: an `es` and an `en` `Guide`, with the same topic slugs in both | Missing fields. Not a different number or order of sections, facts or list items: keep those in step by hand |
| `src/lib/content/privacy.ts` | Both privacy policies | Missing fields. When the policy changes, also update `PRIVACY_UPDATED` in `src/lib/site.ts` |
| `src/lib/catalog.ts` | Plan text as `{ es, en }` pairs | A pair missing a language |
| `src/lib/site.ts` | `PATHS` and `ANCHORS`: each language has its own slugs | A page missing from one language |
| `public/llms.txt` | Plain-text summary for AI assistants, linking both languages | Nothing: update it by hand |

## How to write each language

Follow the copy that is already there:

- **Spanish**: Spanish from Spain, speaking to the reader as *tú* ("Déjanos tu email", "Elige tu caja").
- **English**: British spelling, as in `en.ts` ("colour", "favourite"); the site's English locale is `en-GB`.
- Place, grape and appellation names stay in Spanish, accents included, in both languages: Axarquía, Montes de
  Málaga, Serranía de Ronda, Moscatel de Alejandría, Pedro Ximénez, Romé, DO Málaga.
- Translate the meaning, not the words. Each version should read as if it had been written in that language first.
- SEO keywords are chosen for how people search in each language, not translated from the other list.

## Steps

1. Make the change in one language, then the same change in the other.
2. Run `humanizer:humanizer` on the new or edited copy in both languages. The skills table in `CLAUDE.md` says
   which other skills apply.
3. For a new page, follow the checklist below.
4. Run `npm run typecheck`.
5. In your reply, list what changed under **ES** and **EN**, so both can be checked.

## Adding a page

1. Add its path in both languages to `PATHS` in `src/lib/site.ts`. Each language gets its own slug, as with
   `/apuntate` and `/en/register`.
2. Write one shared component under `src/components/` that takes `lang`.
3. Add a thin route file under each language, `src/app/(es)/<slug>/page.tsx` and `src/app/en/<slug>/page.tsx`,
   that exports the page's metadata and renders the shared component (see `src/app/(es)/apuntate/page.tsx`).
4. Add the page's `meta` title and description to `es.ts` and `en.ts`, and a builder for it in
   `src/lib/metadata.ts`.
5. Add it to `src/app/sitemap.ts` and `public/llms.txt`.
6. Link it from the nav or footer if visitors need to reach it.

The language switch needs no work: `alternatePath` in `src/lib/site.ts` follows `PATHS`.
