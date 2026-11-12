# Zivah Website — Agent Guide

## Purpose and architecture

- This is the full-stack Zivah corporate website: Next.js 16 App Router, React 19, TypeScript,
  Tailwind CSS 4, and Radix UI primitives.
- It uses a custom session-based authentication system backed by PostgreSQL. Tokens are UUIDs
  stored in the `sessions` table and delivered via encrypted `HttpOnly` cookies. Route Handlers
  live under `src/app/api/auth/`. There is no external OIDC provider (like Cognito).
- Admin dashboard routes live in `src/app/admin`, while public pages (Home, Products, Quality, Contact, Quote)
  are in `src/app`.
- The database architecture is two-tier:
  1. **Runtime:** Direct PostgreSQL queries using the `pg` connection pool (`src/lib/db.ts`).
  2. **Development/Migrations:** Prisma is used for schema management and seeding only. **Never import `@prisma/client` in application code.**

## Contracts and implementation rules

- The application is monolithic. Browser code calls the internal Next.js API routes at `/api/*`.
- Use Zod schemas for strict input validation on all API endpoints.
- Passwords must be hashed using `bcryptjs` (12 salt rounds).
- Prevent SQL injection by strictly using parameterized queries in all `pg` database calls. Never use string concatenation for SQL queries.
- Keep user-facing copy in Spanish, with support for English via internationalization (`next-intl`).
- Reuse existing Radix UI components and design tokens; do not introduce competing UI libraries.
- The system handles quotes and product inquiries. Pay close attention to measurement units and variations in the `quotes` and `products` tables.

## Validation and delivery

- Use `pnpm`. Before handoff run, as applicable:

  ```bash
  pnpm format:check
  pnpm type-check
  pnpm lint
  pnpm build
  git diff --check
  ```

- Deployment is targeting a cPanel Node.js hosting environment using standalone output. Do not assume Vercel or Amplify-specific build behaviors.
- Do not commit `.next/`, `node_modules/`, `.env*`, credentials, tokens, certificates, or unrelated working-tree changes.

## Required Spec-Driven Development

Spec Kit is the mandatory engineering workflow for any change that affects application behavior, user-facing functionality, APIs or data contracts, security, database schemas, architecture, infrastructure, or multiple code areas. This applies to features, behavioral bug fixes, and refactors; a direct implementation request does not waive the workflow.

1. Create or update the feature artifacts under `specs/<id>-<short-name>/` with `speckit.specify`. Treat these artifacts as the source of truth.
2. Resolve material ambiguity with `speckit.clarify`.
3. Generate the technical plan with `speckit.plan`.
4. Generate the ordered implementation tasks with `speckit.tasks`.
5. Stop for explicit user approval of the spec, plan, and tasks before implementation. Do not infer approval from the original feature request.
6. Implement only the approved tasks with `speckit.implement`. If scope changes, update the artifacts and obtain approval before proceeding.
7. Run `speckit.analyze` after implementation and resolve discrepancies before handoff.

Use the repository's full SDD workflow when available; its spec, plan, and task review gates are mandatory. Bug-triage tooling may supplement this process but must not bypass it.

Pure documentation corrections, typo fixes, formatting-only changes, and other mechanical edits with no behavioral impact are exempt. For an urgent security or production fix that cannot wait for the review gates, make the smallest safe change, clearly report the exception, and backfill the SDD artifacts in the same work item.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
