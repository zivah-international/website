# Production Runtime Contract

## Request behavior

- The quote page's existing country, measure, and product lookup routes retain their current request and JSON response contracts.
- The health route retains its current JSON health response.
- Database connectivity failures are handled by the existing route error paths; they must not prevent the route bundle from loading.

## Release artifact behavior

- The production standalone bundle must load the declared `pg` dependency from the cPanel Node.js runtime dependency installation.
- The application must not require a pnpm virtual-store path that the FTP packaging step intentionally omits.
- The release does not change database credentials, host, port, schema, data, or route implementations.
