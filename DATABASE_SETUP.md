# Database Setup Guide

This guide explains how to set up the ZIVAH International MySQL database using Prisma ORM.

## Overview

The project uses MySQL 8.0+ with Prisma ORM for type-safe database operations. Prisma provides:

- **Type-safe database client** - Full TypeScript support
- **Migration system** - Version-controlled schema changes
- **Prisma Studio** - Visual database editor
- **Seeding** - Automated initial data setup

## Prerequisites

- MySQL 8.0+ database server running
- Database user with permissions to create databases and tables
- Node.js 18+ installed

## Environment Variables

Set your database connection in `.env`:

```bash
DATABASE_URL="mysql://username:password@localhost:3306/zivah_international"
```

Example for local development:

```bash
DATABASE_URL="mysql://root:password@localhost:3306/zivah_international"
```

## Setup Methods

### Method 1: Quick Setup (Recommended for Development)

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Seed database with initial data (if configured)
npm run db:seed
```

### Method 2: Production Setup with Migrations

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Create and apply migration
npm run db:migrate

# Deploy to production
npx prisma migrate deploy

# Seed database (if needed)
npm run db:seed
```

## Prisma Commands Reference

### Development

```bash
# Generate Prisma Client (after schema changes)
npm run db:generate
# or
npx prisma generate

# Push schema changes to database (no migration files)
npm run db:push
# or
npx prisma db push

# Open Prisma Studio (visual database editor)
npm run db:studio
# or
npx prisma studio
```

### Migrations (Production-Ready)

```bash
# Create a new migration
npm run db:migrate
# or
npx prisma migrate dev --name description

# Apply pending migrations (production)
npx prisma migrate deploy

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Check migration status
npx prisma migrate status
```

### Seeding

```bash
# Run seed script
npm run db:seed
# or
npx prisma db seed
```

## Database Schema

The database schema is defined in `prisma/schema.prisma`. Key models include:

- **Users** - Authentication and user management
- **Categories** - Product categories
- **Products** - Product catalog
- **Quotes** - Quote requests
- **QuoteItems** - Individual items in quotes
- **Countries** - Shipping destinations
- **Measures** - Measurement units
- **Currencies** - Supported currencies

## Default Admin Credentials

After seeding the database, you can log in with:

**Admin Account:**

- Email: `admin@zivahinternational.com`
- Password: `admin123!`

**Manager Account:**

- Email: `manager@zivahinternational.com`
- Password: `manager123!`

## Troubleshooting

### Connection Issues

- Ensure MySQL is running: `mysql -u root -p`
- Verify DATABASE_URL format: `mysql://user:pass@host:3306/dbname`
- Check firewall settings allow MySQL connections
- Test connection: `npx prisma db pull`

### Schema Issues

- If schema is out of sync: `npm run db:push`
- If migration fails: Check Prisma Studio for conflicts
- Reset database: `npx prisma migrate reset` (⚠️ deletes data)

### Prisma Client Issues

- If types are wrong: `npm run db:generate`
- If client not found: Restart your IDE/terminal
- Clear node_modules: `npm install`

## Best Practices

1. **Use migrations in production** - Never use `db:push` in production
2. **Always generate client** - Run `db:generate` after schema changes
3. **Version control migrations** - Commit all migration files
4. **Test migrations locally** - Before deploying to production
5. **Backup before migrating** - Always backup production data first

## Production Deployment

```bash
# 1. Ensure DATABASE_URL is set in production environment

# 2. Generate Prisma Client
npm run db:generate

# 3. Deploy migrations
npx prisma migrate deploy

# 4. Seed if needed (first deployment only)
npx prisma db seed

# 5. Start application
npm run build
npm start
```
