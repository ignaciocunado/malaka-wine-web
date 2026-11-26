@AGENTS.md

# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

# Malaka Wine: project rules

These apply to every task in this repository, without being asked.

## Every change is bilingual

The site is in Spanish (the default, at `/`) and English (under `/en`). Anything a visitor can see (text, a new page, metadata, alt text, an error message) changes in both languages in the same change.

- Before changing text, pages, metadata or routes, invoke the `bilingual-content` skill. It lists where each kind of text lives and the steps for adding a page.
- A Stop hook (`.claude/hooks/bilingual-check.mjs`) checks this at the end of each turn. If a change really applies to one language only (a Spanish typo, say), say so in your reply.
- End your reply with what changed, split into **ES** and **EN**.

## Every change follows the design system

The **Malaka Wine design system** is the source of truth for how the site looks and sounds: logos, colours, type, spacing, radii, graphic devices, iconography and voice. It is a Design System artifact on claude.ai: https://claude.ai/artifact/LNNjX61VmHZvMGv16qy924.

- Before any change a visitor can see (markup, styles, images, icons, copy), read the design system's `project/README.md` and `project/tokens.json` with the Artifact tool (`action: "read"`, `url` above, `path` set to the file). Logo files are uploaded assets listed in `project/design-system.json` under `assetGroups.Logos`; read one with its `blob` id as `path`.
- Build with the code's names for the design system's tokens (table below), never with raw values or new ones. A colour, size, radius or spacing step that isn't in the design system needs the owner's yes first.
- Use the supplied logo files as they are. Never redraw, retype, recolour, mirror or approximate a mark, and keep the design system's clear space and minimum widths. Logo files the site uses live in `public/brand/` and `src/app/` (see below).
- Icons are simple line icons, 1.75px stroke, round ends (`src/components/ui/icons.tsx`). No emoji.
- Copy follows the README's Voice section: *tú* in Spanish, no size or leadership claims without evidence, no prices or wineries until they are confirmed, «Bebe con moderación · +18» on promotional pieces.
- If the design system can't be read in the session, work from the table below and say so in your reply. If a change can't follow the design system, or the design system and this file disagree, stop and ask; don't pick silently.
- When the design system changes, update the code and the table below in the same change.
- In your reply, name any part of the change that departs from the design system.

| Design system | In the code |
| --- | --- |
| `surface`, `surface-raised` | `--system-bg` (`bg-system`), `--elevated-bg` (`bg-elevated`) |
| `ink`, `ink-soft` | `--label` (`text-label`), `--label-secondary` (`text-label-secondary`) |
| `brand`, `on-brand` | `--tint` (`bg-tint`), `--tint-contrast` (`text-tint-contrast`) |
| `accent`, `accent-text` | `--accent` (`text-accent`): on the dark ground both are the same amber |
| `brand-deep`, `brand-soft`, the Light theme | Not used yet: the site is dark only |
| Fraunces, Inter | `font-display`, `font-sans` (loaded in `src/app/fonts.ts`) |
| `display`, `headline`, `title` (Fraunces 600) | `text-hero`, `text-large-title`, `text-title2` |
| `body`, `small` | `text-body`, `text-footnote` |
| `button` | `Button` / `ButtonLink` in `src/components/ui/button.tsx` |
| `space-4` … `space-64` | Tailwind `1`, `2`, `4`, `6`, `10`, `16` (card padding is `p-6`) |
| `radius-sm`, `radius-md`, `radius-pill` | `rounded-sm` (12px), `rounded-md` (22px), `rounded-full`: `globals.css` redefines Tailwind's `sm` and `md` |
| `malaka-compact-on-dark.svg` | `public/brand/`, the header logo (`src/components/site/logo.tsx`) |
| `favicon.svg`, `malaka-icon.svg` | `src/app/icon.svg`; `src/app/apple-icon.png` and `public/logo.png` are rendered from `malaka-icon.svg` |

The site keeps some Apple HIG styles the design system doesn't define (`text-title1`, `title3`, `headline`, `callout`, `subheadline`, `caption`) for in-between sizes; use the design system's own styles first.

Departures the owner has accepted (don't "fix" these without asking):

- The "La mayor comunidad de vinos de Málaga" / "The largest Málaga wine community" line in the hero, the homepage description and the FAQ stays, by the owner's choice.
- The sample plan prices stay on the plan cards and the taste-test result while `CATALOG_IS_SAMPLE` is `true`. This is an open item.

## Skills to use without being asked

| When | Skill |
| --- | --- |
| New or edited copy, in either language | `humanizer:humanizer`, on both versions |
| Buttons, labels, form errors, confirmations, empty states | `design:ux-copy` |
| A new section or page of copy | `marketing:brand-review`, against the design system's README (its Voice section is the style guide) and the existing copy in `src/lib/content/` |
| A change to a component's markup, interaction or styles | `design:accessibility-review`, on what changed |
| Adding a page, or changing a page's title, description, keywords or structured data | `marketing:seo-audit`: on-page checks for that page only, not a full-site audit |

If one of these skills isn't available in the session, carry on and say which one you skipped.

## Code conventions

- Route files under `src/app/(es)/` and `src/app/en/` stay thin: they export the page's metadata, pick the language and render a shared component from `src/components/`.
- No visible text in components. It goes in `src/lib/content/`, or next to its plan in `src/lib/catalog.ts`.
- Reuse what exists: the controls in `src/components/ui/`, `pagePath`, `homeAnchor` and `alternatePath` in `src/lib/site.ts`, the metadata builders in `src/lib/metadata.ts`.
- Before finishing, run what CI runs: `npm run lint -- --max-warnings=0`, `npm run typecheck` and `npm run build` (`npm ci` first if `node_modules` is missing).

## SEO and accessibility

- Every page's metadata comes from a builder in `src/lib/metadata.ts`, fed by its title and description in both languages; the canonical URL and hreflang links come with it.
- A new page also needs an entry in `src/app/sitemap.ts` and a line in `public/llms.txt`.
- No Product/Offer structured data while `CATALOG_IS_SAMPLE` in `src/lib/catalog.ts` is `true`.
- Use native elements (`button`, `a`, `input`, `label`); every input has a label; images have alt text in both languages; everything works from the keyboard; motion respects `prefers-reduced-motion`; text that must stand out on the dark ground uses `accent`, not `tint`.
