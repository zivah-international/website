import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { expect, test } from '@playwright/test';

import { emailService } from '../../src/lib/email';

type CapturedEmail = {
  subject: string;
  html: string;
};

async function captureSubscriptionEmail(
  data: Parameters<typeof emailService.sendSubscriptionEmail>[0]
): Promise<CapturedEmail> {
  const injectable = emailService as unknown as {
    transporter: {
      sendMail: (options: Record<string, unknown>) => Promise<{ messageId: string }>;
    };
  };
  const originalTransporter = injectable.transporter;
  let sentOptions: Record<string, unknown> | undefined;
  injectable.transporter = {
    sendMail: async options => {
      sentOptions = options;
      return { messageId: 'subscription-test-message' };
    },
  };

  try {
    expect(await emailService.sendSubscriptionEmail(data)).toBe(true);
  } finally {
    injectable.transporter = originalTransporter;
  }

  if (typeof sentOptions?.subject !== 'string' || typeof sentOptions.html !== 'string') {
    throw new Error('Subscription email did not include a subject and HTML body');
  }

  return { subject: sentOptions.subject, html: sentOptions.html };
}

test('renders the bilingual subscription welcome email with the approved email design', async ({
  page,
}) => {
  const spanish = await captureSubscriptionEmail({
    email: 'suscriptor@example.test',
    locale: 'es',
    name: '<script>alert(1)</script> & Ana',
  });
  const spanishWithoutName = await captureSubscriptionEmail({
    email: 'suscriptor@example.test',
    locale: 'es',
    name: '   ',
  });
  const english = await captureSubscriptionEmail({
    email: 'subscriber@example.test',
    locale: 'en',
    name: '<b>Jordan</b> & Co.',
  });
  const englishWithoutName = await captureSubscriptionEmail({
    email: 'subscriber@example.test',
    locale: 'en',
    name: '  ',
  });

  expect(spanish.subject).toBe('¡Bienvenido a ZIVAH International!');
  expect(spanish.html).toContain('lang="es"');
  expect(spanish.html).toContain('¡Gracias por suscribirte!');
  expect(spanish.html).toContain('Tu suscripción ha sido confirmada');
  expect(spanish.html).toContain('Hola, &lt;script&gt;alert(1)&lt;/script&gt; &amp; Ana.');
  expect(spanish.html).not.toContain('<script>alert(1)</script>');
  expect(spanish.html).toContain('Actualizaciones sobre nuevos productos y cosechas');
  expect(spanish.html).toContain('Ofertas exclusivas para suscriptores');
  expect(spanish.html).toContain('Contenido educativo sobre nuestros productos');
  expect(spanishWithoutName.html).toContain('Estimado cliente:');
  expect(spanishWithoutName.html).not.toContain('{name}');

  expect(english.subject).toBe('Welcome to ZIVAH International!');
  expect(english.html).toContain('lang="en"');
  expect(english.html).toContain('Thank you for subscribing!');
  expect(english.html).toContain('Your subscription has been confirmed');
  expect(english.html).toContain('Hello, &lt;b&gt;Jordan&lt;/b&gt; &amp; Co.');
  expect(english.html).not.toContain('<b>Jordan</b>');
  expect(english.html).toContain('Updates on new products and harvests');
  expect(english.html).toContain('Exclusive offers for subscribers');
  expect(english.html).toContain('Educational content about our products');
  expect(englishWithoutName.html).toContain('Dear customer,');
  expect(englishWithoutName.html).not.toContain('{name}');

  for (const message of [
    spanish.html,
    spanishWithoutName.html,
    english.html,
    englishWithoutName.html,
  ]) {
    expect(message).toContain('#F6F4EF');
    expect(message).toContain('#FFFFFF');
    expect(message).toContain('#0B2239');
    expect(message).toContain('#C0451F');
    expect(message).toContain('Newsreader');
    expect(message).toContain('Inter,Arial,sans-serif');
    expect(message).not.toMatch(/linear-gradient|box-shadow|border-left|#0891b2|#00b2e9/i);
  }

  for (const [locale, message] of [
    ['es', spanish.html],
    ['en', english.html],
  ] as const) {
    await page.setContent(message);
    for (const width of [320, 600]) {
      await page.setViewportSize({ width, height: 800 });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
      ).toBe(true);

      if (process.env.CAPTURE_SUBSCRIPTION_EMAIL_SCREENSHOTS === '1') {
        await page.screenshot({
          path: join(tmpdir(), `zivah-subscription-email-${locale}-${width}.png`),
        });
      }
    }
  }
});
