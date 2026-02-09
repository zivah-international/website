import { z } from 'zod';

// Enhanced input validation schemas
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'Name contains invalid characters'),

  email: z.string().email('Invalid email address').max(254, 'Email is too long'),

  phone: z
    .string()
    .optional()
    .refine(val => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val), 'Invalid phone number'),

  company: z
    .string()
    .optional()
    .refine(val => !val || val.length <= 100, 'Company name is too long'),

  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters')
    .refine((val: string) => !/<script/i.test(val), 'Message contains invalid content'),

  subject: z
    .string()
    .optional()
    .refine(val => !val || val.length <= 200, 'Subject is too long'),
});

export const quoteFormSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'Name contains invalid characters'),

  customerEmail: z.string().email('Invalid email address').max(254, 'Email is too long'),

  customerPhone: z
    .string()
    .optional()
    .refine(val => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val), 'Invalid phone number'),

  company: z
    .string()
    .optional()
    .refine(val => !val || val.length <= 100, 'Company name is too long'),

  countryId: z.number().int('Invalid country').positive('Invalid country'),

  recipientEmail: z
    .string()
    .optional()
    .refine(val => !val || z.string().email().safeParse(val).success, 'Invalid recipient email'),

  shippingAddress: z
    .object({
      street: z.string().max(200, 'Street address is too long'),
      city: z.string().max(100, 'City is too long'),
      state: z.string().max(100, 'State is too long'),
      country: z.string().max(100, 'Country is too long'),
      postalCode: z.string().max(20, 'Postal code is too long'),
      coordinates: z
        .object({
          lat: z.number().min(-90).max(90),
          lng: z.number().min(-180).max(180),
        })
        .optional(),
    })
    .optional(),

  message: z
    .string()
    .optional()
    .refine(
      val => !val || (val.length <= 1000 && !/<script/i.test(val)),
      'Message is too long or contains invalid content'
    ),

  locale: z.enum(['es', 'en']).optional().default('es'),

  items: z
    .array(
      z.object({
        productId: z.number().int().positive('Invalid product'),
        measureId: z.number().int().positive('Invalid measure').optional(),
        quantity: z
          .number()
          .int()
          .min(1, 'Quantity must be at least 1')
          .max(10000, 'Quantity is too large'),
        unitPrice: z
          .number()
          .min(0, 'Price cannot be negative')
          .max(1000000, 'Price is too high')
          .optional(),
        notes: z.string().max(500, 'Notes are too long').optional(),
        specifications: z.record(z.string(), z.any()).optional(),
      })
    )
    .min(1, 'At least one item is required'),
});

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address').max(254, 'Email is too long'),

  name: z
    .string()
    .optional()
    .refine(val => !val || val.length <= 100, 'Name is too long'),

  preferences: z
    .object({
      products: z.boolean().default(true),
      news: z.boolean().default(true),
      promotions: z.boolean().default(false),
    })
    .optional(),
});

export const searchSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(100, 'Search query is too long')
    .refine(val => !/<script/i.test(val), 'Search query contains invalid content'),

  category: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

// Sanitization functions
export function sanitizeString(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/eval\(/gi, '')
    .replace(/base64,/gi, '')
    .trim();
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d\+\-\s\(\)]/g, '').trim();
}

// CSRF Protection
export class CSRFProtection {
  private static tokens = new Map<string, { token: string; expires: number }>();

  static generateToken(sessionId: string): string {
    const token = crypto.randomUUID();
    const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    this.tokens.set(sessionId, { token, expires });
    return token;
  }

  static validateToken(sessionId: string, token: string): boolean {
    const record = this.tokens.get(sessionId);

    if (!record) return false;

    // Check if token is expired
    if (Date.now() > record.expires) {
      this.tokens.delete(sessionId);
      return false;
    }

    // Check if token matches
    if (record.token !== token) return false;

    // Token is valid, remove it (one-time use)
    this.tokens.delete(sessionId);
    return true;
  }

  static cleanup(): void {
    const now = Date.now();
    for (const [sessionId, record] of this.tokens.entries()) {
      if (now > record.expires) {
        this.tokens.delete(sessionId);
      }
    }
  }
}

// SQL Injection protection
export function isSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/i,
    /('|(\\x27)|(\\x2D\\x2D)|(\\#)|(\%27)|(\%2D\%2D)|(\%23)|(\%00))/i,
    /(\\x27)|(\\x2D\\x2D)|(\;)|(\%3B)|(\%00)/i,
    /(\bor\b|\band\b|\bxor\b)/i,
    /('|(\\x27)|(\\x2D\\x2D)|(\;)|(\%3B)|(\%00)|(\%27)|(\%2D\%2D)|(\%23))/i,
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
}

// XSS Protection
export function isXSS(input: string): boolean {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<form/i,
    /<input/i,
    /<meta/i,
    /<link/i,
    /expression\s*\(/i,
    /vbscript:/i,
    /data:text/i,
    /data:javascript/i,
  ];

  return xssPatterns.some(pattern => pattern.test(input));
}

// File upload validation
export const fileValidation = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],

  validateFile(file: File): { valid: boolean; error?: string } {
    if (file.size > this.maxSize) {
      return { valid: false, error: 'File size exceeds 5MB limit' };
    }

    if (!this.allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not allowed' };
    }

    // Check for malicious file extensions
    const dangerousExtensions = [
      '.exe',
      '.bat',
      '.cmd',
      '.scr',
      '.pif',
      '.com',
      '.jar',
      '.js',
      '.vbs',
      '.wsf',
    ];
    const fileName = file.name.toLowerCase();
    if (dangerousExtensions.some(ext => fileName.endsWith(ext))) {
      return { valid: false, error: 'File type not allowed' };
    }

    return { valid: true };
  },
};

// Rate limiting for forms
export class FormRateLimiter {
  private submissions = new Map<
    string,
    { count: number; resetTime: number; lastSubmission: number }
  >();

  constructor(
    private maxSubmissions: number = 5,
    private windowMs: number = 60 * 1000, // 1 minute
    private cooldownMs: number = 30 * 1000 // 30 seconds between submissions
  ) {}

  canSubmit(identifier: string): {
    allowed: boolean;
    waitTime?: number;
    reason?: string;
  } {
    const now = Date.now();
    const record = this.submissions.get(identifier);

    if (!record) {
      this.submissions.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
        lastSubmission: now,
      });
      return { allowed: true };
    }

    // Check cooldown
    if (now - record.lastSubmission < this.cooldownMs) {
      const waitTime = this.cooldownMs - (now - record.lastSubmission);
      return {
        allowed: false,
        waitTime,
        reason: 'Please wait before submitting again',
      };
    }

    // Check window limit
    if (now > record.resetTime) {
      // Reset window
      this.submissions.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
        lastSubmission: now,
      });
      return { allowed: true };
    }

    if (record.count >= this.maxSubmissions) {
      const waitTime = record.resetTime - now;
      return {
        allowed: false,
        waitTime,
        reason: 'Too many submissions. Please try again later',
      };
    }

    record.count++;
    record.lastSubmission = now;
    return { allowed: true };
  }
}

export const formRateLimiter = new FormRateLimiter();

// Cleanup expired tokens periodically
setInterval(
  () => {
    CSRFProtection.cleanup();
  },
  60 * 60 * 1000
); // Clean up every hour
