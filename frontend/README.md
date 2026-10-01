# Terruño — frontend

Next.js 16 (App Router) site for the Terruño subscription. See the [root README](../README.md) for the full picture.

```bash
cp .env.example .env.local   # then set AUTH_SECRET (npx auth secret)
npm install
npm run dev                  # http://localhost:3000, expects the API on BACKEND_URL
```

| Path | What it is |
| --- | --- |
| `src/app/page.tsx` | Landing page (plans and producers come from the API, with a fallback) |
| `src/app/taste/` | Taste quiz (multi-step form) and its server action |
| `src/app/(auth)/` | Sign-in / sign-up pages and server actions |
| `src/app/account/` | Subscription and profile management (protected) |
| `src/auth.ts` | Auth.js config: Credentials provider backed by the Spring Boot API |
| `src/proxy.ts` | Next.js 16 proxy (formerly middleware) guarding `/account` |
| `src/components/ui/` | Apple HIG-style components: segmented control, chips, slider, stepper, grouped lists |
| `src/lib/api.ts` | Server-only API client |
