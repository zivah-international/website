# Database Setup Guide

This guide explains how to set up the ZIVAH International database using the separated schema and seed files.

## Overview

The project now supports both the legacy PostgreSQL setup and a MySQL deployment path. Use PostgreSQL for existing environments and adopt MySQL only after completing the migration checklist below.

- **`database-schema.sql`** - Contains all database structure definitions (tables, types, indexes, constraints)
- **`database-seed.sql`** - Contains only the initial data seeding (INSERT statements)

## Prerequisites

- PostgreSQL **or** MySQL database server running
- Database user with permissions to create databases and tables
- Node.js installed (for running the setup script)

## Environment Variables

Set the following environment variables. The script supports both `DATABASE_URL` (recommended) and individual variables:

### Option 1: DATABASE_URL (Recommended)

PostgreSQL (legacy):

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/zivah_international
```

MySQL (only after migration planning):

```bash
DATABASE_URL=mysql://username:password@localhost:3306/zivah_international
```

### Option 2: Individual Variables (Fallback)

```bash
DB_HOST=localhost          # Database host
DB_PORT=5432              # Database port
DB_NAME=zivah_international  # Database name
DB_USER=postgres          # Database user
DB_PASSWORD=your_password # Database password
DB_SSL=false              # SSL mode: false, true, strict (default: false)
```

### SSL Configuration

The script supports flexible SSL configuration:

- **`DB_SSL=false`** or **`DB_SSL=0`**: Disable SSL (default)
- **`DB_SSL=true`** or **`DB_SSL=1`**: Enable SSL with relaxed certificate validation
- **`DB_SSL=strict`**: Enable SSL with strict certificate validation

**SSL is disabled by default** unless explicitly enabled. For hosting providers that don't support SSL connections, no additional configuration is needed.

The script will automatically use `DATABASE_URL` if available, otherwise fall back to individual variables.

## Setup Methods

### Method 1: Automated Setup (Recommended)

Use the provided Node.js script for automated setup:

```bash
# Install dependencies if not already installed
npm install

# Run the database setup
npm run db:setup
# or
node scripts/setup-database.js
```

This will:

1. Create the database if it doesn't exist
2. Execute the schema creation
3. Seed the database with initial data

### Method 2: Manual Setup

If you prefer to run the SQL files manually:

1. **Create the database:**

   ```sql
   CREATE DATABASE zivah_international;
   \c zivah_international;
   ```

2. **Run the schema file:**

   ```bash
   psql -U your_username -d zivah_international -f database-schema.sql
   ```

3. **Run the seed file:**
   ```bash
   psql -U your_username -d zivah_international -f database-seed.sql
   ```

## File Structure

### database-schema.sql

- Database extensions (uuid-ossp)
- Custom enum types
- Table creation with all constraints
- Index creation for performance
- Foreign key relationships

### database-seed.sql

- Currency data
- Country data
- Measurement units and families
- Product categories
- Admin and manager user accounts
- Sample products (Banano, Cacao)
- Product pricing
- Site settings

## Default Admin Credentials

After setup, you can log in with these credentials:

**Admin Account:**

- Email: `admin@zivahinternational.com`
- Password: `admin123!`

**Manager Account:**

- Email: `manager@zivahinternational.com`
- Password: `manager123!`

## Troubleshooting

### Connection Issues

- Ensure PostgreSQL is running
- Verify connection parameters
- Check user permissions

### Script Errors

- Make sure all dependencies are installed (`npm install`)
- Verify environment variables are set correctly
- Check PostgreSQL logs for detailed error messages

### Permission Issues

- Ensure the database user has CREATE DATABASE privileges
- Verify the user can create tables and indexes
- **For shared hosting**: The script will automatically try to connect directly to your database if database creation fails due to permissions

### Hosting Environment Notes

The setup script is designed to work with various hosting environments:

- **Full PostgreSQL access**: Can create databases and connect to system databases
- **Shared hosting**: Limited to specific database access - the script will connect directly to your target database
- **Cloud providers**: Works with services like AWS RDS, Google Cloud SQL, etc.

### SSL Connection Issues

SSL is **disabled by default** in the setup script. If you encounter SSL-related errors:

- For hosting providers without SSL support: No configuration needed (SSL is already disabled)
- To explicitly enable SSL: Set `DB_SSL=true` for relaxed validation or `DB_SSL=strict` for strict validation
- If you get certificate validation errors: Try `DB_SSL=true` instead of `DB_SSL=strict`

## Development Notes

- The schema file can be run multiple times safely (uses `IF NOT EXISTS` and `ON CONFLICT DO NOTHING`)
- The seed file uses `ON CONFLICT DO NOTHING` to avoid duplicate data
- Passwords are pre-hashed using bcrypt with cost factor 12
- All foreign key relationships are properly maintained

## Migration

### PostgreSQL → MySQL migration (phased)

1. **Phase 0 (plan):** Keep `DATABASE_URL` pointed at PostgreSQL in production. Stand up a MySQL instance and run `database-schema.sql` and `database-seed.sql` against it in a sandbox.
2. **Phase 1 (dual readiness):** Run the application against MySQL in a staging environment. Verify auth, quotes API, and background jobs. Keep PostgreSQL live for production.
3. **Phase 2 (data migration):** Export data from PostgreSQL and import into MySQL (e.g., pg_dump → CSV → LOAD DATA). Validate record counts and spot-check key tables (users, quotes, products, quote_items).
4. **Phase 3 (cutover):** Update `DATABASE_URL` to the MySQL URI, deploy, and monitor. Keep PostgreSQL snapshot for rollback until MySQL runs cleanly for at least one release cycle.

### Schema updates

1. Modify `database-schema.sql` with your changes.
2. Create a new migration file for data transformations if needed.
3. Test the changes in a development environment (both PostgreSQL and MySQL if you support both).
4. Update this documentation if the setup process changes.
