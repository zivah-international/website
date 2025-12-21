import { NextRequest } from 'next/server';

import { enforceHTTPS, logSecurityEvent } from '@/lib/https';
import { securityMiddleware } from '@/lib/security';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  return securityResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    /*
     * Match API routes
     */
    '/api/:path*',
  ],
};
