import { expect, test } from '@playwright/test';

import {
  calculateLineTotal,
  formatCurrency,
  normalizeQuantityInput,
  resolveUnitPrice,
} from '../../src/lib/quote-pricing';

const kgToTonne = {
  fromMeasureId: 1,
  toMeasureId: 2,
  conversionFactor: '0.001000',
  isActive: true,
};

test('converts a kilogram catalog price to metric tonnes in either relation direction', () => {
  const prices = [{ measureId: 1, price: '2.50', isActive: true, effectiveDate: '2026-01-01' }];

  const direct = resolveUnitPrice({
    prices,
    baseMeasureId: 1,
    selectedMeasureId: 2,
    compatibilities: [kgToTonne],
    now: new Date('2026-11-16T12:00:00Z'),
  });
  const reverse = resolveUnitPrice({
    prices,
    baseMeasureId: 1,
    selectedMeasureId: 2,
    compatibilities: [
      { ...kgToTonne, fromMeasureId: 2, toMeasureId: 1, conversionFactor: '1000.000000' },
    ],
    now: new Date('2026-11-16T12:00:00Z'),
  });

  expect(direct?.displayAmount).toBe('2500.000000');
  expect(direct?.converted).toBe(true);
  expect(reverse?.displayAmount).toBe('2500.000000');
  expect(direct && calculateLineTotal('1.5', direct.rational)).toBe('3750.00');
});

test('prefers a current direct price and ignores inactive or future catalog entries', () => {
  const price = resolveUnitPrice({
    prices: [
      { measureId: 2, price: '10.25', isActive: true, effectiveDate: '2026-01-01' },
      { measureId: 2, price: '999.00', isActive: true, effectiveDate: '2027-01-01' },
      { measureId: 2, price: '888.00', isActive: false, effectiveDate: '2026-01-01' },
      { measureId: 1, price: '2.50', isActive: true, effectiveDate: '2026-01-01' },
    ],
    baseMeasureId: 1,
    selectedMeasureId: 2,
    compatibilities: [kgToTonne],
    now: new Date('2026-11-16T12:00:00Z'),
  });

  expect(price?.displayAmount).toBe('10.250000');
  expect(price?.converted).toBe(false);
});

test('does not infer compatibility from shared measure family and allows an unpriced item', () => {
  const price = resolveUnitPrice({
    prices: [{ measureId: 1, price: '2.50', isActive: true, effectiveDate: '2026-01-01' }],
    baseMeasureId: 1,
    selectedMeasureId: 3,
    compatibilities: [],
    now: new Date('2026-11-16T12:00:00Z'),
  });

  expect(price).toBeNull();
  expect(
    resolveUnitPrice({
      prices: [],
      baseMeasureId: 1,
      selectedMeasureId: 1,
      compatibilities: [],
      now: new Date('2026-11-16T12:00:00Z'),
    })
  ).toBeNull();
});

test('parses locale decimal input and rounds a line once after multiplication', () => {
  expect(normalizeQuantityInput('1,500', 'es', 'WEIGHT')).toBe('1.500');
  expect(normalizeQuantityInput('1.500', 'en', 'WEIGHT')).toBe('1.500');
  expect(normalizeQuantityInput('1,5', 'es', 'QUANTITY')).toBeNull();
  expect(normalizeQuantityInput('1.1234', 'en', 'WEIGHT')).toBeNull();
  expect(normalizeQuantityInput('10000.001', 'en', 'WEIGHT')).toBeNull();

  const price = resolveUnitPrice({
    prices: [{ measureId: 1, price: '0.05', isActive: true, effectiveDate: '2026-01-01' }],
    baseMeasureId: 1,
    selectedMeasureId: 1,
    compatibilities: [],
    now: new Date('2026-11-16T12:00:00Z'),
  });

  expect(price && calculateLineTotal('0.5', price.rational)).toBe('0.03');
  expect(formatCurrency('1234.50', 'es')).toContain('1234,50');
  expect(formatCurrency('1234.50', 'en')).toContain('1,234.50');
  expect(formatCurrency('2500.000000', 'es', 6)).toContain('2500,000000');
});
