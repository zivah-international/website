# 🌊 ZIVAH International S.A. - Website

Modern Next.js website for **ZIVAH International S.A.**, premium Ecuadorian product exporters with headquarters in Samborondón, Guayas and distribution office in Miami, Florida.

## ✅ **Project Status: PRODUCTION READY**

**Current Version**: 1.0.0
**Last Updated**: December 2025
**Next.js Version**: 15.5.3
**Database**: MySQL 8.0+ with direct SQL queries and Prisma ORM

### 🌟 **Key Features Implemented**

- ✅ **Multi-page Website**: Home, Products, Quality, Markets, Quote, Contact pages
- ✅ **Dynamic Product Catalog**: 30+ products across 3 categories with filtering
- ✅ **Advanced Quote System**: Multi-product quotes with measurements and specifications
- ✅ **Admin Dashboard**: User management, quote processing, analytics
- ✅ **Internationalization Ready**: Spanish content with English route structure
- ✅ **PWA Features**: Service worker, offline functionality, web manifest
- ✅ **SEO Optimized**: Meta tags, structured data, sitemap generation
- ✅ **Performance Monitoring**: Core Web Vitals, analytics integration
- ✅ **Security**: Rate limiting, input validation, GDPR compliance

### 🚀 **Tech Stack**

- **Framework**: Next.js 15.5.3 with App Router
- **Database**: MySQL 8.0+ with direct SQL queries and Prisma ORM
- **Authentication**: NextAuth.js 4.24.11
- **Styling**: Tailwind CSS 4.1.13 with custom theme
- **Language**: TypeScript 5.9.2 with strict mode
- **State Management**: React hooks with context
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with custom styling
- **Email**: Nodemailer for contact forms
- **Analytics**: Google Analytics 4 with custom events
- **Performance**: Web Vitals monitoring
- **Security**: Rate limiting, input validation, HTTPS
- **PWA**: Service worker with offline functionality
- **Deployment**: cPanel Node.js hosting compatible

### 🏗️ **Project Structure**

```
zivah-international/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css        # Global styles with theme variables
│   │   ├── layout.tsx         # Root layout with theme provider
│   │   ├── page.tsx           # Homepage with dynamic content
│   │   ├── sitemap.ts         # Dynamic sitemap generation
│   │   ├── contact/           # Contact page
│   │   ├── legal/             # Legal pages (privacy, terms, etc.)
│   │   ├── markets/           # Markets page
│   │   ├── products/          # Products pages (individual product pages)
│   │   ├── quality/           # Quality certifications page
│   │   ├── quote/             # Quote request page
│   │   └── api/               # API routes
│   │       ├── auth/          # NextAuth authentication
│   │       ├── categories/    # Product categories endpoint
│   │       ├── contact/       # Contact form endpoint
│   │       ├── products/      # Products endpoint
│   │       └── quotes/        # Quote requests endpoint
│   ├── components/            # React components
│   │   ├── Analytics.tsx      # Google Analytics integration
│   │   ├── BusinessIntelligence.tsx # Business tracking
│   │   ├── ClientThemeProvider.tsx # Client-side theme provider
│   │   ├── CookieConsent.tsx  # GDPR cookie consent
│   │   ├── ErrorHandling.tsx  # Error boundaries and loading states
│   │   ├── LazyLoad.tsx       # Lazy loading utilities
│   │   ├── Navigation.tsx     # Navigation component
│   │   ├── OptimizedImage.tsx # Image optimization
│   │   ├── QuoteForm.tsx      # Quote request form
│   │   ├── SEO.tsx           # SEO optimization
│   │   ├── SEOOptimization.tsx # Comprehensive SEO suite
│   │   ├── ServiceWorker.tsx  # PWA service worker
│   │   ├── ThemeProvider.tsx  # Theme context provider
│   │   ├── ThemeToggle.tsx    # Dark/light mode toggle
│   │   ├── WebVitals.tsx      # Core Web Vitals monitoring
│   │   ├── ui/               # Reusable UI components
│   │   └── index.ts          # Component exports
│   ├── lib/                   # Utilities and services
│   │   ├── auth.ts           # Authentication utilities
│   │   ├── email.ts          # Email service
│   │   ├── errors.ts         # Error handling utilities
│   │   ├── hooks/            # Custom React hooks
│   │   ├── https.ts          # HTTPS and security utilities
│   │   ├── logger.ts         # Logging utilities
│   │   ├── prisma.ts         # Database client
│   │   ├── rate-limit.ts     # Rate limiting
│   │   ├── security-config.ts # Security configuration
│   │   ├── security.ts       # Security middleware
│   │   ├── services/         # Business logic services
│   │   ├── utils.ts          # Helper functions
│   │   ├── validation.ts     # Input validation
│   │   └── validations/      # Validation schemas
│   ├── middleware.ts         # Next.js middleware
│   └── types/                # TypeScript definitions
├── prisma/                   # Database layer
│   ├── schema.prisma        # Database schema
│   ├── seed.ts             # Database seeding
│   └── migrations/         # Database migrations
├── public/                  # Static assets
│   ├── assets/images/      # Images and icons
│   ├── robots.txt         # SEO configuration
│   ├── sitemap.xml        # Site structure
│   └── site.webmanifest   # PWA manifest
└── Configuration files
    ├── next.config.ts      # Next.js configuration
    ├── tailwind.config.ts  # Tailwind CSS setup
    ├── tsconfig.json      # TypeScript config
    ├── package.json       # Dependencies and scripts
    └── .env.example       # Environment variables template
```

## 🎯 **Features**

### 🌙 **Dark/Light Mode**

- System preference detection
- localStorage persistence
- Smooth transitions with CSS variables
- Glass morphism effects adaptation
- Theme toggle with animated icons

### 📱 **Dynamic Content**

- MySQL database with 3 categories, 30+ products
- API-driven product catalog with filtering
- Real-time category and product search
- Interactive quote request system
- Multi-page structure (Home, Products, Quality, Markets, Quote, Contact)

### 🎨 **Modern UI/UX**

- Responsive design (mobile-first approach)
- Smooth scrolling navigation with section detection
- Glass morphism effects and modern aesthetics
- Professional ZIVAH branding with Ecuadorian theme
- Interactive hover states and animations
- Dark/light mode toggle with system preference detection

### ⚡ **Performance & SEO**

- Next.js 15 App Router with optimized routing
- Core Web Vitals monitoring and reporting
- Image optimization with lazy loading
- Comprehensive SEO suite with structured data
- Google Analytics 4 integration with custom events
- Service worker for PWA functionality
- Dynamic sitemap generation
- Cookie consent with GDPR compliance
- Meta tags and Open Graph optimization

### 🔒 **Security & Compliance**

- Rate limiting and DDoS protection (Upstash)
- Input validation with Zod schemas
- HTTPS enforcement and security headers
- CSRF protection and authentication
- GDPR cookie compliance
- Security middleware and error handling

### 📊 **Business Intelligence**

- Conversion tracking and analytics
- User engagement metrics
- Performance monitoring dashboard
- Business metrics and reporting
- Automated email notifications

## 🛠️ **Development**

### Prerequisites

- Node.js 18.18.0 or higher
- MySQL 8.0+ database
- npm or yarn package manager
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/iferpaz7/zivah-international.git
cd zivah-international

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials and configuration

# Set up database (creates database, tables, and seeds data)
npm run db:setup

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/zivah_db"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Email service (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Production
NODE_ENV="development"
```

### Database Setup

The application uses MySQL 8.0+ with Prisma ORM for type-safe database operations.

#### Database Requirements

- MySQL 8.0+ with InnoDB engine support
- Database user with CREATE DATABASE privileges

#### Database Scripts

```bash
# Generate Prisma Client after schema changes
npm run db:generate

# Push schema changes to database (development)
npm run db:push

# Create and apply migrations (production-ready)
npm run db:migrate

# Open Prisma Studio (visual database editor)
npm run db:studio

# Seed database with initial data (if configured)
npm run db:seed
```

#### Quick Start

1. Ensure MySQL is running
2. Set `DATABASE_URL` in your `.env` file
3. Run `npm run db:push` to create tables
4. Run `npm run db:seed` to add initial data (if configured)

#### Default Admin Accounts

After seeding the database, you can log in with:

- **Admin**: `admin@zivahinternational.com` / `admin123!`
- **Manager**: `manager@zivahinternational.com` / `manager123!`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run format       # Format code with Prettier
npm run format:check # Check if code is formatted correctly
npm run type-check   # Run TypeScript type checking
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database (development)
npm run db:migrate   # Create and apply migrations
npm run db:studio    # Open Prisma Studio database GUI
npm run db:seed      # Seed database with initial data
```

## 🎯 **Code Quality & Formatting**

This project uses a comprehensive code formatting and linting setup to ensure consistent code quality across the team.

### Prettier Configuration

- **Single quotes** for strings
- **Semicolons** always required
- **Trailing commas** in multi-line structures
- **Print width** of 80 characters
- **Tab width** of 2 spaces
- **JSX single quotes** enabled
- Optimized for **Next.js**, **TypeScript**, **React**, and **Tailwind CSS**

### ESLint Configuration

- **Next.js** core web vitals rules
- **TypeScript** recommended rules
- **React** and **React Hooks** best practices
- **JSX accessibility** (jsx-a11y) rules
- **Import** organization and validation
- **Prettier** integration to avoid conflicts
- Custom rules for the project's specific needs

### Available Commands

```bash
# Linting
npm run lint         # Check for linting errors
npm run lint:fix     # Auto-fix linting errors where possible

# Formatting
npm run format       # Format all code files
npm run format:check # Check if code is properly formatted

# Type Checking
npm run type-check   # Run TypeScript type checking
```

### Pre-commit Hooks

The project uses **Husky** and **lint-staged** to automatically:

- Run ESLint on staged TypeScript/JavaScript files
- Format staged files with Prettier
- Prevent commits with linting or formatting errors

### Editor Integration

VS Code settings are configured for:

- **Format on save** enabled
- **ESLint** auto-fix on save
- **Prettier** as default formatter
- **Import organization** on save
- Consistent **tab size** and **rulers**

### File Exclusions

The following files are excluded from formatting:

- `node_modules/` - Dependencies
- `.next/` - Next.js build output
- `prisma/migrations/` - Database migrations
- Environment files (`.env*`)
- Lock files (`package-lock.json`, `yarn.lock`)
- Generated files and logs

### Best Practices

1. **Always run `npm run lint:fix`** before committing
2. **Use `npm run format`** to ensure consistent formatting
3. **Enable format on save** in your editor
4. **Review pre-commit hook output** for any issues
5. **Run `npm run type-check`** regularly during development

## 🗄️ **Database Schema**

### Core Tables

#### Categories Table

- `id`, `name`, `slug`, `description`
- `icon`, `color`, `sort_order`, `is_active`
- `created_at`, `updated_at`

#### Products Table

- `id`, `name`, `slug`, `category_id`
- `description`, `short_description`, `sku`, `code`
- `specifications`, `stock_quantity`, `min_order_qty`
- `image_url`, `image_gallery`, `origin`, `harvest_season`
- `certifications`, `nutritional_info`
- `is_active`, `is_featured`, `seo_title`, `seo_description`
- `measure_id`, `created_at`, `updated_at`

#### Product Variants Table

- `id`, `product_id`, `name`, `sku`, `price`, `stock_qty`
- `is_active`, `attributes`, `created_at`, `updated_at`

#### Quotes System

- **Quotes Table**: `id`, `quote_number`, customer info, status, totals, dates
- **Quote Items Table**: `quote_id`, `product_id`, quantity, pricing, specifications
- **Quote Communications Table**: Communication history and notes

### Supporting Tables

#### Measures & Currencies

- **Measure Families**: Weight, volume, count units
- **Measures**: Individual measurement units with conversions
- **Currencies**: Supported currencies for pricing

#### Users & Authentication

- **Users Table**: Admin/user accounts with roles and permissions
- **Accounts/Sessions**: NextAuth.js authentication tables

#### Countries & Localization

- **Countries Table**: Shipping destinations with calling codes
- **Activity Logs**: User action tracking

### Key Relationships

- **Products** → **Categories** (many-to-one)
- **Products** → **Measures** (many-to-one)
- **Quotes** → **Quote Items** (one-to-many)
- **Quote Items** → **Products** (many-to-one)
- **Users** → **Quotes** (one-to-many for assignments)

## 🚀 **API Endpoints**

### Authentication

- `GET/POST /api/auth/[...nextauth]` - NextAuth.js authentication

### Products

- `GET /api/products` - Get all products with filtering and pagination
- `GET /api/products?category=slug` - Filter products by category
- `GET /api/products?search=term` - Search products by name/description

### Categories

- `GET /api/categories` - Get all product categories
- `GET /api/categories/[slug]` - Get specific category details

### Quotes

- `POST /api/quotes` - Submit quote request
- `GET /api/quotes/countries` - Get available countries for shipping
- `GET /api/quotes/measures` - Get available measurement units
- `GET /api/quotes/products/search` - Search products for quotes

### Contact

- `POST /api/contact` - Submit contact form with rate limiting

### API Response Format

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🚀 **Production Deployment**

### Environment Variables for Production

```env
# Database
DATABASE_URL="mysql://user:pass@host:3306/dbname"

# NextAuth.js
NEXTAUTH_SECRET="your-production-secret-key"
NEXTAUTH_URL="https://yourdomain.com"

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Email service
SMTP_HOST="smtp.yourprovider.com"
SMTP_PORT="587"
SMTP_USER="noreply@yourdomain.com"
SMTP_PASS="your-smtp-password"

# Production settings
NODE_ENV="production"
```

### Build and Deploy

```bash
# Build the application
npm run build

# The .next folder contains the production build
# Upload the entire project to your hosting provider

# For cPanel Node.js hosting:
# 1. Upload all files to public_html/nextjs or subdomain directory
# 2. Set Node.js version to 18+
# 3. Set application startup file to: npm start
# 4. Configure environment variables in cPanel
```

### Database Setup for Production

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed production database (optional)
npx prisma db seed
```

### Performance Optimization

- ✅ Automatic image optimization
- ✅ Core Web Vitals monitoring
- ✅ SEO optimization with structured data
- ✅ Service worker for caching
- ✅ Lazy loading for images and components
- ✅ Bundle splitting and code optimization

### Environment Configuration

```env
# Database
DATABASE_URL="mysql://user:pass@localhost:3306/dbname"

# Next.js
NEXTAUTH_SECRET="random-secret-string"
NEXTAUTH_URL="https://yourdomain.com"
NODE_ENV="production"

# Google Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Email service (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### Troubleshooting

#### Common Issues

1. **Database Connection**: Ensure DATABASE_URL is correct and MySQL is running
2. **Build Errors**: Check Node.js version (18.18.0+) and run `npm install`
3. **Environment Variables**: Copy `.env.example` to `.env` and fill required values
4. **Prisma Issues**: Run `npm run db:generate` after schema changes
5. **Port Conflicts**: Default port is 3000, change with `PORT=3001 npm run dev`

#### Development Tips

- Use `npm run db:studio` to view/edit database
- Check browser console for client-side errors
- Use `npm run lint:fix` to auto-fix code quality issues
- Run `npm run format` to format code consistently
- Use `npm run type-check` for TypeScript validation
- Enable "Format on Save" in your editor for automatic formatting

## � **Usage Examples**

### Product Display

```tsx
// Display products with filtering
import { useEffect, useState } from 'react';

function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetch(`/api/products${category !== 'all' ? `?category=${category}` : ''}`)
      .then(res => res.json())
      .then(data => setProducts(data.data));
  }, [category]);

  return (
    <div>
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
      >
        <option value='all'>All Categories</option>
        <option value='fruits'>Fruits</option>
        <option value='seafood'>Seafood</option>
      </select>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Quote Request Form

```tsx
// Submit quote request
const handleQuoteSubmit = async formData => {
  const response = await fetch('/api/quotes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  if (response.ok) {
    // Handle success
    console.log('Quote submitted successfully');
  } else {
    // Handle error
    console.error('Quote submission failed');
  }
};
```

### Contact Form

```tsx
// Send contact message
const handleContactSubmit = async formData => {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  const result = await response.json();
  if (result.success) {
    alert('Message sent successfully!');
  } else {
    alert(`Error: ${result.error}`);
  }
};
```

## 📊 **Database Management & Analytics**

### Prisma Commands

```bash
# Generate client after schema changes
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name description

# Deploy migrations to production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Seed database with sample data
npx prisma db seed
```

### Analytics & Monitoring

- **Core Web Vitals**: Automatic monitoring of LCP, FID, CLS, FCP, TTFB
- **Google Analytics 4**: Comprehensive event tracking and conversion monitoring
- **Business Intelligence**: Custom conversion tracking and user engagement metrics
- **Performance Monitoring**: Real-time performance metrics and error tracking
- **SEO Monitoring**: Automated SEO validation and reporting

### Backup Strategy

```bash
# Backup database
mysqldump -h localhost -u username -p dbname > backup.sql

# Restore database
mysql -h localhost -u username -p dbname < backup.sql

# Backup application files
tar -czf backup.tar.gz /path/to/application
```

## � **Security & Compliance**

### Security Features

- **Rate Limiting**: Redis-based rate limiting for API endpoints
- **Input Validation**: Comprehensive Zod schema validation
- **XSS Protection**: Input sanitization and HTML escaping
- **SQL Injection Prevention**: Parameterized queries with Prisma
- **CSRF Protection**: Security headers and token validation
- **HTTPS Enforcement**: Automatic SSL redirection
- **Security Headers**: Comprehensive security headers middleware

### GDPR Compliance

- **Cookie Consent**: Granular cookie preferences management
- **Data Processing**: Transparent data collection and usage
- **User Rights**: Data export, deletion, and access requests
- **Analytics Compliance**: GDPR-compliant Google Analytics setup
- **Privacy Policy**: Comprehensive privacy policy documentation

### Performance Security

- **DDoS Protection**: Rate limiting and request throttling
- **Resource Protection**: API endpoint protection and monitoring
- **Error Handling**: Secure error responses without data leakage
- **Logging**: Comprehensive security event logging

### Compliance Documentation

- **Privacy Policy**: `/legal/privacy-policy`
- **Terms of Service**: `/legal/terms-of-service`
- **Cookie Policy**: `/legal/cookie-policy`
- **Data Protection**: `/legal/data-protection`

## 🔧 **Configuration**

### Next.js Configuration

- **Framework**: Next.js 15.5.3 with App Router
- **TypeScript**: Strict mode enabled
- **Image Optimization**: Built-in Next.js Image component
- **API Routes**: RESTful endpoints with proper error handling
- **Middleware**: Security, rate limiting, and HTTPS enforcement

### Database Configuration

- **ORM**: Prisma with MySQL 8.0+
- **Connection**: Environment-based configuration
- **Migrations**: Automated schema management
- **Seeding**: Sample data for development

### Security Features

- **Rate Limiting**: Upstash Redis-based rate limiting
- **Input Validation**: Zod schema validation
- **Sanitization**: XSS and SQL injection protection
- **HTTPS Enforcement**: Middleware-based SSL enforcement
- **Security Headers**: Comprehensive security headers

### SEO & Performance

- **Core Web Vitals**: Automatic monitoring and reporting
- **Structured Data**: JSON-LD schema markup
- **Sitemap**: Dynamic XML sitemap generation
- **Meta Tags**: Comprehensive SEO meta tags
- **Analytics**: Google Analytics 4 integration

### Styling Configuration

- **CSS Framework**: Tailwind CSS 4.1.13
- **Theme System**: Dark/light mode with system preference
- **Glass Morphism**: Custom CSS utilities
- **Responsive Design**: Mobile-first approach
- **Performance**: Optimized CSS with purging

## 📝 **License**

Copyright © 2025 ZIVAH International S.A. All rights reserved.

This project is proprietary software developed for ZIVAH International S.A.
Unauthorized use, reproduction, or distribution is prohibited.

## 📞 **Support & Contact**

### Technical Support

- **Email**: info@zivahinternational.com
- **Repository**: https://github.com/iferpaz7/zivah-international
- **Issues**: GitHub Issues for bug reports and feature requests

### Business Contact

- **Website**: [zivahinternational.com](https://zivahinternational.com)
- **Headquarters**: Samborondón, Guayas, Ecuador
- **Distribution**: Miami, Florida, USA
- **Phone**: +593999002893

### Development Team

- **Lead Developer**: ZIVAH International S.A. Development Team
- **Tech Stack**: Next.js, TypeScript, MySQL, Tailwind CSS
- **Status**: Production Ready with Comprehensive Features

---

**🌊 ZIVAH International S.A.**
_Exportadores Premium de Productos Ecuatorianos_
🏢 _Sede Principal_: Samborondón, Guayas, Ecuador
🏢 _Oficina de Distribución_: Miami, Florida, USA
🌐 _Website_: [zivahinternational.com](https://zivahinternational.com)
📧 _Email_: info@zivahinternational.com
