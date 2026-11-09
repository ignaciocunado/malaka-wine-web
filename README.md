# Malaka · Málaga

Demo landing site for **Malaka Wines**, a monthly subscription box of wine from small producers in Málaga.
The site is in Spanish (es-ES) and styled after Apple's Human Interface Guidelines.

This is a **front-end-only demo**: there is no backend, database or login. Plans and producers are static data in the
code, and the taste quiz runs entirely in the browser. Nothing is stored or sent anywhere.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Landing page: hero, how it works, the four wine areas, plans, producers, FAQ |
| `/taste` | Taste quiz (styles, palate, box, review). It ends on the plan picked on the landing page (`/taste?plan=BODEGA`) or, if none was picked, the plan recommended for the answers |

Every page is prerendered at build time (static HTML), so it can be served from a CDN with no server code.

> Plans, prices and producers in `src/lib/catalog.ts` are **fictional samples**. Replace them before showing the
> demo as the real thing.

## Run it locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

Checks: `npm run typecheck`, `npm run lint`, `npm run build`.

## Deploy to Vercel (free Hobby plan)

No configuration or environment variables are needed.

1. Push this repository to GitHub.
2. On [vercel.com/new](https://vercel.com/new), import the repository. Vercel detects Next.js. Keep the default settings and click **Deploy**.
3. Every push to `main` deploys to production, and every pull request gets its own preview URL.

Because every page is static, the site is served from Vercel's CDN without using serverless functions, so it stays
well within the Hobby plan's limits.

## Design: Apple Human Interface Guidelines

Apple doesn't publish a web component framework, so the UI implements the HIG directly:

- **System fonts**: SF Pro on Apple devices via `-apple-system`, with Inter (`next/font`) as the fallback elsewhere.
- **HIG color system** in `src/app/globals.css`: labels, fills, grouped backgrounds, separators and system colors.
  The site always uses the light (white) appearance, even when the visitor's device is in dark mode. A wine-red tint
  replaces systemBlue as the app tint color.
- **HIG text styles**: `text-large-title`, `text-title1…3`, `text-headline`, `text-body`, `text-subheadline`, `text-footnote`, `text-caption`.
- **HIG controls** in `src/components/ui/`: segmented control, toggle chips, iOS-style slider, stepper, inset grouped
  lists, and a translucent "material" navigation bar. They are built on native inputs, so keyboard navigation and
  screen readers work.

## Project layout

```
src/
  app/
    page.tsx              landing page
    taste/page.tsx        taste quiz page
    layout.tsx            fonts, metadata, nav bar and footer
    globals.css           HIG design tokens and text styles
  components/
    landing/              hero illustration, plan cards, FAQ
    taste/taste-form.tsx  the quiz (client component)
    site/                 nav bar, footer, logo
    ui/                   HIG-style controls
  lib/
    catalog.ts            plans, producers and regions (static demo data)
    taste.ts              quiz options, Spanish labels, plan recommendation
```

## Adding the full web app later

An earlier version had a Spring Boot + MySQL API with sign-up/login (Auth.js), saved taste profiles and
subscriptions. It was removed to keep this demo front-end only. The code is in git history: commit `d4ce9e7` on
`main` has the complete stack (`backend/`, `frontend/`, `docker-compose.yml`) to start from.

## 3D bottles on the homepage

The homepage background is a three.js scene (`src/components/landing/tablecloth-scene.tsx`): a tablecloth with wine
bottles that roll into place as you scroll. The bottle models are built in Blender by a script:

```bash
blender --background --python assets/blender/build_bottles.py
```

It writes `assets/blender/bottles.blend` (the editable source) and `public/models/bottles.glb` (what the site loads).
Glass colors and labels are applied at runtime from the wines in `src/lib/catalog.ts`.
