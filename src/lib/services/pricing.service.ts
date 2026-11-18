import { query } from '@/lib/db';
import { logger } from '@/lib/logger';
import {
  calculateLineTotal,
  type CatalogPrice,
  type MeasureCompatibility,
  resolveUnitPrice,
} from '@/lib/quote-pricing';

export interface QuotePricingRequest {
  productId: number;
  measureId: number;
}

export interface QuotePricingRecord {
  productId: number;
  baseMeasureId: number | null;
  measureType: string | null;
  selectedMeasureId: number;
  selectedMeasureType: string | null;
  selectedMeasureSymbol: string | null;
  allowed: boolean;
  prices: CatalogPrice[];
  compatibilities: MeasureCompatibility[];
}

export interface ProductPricingService {
  getAvailableMeasuresForProduct(productId: number): Promise<Record<string, unknown>[]>;
  getPriceForUnit(productId: number, measureId: number): Promise<string | null>;
  getTotalPrice(productId: number, measureId: number, quantity: string): Promise<string | null>;
  areMeasuresCompatible(fromMeasureId: number, toMeasureId: number): Promise<boolean>;
  getQuotePricingData(requests: QuotePricingRequest[]): Promise<Map<string, QuotePricingRecord>>;
}

function requestKey(productId: number, measureId: number): string {
  return `${productId}:${measureId}`;
}

class DatabasePricingService implements ProductPricingService {
  async getAvailableMeasuresForProduct(productId: number): Promise<Record<string, unknown>[]> {
    try {
      const productResult = await query<{ measure_id: number | null }>(
        `SELECT p.measure_id FROM products p WHERE p.id = $1 AND p.is_active = true`,
        [productId]
      );
      if (productResult.rows.length === 0) return [];

      const baseMeasureId = productResult.rows[0].measure_id;
      if (baseMeasureId === null) {
        const result = await query<Record<string, unknown>>(
          `
            SELECT DISTINCT m.id, m.name, m.short_name, m.symbol, m.type, m.family_id,
              m.base_unit, m.conversion_factor::text AS conversion_factor, m.description
            FROM measures m
            JOIN product_prices pp ON pp.measure_id = m.id
            WHERE pp.product_id = $1 AND pp.is_active = true
              AND pp.effective_date <= NOW() AND m.is_active = true
            ORDER BY m.type, m.sort_order
          `,
          [productId]
        );
        return result.rows;
      }

      const result = await query<Record<string, unknown>>(
        `
          SELECT DISTINCT m.id, m.name,
            CASE WHEN m.type = 'WEIGHT' AND UPPER(m.short_name) = 'MT' THEN 't' ELSE m.short_name END AS short_name,
            CASE WHEN m.type = 'WEIGHT' AND UPPER(COALESCE(m.symbol, '')) = 'MT' THEN 't' ELSE m.symbol END AS symbol,
            m.type, m.family_id, m.base_unit, m.conversion_factor::text AS conversion_factor, m.description
          FROM measures m
          WHERE m.is_active = true
            AND (
              m.id = $1
              OR EXISTS (
                SELECT 1 FROM measure_compatibility mc
                JOIN measures fm ON fm.id = mc.from_measure_id AND fm.is_active = true
                JOIN measures tm ON tm.id = mc.to_measure_id AND tm.is_active = true
                WHERE mc.is_active = true AND mc.conversion_factor > 0
                  AND ((mc.from_measure_id = $1 AND mc.to_measure_id = m.id)
                    OR (mc.to_measure_id = $1 AND mc.from_measure_id = m.id))
              )
            )
          ORDER BY m.type, m.sort_order
        `,
        [baseMeasureId]
      );
      return result.rows;
    } catch (error) {
      logger.error('Error getting available measures for quote product', error);
      return [];
    }
  }

  async getPriceForUnit(productId: number, measureId: number): Promise<string | null> {
    const [record] = (await this.getQuotePricingData([{ productId, measureId }])).values();
    if (!record?.allowed) return null;

    return (
      resolveUnitPrice({
        prices: record.prices,
        baseMeasureId: record.baseMeasureId,
        selectedMeasureId: measureId,
        compatibilities: record.compatibilities,
      })?.displayAmount ?? null
    );
  }

  async getTotalPrice(
    productId: number,
    measureId: number,
    quantity: string
  ): Promise<string | null> {
    const [record] = (await this.getQuotePricingData([{ productId, measureId }])).values();
    if (!record?.allowed) return null;

    const price = resolveUnitPrice({
      prices: record.prices,
      baseMeasureId: record.baseMeasureId,
      selectedMeasureId: measureId,
      compatibilities: record.compatibilities,
    });
    return price ? calculateLineTotal(quantity, price.rational) : null;
  }

  async areMeasuresCompatible(fromMeasureId: number, toMeasureId: number): Promise<boolean> {
    if (fromMeasureId === toMeasureId) return true;
    try {
      const result = await query<{ compatible: boolean }>(
        `
          SELECT EXISTS (
            SELECT 1
            FROM measure_compatibility mc
            JOIN measures fm ON fm.id = mc.from_measure_id AND fm.is_active = true
            JOIN measures tm ON tm.id = mc.to_measure_id AND tm.is_active = true
            WHERE mc.is_active = true AND mc.conversion_factor > 0
              AND ((mc.from_measure_id = $1 AND mc.to_measure_id = $2)
                OR (mc.from_measure_id = $2 AND mc.to_measure_id = $1))
          ) AS compatible
        `,
        [fromMeasureId, toMeasureId]
      );
      return result.rows[0]?.compatible === true;
    } catch (error) {
      logger.error('Error checking quote measure compatibility', error);
      return false;
    }
  }

  async getQuotePricingData(
    requests: QuotePricingRequest[]
  ): Promise<Map<string, QuotePricingRecord>> {
    const records = new Map<string, QuotePricingRecord>();
    if (requests.length === 0) return records;

    try {
      const productIds = [...new Set(requests.map(request => request.productId))];
      const productResult = await query<{
        id: number;
        base_measure_id: number | null;
        measure_type: string | null;
      }>(
        `
          SELECT p.id, active_base.id AS base_measure_id, active_base.type AS measure_type
          FROM products p
          LEFT JOIN measures active_base ON active_base.id = p.measure_id AND active_base.is_active = true
          WHERE p.id = ANY($1::int[]) AND p.is_active = true
        `,
        [productIds]
      );
      const products = new Map(productResult.rows.map(product => [product.id, product]));

      const activeMeasureIds = [
        ...new Set([
          ...requests.map(request => request.measureId),
          ...productResult.rows.flatMap(product =>
            product.base_measure_id === null ? [] : [product.base_measure_id]
          ),
        ]),
      ];
      const measureResult = await query<{
        id: number;
        type: string;
        short_name: string;
        symbol: string | null;
      }>(
        `SELECT id, type, short_name, symbol FROM measures WHERE id = ANY($1::int[]) AND is_active = true`,
        [activeMeasureIds]
      );
      const measures = new Map(measureResult.rows.map(measure => [measure.id, measure]));

      const priceResult = await query<{
        product_id: number;
        measure_id: number;
        price: string;
        effective_date: string | Date;
        is_active: boolean;
      }>(
        `
          SELECT pp.product_id, pp.measure_id, pp.price::text AS price,
            pp.effective_date, pp.is_active
          FROM product_prices pp
          JOIN measures m ON m.id = pp.measure_id AND m.is_active = true
          WHERE pp.product_id = ANY($1::int[]) AND pp.is_active = true
            AND pp.effective_date <= NOW()
        `,
        [productIds]
      );
      const pricesByProduct = new Map<number, CatalogPrice[]>();
      for (const price of priceResult.rows) {
        const prices = pricesByProduct.get(price.product_id) || [];
        prices.push({
          measureId: price.measure_id,
          price: price.price,
          isActive: price.is_active,
          effectiveDate: price.effective_date,
        });
        pricesByProduct.set(price.product_id, prices);
      }

      const compatibilityResult = await query<{
        product_id: number;
        selected_measure_id: number;
        from_measure_id: number;
        to_measure_id: number;
        conversion_factor: string | null;
        is_active: boolean;
      }>(
        `
          SELECT request.product_id, request.measure_id AS selected_measure_id,
            mc.from_measure_id, mc.to_measure_id,
            mc.conversion_factor::text AS conversion_factor, mc.is_active
          FROM UNNEST($1::int[], $2::int[]) AS request(product_id, measure_id)
          JOIN products p ON p.id = request.product_id AND p.is_active = true
          JOIN measure_compatibility mc ON mc.is_active = true AND mc.conversion_factor > 0
            AND ((mc.from_measure_id = p.measure_id AND mc.to_measure_id = request.measure_id)
              OR (mc.to_measure_id = p.measure_id AND mc.from_measure_id = request.measure_id))
          JOIN measures fm ON fm.id = mc.from_measure_id AND fm.is_active = true
          JOIN measures tm ON tm.id = mc.to_measure_id AND tm.is_active = true
        `,
        [requests.map(request => request.productId), requests.map(request => request.measureId)]
      );
      const compatibilitiesByRequest = new Map<string, MeasureCompatibility[]>();
      for (const compatibility of compatibilityResult.rows) {
        const key = requestKey(compatibility.product_id, compatibility.selected_measure_id);
        const values = compatibilitiesByRequest.get(key) || [];
        values.push({
          fromMeasureId: compatibility.from_measure_id,
          toMeasureId: compatibility.to_measure_id,
          conversionFactor: compatibility.conversion_factor,
          isActive: compatibility.is_active,
        });
        compatibilitiesByRequest.set(key, values);
      }

      for (const request of requests) {
        const product = products.get(request.productId);
        const selectedMeasure = measures.get(request.measureId);
        const prices = pricesByProduct.get(request.productId) || [];
        const compatibilities =
          compatibilitiesByRequest.get(requestKey(request.productId, request.measureId)) || [];
        const hasBase = product?.base_measure_id != null;
        const directPriceExists = prices.some(price => price.measureId === request.measureId);
        const allowed = Boolean(
          product &&
          selectedMeasure &&
          (hasBase
            ? product.base_measure_id === request.measureId || compatibilities.length > 0
            : directPriceExists)
        );

        records.set(requestKey(request.productId, request.measureId), {
          productId: request.productId,
          baseMeasureId: product?.base_measure_id ?? null,
          measureType: product?.measure_type ?? null,
          selectedMeasureId: request.measureId,
          selectedMeasureType: selectedMeasure?.type ?? null,
          selectedMeasureSymbol:
            selectedMeasure?.type === 'WEIGHT' && selectedMeasure.short_name.toUpperCase() === 'MT'
              ? 't'
              : selectedMeasure?.symbol || selectedMeasure?.short_name || null,
          allowed,
          prices,
          compatibilities,
        });
      }
    } catch (error) {
      logger.error('Error loading quote pricing data', error);
      return new Map();
    }

    return records;
  }
}

export const pricingService: ProductPricingService = new DatabasePricingService();
