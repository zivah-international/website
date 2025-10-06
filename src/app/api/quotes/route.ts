import { NextRequest, NextResponse } from 'next/server';

import { query, withTransaction } from '@/lib/db';
import { emailService } from '@/lib/email';
import { createApiResponse, handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import {
  formRateLimiter,
  isSQLInjection,
  isXSS,
  quoteFormSchema,
  sanitizeEmail,
  sanitizeString,
} from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '10'), 100);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');

    const where: string[] = [];
    const params: any[] = [];

    if (status) {
      where.push(`q.status = ?`);
      params.push(status);
    }
    if (userId) {
      where.push(`q.user_id = ?`);
      params.push(parseInt(userId));
    }

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    const [quotes, total] = await Promise.all([
      query(
        `
        SELECT
          q.*,
          JSON_OBJECT(
            'id', u.id,
            'name', u.name,
            'email', u.email,
            'company', u.company
          ) as user,
          COALESCE(
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', qi.id,
                'productId', qi.product_id,
                'measureId', qi.measure_id,
                'quantity', qi.quantity,
                'unitPrice', qi.unit_price,
                'totalPrice', qi.total_price,
                'notes', qi.notes,
                'specifications', qi.specifications,
                'product', JSON_OBJECT(
                  'id', p.id,
                  'name', p.name,
                  'sku', p.sku
                )
              )
            ), JSON_ARRAY()
          ) as items,
          COALESCE(
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', qc.id,
                'type', qc.type,
                'content', qc.content,
                'createdAt', qc.created_at
              ) ORDER BY qc.created_at DESC
            ), JSON_ARRAY()
          ) as communications
        FROM quotes q
        LEFT JOIN users u ON q.user_id = u.id
        LEFT JOIN quote_items qi ON q.id = qi.quote_id
        LEFT JOIN products p ON qi.product_id = p.id
        LEFT JOIN quote_communications qc ON q.id = qc.quote_id
        ${whereClause}
        GROUP BY q.id, u.id
        ORDER BY q.created_at DESC
        LIMIT ?, ?
      `,
        [...params, (page - 1) * pageSize, pageSize]
      ),
      query(
        `
        SELECT COUNT(*) as count FROM quotes q
        ${whereClause}
      `,
        params
      ),
    ]);

    return createApiResponse({
      data: quotes as any,
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

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      'unknown';

    // Check form submission rate limit
    const rateLimitCheck = formRateLimiter.canSubmit(`quote:${ip}`);
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
      customerName: sanitizeString(body.customerName || ''),
      customerEmail: sanitizeEmail(body.customerEmail || ''),
      customerPhone: body.customerPhone ? sanitizeString(body.customerPhone) : undefined,
      company: body.company ? sanitizeString(body.company) : undefined,
      countryId: body.countryId,
      recipientEmail: body.recipientEmail ? sanitizeEmail(body.recipientEmail) : undefined,
      shippingAddress: body.shippingAddress,
      message: body.message ? sanitizeString(body.message) : undefined,
      items:
        body.items?.map((item: any) => ({
          productId: item.productId,
          measureId: item.measureId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          notes: item.notes ? sanitizeString(item.notes) : undefined,
          specifications: item.specifications,
        })) || [],
    };

    // Check for malicious content in text fields
    const textFields = [
      sanitizedBody.customerName,
      sanitizedBody.customerEmail,
      sanitizedBody.message,
    ];
    if (sanitizedBody.company) textFields.push(sanitizedBody.company);
    if (sanitizedBody.recipientEmail) textFields.push(sanitizedBody.recipientEmail);
    sanitizedBody.items.forEach((item: any) => {
      if (item.notes) textFields.push(item.notes);
    });

    for (const field of textFields) {
      if (field && (isXSS(field) || isSQLInjection(field))) {
        console.warn(`Malicious content detected in quote form from IP: ${ip}`);
        return createApiResponse(null, 'Contenido no válido detectado.', 400);
      }
    }

    // Validate with enhanced schema
    const validatedData = quoteFormSchema.parse(sanitizedBody);

    // Generate quote number
    const lastQuoteResult = await query(`
      SELECT id FROM quotes ORDER BY id DESC LIMIT 1
    `);
    const lastQuoteId = (lastQuoteResult as any)[0]?.id || 0;
    const quoteNumber = `Q${String(lastQuoteId + 1).padStart(6, '0')}`;

    // Create quote and items in transaction
    const quote = await withTransaction(async client => {
      // Insert quote
      const quoteResult = await client.query(
        `
        INSERT INTO quotes (
          quote_number, customer_name, customer_email, customer_phone, company,
          country_id, shipping_address, message, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `,
        [
          quoteNumber,
          validatedData.customerName,
          validatedData.customerEmail,
          validatedData.customerPhone,
          validatedData.company,
          validatedData.countryId,
          validatedData.shippingAddress,
          validatedData.message,
          'PENDING',
        ]
      );

      const quoteId = (quoteResult as any).insertId;

      // Insert quote items
      if (validatedData.items.length > 0) {
        const itemValues = validatedData.items
          .map(
            (item: any) =>
              `(${quoteId}, ${item.productId}, ${item.measureId}, ${item.quantity}, ${item.unitPrice || 0}, ${(item.unitPrice || 0) * item.quantity}, '${item.notes || ''}', '${JSON.stringify(item.specifications || {})}')`
          )
          .join(', ');

        await client.query(`
          INSERT INTO quote_items (
            quote_id, product_id, measure_id, quantity, unit_price, total_price, notes, specifications
          ) VALUES ${itemValues}
        `);
      }

      // Get complete quote with relations
      const completeQuote = await client.query(
        `
        SELECT
          q.*,
          JSON_OBJECT(
            'id', u.id,
            'name', u.name,
            'email', u.email,
            'company', u.company
          ) as user,
          JSON_OBJECT(
            'name', c.name
          ) as country,
          COALESCE(
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', qi.id,
                'productId', qi.product_id,
                'measureId', qi.measure_id,
                'quantity', qi.quantity,
                'unitPrice', qi.unit_price,
                'totalPrice', qi.total_price,
                'notes', qi.notes,
                'specifications', qi.specifications,
                'product', JSON_OBJECT(
                  'id', p.id,
                  'name', p.name,
                  'sku', p.sku
                )
              )
            ), JSON_ARRAY()
          ) as items
        FROM quotes q
        LEFT JOIN users u ON q.user_id = u.id
        LEFT JOIN countries c ON q.country_id = c.id
        LEFT JOIN quote_items qi ON q.id = qi.quote_id
        LEFT JOIN products p ON qi.product_id = p.id
        WHERE q.id = ?
        GROUP BY q.id, u.id, c.id
      `,
        [quoteId]
      );

      return (completeQuote as any)[0];
    });

    // Send email if requested
    let emailSent = false;
    if (validatedData.recipientEmail) {
      try {
        const emailData = {
          quoteId: quote.id,
          customerName: quote.customerName,
          customerEmail: quote.customerEmail,
          company: quote.company || undefined,
          country: (quote as any).countryRef?.name,
          currency: 'USD', // TODO: Fetch actual currency from currencyId
          currencyId: quote.currencyId,
          totalAmount: quote.totalAmount ? Number(quote.totalAmount) : undefined,
          items: (quote as any).items.map((item: any) => ({
            productName: item.product?.name || 'Producto',
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice),
            totalPrice: Number(item.totalPrice),
          })),
          message: quote.message || undefined,
          quoteNumber: quote.quoteNumber,
        };

        emailSent = await emailService.sendQuoteEmail(emailData, validatedData.recipientEmail);

        // Update email status
        await query(
          `
          UPDATE quotes
          SET email_status = ?, email_sent_at = ?, updated_at = NOW()
          WHERE id = ?
        `,
          [emailSent ? 'sent' : 'failed', emailSent ? new Date() : null, quote.id]
        );

        logger.info('Quote email sent', { quoteId: quote.id, emailSent });
      } catch (emailError) {
        logger.error('Failed to send quote email', {
          error: emailError,
          quoteId: quote.id,
        });
        // Don't fail the quote creation, just log the email failure
      }
    }

    // Log activity
    await query(
      `
      INSERT INTO activity_logs (
        action, entity_type, entity_id, details, created_at
      ) VALUES (?, ?, ?, ?, NOW())
    `,
      [
        'CREATE_QUOTE',
        'Quote',
        quote.id,
        JSON.stringify({
          quoteId: quote.id,
          itemsCount: validatedData.items.length,
          company: quote.company,
          customerEmail: quote.customer_email,
          emailSent,
        }),
      ]
    );

    return createApiResponse(
      {
        ...quote,
        emailSent,
      },
      'Cotización creada exitosamente',
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
