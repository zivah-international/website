import { NextRequest, NextResponse } from 'next/server';

import { getSecurityHeaders } from './https';
import { logger } from './logger';

// Simple in-memory rate limiter (for development)
// In production, use Redis or a proper rate limiting service
class SimpleRateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();

  constructor(
    private limit: number = 100,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}

  check(key: string): { success: boolean; remaining: number; reset: number } {
    const now = Date.now();
    const record = this.requests.get(key);

    if (!record || now > record.resetTime) {
      // First request or window expired
      this.requests.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return {
        success: true,
        remaining: this.limit - 1,
        reset: now + this.windowMs,
      };
    }

    if (record.count >= this.limit) {
      return { success: false, remaining: 0, reset: record.resetTime };
    }

    record.count++;
    return {
      success: true,
      remaining: this.limit - record.count,
      reset: record.resetTime,
    };
  }
}

const rateLimiter = new SimpleRateLimiter();

// Security headers configuration
const securityHeaders = getSecurityHeaders(process.env.NODE_ENV);

// Suspicious patterns to block
const suspiciousPatterns = [
  /\.\./, // Directory traversal
  /<script/i, // XSS attempts
  /javascript:/i, // JavaScript injection
  /on\w+\s*=/i, // Event handler injection
  /eval\(/i, // Code execution
  /base64,/i, // Base64 encoded content
  /data:text/i, // Data URL injection
];

// IP addresses to block (add known malicious IPs)
const blockedIPs = new Set<string>([
  // Add known malicious IPs here
  // '192.168.1.1',
]);

// User agents to block
const blockedUserAgents = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /sqlmap/i,
  /nmap/i,
  /masscan/i,
  /dirbuster/i,
  /gobuster/i,
  /nikto/i,
  /acunetix/i,
  /openvas/i,
  /nessus/i,
  /qualys/i,
  /rapid7/i,
  /metasploit/i,
];

// Rate limiting for sensitive endpoints
const sensitiveEndpoints = ['/api/auth', '/api/quotes', '/api/contact', '/api/products'];

export async function securityMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown';
  const userAgent = request.headers.get('user-agent') || '';
  const { method } = request;

  // Block known malicious IPs
  if (blockedIPs.has(ip)) {
    logger.warn(`Blocked request from malicious IP: ${ip}`);
    return new NextResponse('Access Denied', { status: 403 });
  }

  // Block suspicious user agents
  if (blockedUserAgents.some(pattern => pattern.test(userAgent))) {
    logger.warn(`Blocked request from suspicious user agent: ${userAgent}`);
    return new NextResponse('Access Denied', { status: 403 });
  }

  // Check for suspicious patterns in URL and query parameters
  const fullUrl = request.url;
  if (suspiciousPatterns.some(pattern => pattern.test(fullUrl))) {
    logger.warn(`Blocked request with suspicious pattern: ${fullUrl}`);
    return new NextResponse('Bad Request', { status: 400 });
  }

  // Rate limiting for sensitive endpoints
  if (sensitiveEndpoints.some(endpoint => pathname.startsWith(endpoint))) {
    try {
      const { success } = rateLimiter.check(ip);

      if (!success) {
        logger.warn(`Rate limit exceeded for IP: ${ip} on ${pathname}`);
        return new NextResponse('Too Many Requests', {
          status: 429,
          headers: {
            'Retry-After': '900', // 15 minutes
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          },
        });
      }
    } catch (error) {
      logger.error('Rate limiting error:', error);
      // Continue without rate limiting if there's an error
    }
  }

  // General rate limiting for all requests
  try {
    const { success, remaining, reset } = rateLimiter.check(`${ip}:general`);

    if (!success) {
      logger.warn(`General rate limit exceeded for IP: ${ip}`);
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': '900',
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': new Date(reset).toISOString(),
        },
      });
    }
  } catch (error) {
    logger.error('General rate limiting error:', error);
  }

  // Block dangerous HTTP methods
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
  if (!allowedMethods.includes(method)) {
    logger.warn(`Blocked dangerous HTTP method: ${method} from ${ip}`);
    return new NextResponse('Method Not Allowed', { status: 405 });
  }

  // Log security events
  if (pathname.includes('/api/')) {
    logger.debug(`API Request: ${method} ${pathname} from ${ip}`);
  }

  // Create response with security headers
  const response = NextResponse.next();

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', '100');
  response.headers.set('X-RateLimit-Remaining', '99'); // This would be dynamic in production
  response.headers.set('X-RateLimit-Reset', new Date(Date.now() + 15 * 60 * 1000).toISOString());

  return response;
}

// Utility function to validate input data
export function validateInput(
  input: string,
  type: 'email' | 'text' | 'url' | 'phone' | 'name'
): boolean {
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    text: /^[a-zA-Z0-9\s\-_.,!?()]+$/,
    url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    phone: /^[\+]?[1-9][\d]{0,15}$/,
    name: /^[a-zA-Z\s\-']{2,50}$/,
  };

  return patterns[type].test(input.trim());
}

// Sanitize input data
export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

// CSRF token generation
export function generateCSRFToken(): string {
  return crypto.randomUUID();
}

// Validate CSRF token
export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken && token.length === 36; // UUID length
}
