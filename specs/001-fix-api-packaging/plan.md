# Implementation Plan: Restore Production API Runtime Dependencies

**Branch**: `001-fix-api-packaging` | **Date**: 2026-11-12 | **Spec**: [spec.md](spec.md)

**Input**: The quote form works locally, but production requests for its lookup data fail with empty errors.

**Emergency exception**: Production APIs are unavailable. The smallest remediation is being implemented immediately and this SDD record is being backfilled in the same work item, as permitted by the repository guide.

## Summary

The production package contains a Turbopack-generated hashed alias for `pg` that points into pnpm's virtual store. The FTP packaging step excludes the top-level standalone `node_modules`, leaving the alias unresolved on cPanel. Build the standalone output with Webpack so server routes resolve `pg` by its normal package name from the cPanel-managed Node.js dependencies.

## Technical Context

**Language/Version**: TypeScript 6.0.3, Node.js 22 in cPanel

**Primary Dependencies**: Next.js 16.4.6, React 19.3.1, `pg` 8.23.1, Babel React Compiler plugin, pnpm 11.9.0

**Storage**: Existing PostgreSQL database; no schema or data changes

**Testing**: Production build plus inspection of the standalone server dependency references. No automated test suite is added for this packaging-only correction.

**Target Platform**: Linux, cPanel Node.js application managed by Passenger

**Project Type**: Full-stack Next.js website

**Performance Goals**: No material change to request latency or memory use

**Constraints**: Preserve the cPanel-managed top-level `node_modules` symlink; do not change environment variables, credentials, schema, or API contracts.

**Scale/Scope**: Production build configuration and compiler dependency affecting the artifact used by all API routes

## Constitution Check

- Standalone Next.js deployment on cPanel: PASS; the deployment target and output remain the same.
- PostgreSQL access through the existing `pg` runtime pool: PASS; no data-layer code changes.
- API validation and response contracts: PASS; no route code or contract changes.
- Secret and environment handling: PASS; cPanel environment settings are untouched.
- Spec-Kit compliance: PASS with the urgent production exception documented above and artifacts backfilled.

## Project Structure

```text
package.json                              # Use Webpack and provide the Babel React Compiler plugin
next.config.ts                            # Remove the Turbopack-only Rust compiler option
.github/workflows/deploy.yml              # Existing pipeline continues to call pnpm build
src/lib/db.ts                             # Unchanged PostgreSQL pool
src/app/api/quotes/countries/route.ts      # Unchanged endpoint
specs/001-fix-api-packaging/               # Backfilled specification and verification records
```

**Structure Decision**: Keep the application architecture and deployment workflow intact. Change the production build command, add the documented compiler plugin, and remove only the Turbopack-specific Rust compiler option. The existing pipeline invokes the updated package script before packaging.

## Complexity Tracking

No constitution violations or additional architecture are introduced.
