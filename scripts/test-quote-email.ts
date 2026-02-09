import * as dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config({ path: '.env.local' });

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
}

function generateQuoteHTML(data: QuoteEmailData): string {
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
    <html>
    <head>
      <meta charset="utf-8">
      <title>Cotización ${data.quoteNumber}</title>
    </head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f3f4f6;">
      <div style="max-width: 650px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">ZIVAH International</h1>
            <p style="color: #bfdbfe; margin: 8px 0 0 0; font-size: 14px;">Premium Products from Ecuador</p>
          </div>

          <!-- Quote Info -->
          <div style="padding: 30px;">
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #3b82f6;">
              <h2 style="margin: 0 0 15px 0; color: #1e40af; font-size: 20px;">📋 Cotización ${data.quoteNumber}</h2>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 5px 0; color: #6b7280;"><strong>Cliente:</strong></td>
                  <td style="padding: 5px 0;">${data.customerName}</td>
                </tr>
                ${
                  data.company
                    ? `
                <tr>
                  <td style="padding: 5px 0; color: #6b7280;"><strong>Empresa:</strong></td>
                  <td style="padding: 5px 0;">${data.company}</td>
                </tr>
                `
                    : ''
                }
                ${
                  data.country
                    ? `
                <tr>
                  <td style="padding: 5px 0; color: #6b7280;"><strong>País:</strong></td>
                  <td style="padding: 5px 0;">${data.country}</td>
                </tr>
                `
                    : ''
                }
                <tr>
                  <td style="padding: 5px 0; color: #6b7280;"><strong>Email:</strong></td>
                  <td style="padding: 5px 0;"><a href="mailto:${data.customerEmail}" style="color: #3b82f6;">${data.customerEmail}</a></td>
                </tr>
              </table>
            </div>

            <!-- Products Table -->
            <h3 style="color: #1f2937; margin-bottom: 15px;">🛒 Productos Solicitados</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; border-radius: 8px; overflow: hidden;">
              <thead>
                <tr style="background: #1e40af; color: white;">
                  <th style="padding: 14px; text-align: left; font-weight: 600;">Producto</th>
                  <th style="padding: 14px; text-align: center; font-weight: 600;">Cant.</th>
                  <th style="padding: 14px; text-align: right; font-weight: 600;">Precio Unit.</th>
                  <th style="padding: 14px; text-align: right; font-weight: 600;">Total</th>
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
                  <td colspan="3" style="padding: 14px; text-align: right; font-weight: 700; color: #1e40af;">TOTAL ESTIMADO:</td>
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
              <h3 style="margin: 0 0 10px 0; color: #92400e;">💬 Mensaje del Cliente:</h3>
              <p style="margin: 0; color: #78350f;">${data.message}</p>
            </div>
            `
                : ''
            }

            <!-- Contact Info -->
            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
              <h3 style="margin: 0 0 10px 0; color: #065f46;">📞 Información de Contacto</h3>
              <p style="margin: 5px 0; color: #047857;">📧 Email: export@zivahinternational.com</p>
              <p style="margin: 5px 0; color: #047857;">📱 WhatsApp: +593 99 900 2893</p>
              <p style="margin: 5px 0; color: #047857;">🌐 Web: www.zivahinternational.com</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 12px;">Esta cotización es válida por 30 días a partir de la fecha de emisión.</p>
            <p style="margin: 0; color: #9ca3af; font-size: 11px;">© ${new Date().getFullYear()} ZIVAH International S.A. - Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

async function testQuoteEmail() {
  const port = parseInt(process.env.EMAIL_PORT || '587');

  console.log('='.repeat(50));
  console.log('ZIVAH - Quote Email Test');
  console.log('='.repeat(50));
  console.log('\nEmail Configuration:');
  console.log('  Host:', process.env.EMAIL_HOST);
  console.log('  Port:', port);
  console.log('  User:', process.env.EMAIL_USER);
  console.log('  From:', process.env.EMAIL_FROM);
  console.log('  Business BCC:', process.env.BUSINESS_EMAIL);
  console.log('');

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Simulate quote data
  const quoteData: QuoteEmailData = {
    quoteId: 12345,
    quoteNumber: 'QT-2026-00001',
    customerName: 'Ivan Paz',
    customerEmail: 'ifer343@gmail.com',
    company: 'Tech Solutions Inc.',
    country: 'Estados Unidos',
    currency: 'USD',
    totalAmount: 2850.0,
    message:
      'Estoy interesado en importar estos productos para mi negocio de alimentos gourmet. Por favor incluir información sobre los tiempos de envío a Miami y opciones de pago.',
    items: [
      {
        productName: 'Cacao en Polvo Premium (Arriba Nacional)',
        quantity: 50,
        unitPrice: 25.0,
        totalPrice: 1250.0,
      },
      {
        productName: 'Banano Deshidratado Orgánico',
        quantity: 100,
        unitPrice: 8.0,
        totalPrice: 800.0,
      },
      {
        productName: 'Aceite de Palma Africana Refinado',
        quantity: 20,
        unitPrice: 40.0,
        totalPrice: 800.0,
      },
    ],
  };

  try {
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✓ SMTP connection OK\n');

    console.log('Sending quote email...');
    console.log('  To:', quoteData.customerEmail);
    console.log('  BCC:', process.env.BUSINESS_EMAIL);
    console.log('');

    const htmlContent = generateQuoteHTML(quoteData);

    const info = await transporter.sendMail({
      from: `"ZIVAH International" <${process.env.EMAIL_FROM}>`,
      to: quoteData.customerEmail,
      bcc: process.env.BUSINESS_EMAIL,
      subject: `Cotización ${quoteData.quoteNumber} - ZIVAH International`,
      html: htmlContent,
    });

    console.log('✓ Quote email sent successfully!');
    console.log('  Message ID:', info.messageId);
    console.log('');
    console.log('='.repeat(50));
    console.log('Check your inbox at:', quoteData.customerEmail);
    console.log('BCC copy sent to:', process.env.BUSINESS_EMAIL);
    console.log('='.repeat(50));
  } catch (error) {
    console.error('✗ Error:', error);
  }
}

testQuoteEmail();
