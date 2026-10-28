# Tech stack

Implementation guidance for Lattely. Read this before changing frameworks, database access, authentication, deployment, styling, or test tooling. See [ADR-0001](../adr/0001-lattely-mvp-architecture.md) for the architecture rationale and boundaries.

## Chosen stack

- **Language and web app:** TypeScript with Next.js App Router. Use pnpm.
- **Hosting:** Vercel. Keep the app on standard Next.js and Node-compatible features so an AWS move remains practical. Add Vercel-specific services only after an explicit need.
- **Database:** Neon-hosted PostgreSQL with PostGIS. Store café coordinates as `geography(Point, 4326)` and use PostGIS distance queries in meters. Use Neon branches for development and tests; keep test runs off production.
- **Database access:** Drizzle ORM. Use its typed query builder for ordinary reads and writes; use parameterized SQL for PostGIS radius filtering and other queries that benefit from direct SQL.
- **Schema changes:** Drizzle Kit. Generate SQL migration files, inspect and commit them with the schema change, then apply pending migrations with `drizzle-kit migrate` against the intended Neon branch. Use custom SQL migrations when a database feature requires SQL that the schema generator cannot express. Do not use `drizzle-kit push` against production. Production migration automation is deferred until deployment environments are defined.
- **Authentication:** Neon Managed Better Auth. Use its current SDK and prebuilt UI for sign-in, sign-up, and password recovery; profile settings may need app UI. Support email/password and Google sign-in. Require sign-in to submit or edit a rating. Use Lattely-owned Google OAuth credentials before production. Do not use legacy Stack Auth examples or write directly to Neon Auth tables.
- **Authentication email:** Use Neon’s shared email sender for development and testing. Configure Resend as Neon’s custom SMTP provider before the invited pilot. Keep Neon’s default email templates; custom templates and webhook handlers are deferred.
- **UI:** Tailwind CSS for responsive styling and shadcn/ui for standard controls and interactions wherever a suitable component exists. Add components individually so their source stays in the repository and can be customized or removed. Keep shadcn primitives in `src/components/ui`; compose café- or rating-specific UI in its feature. Use CSS Modules only when Tailwind utilities are not a good fit.
- **Browser tests:** Playwright end-to-end tests for the core user flows. Use deterministic sample cafés and ratings in an isolated Neon branch, and emulate browser geolocation. Do not point tests at production or rely on live Google OAuth or email delivery.

## Agent guardrails

- Organize code by feature. Keep `src/app/` for routes and layouts; put café-specific code in `src/features/cafes/` and rating-specific code in `src/features/ratings/`. Each feature owns its `components/`, `types/`, and `utils/` folders. Put shadcn/ui primitives in `src/components/ui/`, Neon Auth integration in `src/auth/`, and Drizzle setup/schema in `src/db/`. Use `src/lib/` only for genuinely shared helpers such as shadcn's `cn` helper. Store migrations in `drizzle/` and Playwright tests in `tests/e2e/`.
- Keep database credentials and auth secrets server-side. Never expose them through client-side code or public environment variables.
- Treat Neon as the hosted PostgreSQL source of truth. Do not add a local PostgreSQL service as a prerequisite without revisiting the decision.
- Pin stable compatible releases when scaffolding. Avoid release candidates and previews for core runtime dependencies.
- Keep product behavior and domain vocabulary aligned with [GLOSSARY.md](../../GLOSSARY.md) and the [first-version spec](https://github.com/alexbessedonato/Lattely_V2/issues/1).
- Do not add a separate API service, external maps/geocoding provider, cached rating counters, custom auth-email webhook, or extra test framework without a concrete requirement.

## Official references

- [Next.js styling](https://nextjs.org/docs/app/getting-started/css)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Neon PostGIS](https://neon.com/docs/extensions/postgis)
- [Neon Managed Better Auth](https://neon.com/docs/auth/overview)
- [Neon Auth production checklist](https://neon.com/docs/auth/production-checklist)
- [Drizzle with Neon](https://orm.drizzle.team/docs/connect-neon)
- [Drizzle migrations](https://orm.drizzle.team/docs/migrations)
- [shadcn/ui overview](https://ui.shadcn.com/docs)
- [Adding shadcn/ui components](https://ui.shadcn.com/docs/new)
- [Next.js testing](https://nextjs.org/docs/app/guides/testing)
- [Playwright](https://playwright.dev/docs/intro)
