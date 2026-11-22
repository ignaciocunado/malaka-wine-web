# Malaka · Málaga

Demo landing site for **Malaka Wine**, a subscription box of wine delivered every four months, from small producers in Málaga.
The site is in Spanish (the default, at `/`) and English (under `/en`). It is dark, styled after Apple's Human
Interface Guidelines, and built round live 3D scenes of Málaga (see [3D scenes](#3d-scenes)).

This is a **front-end-only site**: there is no backend, database or login. Its text and plans are JSON files in
`content/`, which an editor at `/admin` changes by committing to the repository (see
[Editing content](#editing-content)). The only thing the site sends anywhere is the email address from the "register
your interest" form, which goes to a Google Sheet (see [Collecting emails](#collecting-emails)).

## Pages

| Spanish | English | What it is |
| --- | --- | --- |
| `/` | `/en` | Landing page: the bay seen from a vineyard, a walk down into the cellar for "how it works", the taste profile, plans, FAQ |
| `/apuntate` | `/en/register` | "Register your interest" form: an email address and a consent box. The plan buttons on the landing page link here with `?plan=BODEGA`, which is saved with the sign-up |
| `/quienes-somos` | `/en/about` | About page: the founder, Antonio Cuñado Bernal, the projects behind the contacts with the province's small producers, and why Malaka Wine exists |
| `/privacidad` | `/en/privacy` | Privacy policy (GDPR) for the emails the form collects |
| `/vinos-de-malaga` | `/en/malaga-wines` | Guide to Málaga wines: a relief table of the province to explore the areas, then appellations, grapes, styles, history, pairings |
| `/vinos-de-malaga/<slug>` | `/en/malaga-wines/<slug>` | One page per wine area (Axarquía, Montes de Málaga, Serranía de Ronda, Norte de Málaga, Manilva) and grape (Moscatel de Alejandría, Pedro Ximénez, Romé) |
| `/<slug>` | `/en/<slug>` | Pages created in the editor, each with its own address in each language (e.g. `/catas` and `/en/tastings`), linked from the footer |
| `/admin` | | The content editor (see [Editing content](#editing-content)) |

Every page is prerendered at build time (static HTML), so it can be served from a CDN with no server code.

> The plans and prices in `content/plans.json` are **fictional samples**. Replace them before showing the
> demo as the real thing, then turn off `sample` in that file (in the editor: **Planes y precios → Contenido de
> ejemplo**). The wine guide (`content/guide/`) is real reference content.

The taste quiz that used to be at `/taste` is parked until launch: its code is still in `src/components/taste/` and
`src/lib/taste.ts`, with no route pointing at it, and `public/_redirects` sends the old URLs to the form. To bring
it back, add a `taste` path to `PATHS` in `src/lib/site.ts` and a route file under each language that renders
`TastePage`.

## Collecting emails

There is no database. The form posts each sign-up to a Google Apps Script, which adds a row to a Google Sheet you
own: time, email, language, plan of interest and the version of the privacy policy the person agreed to.

Set it up once:

1. Create a Google Sheet (ideally in a Google Workspace account, which comes with Google's data processing terms).
2. In the Sheet, open **Extensions → Apps Script**, delete the sample code and paste in
   `scripts/google-sheet/Code.gs`.
3. **Deploy → New deployment → Web app**, with **Execute as: Me** and **Who has access: Anyone**. Approve the
   permissions Google asks for.
4. Copy the web app URL (it ends in `/exec`) into `INTEREST_ENDPOINT` in `src/lib/site.ts` and deploy the site.

To get the list, open the Sheet, or **File → Download → Comma-separated values (.csv)**. To remove someone who asks,
delete their row. If you change the script, publish it with **Deploy → Manage deployments → Edit → New version**.

Before going live, fill in the `CONTROLLER` placeholders in `src/lib/site.ts` (the privacy policy prints them) and
have the policy in `src/lib/content/privacy.ts` checked by someone qualified. When the policy changes, update
`PRIVACY_UPDATED` in the same file.

## Languages

The site's text lives in JSON files in `content/`, each holding the same fields in both languages
(`{ "es": {…}, "en": {…} }`):

- `content/site/`: the homepage, FAQ, sign-up page, and the menu, footer and notices;
- `content/plans.json`: the plans;
- `content/guide/`: the wine guide's overview page, and one file per area or grape in `topics/`;
- `content/pages/`: pages created in the editor.

The loaders in `src/lib/` (`getDictionary` in `content/index.ts`, `getCatalog` in `catalog.ts`, `getGuide` in
`content/guide.ts`, and `content/pages.ts`) read these files and hand components the same shapes as before.
TypeScript still fails the build if the English is missing a field. Two pieces of text stay in code: the privacy
policy (`src/lib/content/privacy.ts`), which is legal text that quotes the controller's details, and the parked
taste quiz (`src/lib/content/taste.ts`), which uses formatting functions.

Each language has its own root layout (`src/app/(es)/layout.tsx` and `src/app/en/layout.tsx`) so the static HTML
carries the right `<html lang>`. The route files under them are thin: they pick the language and render a shared
component. To add a page, add its path to `PATHS` in `src/lib/site.ts`, a route file under each language, and an
entry in `src/app/sitemap.ts`.

## Editing content

`/admin` is [Sveltia CMS](https://sveltiacms.app), a static page (`public/admin/index.html`, configured by
`public/admin/config.yml`) that edits the files in `content/` through GitHub. Editors sign in with their GitHub
account and see Spanish and English side by side. When they save, the CMS commits the change to the **`develop`**
branch. Cloudflare builds develop's preview link within a few minutes, and the change reaches the live site when
develop is merged into `main`. `docs/editar-la-web.md` is the editors' guide, in Spanish.

To try the editor without signing in:

1. Run `npm run dev`.
2. Open http://localhost:3000/admin/index.html in Chrome or Edge.
3. Choose **Trabajar con un repositorio local** and pick your checkout.

Saves are written straight to your files, with no commit.

What can be edited:

| In the editor | File |
| --- | --- |
| Textos de la web: homepage, FAQ, plans and prices, sign-up page, About page, menu, footer and notices | `content/site/*.json`, `content/plans.json` |
| Guía de vinos: the guide's overview page and its "updated" date | `content/guide/overview.json` |
| Artículos de la guía: one article per area or grape; new ones are grape pages | `content/guide/topics/<slug>.json` |
| Páginas: new pages with a cover photo and text with photos | `content/pages/*.json`, photos in `public/uploads/` |

Some things still need a developer:

- **New wine areas.** An area is a topic whose slug is a place on the 3D relief table
  (`src/components/scene/data/province.json`), and it needs stills from `scripts/3d/posters.mjs`.
- The privacy policy.
- The layout and the 3D scenes.
- `public/llms.txt`, which repeats some facts (shipping, plans), so update it by hand when they change.

### Setting up sign-in (once)

1. Deploy [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) with its **Deploy to Cloudflare** button.
2. Register a GitHub OAuth app (**GitHub → Settings → Developer settings → OAuth Apps**). Set the callback URL to
   `https://<the Worker's address>/callback`.
3. In the Worker's settings, set these variables:
   - `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`, from the OAuth app;
   - `ALLOWED_DOMAINS`: `malakawine.com`, plus the preview domain if you want to sign in on preview links.
4. Put the Worker's address in `base_url` under `backend` in `public/admin/config.yml`.
5. Invite each editor's GitHub account to the repository with **write** access.
6. Turn on email notifications for failed Workers Builds in Cloudflare. GitHub only emails a CI failure to whoever
   pushed, which for an edit is the editor.

### How the editor and the code fit together

- **Every field needs an `i18n` option.** In `config.yml`, use `i18n: true` for text written in each language, and
  `i18n: duplicate` for a value shared by both (price, plan code, order, date). Sveltia edits a shared value in
  Spanish and copies it to English. A field without the option is saved in Spanish only, and the English site
  would lose it. Nested fields don't inherit the option.
- **List fields in `config.yml` in the same order as the keys in the JSON file.** The CMS writes them in config
  order. A key with no field in the config may be dropped on save. When you add a key to a content file, add its
  field to the config in the same place.
- **The CMS trims the text it saves**, so a space a sentence needs at its edge belongs in the component (see the
  consent sentence in `interest-form.tsx`).
- **Text with formatting is converted when it's read:**
  - FAQ answers are Markdown, limited to bold and lists, and `faqBlocks()` turns them back into paragraphs and lists.
  - Guide sections are plain text with blank lines between paragraphs.
  - Page text is full Markdown, rendered by `marked` at build time and styled by `.page-body` in `globals.css`.
- **Checks on page addresses.** An address the site already uses, or one used by two pages, fails the build. The CMS
  refuses both before saving. The reserved words are listed in `src/lib/content/pages.ts` and in the `slug` pattern in
  `config.yml`; keep the two lists the same. With no pages at all, a hidden, `noindex` placeholder at `/_` keeps
  the build working, because a static export can't have a dynamic route with no pages.
- **Edits land on develop**, so pull before you start working, and merge develop into feature branches often.
  Conflicts can only come from files in `content/`.
- **The Sveltia version is pinned** in `public/admin/index.html`. To upgrade, change the version, then open
  `/admin` and save an entry. Check that the commit changes only that entry's fields.

## SEO

- **Domain**: `SITE_URL` in `src/lib/site.ts` (`https://malakawine.com`). Canonical URLs, hreflang links, the
  sitemap and structured data are all built from it, so change it there if the domain changes.
- **Per-page metadata**: `src/lib/metadata.ts` builds each page's title, description, canonical URL, hreflang
  alternates and social card from the text in `content/`.
- **`/sitemap.xml` and `/robots.txt`**: generated by `src/app/sitemap.ts` and `src/app/robots.ts`. The robots file
  welcomes AI crawlers by name.
- **Structured data** (`src/lib/structured-data.ts`): Organization and WebSite on every page, FAQPage on the
  homepage, Article, BreadcrumbList and FAQPage on the guide. Product/Offer data for the plans is written but only
  published once `sample` is off in `content/plans.json`, so search engines are never given made-up prices.
- **`/llms.txt`** (`public/llms.txt`): a plain-text summary of the site for AI assistants. Update it by hand when
  pages are added or the facts it repeats change.
- **Social cards**: `public/og-es.jpg` and `public/og-en.jpg` (1200×630) are screenshots of the homepage hero.

## Run it locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

Checks: `npm run typecheck`, `npm run lint`, `npm run build`.

## Deploy to Cloudflare

The site is a static export (`output: "export"` in `next.config.ts`): `npm run build` writes plain HTML, CSS and JS
to `out/`. `wrangler.jsonc` tells Cloudflare to serve that folder as static assets; there is no Worker script and
no environment variables are needed.

The repository is connected to a Cloudflare Worker through Workers Builds (**Workers & Pages → the Worker →
Settings → Build**), with these settings:

- **Build command**: `npm run build`
- **Deploy command** (production branch): `npx wrangler deploy`
- **Non-production branch deploy command**: `npx wrangler preview`

Every push to the production branch deploys to production, and every other branch gets its own preview URL. The
`name` in `wrangler.jsonc` must match the Worker's name in the dashboard, and the empty `previews` block has to stay:
`wrangler preview` refuses to run without it.

Files in `public/` (such as the 3D data and stills in `public/3d/`) keep their names between deploys, so rename one when you replace it or
purge the cache, otherwise visitors may get the old copy for a while.

## Design: Apple Human Interface Guidelines

Apple doesn't publish a web component framework, so the UI implements the HIG directly:

- **Fonts**: body text and controls use SF Pro on Apple devices via `-apple-system`, with Inter (`next/font`) as the
  fallback elsewhere. Headlines (`text-hero` down to `text-title2`) use the Fraunces serif, a deliberate departure
  from the HIG for a wine-label feel.
- **HIG color system** in `src/app/globals.css`: labels, fills, grouped backgrounds, separators and system colors.
  The site is always dark, whatever the visitor's device is set to: its ground is the night sky of the homepage's
  scene and its text the color of whitewash. Two brand colors sit on top: wine red (`tint`) fills buttons, and
  amber (`accent`) is for text and rules that must stand out on the dark ground, where wine red is too dim to read.
- **HIG text styles**: `text-large-title`, `text-title1…3`, `text-headline`, `text-body`, `text-subheadline`, `text-footnote`, `text-caption`.
- **HIG controls** in `src/components/ui/`: segmented control, toggle chips, iOS-style slider, stepper, inset grouped
  lists, and a translucent "material" navigation bar. They are built on native inputs, so keyboard navigation and
  screen readers work.

## Project layout

```
content/                  the site's text in both languages, edited at /admin (see Editing content)
  site/                   homepage, FAQ, sign-up page, menu, footer and notices
  plans.json              the plans
  guide/                  the wine guide: overview.json and topics/<slug>.json
  pages/                  pages created in the editor
src/
  app/
    (es)/                 Spanish routes (served at /) and their root layout; [slug] for pages made in the editor
    en/                   English routes (served at /en) and their root layout; [slug] likewise
    global-not-found.tsx  404 page, in both languages
    sitemap.ts, robots.ts
    globals.css           HIG design tokens and text styles
  components/
    landing/              homepage, its 3D stage, plan cards, FAQ
    scene/                the three.js scenes, their baked data index and the device checks
    interest/             the "register your interest" page and its form (client component)
    legal/                the privacy policy page
    taste/                the taste quiz, not routed for now
    guide/                the wine guide pages and the relief table
    page/                 the layout of pages created in the editor
    site/                 document shell, nav bar, footer, logo, language switch, age gate
    seo/json-ld.tsx       structured data script tag
    ui/                   HIG-style controls
  lib/
    site.ts               domain, languages, paths, metadata helper
    content/              loaders for content/ (index.ts, guide.ts, pages.ts), plus the text kept in code:
                          privacy.ts and taste.ts
    catalog.ts            loader for the plans
    structured-data.ts    schema.org JSON-LD
    taste.ts              quiz defaults and plan recommendation
scripts/google-sheet/     the Apps Script that saves sign-ups to a Google Sheet
scripts/3d/               bakes the 3D scenes' data and renders their stills
public/3d/                what those scripts write: data files and still images
public/admin/             the content editor (Sveltia CMS) and its config.yml
public/uploads/           photos uploaded in the editor
public/_redirects         Cloudflare redirects from the old quiz URLs
docs/editar-la-web.md     the editors' guide, in Spanish
```

## Adding the full web app later

An earlier version had a Spring Boot + MySQL API with sign-up/login (Auth.js), saved taste profiles and
subscriptions. It was removed to keep this demo front-end only. The code is in git history: commit `d4ce9e7` on
`main` has the complete stack (`backend/`, `frontend/`, `docker-compose.yml`) to start from.

## 3D scenes

The site has three live scenes, drawn with three.js. All three are models, built in code from real data, not
photographs or downloaded meshes:

- **The bay from a vineyard** (`src/components/scene/vineyard.ts`): the homepage's opening picture. Málaga at blue
  hour seen from a ridge in the Montes, about 4.7 km north of the cathedral: vines either side of a track that leads
  to a lagar, then Gibralfaro, the cathedral, the port and Sierra de Mijas across the bay. The terrain is real
  elevation data and the landmarks stand at their real coordinates; the vineyard is invented.
- **The lagar** (`lagar.ts`): the press-house at the end of the track, modelled in metres: a thick front wall with a
  stone-lined arched passage, lime plaster, clay tiles, shutters, a lantern, and a pair of studded doors that are shut
  at first and swing in as the camera arrives. Its plaster, tiles, stone
  and timber are painted on canvases at start-up, each with a height map for bump.
- **The cellar** (`cellar.ts`): a solera cellar, behind "how it works". Scrolling the homepage walks the camera down
  the track, in through the lagar's door and along the aisle (`home-scene.ts` and `components/landing/home-stage.tsx`).
  The walk has no cut: the passage's inner mouth is a portal, a window that writes to the stencil buffer. From the
  track, the vineyard is drawn first and then the cellar, seen from the same camera moved into the cellar's
  coordinates, only inside that window, so the lamplit nave shows through the door as it opens and the camera simply
  walks into it. Once the camera is past the window, only the cellar is drawn, and nothing changes on screen.
- **The relief table** (`relief-scene.ts`): the province as a museum model, in the wine guide. Choosing an area turns
  and zooms the table to it; each area's own page shows the table turned to that area.

### Keeping them fast

- **Stills first.** Every scene has still images rendered from the scene itself. Pages paint with those, and the
  live scene (three.js plus its data) only starts loading once the browser is idle, then fades in over the still.
- **Stills only, for some.** Visitors who ask for reduced motion or data saving, and browsers without WebGL 2, never
  load three.js: the homepage's stills (the track, the lagar's door, the cellar) zoom and cross-fade with the scroll
  instead, and the guide's change with the chosen area.
- **Drawn only when something moves.** A scene draws a frame while its camera is moving and then stops; a page at
  rest uses no GPU. Shadows are drawn once, since nothing in the scenes moves.
- **Small downloads.** The bake script culls the bay to what the camera can see and stores only what can't be worked
  out again: the vines and pines are one bit per position, and each building's windows are regenerated from its
  number. The bay is about 200 KB and the province about 90 KB, already gzipped (hosts don't compress binary files).
- **Less on slower devices.** Phones, tablets and computers that report little memory or few cores get fewer and
  simpler vines, smaller shadow maps and a lower pixel ratio (`pickTier` in `scene/device.ts`). Any device that
  can't keep up while scrolling lowers the scene's resolution by itself rather than stutter.

### Changing a scene

```bash
node scripts/3d/bake.mjs       # terrain, city, vines, pines -> public/3d/*.bin and src/components/scene/data/*.json
npm run build
node scripts/3d/posters.mjs    # stills and the social cards -> public/3d/posters/, public/og-*.jpg (add `home` or `relief` for one set)
npm run build                  # again, so the build picks up the new stills
```

Run the bake script when you change what it places (the viewpoint, the city, where vines grow). Run the posters
script whenever a scene looks different, so the stills still match it. The posters script needs Playwright with
Chromium (`npm i -D playwright && npx playwright install chromium`), which is not one of the site's dependencies;
it renders in software, so it takes a few minutes and needs no GPU.

Elevation data: [Mapzen Terrain Tiles](https://registry.opendata.aws/terrain-tiles/) on AWS Open Data (which
combine SRTM, EU-DEM, GMTED and ETOPO1 among other sources). The site credits them in its footer.
