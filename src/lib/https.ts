import { NextRequest, NextResponse } from 'next/server';

// HTTPS Enforcement Middleware
export function enforceHTTPS(request: NextRequest): NextResponse | null {
  // Skip HTTPS enforcement in development
  if (process.env.NODE_ENV === 'development') {
    return null;
  }

  const host = request.headers.get('host') || '';
  const protocol =
    request.headers.get('x-forwarded-proto') ||
    request.headers.get('x-forwarded-protocol') ||
    (request.url.startsWith('https://') ? 'https' : 'http');

  // Check if request is already HTTPS
  if (protocol === 'https') {
    return null;
  }

  // Redirect to HTTPS
  const httpsUrl = `https://${host}${request.nextUrl.pathname}${request.nextUrl.search}`;

  return NextResponse.redirect(httpsUrl, {
    status: 301, // Permanent redirect
    headers: {
      'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
    },
  });
}

// Security headers for different environments
export const getSecurityHeaders = (environment: string = 'production') => {
  const baseHeaders = {
    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      'upgrade-insecure-requests',
    ].join('; '),

    // Prevent clickjacking
    'X-Frame-Options': 'DENY',

    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Enable XSS protection
    'X-XSS-Protection': '1; mode=block',

    // Referrer Policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Permissions Policy
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'accelerometer=()',
      'gyroscope=()',
      'autoplay=()',
      'encrypted-media=()',
      'fullscreen=(self)',
      'picture-in-picture=()',
    ].join(', '),

    // HSTS (HTTP Strict Transport Security)
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

    // Remove server information
    'X-Powered-By': '',

    // Cross-Origin policies
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
  };

  // Add development-specific headers
  if (environment === 'development') {
    return {
      ...baseHeaders,
      // Relax CSP for development
      'Content-Security-Policy': baseHeaders['Content-Security-Policy'].replace(
        'upgrade-insecure-requests',
        ''
      ),
      // Disable HSTS in development
      'Strict-Transport-Security': '',
    };
  }

  return baseHeaders;
};

// Validate request origin
export function validateOrigin(request: NextRequest, allowedOrigins: string[]): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  if (!origin && !referer) return false;

  const checkUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return allowedOrigins.some(allowed => {
        if (allowed.startsWith('*.')) {
          // Wildcard subdomain
          const domain = allowed.slice(2);
          return urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain);
        }
        return urlObj.origin === allowed;
      });
    } catch {
      return false;
    }
  };

  if (origin && checkUrl(origin)) return true;
  if (referer && checkUrl(referer)) return true;

  return false;
}

// CORS headers
export function getCORSHeaders(request: NextRequest, allowedOrigins: string[] = []) {
  const origin = request.headers.get('origin') || '';

  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400', // 24 hours
  };

  // Add credentials if origin is allowed
  if (corsHeaders['Access-Control-Allow-Origin']) {
    corsHeaders['Access-Control-Allow-Credentials'] = 'true';
  }

  return corsHeaders;
}

// API Key validation
export function validateAPIKey(request: NextRequest, validKeys: string[]): boolean {
  const apiKey =
    request.headers.get('x-api-key') ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  if (!apiKey) return false;

  return validKeys.includes(apiKey);
}

// Request size limiting
export function checkRequestSize(
  request: NextRequest,
  maxSizeBytes: number = 10 * 1024 * 1024
): boolean {
  const contentLength = parseInt(request.headers.get('content-length') || '0');
  return contentLength <= maxSizeBytes;
}

// Log security events
export function logSecurityEvent(
  event: string,
  details: Record<string, unknown>,
  request: NextRequest
) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    ip:
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    url: request.url,
    method: request.method,
    ...details,
  };

  console.warn('SECURITY EVENT:', JSON.stringify(logEntry, null, 2));

  // In production, you might want to send this to a logging service
  // like Datadog, LogRocket, or your own logging infrastructure
}
