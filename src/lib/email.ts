import nodemailer from 'nodemailer';

import { logger } from './logger';

type Locale = 'es' | 'en';

// Multi-language translations for email templates
const emailTranslations = {
  es: {
    tagline: 'Productos Premium de Ecuador',
    quote: 'Cotización',
    customer: 'Cliente',
    company: 'Empresa',
    country: 'País',
    email: 'Email',
    productsRequested: 'Productos Solicitados',
    product: 'Producto',
    quantity: 'Cant.',
    unitPrice: 'Precio Unit.',
    total: 'Total',
    estimatedTotal: 'TOTAL ESTIMADO',
    customerMessage: 'Mensaje del Cliente',
    contactInfo: 'Información de Contacto',
    validityNote: 'Esta cotización es válida por 30 días a partir de la fecha de emisión.',
    copyright: 'Todos los derechos reservados.',
  },
  en: {
    tagline: 'Premium Products from Ecuador',
    quote: 'Quote',
    customer: 'Customer',
    company: 'Company',
    country: 'Country',
    email: 'Email',
    productsRequested: 'Requested Products',
    product: 'Product',
    quantity: 'Qty.',
    unitPrice: 'Unit Price',
    total: 'Total',
    estimatedTotal: 'ESTIMATED TOTAL',
    customerMessage: 'Customer Message',
    contactInfo: 'Contact Information',
    validityNote: 'This quote is valid for 30 days from the date of issue.',
    copyright: 'All rights reserved.',
  },
};

interface QuoteEmailData {
  quoteId: number;
  customerName: string;
  customerEmail: string;
  company?: string;
  country?: string;
  currency: string;
  totalAmount?: number;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  message?: string;
  quoteNumber: string;
  locale?: Locale;
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
      const locale = quoteData.locale || 'es';
      const t = emailTranslations[locale];
      const htmlContent = this.generateQuoteHTML(quoteData);
      const businessEmail = process.env.BUSINESS_EMAIL || 'info@zivahinternational.com';

      const mailOptions = {
        from: `"ZIVAH International" <${process.env.EMAIL_FROM}>`,
        to: recipientEmail,
        bcc: businessEmail, // Always send copy to business team
        subject: `${t.quote} ${quoteData.quoteNumber} - ZIVAH International`,
        html: htmlContent,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info('Quote email sent successfully', {
        quoteId: quoteData.quoteId,
        messageId: info.messageId,
        recipient: recipientEmail,
        bcc: businessEmail,
      });
      return true;
    } catch (error) {
      logger.error('Failed to send quote email', {
        error: error instanceof Error ? error.message : String(error),
        quoteId: quoteData.quoteId,
      });
      return false;
    }
  }

  private generateQuoteHTML(data: QuoteEmailData): string {
    const locale = data.locale || 'es';
    const t = emailTranslations[locale];

    const itemsHTML = data.items
      .map(
        item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.productName}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${data.currency} ${item.unitPrice.toFixed(2)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${data.currency} ${item.totalPrice.toFixed(2)}</td>
      </tr>
    `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html lang="${locale}">
      <head>
        <meta charset="utf-8">
        <title>${t.quote} ${data.quoteNumber}</title>
      </head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f3f4f6;">
        <div style="max-width: 650px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">

            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">ZIVAH International</h1>
              <p style="color: #bfdbfe; margin: 8px 0 0 0; font-size: 14px;">${t.tagline}</p>
            </div>

            <!-- Quote Info -->
            <div style="padding: 30px;">
              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #3b82f6;">
                <h2 style="margin: 0 0 15px 0; color: #1e40af; font-size: 20px;">📋 ${t.quote} ${data.quoteNumber}</h2>
                <table style="width: 100%;">
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280;"><strong>${t.customer}:</strong></td>
                    <td style="padding: 5px 0;">${data.customerName}</td>
                  </tr>
                  ${
                    data.company
                      ? `
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280;"><strong>${t.company}:</strong></td>
                    <td style="padding: 5px 0;">${data.company}</td>
                  </tr>
                  `
                      : ''
                  }
                  ${
                    data.country
                      ? `
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280;"><strong>${t.country}:</strong></td>
                    <td style="padding: 5px 0;">${data.country}</td>
                  </tr>
                  `
                      : ''
                  }
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280;"><strong>${t.email}:</strong></td>
                    <td style="padding: 5px 0;"><a href="mailto:${data.customerEmail}" style="color: #3b82f6;">${data.customerEmail}</a></td>
                  </tr>
                </table>
              </div>

              <!-- Products Table -->
              <h3 style="color: #1f2937; margin-bottom: 15px;">🛒 ${t.productsRequested}</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; border-radius: 8px; overflow: hidden;">
                <thead>
                  <tr style="background: #1e40af; color: white;">
                    <th style="padding: 14px; text-align: left; font-weight: 600;">${t.product}</th>
                    <th style="padding: 14px; text-align: center; font-weight: 600;">${t.quantity}</th>
                    <th style="padding: 14px; text-align: right; font-weight: 600;">${t.unitPrice}</th>
                    <th style="padding: 14px; text-align: right; font-weight: 600;">${t.total}</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                </tbody>
                ${
                  data.totalAmount
                    ? `
                <tfoot>
                  <tr style="background: #f0f9ff;">
                    <td colspan="3" style="padding: 14px; text-align: right; font-weight: 700; color: #1e40af;">${t.estimatedTotal}:</td>
                    <td style="padding: 14px; text-align: right; font-weight: 700; font-size: 18px; color: #1e40af;">${data.currency} ${data.totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
                `
                    : ''
                }
              </table>

              ${
                data.message
                  ? `
              <!-- Customer Message -->
              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #f59e0b;">
                <h3 style="margin: 0 0 10px 0; color: #92400e;">💬 ${t.customerMessage}:</h3>
                <p style="margin: 0; color: #78350f;">${data.message}</p>
              </div>
              `
                  : ''
              }

              <!-- Contact Info -->
              <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
                <h3 style="margin: 0 0 10px 0; color: #065f46;">📞 ${t.contactInfo}</h3>
                <p style="margin: 5px 0; color: #047857;">📧 Email: export@zivahinternational.com</p>
                <p style="margin: 5px 0; color: #047857;">📱 WhatsApp: +593 99 900 2893</p>
                <p style="margin: 5px 0; color: #047857;">🌐 Web: www.zivahinternational.com</p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 12px;">${t.validityNote}</p>
              <p style="margin: 0; color: #9ca3af; font-size: 11px;">© ${new Date().getFullYear()} ZIVAH International S.A. - ${t.copyright}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();
