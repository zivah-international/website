# Verification Quickstart

1. Run `pnpm build` from the repository root.
2. Inspect `.next/standalone/.next/server/chunks` and confirm the route bundle does not attempt to import a missing hashed `pg-<hash>` package alias.
3. Confirm the production route bundle uses the ordinary `pg` package name expected in the cPanel-managed dependency directory.
4. On the next approved production release, request `/api/health`, `/api/quotes/measures`, `/api/quotes/countries`, and `/api/products`. Each should return its application JSON response; no Passenger log should report `ERR_MODULE_NOT_FOUND` for `pg-<hash>`.

Local artifact result: steps 1–3 passed on 2026-11-12. Step 4 remains a post-release check.

Production verification requires a deployment and the configured cPanel environment. Do not print or include `DATABASE_URL` values in logs or reports.
