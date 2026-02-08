import { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

import { defaultLocale, locales } from '@/i18n/config';
import { enforceHTTPS, logSecurityEvent } from '@/lib/https';
import { securityMiddleware } from '@/lib/security';
import { updateSession } from '@/utils/supabase/middleware';

// Create the next-intl middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // No prefix for default (es), prefix for others (/en)
});

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip i18n for API routes, static files, and special paths
  const shouldSkipI18n =
    pathname.startsWith('/api/') ||
    pathname.startsWith('/admin/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/assets/') ||
    pathname.includes('.');

  // Handle i18n routing using next-intl middleware
  if (!shouldSkipI18n) {
    return intlMiddleware(request);
  }

  // Enforce HTTPS in production
  const httpsRedirect = enforceHTTPS(request);
  if (httpsRedirect) {
    logSecurityEvent(
      'https_redirect',
      {
        from: request.url,
        to: httpsRedirect.headers.get('location'),
      },
      request
    );
    return httpsRedirect;
  }

  // Apply security middleware
  const securityResponse = securityMiddleware(request);
  if (securityResponse) {
    return securityResponse;
  }

  // For API routes, add additional security checks
  if (pathname.startsWith('/api/')) {
    // Log API access
    logSecurityEvent(
      'api_access',
      {
        pathname,
        method: request.method,
      },
      request
    );
  }

  // Handle Supabase session updates and auth redirects
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (robots.txt, sitemap.xml, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
