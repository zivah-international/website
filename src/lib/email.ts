import nodemailer from 'nodemailer';

import { logger } from './logger';
import { formatCurrency as formatUsd } from './quote-pricing';

type Locale = 'es' | 'en';

interface SubscriptionEmailData {
  email: string;
  name?: string;
  locale?: Locale;
}

const emailTranslations = {
  es: {
    tagline: 'Productos premium de Ecuador',
    subject: 'Recibimos tu solicitud',
    acknowledgment: 'Recibimos tu solicitud de cotización',
    acknowledgmentBody:
      'Gracias por contactar a ZIVAH International. Nuestro equipo comercial revisará los productos y detalles solicitados y se comunicará contigo.',
    request: 'Referencia de solicitud',
    customer: 'Cliente',
    company: 'Empresa',
    country: 'País',
    email: 'Email',
    phone: 'Teléfono',
    productsRequested: 'Productos solicitados',
    product: 'Producto',
    quantity: 'Cantidad',
    unitPrice: 'Precio unitario estimado',
    total: 'Total',
    estimatedTotal: 'Total estimado',
    pending: 'Por confirmar',
    estimateNote:
      'Los precios del catálogo son estimados. El total final, disponibilidad y términos de envío quedan sujetos a confirmación por nuestro equipo comercial.',
    customerMessage: 'Mensaje',
    notes: 'Notas',
    specifications: 'Especificaciones',
    contactInfo: 'Contacto',
    contactInstruction:
      'Si tienes alguna pregunta, responde a este correo o contáctanos en export@zivahinternational.com.',
    copyright: 'Todos los derechos reservados.',
  },
  en: {
    tagline: 'Premium products from Ecuador',
    subject: 'We received your request',
    acknowledgment: 'We received your quote request',
    acknowledgmentBody:
      'Thank you for contacting ZIVAH International. Our sales team will review the requested products and details and get in touch with you.',
    request: 'Request reference',
    customer: 'Customer',
    company: 'Company',
    country: 'Country',
    email: 'Email',
    phone: 'Phone',
    productsRequested: 'Requested products',
    product: 'Product',
    quantity: 'Quantity',
    unitPrice: 'Estimated unit price',
    total: 'Total',
    estimatedTotal: 'Estimated total',
    pending: 'To be confirmed',
    estimateNote:
      'Catalog prices are estimates. The final total, availability, and shipping terms are subject to confirmation by our sales team.',
    customerMessage: 'Message',
    notes: 'Notes',
    specifications: 'Specifications',
    contactInfo: 'Contact',
    contactInstruction:
      'If you have a question, reply to this email or contact us at export@zivahinternational.com.',
    copyright: 'All rights reserved.',
  },
};

const subscriptionTranslations = {
  es: {
    tagline: 'Productos premium de Ecuador',
    subject: '¡Bienvenido a ZIVAH International!',
    welcomeTitle: '¡Gracias por suscribirte!',
    greetingWithName: 'Hola, {name}.',
    greetingWithoutName: 'Estimado cliente:',
    welcomeMessage:
      'Tu suscripción ha sido confirmada. A partir de ahora recibirás nuestras últimas novedades, ofertas exclusivas y contenido exclusivo sobre nuestros productos premium de Ecuador.',
    benefitsTitle: '¿Qué recibirás?',
    benefit1: 'Actualizaciones sobre nuevos productos y cosechas',
    benefit2: 'Ofertas exclusivas para suscriptores',
    benefit3: 'Contenido educativo sobre nuestros productos',
    footerNote: 'Si no realizaste esta suscripción, por favor ignora este correo.',
    contactLabel: '¿Tienes preguntas? Contáctanos en',
  },
  en: {
    tagline: 'Premium products from Ecuador',
    subject: 'Welcome to ZIVAH International!',
    welcomeTitle: 'Thank you for subscribing!',
    greetingWithName: 'Hello, {name}.',
    greetingWithoutName: 'Dear customer,',
    welcomeMessage:
      'Your subscription has been confirmed. From now on you will receive our latest news, exclusive offers and exclusive content about our premium products from Ecuador.',
    benefitsTitle: 'What will you receive?',
    benefit1: 'Updates on new products and harvests',
    benefit2: 'Exclusive offers for subscribers',
    benefit3: 'Educational content about our products',
    footerNote: 'If you did not make this subscription, please ignore this email.',
    contactLabel: 'Have questions? Contact us at',
  },
};

export interface QuoteEmailData {
  quoteId: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  company?: string;
  country?: string;
  currency: string;
  totalAmount?: string | null;
  items: Array<{
    productName: string;
    quantity: string;
    unitSymbol: string;
    unitPrice: string | null;
    converted?: boolean;
    totalPrice: string | null;
    notes?: string;
    specifications?: Record<string, unknown>;
  }>;
  message?: string;
  quoteNumber: string;
  locale?: Locale;
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatSpecifications(value: Record<string, unknown> | undefined): string {
  if (!value || Object.keys(value).length === 0) return '';
  return Object.entries(value)
    .map(([key, entry]) => `${key}: ${typeof entry === 'string' ? entry : JSON.stringify(entry)}`)
    .join('\n');
}

export function renderQuoteReceiptEmail(data: QuoteEmailData): { html: string; text: string } {
  const locale = data.locale === 'en' ? 'en' : 'es';
  const t = emailTranslations[locale];
  const formatAmount = (value: string, digits = 2) => formatUsd(value, locale, digits);
  const details = [
    [t.customer, data.customerName],
    ...(data.company ? [[t.company, data.company]] : []),
    ...(data.country ? [[t.country, data.country]] : []),
    [t.email, data.customerEmail],
    ...(data.customerPhone ? [[t.phone, data.customerPhone]] : []),
  ];
  const itemRows = data.items
    .map(item => {
      const notes = item.notes
        ? `<p style="margin:8px 0 0;color:#5C6A75;"><strong>${t.notes}:</strong> ${escapeHtml(item.notes)}</p>`
        : '';
      const specsText = formatSpecifications(item.specifications);
      const specifications = specsText
        ? `<p style="margin:8px 0 0;color:#5C6A75;white-space:pre-wrap;"><strong>${t.specifications}:</strong> ${escapeHtml(specsText)}</p>`
        : '';
      return `<tr><td style="padding:0 0 12px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #D8D3C8;border-collapse:collapse;">
          <tr><td colspan="2" style="padding:12px;border-bottom:1px solid #D8D3C8;color:#0B2239;font-weight:600;">${escapeHtml(item.productName)}</td></tr>
          <tr><td style="width:45%;padding:9px 12px;color:#5C6A75;font-size:12px;">${t.quantity}</td><td style="padding:9px 12px;text-align:right;color:#14202B;">${escapeHtml(item.quantity)} ${escapeHtml(item.unitSymbol)}</td></tr>
          <tr><td style="padding:9px 12px;color:#5C6A75;font-size:12px;">${t.unitPrice}</td><td style="padding:9px 12px;text-align:right;color:#14202B;">${item.unitPrice ? escapeHtml(formatAmount(item.unitPrice, item.converted ? 6 : 2)) : t.pending}</td></tr>
          <tr><td style="padding:9px 12px;color:#5C6A75;font-size:12px;">${t.total}</td><td style="padding:9px 12px;text-align:right;color:#14202B;">${item.totalPrice ? escapeHtml(formatAmount(item.totalPrice)) : t.pending}</td></tr>
          ${notes || specifications ? `<tr><td colspan="2" style="padding:0 12px 12px;">${notes}${specifications}</td></tr>` : ''}
        </table>
      </td></tr>`;
    })
    .join('');
  const detailsRows = details
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#5C6A75;vertical-align:top;"><strong>${escapeHtml(label)}</strong></td><td style="padding:4px 0;color:#14202B;">${escapeHtml(value)}</td></tr>`
    )
    .join('');
  const totalHtml =
    data.totalAmount !== null && data.totalAmount !== undefined
      ? `<tr><td style="padding:14px 8px;text-align:right;color:#0B2239;font-weight:700;">${t.estimatedTotal}: ${escapeHtml(formatAmount(data.totalAmount))}</td></tr>`
      : '';
  const messageHtml = data.message
    ? `<h2 style="font:500 18px Georgia,'Times New Roman',serif;color:#0B2239;">${t.customerMessage}</h2><p style="white-space:pre-wrap;color:#14202B;">${escapeHtml(data.message)}</p>`
    : '';
  const html = `<!doctype html>
<html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${t.acknowledgment}</title></head>
<body style="margin:0;padding:0;background:#F6F4EF;color:#14202B;font-family:Inter,Arial,sans-serif;line-height:1.55;">
  <div style="width:100%;background:#F6F4EF;padding:24px 12px;box-sizing:border-box;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:680px;margin:0 auto;background:#FFFFFF;border-collapse:collapse;">
      <tr><td style="padding:24px 28px;background:#0B2239;color:#FFFFFF;border-bottom:4px solid #C0451F;">
        <p style="margin:0;color:#F6F4EF;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;">ZIVAH International</p>
        <p style="margin:5px 0 0;color:#F6F4EF;font-size:13px;">${t.tagline}</p>
      </td></tr>
      <tr><td style="padding:28px;">
        <p style="margin:0 0 8px;color:#C0451F;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">${t.request} ${escapeHtml(data.quoteNumber)}</p>
        <h1 style="margin:0 0 12px;color:#0B2239;font:500 28px/1.2 Newsreader,Georgia,'Times New Roman',serif;">${t.acknowledgment}</h1>
        <p style="margin:0 0 22px;color:#14202B;">${t.acknowledgmentBody}</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:0 0 26px;">${detailsRows}</table>
        <h2 style="margin:0 0 12px;color:#0B2239;font:500 20px/1.25 Newsreader,Georgia,'Times New Roman',serif;">${t.productsRequested}</h2>
        <div style="width:100%;">
          <table cellpadding="0" cellspacing="0" style="width:100%;table-layout:fixed;border-collapse:collapse;">
            <tbody>${itemRows}</tbody><tfoot>${totalHtml}</tfoot>
          </table>
        </div>
        <p style="margin:18px 0 0;padding:12px 0;border-top:1px solid #D8D3C8;border-bottom:1px solid #D8D3C8;color:#5C6A75;font-size:13px;">${t.estimateNote}</p>
        ${messageHtml}
      </td></tr>
      <tr><td style="padding:18px 28px;border-top:1px solid #D8D3C8;color:#5C6A75;font-size:12px;">
        <strong style="color:#0B2239;">${t.contactInfo}</strong><br>${t.contactInstruction}<br>
        <span style="display:block;margin-top:10px;">© ${new Date().getFullYear()} ZIVAH International S.A. · ${t.copyright}</span>
      </td></tr>
    </table>
  </div>
</body></html>`;
  const itemText = data.items
    .map(item => {
      const unitPrice = item.unitPrice
        ? formatAmount(item.unitPrice, item.converted ? 6 : 2)
        : t.pending;
      const total = item.totalPrice ? formatAmount(item.totalPrice) : t.pending;
      const notes = item.notes ? `\n  ${t.notes}: ${item.notes}` : '';
      const specs = formatSpecifications(item.specifications);
      return `- ${item.productName}\n  ${t.quantity}: ${item.quantity} ${item.unitSymbol}\n  ${t.unitPrice}: ${unitPrice}\n  ${t.total}: ${total}${notes}${specs ? `\n  ${t.specifications}: ${specs}` : ''}`;
    })
    .join('\n');
  const detailText = details.map(([label, value]) => `${label}: ${value}`).join('\n');
  const text = [
    `ZIVAH International — ${t.tagline}`,
    `${t.acknowledgment} — ${t.request} ${data.quoteNumber}`,
    '',
    t.acknowledgmentBody,
    '',
    detailText,
    '',
    t.productsRequested,
    itemText,
    ...(data.totalAmount !== null && data.totalAmount !== undefined
      ? ['', `${t.estimatedTotal}: ${formatAmount(data.totalAmount)}`]
      : []),
    '',
    t.estimateNote,
    ...(data.message ? ['', `${t.customerMessage}:`, data.message] : []),
    '',
    `${t.contactInfo}: ${t.contactInstruction}`,
    `© ${new Date().getFullYear()} ZIVAH International S.A. — ${t.copyright}`,
  ].join('\n');
  return { html, text };
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const port = parseInt(process.env.EMAIL_PORT || '587');

    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port,
      secure: port === 465, // true for 465 (SSL), false for 587 (STARTTLS)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendQuoteEmail(quoteData: QuoteEmailData, recipientEmail: string): Promise<boolean> {
    try {
      const locale = quoteData.locale === 'en' ? 'en' : 'es';
      const rendered = renderQuoteReceiptEmail(quoteData);
      const businessEmail = process.env.BUSINESS_EMAIL || 'info@zivahinternational.com';

      const info = await this.transporter.sendMail({
        from: `"ZIVAH International" <${process.env.EMAIL_FROM}>`,
        to: recipientEmail,
        bcc: businessEmail,
        subject: `${emailTranslations[locale].subject} ${quoteData.quoteNumber} - ZIVAH International`,
        html: rendered.html,
        text: rendered.text,
      });
      logger.info('Quote receipt email sent successfully', {
        quoteId: quoteData.quoteId,
        messageId: info.messageId,
        recipient: recipientEmail,
        bcc: businessEmail,
      });
      return true;
    } catch (error) {
      logger.error('Failed to send quote receipt email', {
        error: error instanceof Error ? error.message : String(error),
        quoteId: quoteData.quoteId,
      });
      return false;
    }
  }

  async sendSubscriptionEmail(data: SubscriptionEmailData): Promise<boolean> {
    try {
      const locale = data.locale || 'es';
      const t = subscriptionTranslations[locale];
      const htmlContent = this.generateSubscriptionHTML(data, t);

      const mailOptions = {
        from: `"ZIVAH International" <${process.env.EMAIL_FROM}>`,
        to: data.email,
        subject: t.subject,
        html: htmlContent,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info('Subscription email sent', {
        email: data.email,
        messageId: info.messageId,
      });
      return true;
    } catch (error) {
      logger.error('Failed to send subscription email', {
        error: error instanceof Error ? error.message : String(error),
        email: data.email,
      });
      return false;
    }
  }

  private generateSubscriptionHTML(
    data: SubscriptionEmailData,
    t: (typeof subscriptionTranslations)['es']
  ): string {
    const locale = data.locale || 'es';
    const name = data.name?.trim();
    const greeting = name
      ? t.greetingWithName.replace('{name}', escapeHtml(name))
      : t.greetingWithoutName;

    return `
      <!doctype html>
      <html lang="${locale}">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${t.subject}</title>
        </head>
        <body style="margin:0;padding:0;background:#F6F4EF;color:#14202B;font-family:Inter,Arial,sans-serif;line-height:1.6;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;background:#F6F4EF;">
            <tr>
              <td align="center" style="padding:24px 12px;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;border-collapse:collapse;background:#FFFFFF;">
                  <tr>
                    <td style="padding:24px 28px;background:#0B2239;border-bottom:3px solid #C0451F;color:#F6F4EF;">
                      <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;">ZIVAH International</p>
                      <p style="margin:6px 0 0;font-size:13px;">${t.tagline}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:28px;">
                      <h1 style="margin:0 0 18px;color:#0B2239;font-family:Newsreader,Georgia,'Times New Roman',serif;font-size:30px;font-weight:500;line-height:1.2;">${t.welcomeTitle}</h1>
                      <p style="margin:0 0 10px;color:#14202B;font-size:16px;">${greeting}</p>
                      <p style="margin:0 0 24px;color:#14202B;font-size:16px;">${t.welcomeMessage}</p>

                      <div style="padding:16px 0;border-top:1px solid #D8D3C8;border-bottom:1px solid #D8D3C8;">
                        <h2 style="margin:0 0 10px;color:#0B2239;font-family:Newsreader,Georgia,'Times New Roman',serif;font-size:20px;font-weight:500;line-height:1.3;">${t.benefitsTitle}</h2>
                        <ul style="margin:0;padding:0 0 0 20px;color:#14202B;font-size:15px;">
                          <li style="margin:0 0 8px;">${t.benefit1}</li>
                          <li style="margin:0 0 8px;">${t.benefit2}</li>
                          <li style="margin:0;">${t.benefit3}</li>
                        </ul>
                      </div>

                      <p style="margin:22px 0 0;color:#5C6A75;font-size:13px;">${t.footerNote}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 28px;border-top:1px solid #D8D3C8;background:#F6F4EF;color:#5C6A75;font-size:12px;">
                      <p style="margin:0 0 5px;">${t.contactLabel}</p>
                      <p style="margin:0;font-size:14px;"><a href="mailto:export@zivahinternational.com" style="color:#0B2239;text-decoration:underline;">export@zivahinternational.com</a></p>
                      <p style="margin:12px 0 0;color:#5C6A75;font-size:11px;">© ${new Date().getFullYear()} ZIVAH International</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();
