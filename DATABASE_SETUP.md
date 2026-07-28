# Database Setup Guide

This guide explains how to set up the ZIVAH International PostgreSQL database using Prisma ORM.

## Overview

The project uses PostgreSQL 13+ with **Prisma ORM for dev-only schema management**. Production queries use direct SQL via `pg` connection pool (`src/lib/db.ts`). The generated `@prisma/client` is **never imported** in application code.

## Prerequisites

- PostgreSQL 13+ database server running
- Database user with permissions to create tables
- Node.js 18+ installed

## Environment Variables

Set your database connection in `.env.local`:

```env
DATABASE_URL="postgresql://user:password@host:5432/zivahint_web"
```

## Setup

```bash
# Install dependencies
pnpm install

# Generate Prisma Client (dev only — not used at runtime)
pnpm db:generate

# Push schema to database (creates all tables)
pnpm db:push

# Seed database with initial data
pnpm db:seed
```

## Prisma Commands Reference (Dev Only)

```bash
# Generate Prisma Client (after schema changes — dev only)
pnpm db:generate

# Push schema to database (no migration files — for development)
pnpm db:push

# Open Prisma Studio (visual database editor)
pnpm db:studio

# Run seed script
pnpm db:seed
```

## Database Schema

The database schema is defined in `prisma/schema.prisma`. Key models include:

- **Users / Sessions** — Custom authentication
- **Categories** — Product categories (hierarchical)
- **Products / ProductVariants / ProductPrices** — Product catalog with i18n
- **Quotes / QuoteItems / QuoteCommunications** — Quote system
- **Countries** — Shipping destinations
- **Measures / MeasureFamilies** — Measurement units
- **Currencies** — Supported currencies
- **ContactSubmissions** — Contact form entries
- **ActivityLogs** — Audit trail

## Default Admin Credentials

After seeding, you can log in with:

- **Admin**: `admin@zivahinternational.com` / `admin123!`

Override via `ADMIN_SEED_EMAIL` and `ADMIN_SEED_PASSWORD` env vars.

## Troubleshooting

### Connection Issues

- Ensure PostgreSQL is running and accessible
- Verify `DATABASE_URL` format: `postgresql://user:pass@host:5432/dbname`
- Check firewall allows the PostgreSQL port
- Test connection: `npx prisma db pull`

### Schema Issues

- If schema is out of sync: `pnpm db:push`
- If Prisma Client types are wrong: `pnpm db:generate`

## Production Deployment

```bash
# 1. Ensure DATABASE_URL is set in production environment

# 2. Push schema
pnpm db:push

# 3. Seed if needed (first deployment only)
pnpm db:seed

# 4. Build and start
pnpm build
npm start
```

**Note**:

- Prisma (`db:generate`, `db:push`, `db:seed`) is **dev-only** — the generated client is not used at runtime
- All production queries use `pg` pool directly (`src/lib/db.ts`)
- For version-controlled schema changes, consider `prisma migrate dev` + `prisma migrate deploy`
