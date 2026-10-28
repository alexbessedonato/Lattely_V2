# ADR-0001: Lattely MVP application architecture

- **Status:** Accepted
- **Date:** 2026-10-28
- **Scope:** First usable version of Lattely

## Context

Lattely is a responsive web platform for finding specialty coffee shops in Barcelona and comparing them using ratings submitted through Lattely. The agreed first-version behavior is recorded in the [product spec](https://github.com/alexbessedonato/Lattely_V2/issues/1); domain terms are in [GLOSSARY.md](../../GLOSSARY.md).

The app needs a location-aware ranked list, a small set of radius choices, sign-in for rating, and an easy way to test the complete flow before the invited pilot. The initial catalog and rating volume are expected to be small.

## Decisions

### One web application

Build one Next.js application as a modular monolith: one deployable app with code organized around features such as cafés, ratings, and authentication. Deploy it on Vercel and use Neon for hosted PostgreSQL and authentication.

Keep database reads, ranking, and writes on the server. The browser requests location permission or lets the user choose a Barcelona neighborhood, selects a radius, renders the ordered results, and submits a rating. It does not calculate rating averages or decide the result order.

Do not add a separate API service or an RPC for the MVP. Keep the search and rating logic in the Next.js server application; extract a database function or endpoint later only if the query’s complexity or measured load justifies it.

### Feature slices and UI

Keep `src/app/` focused on Next.js routes and layouts. Put café behavior in `src/features/cafes/` and rating behavior in `src/features/ratings/`; each feature owns its `components/`, `types/`, and `utils/` folders. Keep cross-feature UI in `src/components/`; place shadcn/ui primitives in `src/components/ui/`. Keep Neon Auth integration in `src/auth/` and Drizzle setup and schema in `src/db/`. Reserve `src/lib/` for genuinely shared helpers such as shadcn's `cn` helper. Store SQL migrations in `drizzle/` and Playwright tests in `tests/e2e/`.

Use Tailwind CSS for responsive styling. Prefer shadcn/ui components for standard controls and interactions when a suitable component exists, adding them individually so their source stays editable in the repo. Build feature-specific compositions inside the owning feature and use plain semantic HTML when shadcn/ui adds no useful behavior.

### Location search

Use the browser’s Geolocation API when the user grants permission. Offer a curated Barcelona neighborhood picker as the fallback, using a representative point for each neighborhood. Store café points as PostGIS `geography(Point, 4326)` and use `ST_DWithin` for radius filtering, with distance measured in meters.

Privacy default: treat precise browser coordinates as a transient search input; do not store them as user data. No map, map-tile service, or external geocoding provider is part of the first version.

### Ratings and ranking

Store each person’s current 1–5 rating for each coffee shop as an individual database row. Enforce one rating per person per shop in PostgreSQL and let the person update that row.

Calculate each coffee shop’s average rating and rating count in the server-side database query used to build results. Sort by the Lattely rating as specified in the product spec, placing unrated shops after rated shops. Do not store duplicated average/count fields or introduce a cache or materialized view at this stage.

The first version uses a direct Drizzle/PostgreSQL query for location filtering and ranking. Revisit a stored database function/RPC only when the query is hard to maintain or performance measurements call for it.

### Authentication boundary

Use Neon Managed Better Auth for email/password and Google sign-in. Only signed-in users can submit or edit a rating. The application uses Neon’s supported SDK for identity and sessions; its café and rating tables store the auth user ID as the rating owner.

Keep auth-managed tables under Neon Auth’s control. Do not write to them directly or create foreign keys to the synchronized auth user table.

### Database changes and testing

Keep the TypeScript Drizzle schema and generated SQL migration files in Git. Review migrations and apply them with Drizzle Kit to the intended Neon branch. Use an isolated Neon branch and deterministic café/rating data for Playwright tests.

Use Playwright for browser-level checks of location fallback, radius filtering, ordering, sign-in, and rating submission or editing. Production migration automation and additional test layers are deferred until deployment environments and concrete needs are known.

## Consequences

- The frontend receives results ready to display, while PostgreSQL remains the source of truth for location filtering and rating calculations.
- The server-side radius and ranking query uses SQL, which keeps the PostGIS behavior explicit and supports the user’s goal of learning SQL.
- Feature slices keep cafés and ratings easy to change independently. shadcn/ui source remains local and customizable, while Tailwind keeps styles close to their components.
- Vercel and Neon make the first deployment straightforward. Standard Next.js patterns and PostgreSQL reduce the work required if the app later moves to AWS.
- Live aggregation keeps rating data simple at the expected MVP scale. If query performance becomes a problem, measure it before adding stored aggregates or caching.
- Google OAuth credentials and Resend SMTP must be configured before the invited pilot. Neon’s shared auth email sender is for development and testing.

## Deferred

- AWS migration.
- Separate backend service or RPC.
- Cached or precomputed rating aggregates.
- Map display, external geocoding, and café submissions by users.
- Café administration UI.
- Custom authentication email templates and webhook handlers.
- A second UI component kit or test framework.
