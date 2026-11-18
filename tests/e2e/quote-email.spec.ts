import { expect, test } from '@playwright/test';

import { emailService, type QuoteEmailData, renderQuoteReceiptEmail } from '../../src/lib/email';

const receipt: QuoteEmailData = {
  quoteId: 1,
  quoteNumber: 'Q000001',
  customerName: '<script>alert(1)</script> & Buyer',
  customerEmail: 'buyer@example.test',
  customerPhone: '+593 99 000 0000',
  company: 'Acme <Export>',
  country: 'Ecuador',
  currency: 'USD',
  totalAmount: null,
  items: [
    {
      productName: 'Camarón <Premium>',
      quantity: '1.500',
      unitSymbol: 't',
      unitPrice: null,
      totalPrice: null,
      notes: 'Pack & ship <carefully>',
      specifications: { packaging: 'Caja "premium"' },
    },
    {
      productName: 'Mango exportación',
      quantity: '0.5',
      unitSymbol: 't',
      unitPrice: '1234.567890',
      converted: true,
      totalPrice: '617.28',
    },
  ],
  message: 'Please confirm <availability>.',
  locale: 'es',
};

test('renders bilingual, escaped receipt content with no total for unpriced lines', async ({
  page,
}) => {
  const spanish = renderQuoteReceiptEmail(receipt);
  const english = renderQuoteReceiptEmail({ ...receipt, locale: 'en' });
  const fullyPriced = renderQuoteReceiptEmail({
    ...receipt,
    items: [receipt.items[1]],
    totalAmount: '617.28',
  });

  expect(spanish.html).toContain('Recibimos tu solicitud de cotización');
  expect(spanish.text).toContain('1.500 t');
  expect(spanish.html).toContain('1.500 t');
  expect(spanish.html).toContain('Camarón &lt;Premium&gt;');
  expect(spanish.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt; &amp; Buyer');
  expect(spanish.html).not.toContain('<script>alert(1)</script>');
  expect(spanish.html).toContain('Pack &amp; ship &lt;carefully&gt;');
  expect(spanish.html).toContain('Caja &quot;premium&quot;');
  expect(spanish.text).toContain('Precio unitario estimado: Por confirmar');
  expect(spanish.text).toContain('Los precios del catálogo son estimados.');
  expect(spanish.text).toContain('1234,567890');
  expect(spanish.html).not.toContain('Total estimado</td>');
  expect(spanish.text).not.toContain('Total estimado: USD');
  expect(english.html).toContain('We received your quote request');
  expect(english.text).toContain('Estimated unit price: To be confirmed');
  expect(english.text).toContain('Catalog prices are estimates.');
  expect(english.html).toContain('name="viewport"');
  expect(english.html).toContain('max-width:680px');
  expect(english.html).toContain('table-layout:fixed');
  expect(english.html).not.toContain('min-width:520px');
  expect(english.html).not.toMatch(/linear-gradient|📋|🛒|💬/u);
  expect(fullyPriced.html).toContain('Total estimado: 617,28');
  expect(fullyPriced.text).toContain('Total estimado: 617,28');

  await page.setViewportSize({ width: 360, height: 800 });
  await page.setContent(spanish.html);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true
  );
});

test('sends matching HTML and text receipt with the existing business BCC', async () => {
  const injectable = emailService as unknown as {
    transporter: { sendMail: (options: Record<string, unknown>) => Promise<{ messageId: string }> };
  };
  const originalTransporter = injectable.transporter;
  let sentOptions: Record<string, unknown> | undefined;
  injectable.transporter = {
    sendMail: async options => {
      sentOptions = options;
      return { messageId: 'test-message' };
    },
  };

  try {
    expect(await emailService.sendQuoteEmail(receipt, receipt.customerEmail)).toBe(true);
    expect(sentOptions?.to).toBe(receipt.customerEmail);
    expect(sentOptions?.bcc).toBeTruthy();
    expect(typeof sentOptions?.html).toBe('string');
    expect(typeof sentOptions?.text).toBe('string');
    expect(sentOptions?.subject).toContain('Recibimos tu solicitud');
    expect(sentOptions?.text).toContain('1.500 t');
    expect(sentOptions?.html).toContain('1.500 t');
  } finally {
    injectable.transporter = originalTransporter;
  }
});

test('reports email delivery failure without throwing away the stored request', async () => {
  const injectable = emailService as unknown as {
    transporter: { sendMail: () => Promise<never> };
  };
  const originalTransporter = injectable.transporter;
  injectable.transporter = {
    sendMail: async () => {
      throw new Error('controlled transport failure');
    },
  };

  try {
    expect(await emailService.sendQuoteEmail(receipt, receipt.customerEmail)).toBe(false);
  } finally {
    injectable.transporter = originalTransporter;
  }
});
