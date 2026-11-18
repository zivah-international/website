export interface RationalAmount {
  numerator: bigint;
  denominator: bigint;
}

export interface CatalogPrice {
  measureId: number;
  price: string;
  isActive: boolean;
  effectiveDate?: string | Date;
}

export interface MeasureCompatibility {
  fromMeasureId: number;
  toMeasureId: number;
  conversionFactor: string | null;
  isActive: boolean;
}

export interface ResolvedUnitPrice {
  rational: RationalAmount;
  displayAmount: string;
  converted: boolean;
}

const CONTINUOUS_MEASURE_TYPES = new Set(['WEIGHT', 'VOLUME', 'LENGTH', 'AREA']);
const MAX_QUANTITY = 10_000n;

export function isContinuousMeasureType(measureType: string): boolean {
  return CONTINUOUS_MEASURE_TYPES.has(measureType.toUpperCase());
}

function greatestCommonDivisor(left: bigint, right: bigint): bigint {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;

  while (b !== 0n) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }

  return a || 1n;
}

function rational(numerator: bigint, denominator: bigint): RationalAmount | null {
  if (denominator === 0n) return null;
  const sign = denominator < 0n ? -1n : 1n;
  const divisor = greatestCommonDivisor(numerator, denominator);

  return {
    numerator: (numerator / divisor) * sign,
    denominator: (denominator / divisor) * sign,
  };
}

export function parseDecimalRational(value: string): RationalAmount | null {
  if (value.length > 64) return null;
  const match = /^(\d+)(?:\.(\d+))?$/.exec(value);
  if (!match) return null;

  const fraction = match[2] || '';
  const denominator = 10n ** BigInt(fraction.length);
  const numerator = BigInt(`${match[1]}${fraction}`);
  return rational(numerator, denominator);
}

function divide(left: RationalAmount, right: RationalAmount): RationalAmount | null {
  return rational(left.numerator * right.denominator, left.denominator * right.numerator);
}

function multiply(left: RationalAmount, right: RationalAmount): RationalAmount | null {
  return rational(left.numerator * right.numerator, left.denominator * right.denominator);
}

function roundHalfUp(value: RationalAmount, scale: number): bigint {
  const factor = 10n ** BigInt(scale);
  const scaledNumerator = value.numerator * factor;
  const absoluteNumerator = scaledNumerator < 0n ? -scaledNumerator : scaledNumerator;
  const rounded = (absoluteNumerator * 2n + value.denominator) / (2n * value.denominator);
  return scaledNumerator < 0n ? -rounded : rounded;
}

function formatScaledInteger(value: bigint, scale: number): string {
  const negative = value < 0n;
  const digits = (negative ? -value : value).toString().padStart(scale + 1, '0');
  const whole = scale ? digits.slice(0, -scale) : digits;
  const fraction = scale ? `.${digits.slice(-scale)}` : '';
  return `${negative ? '-' : ''}${whole}${fraction}`;
}

export function formatRational(value: RationalAmount, fractionDigits = 6): string {
  return formatScaledInteger(roundHalfUp(value, fractionDigits), fractionDigits);
}

function getEligiblePrice(
  prices: CatalogPrice[],
  measureId: number,
  now: Date
): RationalAmount | null {
  const price = prices
    .filter(candidate => {
      if (candidate.measureId !== measureId || !candidate.isActive) return false;
      if (!candidate.effectiveDate) return true;

      const effectiveTime = new Date(candidate.effectiveDate).getTime();
      return Number.isFinite(effectiveTime) && effectiveTime <= now.getTime();
    })
    .sort((left, right) => {
      const leftTime = left.effectiveDate ? new Date(left.effectiveDate).getTime() : 0;
      const rightTime = right.effectiveDate ? new Date(right.effectiveDate).getTime() : 0;
      return rightTime - leftTime;
    })[0];

  if (!price) return null;
  const parsed = parseDecimalRational(price.price);
  return parsed && parsed.numerator >= 0n ? parsed : null;
}

function getNormalizedFactor(
  sourceMeasureId: number,
  targetMeasureId: number,
  compatibilities: MeasureCompatibility[]
): RationalAmount | null {
  const direct = compatibilities.find(
    item =>
      item.fromMeasureId === sourceMeasureId &&
      item.toMeasureId === targetMeasureId &&
      item.isActive
  );
  const reverse = compatibilities.find(
    item =>
      item.fromMeasureId === targetMeasureId &&
      item.toMeasureId === sourceMeasureId &&
      item.isActive
  );

  const directFactor = direct?.conversionFactor
    ? parseDecimalRational(direct.conversionFactor)
    : null;
  if (directFactor && directFactor.numerator > 0n) return directFactor;

  const reverseFactor = reverse?.conversionFactor
    ? parseDecimalRational(reverse.conversionFactor)
    : null;
  if (!reverseFactor || reverseFactor.numerator <= 0n) return null;

  return rational(reverseFactor.denominator, reverseFactor.numerator);
}

export function resolveUnitPrice(input: {
  prices: CatalogPrice[];
  baseMeasureId: number | null | undefined;
  selectedMeasureId: number;
  compatibilities: MeasureCompatibility[];
  now?: Date;
}): ResolvedUnitPrice | null {
  const now = input.now || new Date();
  const directPrice = getEligiblePrice(input.prices, input.selectedMeasureId, now);

  if (directPrice) {
    return {
      rational: directPrice,
      displayAmount: formatRational(directPrice),
      converted: false,
    };
  }

  if (input.baseMeasureId == null || input.baseMeasureId === input.selectedMeasureId) {
    return null;
  }

  const basePrice = getEligiblePrice(input.prices, input.baseMeasureId, now);
  const factor = getNormalizedFactor(
    input.baseMeasureId,
    input.selectedMeasureId,
    input.compatibilities
  );
  if (!basePrice || !factor) return null;

  const converted = divide(basePrice, factor);
  if (!converted || converted.numerator < 0n) return null;

  return {
    rational: converted,
    displayAmount: formatRational(converted),
    converted: true,
  };
}

export function calculateLineTotal(quantity: string, unitPrice: RationalAmount): string | null {
  const parsedQuantity = parseDecimalRational(quantity);
  if (!parsedQuantity || parsedQuantity.numerator <= 0n) return null;

  const amount = multiply(parsedQuantity, unitPrice);
  return amount ? formatScaledInteger(roundHalfUp(amount, 2), 2) : null;
}

export function sumCurrencyAmounts(amounts: Array<string | null>): string | null {
  if (amounts.some(amount => amount === null)) return null;

  const totalCents = (amounts as string[]).reduce<bigint | null>((sum, amount) => {
    const parsed = parseDecimalRational(amount);
    if (!parsed || sum === null) return null;
    return sum + roundHalfUp(parsed, 2);
  }, 0n);

  return totalCents === null ? null : formatScaledInteger(totalCents, 2);
}

export function normalizeQuantityInput(
  input: string,
  locale: string,
  measureType: string
): string | null {
  const trimmed = input.trim();
  if (!trimmed || trimmed.length > 16) return null;

  const spanishDecimal = locale.toLowerCase().startsWith('es');
  if (spanishDecimal && trimmed.includes('.')) return null;
  if (!spanishDecimal && trimmed.includes(',')) return null;

  const canonical = spanishDecimal ? trimmed.replace(',', '.') : trimmed;
  const match = /^(\d+)(?:\.(\d{1,3}))?$/.exec(canonical);
  if (!match) return null;

  const fraction = match[2] || '';
  const whole = match[1].replace(/^0+(?=\d)/, '');
  if (!isContinuousMeasureType(measureType) && /[1-9]/.test(fraction)) {
    return null;
  }

  const normalized = fraction ? `${whole}.${fraction}` : whole;
  const parsed = parseDecimalRational(normalized);
  if (!parsed || parsed.numerator <= 0n || parsed.numerator > MAX_QUANTITY * parsed.denominator) {
    return null;
  }

  if (!isContinuousMeasureType(measureType)) {
    return whole;
  }

  return normalized;
}

export function isValidCanonicalQuantity(value: string, measureType: string): boolean {
  if (!/^\d+(?:\.\d{1,3})?$/.test(value)) return false;
  const parsed = parseDecimalRational(value);
  if (!parsed || parsed.numerator <= 0n || parsed.numerator > MAX_QUANTITY * parsed.denominator) {
    return false;
  }

  const fraction = value.split('.')[1] || '';
  return isContinuousMeasureType(measureType) || !/[1-9]/.test(fraction);
}

export function formatDecimalForLocale(value: string, locale: string): string {
  const parsed = parseDecimalRational(value);
  if (!parsed) return value;

  const fractionDigits = value.split('.')[1]?.length || 0;
  const scaled = roundHalfUp(parsed, fractionDigits);
  const normalized = formatScaledInteger(scaled, fractionDigits);
  const [wholeValue, fractionValue] = normalized.split('.');
  const whole = BigInt(wholeValue);
  const grouped = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(whole);
  const displayFraction = fractionValue?.replace(/0+$/, '');
  if (!displayFraction) return grouped;

  const separator =
    new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
      .formatToParts(1.1)
      .find(part => part.type === 'decimal')?.value || '.';
  return `${grouped}${separator}${displayFraction}`;
}

export function formatCurrency(value: string, locale: string, fractionDigits = 2): string {
  const parsed = parseDecimalRational(value);
  if (!parsed || parsed.numerator < 0n) return `USD ${value}`;

  const scale = 10n ** BigInt(fractionDigits);
  const rounded = roundHalfUp(parsed, fractionDigits);
  const whole = rounded / scale;
  const fraction = (rounded % scale).toString().padStart(fractionDigits, '0');
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'code',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

  return formatter
    .formatToParts(whole)
    .map(part => (part.type === 'fraction' ? fraction : part.value))
    .join('');
}
