# ZIVAH International S.A. - Website

Modern Next.js website for **ZIVAH International S.A.**, premium Ecuadorian product exporters with headquarters in Samborondón, Guayas and distribution office in Miami, Florida.

## Project Status: PRODUCTION READY

**Current Version**: 1.0.0
**Last Updated**: July 2026
**Next.js Version**: 16.2.9
**Database**: PostgreSQL 13+ with direct SQL queries and Prisma ORM

### Key Features Implemented

- Multi-page Website: Home, Products, Quality, Markets, Quote, Contact pages
- Dynamic Product Catalog: 30+ products across 3 categories with filtering
- Advanced Quote System: Multi-product quotes with measurements and specifications
- Admin Dashboard: User management, quote processing, analytics
- Internationalization Ready: Multi-language support (ES/EN)
- PWA Features: Service worker, offline functionality, web manifest
- SEO Optimized: Meta tags, structured data, sitemap generation
- Performance Monitoring: Core Web Vitals, analytics integration
- Security: Rate limiting, input validation, GDPR compliance

### Tech Stack

- **Framework**: Next.js 16.2.9 with App Router
- **Database**: PostgreSQL 13+ with direct SQL queries (`pg` pool) and Prisma ORM
- **Authentication**: Custom session-based auth (bcryptjs + UUID tokens via httpOnly cookies)
- **Styling**: Tailwind CSS 4.3.1 with custom theme
- **Language**: TypeScript 5.9.2 with strict mode
- **UI Components**: Radix UI primitives with custom styling
- **Email**: Nodemailer for contact/quote notifications
- **Analytics**: Google Analytics 4 with custom events
- **Validation**: Zod schemas for input validation
- **Rate Limiting**: Upstash Redis-based rate limiting
- **Deployment**: cPanel Node.js hosting compatible (standalone output)

### Project Structure

```
src/
├── app/
│   ├── (auth)/              # Sign-in/Sign-up pages
│   ├── [locale]/            # Internationalized pages
│   ├── admin/               # Admin dashboard pages
│   └── api/                 # API routes
│       ├── auth/            # sign-in, sign-up, sign-out, session
│       ├── admin/           # Admin CRUD endpoints
│       ├── categories/      # Public categories
│       ├── contact/         # Contact form
│       ├── health/          # Health check
│       ├── products/        # Public products
│       └── quotes/          # Quote system
├── components/              # React components
├── lib/
│   ├── auth.ts             # Session validation via DB
│   ├── auth-shared.ts      # Auth types & role helpers
│   ├── db.ts               # PostgreSQL connection pool
│   ├── email.ts            # Nodemailer service
│   ├── password.ts         # bcryptjs hash/verify
│   └── ...
└── utils/
prisma/
├── schema.prisma           # Database schema
├── seed.ts                 # Database seeding
└── migrations/             # SQL migrations
```

## Development

### Prerequisites

- Node.js 18.18.0 or higher
- PostgreSQL 13+ database
- pnpm package manager

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database credentials

# Generate Prisma client
pnpm db:generate

# Push schema to database (creates all tables)
pnpm db:push

# Seed database with initial data (currencies, countries, measures, products, admin user)
pnpm db:seed

# Start development server
pnpm dev
```

### Environment Variables

```env
# Database (Required)
DATABASE_URL="postgresql://user:password@host:5432/database"

# Email (Required)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="noreply@zivahinternational.com"
BUSINESS_EMAIL="info@zivahinternational.com"

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

### Default Admin Account

After seeding, you can log in with:

- **Admin**: `admin@zivahinternational.com` / `admin123!`

Admin credentials can be customized via `ADMIN_SEED_EMAIL` and `ADMIN_SEED_PASSWORD` env vars.

### Database Scripts (Dev Only)

```bash
pnpm db:generate   # Generate Prisma client after schema changes
pnpm db:push       # Push schema to database (development)
pnpm db:migrate    # Create and apply migrations
pnpm db:studio     # Open Prisma Studio (database GUI)
pnpm db:seed       # Seed database with initial data
```

**Note**: Prisma is a dev-time tool only. The generated client is never used in application code — all production queries go through `pg` directly.

## Architecture

### Authentication Flow

Custom session-based auth without external providers:

```
Sign-in → POST /api/auth/sign-in → bcryptjs verify → session token (UUID) → httpOnly cookie
Sign-up → POST /api/auth/sign-up → bcryptjs hash → session token → httpOnly cookie
Sign-out → POST /api/auth/sign-out → DELETE session from DB → clear cookie
Session check → GET /api/auth/session → lookup token in DB → return user
```

- Tokens are stored in `sessions` table with expiry (7 days)
- Passwords hashed with bcryptjs (12 salt rounds)
- Admin routes protected via `getAuthUser()` which queries sessions/users tables

### Database Layer

Two-tier approach:

1. **Runtime** (`src/lib/db.ts`): Direct PostgreSQL queries via `pg` connection pool — this is what the app uses in production
2. **Dev-only** (Prisma): Schema management, migrations, and seeding only — `@prisma/client` is **never imported** in application code

### API Routes

| Endpoint                          | Method | Description                        |
| --------------------------------- | ------ | ---------------------------------- |
| `POST /api/auth/sign-in`          | POST   | Email + password login             |
| `POST /api/auth/sign-up`          | POST   | Create account                     |
| `POST /api/auth/sign-out`         | POST   | Destroy session                    |
| `GET /api/auth/session`           | GET    | Get current user                   |
| `GET /api/categories`             | GET    | Product categories                 |
| `GET /api/products`               | GET    | Products with filtering/pagination |
| `POST /api/quotes`                | POST   | Submit quote request               |
| `GET /api/quotes/countries`       | GET    | Shipping countries                 |
| `GET /api/quotes/measures`        | GET    | Measurement units                  |
| `GET /api/quotes/products/search` | GET    | Product search for quotes          |
| `POST /api/contact`               | POST   | Contact form                       |
| `GET /api/health`                 | GET    | Health check                       |

### Database Schema (Core Tables)

- **users**: Authentication, roles (admin/sales_manager/sales_rep/viewer)
- **sessions**: Session tokens for auth
- **categories**: Product categories (hierarchical)
- **products**: Product catalog with i18n translations
- **product_variants**: Product variations (size, etc.)
- **product_prices**: Pricing by measure unit
- **measures / measure_families**: Measurement units with conversions
- **currencies**: Supported currencies
- **countries**: Shipping destinations
- **quotes / quote_items / quote_communications**: Quote system
- **contact_submissions**: Contact form entries
- **newsletter_subscriptions**: Newsletter signups
- **site_settings**: App configuration
- **pages**: CMS pages
- **activity_logs**: Audit trail

## Production Deployment

### Build

```bash
pnpm build
```

Output: `.next/standalone/` (standalone mode for cPanel).

### cPanel Setup

1. Upload `.next/standalone/` contents and `public/` folder
2. Set Node.js version to 22+
3. Entry point: `node server.cjs` or `npm start`
4. Configure environment variables in cPanel Node.js Selector
5. Run `pnpm db:push` and `pnpm db:seed` on production DB

### Required Environment Variables (Production)

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
EMAIL_HOST="smtp.yourprovider.com"
EMAIL_PORT="465"
EMAIL_USER="noreply@yourdomain.com"
EMAIL_PASS="your-smtp-password"
EMAIL_FROM="noreply@yourdomain.com"
BUSINESS_EMAIL="export@yourdomain.com"
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
NODE_ENV="production"
```

## Security

- Passwords: bcryptjs with 12 salt rounds
- Sessions: UUID tokens in httpOnly, Secure, SameSite cookies
- SQL Injection: Parameterized queries (never string concatenation)
- Rate Limiting: Upstash Redis-based per-IP throttling
- Input Validation: Zod schemas on all API inputs
- XSS Protection: Input sanitization on all text fields
- Headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- HTTPS: Enforced in production via middleware

## License

Copyright © 2026 ZIVAH International S.A. All rights reserved.

## Contact

- **Website**: [zivahinternational.com](https://zivahinternational.com)
- **Email**: info@zivahinternational.com
- **Headquarters**: Samborondón, Guayas, Ecuador
- **Distribution**: Miami, Florida, USA
