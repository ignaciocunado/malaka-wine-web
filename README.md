# Terruño · Málaga

Starter project for a monthly subscription box of **wine from small producers in Málaga**.
Subscribers take a taste quiz, pick a plan (Descubre, Bodega or Reserva) and get a curated box every month.
The site is in **Spanish** (es-ES).

| Layer | Stack |
| --- | --- |
| Frontend | Next.js 16 (App Router, React 19, TypeScript), Tailwind CSS 4 styled after Apple's Human Interface Guidelines, in Spanish |
| Auth | [Auth.js](https://authjs.dev) (NextAuth v5) on the frontend, Spring Security + OAuth2 Resource Server (JWT) on the API |
| Backend | Java 21, Spring Boot 4.1, Spring Data JPA, Bean Validation, Flyway |
| Database | MySQL 8 |

## What's included

- **Landing page**: hero, how it works, the four wine areas (Axarquía, Montes de Málaga, Serranía de Ronda, Norte de Málaga), plans, producers and FAQ. Plans and producers come from the API, and the page falls back to built-in sample plans if the API is down.
- **Taste quiz** (`/taste`): a 4-step form (wine styles and sweetness, body and adventurousness, box size/frequency/budget/notes, then review). You can take it without an account. When you save, you're sent to sign-up and your answers come back with you. Afterwards it recommends a plan.
- **Sign up / sign in**: email + password through Auth.js. Sign-up requires confirming you're 18+, since the box contains alcohol.
- **Account** (`/account`, protected): start, switch or cancel a subscription, see your taste profile, sign out.
- **REST API** with validation, problem-detail errors, Flyway migrations with seed data, and integration tests.

> Producers, prices and plans in the seed data are **fictional samples**. Replace them before launch.
>
> The project started out selling wine and olive oil. Migration `V3__wine_only_spanish_catalog.sql` retires the oil
> plans (rather than deleting them, so past subscriptions keep their history), moves active wine + oil subscribers to
> the two-bottle wine plan, cancels oil-only subscriptions, drops the oil columns, and translates the catalog.

## Design: Apple Human Interface Guidelines

Apple doesn't publish a web component framework, so the UI implements the **HIG** directly:

- **System fonts**: SF Pro on Apple devices via `-apple-system`, with Inter as the fallback elsewhere. SF Pro is not bundled, because its license doesn't allow that.
- **HIG color system** in `src/app/globals.css`: label/secondary label, fills, grouped backgrounds, separators and system colors. The site always uses the light (white) appearance, even when the visitor's device is in dark mode. A wine-red tint replaces systemBlue as the app tint color.
- **HIG text styles**: `text-large-title`, `text-title1…3`, `text-headline`, `text-body`, `text-callout`, `text-subheadline`, `text-footnote`, `text-caption`.
- **HIG controls** in `src/components/ui/`: segmented control, toggle chips, iOS-style slider, stepper, inset grouped lists and form rows, plus a translucent "material" navigation bar.
- Native inputs under the hood, so keyboard navigation and screen readers work. Focus rings and `prefers-reduced-motion` are respected.

## How auth works

```
Browser ──(encrypted Auth.js session cookie)──▶ Next.js server ──(Bearer JWT)──▶ Spring Boot API
```

1. `POST /api/auth/register` or `/api/auth/login` on the API checks credentials with Spring Security's `DaoAuthenticationProvider` (BCrypt via `DelegatingPasswordEncoder`). It returns a signed HS256 JWT that is valid for 7 days.
2. The Auth.js **Credentials provider** (`frontend/src/auth.ts`) calls the login endpoint and stores the API token inside Auth.js's encrypted, HTTP-only session cookie.
3. Server components and server actions read the session with `auth()` and call the API with `Authorization: Bearer <token>` (`frontend/src/lib/api.ts`, which is server-only). The browser never talks to the API directly.
4. The API validates the token on every request through Spring Security's OAuth2 Resource Server. `/account` is protected by Next.js 16's `proxy.ts` (formerly middleware), and the page checks the session again on its own.

Adding Google or Apple sign-in later means adding an Auth.js provider plus an API endpoint that exchanges the provider's ID token for an API JWT.

## Quick start (Docker)

```bash
cp .env.example .env
# fill in JWT_SECRET (openssl rand -base64 48) and AUTH_SECRET (openssl rand -base64 33)
docker compose up --build
```

Then open http://localhost:3000. The API is on http://localhost:8080 and MySQL on localhost:3306.

## Local development

Prerequisites: Node 20+, Java 21, and MySQL 8 (or just `docker compose up mysql`).

```bash
# 1. Database (skip if you use docker compose up mysql)
mysql -uroot -e "CREATE DATABASE terruno; CREATE USER 'terruno'@'%' IDENTIFIED BY 'terruno'; GRANT ALL ON terruno.* TO 'terruno'@'%';"

# 2. API on :8080. Flyway creates the schema and seed data on first start.
cd backend
./mvnw spring-boot:run

# 3. Website on :3000
cd frontend
cp .env.example .env.local   # set AUTH_SECRET (npx auth secret)
npm install
npm run dev
```

### Configuration

| Variable | Where | Default | Notes |
| --- | --- | --- | --- |
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | backend | `localhost:3306/terruno`, `terruno`/`terruno` | |
| `JWT_SECRET` | backend | dev-only value | **Required** outside local dev. At least 32 characters |
| `JWT_TTL` | backend | `7d` | Keep in sync with `session.maxAge` in `frontend/src/auth.ts` |
| `CORS_ALLOWED_ORIGINS` | backend | `http://localhost:3000` | Only needed if browsers call the API directly |
| `BACKEND_URL` | frontend | `http://localhost:8080` | Server-side only |
| `AUTH_SECRET` | frontend | none | **Required**. Encrypts the session cookie |
| `AUTH_TRUST_HOST` / `AUTH_URL` | frontend | none | Needed for `next start` and Docker |

### Tests and checks

```bash
cd backend && ./mvnw test                                        # API integration tests (in-memory H2 in MySQL mode)
cd frontend && npx tsc --noEmit && npm run lint && npm run build
```

## API

| Method & path | Auth | Description |
| --- | --- | --- |
| `POST /api/auth/register` | none | `{email, password, firstName, lastName?, adultConfirmed}` → `{token, expiresAt, user}` |
| `POST /api/auth/login` | none | `{email, password}` → `{token, expiresAt, user}` |
| `GET /api/me` | Bearer | Current user |
| `GET /api/plans` | none | Subscription plans |
| `GET /api/producers` | none | Partner producers |
| `GET / PUT /api/taste-profile` | Bearer | Read (404 if none yet) or save the taste quiz answers |
| `GET / PUT / DELETE /api/subscription` | Bearer | Current subscription; `PUT {planCode}` starts or switches it; `DELETE` cancels it |
| `GET /actuator/health` | none | Health check |

Errors are [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457) problem details, with messages in Spanish (the API's locale
is fixed to `es`, see `spring.web.locale` in `application.yml`). Validation errors include an `errors` map of field → message.

## Project layout

```
backend/                     Spring Boot API
  src/main/java/com/terruno/api/
    auth/                    register/login, JWT issuing
    catalog/                 plans and producers
    taste/                   taste profile
    subscription/            subscriptions
    config/                  security (JWT, CORS), app properties
  src/main/resources/db/migration/   Flyway schema and seed data
frontend/                    Next.js site (see frontend/README.md)
docker-compose.yml           MySQL + API + site
```

## Suggested next steps

- **Payments**: Stripe Checkout/Billing for subscriptions (`SubscriptionService.subscribe` is the hook).
- **Address/shipping step** at sign-up or checkout.
- **English version**: the copy is written directly in Spanish; adding a second language would mean moving it to a library such as next-intl.
- **Email**: welcome and shipping notifications, password reset, email verification.
- **Login hardening**: rate limiting and lockout on `/api/auth/login`.
- **Admin**: curate monthly boxes, manage producers and stock.
- **Real producer photography** and content.
