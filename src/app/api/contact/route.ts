import { NextRequest, NextResponse } from 'next/server';

import { query } from '@/lib/db';
import { createApiResponse, handleApiError } from '@/lib/errors';
import {
  contactFormSchema,
  formRateLimiter,
  isSQLInjection,
  isXSS,
  sanitizeEmail,
  sanitizeString,
} from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      'unknown';

    // Check form submission rate limit
    const rateLimitCheck = formRateLimiter.canSubmit(`contact:${ip}`);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          error: true,
          message: rateLimitCheck.reason || 'Demasiadas solicitudes. Intente nuevamente más tarde.',
          timestamp: new Date().toISOString(),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitCheck.waitTime || 30000) / 1000).toString(),
          },
        }
      );
    }

    const body = await request.json();

    // Sanitize input data
    const sanitizedBody = {
      name: sanitizeString(body.name || ''),
      email: sanitizeEmail(body.email || ''),
      phone: body.phone ? sanitizeString(body.phone) : undefined,
      company: body.company ? sanitizeString(body.company) : undefined,
      message: sanitizeString(body.message || ''),
      subject: body.subject ? sanitizeString(body.subject) : undefined,
    };

    // Check for malicious content
    const textFields = [sanitizedBody.name, sanitizedBody.email, sanitizedBody.message];
    if (sanitizedBody.company) textFields.push(sanitizedBody.company);
    if (sanitizedBody.subject) textFields.push(sanitizedBody.subject);

    for (const field of textFields) {
      if (isXSS(field) || isSQLInjection(field)) {
        console.warn(`Malicious content detected in contact form from IP: ${ip}`);
        return createApiResponse(null, 'Contenido no válido detectado.', 400);
      }
    }

    // Validate with enhanced schema
    const validatedData = contactFormSchema.parse(sanitizedBody);

    const contactSubmission = await query(
      `
      INSERT INTO contact_submissions (
        name, email, phone, company, subject, message, type, source, ip_address, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        validatedData.name,
        validatedData.email,
        validatedData.phone,
        validatedData.company,
        validatedData.subject,
        validatedData.message,
        'GENERAL',
        'website',
        ip,
        request.headers.get('user-agent') || 'unknown',
      ]
    );

    // Log activity
    await query(
      `
      INSERT INTO activity_logs (
        action, entity_type, entity_id, details, ip_address, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        'CONTACT_SUBMISSION',
        'ContactSubmission',
        contactSubmission.insertId,
        JSON.stringify({
          contactId: contactSubmission.insertId,
          email: validatedData.email,
          company: validatedData.company,
        }),
        ip,
        request.headers.get('user-agent') || 'unknown',
      ]
    );

    return createApiResponse(
      { id: contactSubmission.insertId },
      'Mensaje enviado exitosamente. Nos pondremos en contacto contigo pronto.',
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '10'), 100);
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const where: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (type) {
      where.push(`type = $${paramIndex}`);
      params.push(type);
      paramIndex++;
    }
    if (status) {
      where.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    const [submissions, total] = await Promise.all([
      query(
        `
        SELECT * FROM contact_submissions
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `,
        [...params, pageSize, (page - 1) * pageSize]
      ),
      query(
        `
        SELECT COUNT(*) as count FROM contact_submissions
        ${whereClause}
      `,
        params
      ),
    ]);

    return createApiResponse({
      data: submissions as any,
      pagination: {
        page,
        pageSize,
        total: parseInt((total as any)[0].count),
        totalPages: Math.ceil(parseInt((total as any)[0].count) / pageSize),
        hasNext: page * pageSize < parseInt((total as any)[0].count),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
