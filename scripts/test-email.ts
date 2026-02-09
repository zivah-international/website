import * as dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testEmail() {
  const port = parseInt(process.env.EMAIL_PORT || '587');

  console.log('Email Configuration:');
  console.log('  Host:', process.env.EMAIL_HOST);
  console.log('  Port:', port);
  console.log('  User:', process.env.EMAIL_USER);
  console.log('  From:', process.env.EMAIL_FROM);
  console.log('  Secure:', port === 465);
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

  try {
    // Verify connection
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✓ SMTP connection verified!\n');

    // Send test email
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: `"ZIVAH International Test" <${process.env.EMAIL_FROM}>`,
      to: 'ifer343@gmail.com',
      subject: 'Test Email - ZIVAH International',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #2563eb;">Test Email Exitoso!</h1>
          <p>Este es un correo de prueba del sistema ZIVAH International.</p>
          <p>Fecha: ${new Date().toLocaleString('es-ES')}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            Si recibes este correo, la configuración de email está funcionando correctamente.
          </p>
        </div>
      `,
    });

    console.log('✓ Email sent successfully!');
    console.log('  Message ID:', info.messageId);
    console.log('  To: ifer343@gmail.com');
  } catch (error) {
    console.error('✗ Error:', error);
  }
}

testEmail();
