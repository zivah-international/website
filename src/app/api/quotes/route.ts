import { NextRequest, NextResponse } from 'next/server';

import { parseJsonFields, query, withTransaction } from '@/lib/db';
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
    const params: unknown[] = [];

    if (status) {
      where.push(`q.status = ?`);
      params.push(status);
    }
    if (userId) {
      where.push(`q.user_id = ?`);
      params.push(parseInt(userId));
    }

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    type QuoteRow = {
      id: number;
      quote_number: string;
      customer_name: string;
      customer_email: string;
      customer_phone?: string | null;
      company?: string | null;
      country_id?: number | null;
      shipping_address?: string | null;
      message?: string | null;
      status: string;
      priority?: string | null;
      created_at: string;
      updated_at: string;
      user_id?: number | null;
      user_name?: string | null;
      user_email?: string | null;
      user_company?: string | null;
    };

    type QuoteItemRow = {
      id: number;
      quote_id: number;
      product_id: number;
      measure_id?: number | null;
      quantity: number;
      unit_price: number;
      total_price: number;
      notes?: string | null;
      specifications?: string | null;
      product_name?: string | null;
      product_sku?: string | null;
    };

    type QuoteCommunicationRow = {
      id: number;
      quote_id: number;
      type: string;
      content: string;
      created_at: string;
    };

    const offset = (page - 1) * pageSize;

    const [quotesResult, total] = await Promise.all([
      query<QuoteRow>(
        `
        SELECT
          q.*,
          u.name AS user_name,
          u.email AS user_email,
          u.company AS user_company
        FROM quotes q
        LEFT JOIN users u ON q.user_id = u.id
        ${whereClause}
        ORDER BY q.created_at DESC
        LIMIT ? OFFSET ?
      `,
        [...params, pageSize, offset]
      ),
      query<{ count: string | number }>(
        `
        SELECT COUNT(*) as count FROM quotes q
        ${whereClause}
      `,
        params
      ),
    ]);

    const totalCount = parseInt(total.rows[0].count.toString(), 10);

    const quoteIds = quotesResult.rows.map(q => q.id);
    const itemsByQuote: Record<number, QuoteItemRow[]> = {};
    const communicationsByQuote: Record<number, QuoteCommunicationRow[]> = {};

    if (quoteIds.length > 0) {
      const placeholders = quoteIds.map(() => '?').join(',');

      const items = await query<QuoteItemRow>(
        `
        SELECT qi.*, p.name AS product_name, p.sku AS product_sku
        FROM quote_items qi
        LEFT JOIN products p ON qi.product_id = p.id
        WHERE qi.quote_id IN (${placeholders})
        ORDER BY qi.created_at DESC
      `,
        quoteIds
      );

      items.rows.forEach(item => {
        if (!itemsByQuote[item.quote_id]) itemsByQuote[item.quote_id] = [];
        itemsByQuote[item.quote_id].push(item);
      });

      const communications = await query<QuoteCommunicationRow>(
        `
        SELECT qc.*
        FROM quote_communications qc
        WHERE qc.quote_id IN (${placeholders})
        ORDER BY qc.created_at DESC
      `,
        quoteIds
      );

      communications.rows.forEach(comm => {
        if (!communicationsByQuote[comm.quote_id]) communicationsByQuote[comm.quote_id] = [];
        communicationsByQuote[comm.quote_id].push(comm);
      });
    }

    const parsedQuotes = quotesResult.rows.map(quote => {
      const base = parseJsonFields(quote as Record<string, any>, ['shipping_address']);

      return {
        ...base,
        user: quote.user_id
          ? {
              id: quote.user_id,
              name: quote.user_name,
              email: quote.user_email,
              company: quote.user_company,
            }
          : null,
        items: (itemsByQuote[quote.id] || []).map(item => ({
          ...parseJsonFields(item as Record<string, any>, ['specifications']),
          product: item.product_id
            ? {
                id: item.product_id,
                name: item.product_name,
                sku: item.product_sku,
              }
            : null,
        })),
        communications: (communicationsByQuote[quote.id] || []).map(({ created_at, ...comm }) => ({
          ...comm,
          createdAt: created_at,
        })),
      };
    });

    return createApiResponse({
      data: parsedQuotes,
      pagination: {
        page,
        pageSize,
        total: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        hasNext: page * pageSize < totalCount,
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
        logger.warn(`Malicious content detected in quote form from IP: ${ip}`);
        return createApiResponse(null, 'Contenido no válido detectado.', 400);
      }
    }

    // Validate with enhanced schema
    const validatedData = quoteFormSchema.parse(sanitizedBody);

    // Create quote and items in transaction
    const quote = await withTransaction(async client => {
      type LastQuoteRow = { id: number };

      // Lock the last quote row to avoid race conditions when generating the next number
      const [lastQuoteResult] = (await client.execute(
        `SELECT id FROM quotes ORDER BY id DESC LIMIT 1 FOR UPDATE`
      )) as [LastQuoteRow[], unknown];
      const lastQuoteId = lastQuoteResult[0]?.id ?? 0;
      const quoteNumber = `Q${String(lastQuoteId + 1).padStart(6, '0')}`;

      // Insert quote
      const [quoteResult] = await client.execute(
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
          validatedData.customerPhone ?? null,
          validatedData.company ?? null,
          validatedData.countryId ?? null,
          validatedData.shippingAddress ?? null,
          validatedData.message ?? null,
          'PENDING',
        ]
      );

      const quoteResultWithId = quoteResult as { insertId: number };
      const quoteId = quoteResultWithId.insertId;

      // Insert quote items
      if (validatedData.items.length > 0) {
        const now = new Date();
        for (const item of validatedData.items) {
          await client.execute(
            `
            INSERT INTO quote_items (
              quote_id, product_id, measure_id, quantity, unit_price, total_price, notes, specifications, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              quoteId,
              item.productId,
              item.measureId,
              item.quantity,
              item.unitPrice || 0,
              (item.unitPrice || 0) * item.quantity,
              item.notes ?? null,
              JSON.stringify(item.specifications || {}),
              now,
              now,
            ]
          );
        }
      }

      // Get complete quote with relations
      const [completeQuote] = await client.execute(
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

      const completeQuoteArray = completeQuote as Array<Record<string, unknown>>;
      const quoteData = completeQuoteArray[0];

      // Parse JSON fields
      return parseJsonFields(quoteData, ['user', 'country', 'items', 'shipping_address']);
    });

    // Send email if requested
    let emailSent = false;
    if (validatedData.recipientEmail) {
      try {
        const quoteWithRelations = quote as Record<string, any>;
        const emailData = {
          quoteId: quoteWithRelations.id,
          customerName: quoteWithRelations.customerName || quoteWithRelations.customer_name,
          customerEmail: quoteWithRelations.customerEmail || quoteWithRelations.customer_email,
          company: quoteWithRelations.company || undefined,
          country: quoteWithRelations.country?.name,
          currency: 'USD', // TODO: Fetch actual currency from currencyId
          currencyId: quoteWithRelations.currencyId || quoteWithRelations.currency_id,
          totalAmount: quoteWithRelations.totalAmount
            ? Number(quoteWithRelations.totalAmount)
            : undefined,
          items: Array.isArray(quoteWithRelations.items)
            ? quoteWithRelations.items.map((item: any) => ({
                productName: item.product?.name || 'Producto',
                quantity: item.quantity,
                unitPrice: Number(item.unitPrice || item.unit_price),
                totalPrice: Number(item.totalPrice || item.total_price),
              }))
            : [],
          message: quoteWithRelations.message || undefined,
          quoteNumber: quoteWithRelations.quoteNumber || quoteWithRelations.quote_number,
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
