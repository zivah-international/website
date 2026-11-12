# Research: Restore Production API Runtime Dependencies

## Confirmed failure chain

1. The Passenger log reports `Failed to load external module pg-ad45e98bb7b7a165` from `.next/server/chunks/[turbopack]_runtime.js`.
2. The local standalone build contains `.next/standalone/.next/node_modules/pg-ad45e98bb7b7a165` as a symlink to `../../node_modules/.pnpm/pg@8.23.1/node_modules/pg`.
3. `.github/workflows/deploy.yml` packages `.next/standalone` with `rsync -a --exclude='/node_modules'`. This excludes the symlink target while leaving the hashed alias in `.next/node_modules`.
4. The local standalone tree retains the pnpm virtual store and works through to the route handler; the deployed FTP package does not retain that target. The unresolved import occurs before SQL execution.

This explains why local requests reach the database layer while the production process fails while importing the route bundle. The update to product image URLs did not modify this runtime dependency tree, PostgreSQL permissions, or the database schema.

## Framework and build decision

- The installed Next.js CLI supports `next build --webpack` as an alternative to Turbopack.
- The first Webpack build attempt rejected `experimental.turbopackRustReactCompiler`; Next.js documentation says this Rust implementation is Turbopack-only. The stable `reactCompiler` option uses `babel-plugin-react-compiler`, which the documentation requires as a dev dependency.
- The official [Next.js output guide](https://nextjs.org/docs/app/api-reference/config/next-config-js/output) describes the standalone output and its runtime package files.
- The official [serverExternalPackages guide](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages) documents external package resolution for Server Components and Route Handlers and lists `pg` among built-in external packages.
- A closely matching Next.js 16 + Turbopack + pnpm deployment report records the same hashed-alias `ERR_MODULE_NOT_FOUND` pattern and reports that switching the build to Webpack avoids the runtime failure: [vercel/next.js issue #93901](https://github.com/vercel/next.js/issues/93901).

## Decision

Change the existing `build` script to `next build --webpack`, install the documented Babel compiler plugin, and remove the Turbopack-only Rust compiler flag while keeping `reactCompiler: true`. This keeps the current cPanel packaging and environment configuration, preserves the React Compiler, and avoids shipping Turbopack's hashed pnpm-store alias as the route's runtime package name.

## Local artifact verification

The production build completed with Next.js 16.4.6 using Webpack. The generated standalone server contains ordinary `import("pg")` references, contains zero `pg-<hash>` aliases in server chunks, and no longer emits `.next/node_modules` aliases for the PostgreSQL driver.

## Risks and verification boundary

- The cPanel Node.js environment must have the already-declared `pg` production dependency installed, consistent with the documented CloudLinux-managed dependency symlink.
- A local artifact build can confirm the generated import form and that the standalone server reaches route-level error handling. Only a subsequent production deployment can confirm Passenger and cPanel resolve the installed dependency in situ.
