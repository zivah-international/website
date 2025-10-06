// Product Pricing Service
// Database-driven pricing service using direct SQL queries
import { query } from '@/lib/db';

export interface ProductPricingService {
  getAvailableMeasuresForProduct(productId: number): Promise<any[]>;
  getPriceForUnit(productId: number, measureId: number): Promise<number | null>;
  getTotalPrice(productId: number, measureId: number, quantity: number): Promise<number | null>;
  areMeasuresCompatible(fromMeasureId: number, toMeasureId: number): Promise<boolean>;
}

class DatabasePricingService implements ProductPricingService {
  async getAvailableMeasuresForProduct(productId: number): Promise<any[]> {
    try {
      // Get product with its default measure family
      const productQuery = `
        SELECT p.measure_id, m.family_id
        FROM products p
        LEFT JOIN measures m ON p.measure_id = m.id
        WHERE p.id = ?
      `;
      const productResult = await query(productQuery, [productId]);

      if (productResult.rows.length === 0) {
        return [];
      }

      const defaultFamily = (productResult.rows[0] as any).family_id;
      if (!defaultFamily) {
        return [];
      }

      // Get all measures in the same family
      const measuresQuery = `
        SELECT * FROM measures
        WHERE family_id = ? AND is_active = true
        ORDER BY sort_order ASC
      `;
      const measuresResult = await query(measuresQuery, [defaultFamily]);

      return measuresResult.rows;
    } catch (error) {
      console.error('Error getting available measures:', error);
      return [];
    }
  }

  async getPriceForUnit(productId: number, measureId: number): Promise<number | null> {
    try {
      // First try to get direct price
      const priceQuery = `
        SELECT price FROM product_prices
        WHERE product_id = ? AND measure_id = ? AND is_active = true
      `;
      const priceResult = await query(priceQuery, [productId, measureId]);

      if (priceResult.rows.length > 0) {
        return Number((priceResult.rows[0] as any).price);
      }

      // If no direct price, get all prices for this product and try to convert
      const allPricesQuery = `
        SELECT pp.price, pp.measure_id, mc.conversion_factor
        FROM product_prices pp
        LEFT JOIN measure_compatibility mc ON mc.from_measure_id = pp.measure_id AND mc.to_measure_id = ?
        WHERE pp.product_id = ? AND pp.is_active = true
      `;
      const allPricesResult = await query(allPricesQuery, [measureId, productId]);

      for (const priceRow of allPricesResult.rows) {
        const row = priceRow as any;
        if (row.measure_id === measureId) {
          return Number(row.price);
        }

        if (row.conversion_factor) {
          // Convert price: if converting from A to B with factor F, price_B = price_A / F
          return Number(row.price) / Number(row.conversion_factor);
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting price for unit:', error);
      return null;
    }
  }

  async getTotalPrice(
    productId: number,
    measureId: number,
    quantity: number
  ): Promise<number | null> {
    const unitPrice = await this.getPriceForUnit(productId, measureId);
    if (unitPrice === null) {
      return null;
    }
    return unitPrice * quantity;
  }

  async areMeasuresCompatible(fromMeasureId: number, toMeasureId: number): Promise<boolean> {
    try {
      // Check direct compatibility
      const compatibilityQuery = `
        SELECT id FROM measure_compatibility
        WHERE (from_measure_id = ? AND to_measure_id = ?)
           OR (from_measure_id = ? AND to_measure_id = ?)
        LIMIT 1
      `;
      const compatibilityResult = await query(compatibilityQuery, [
        fromMeasureId,
        toMeasureId,
        toMeasureId,
        fromMeasureId,
      ]);

      if (compatibilityResult.rows.length > 0) {
        return true;
      }

      // Check if they belong to the same family
      const familyQuery = `
        SELECT m1.family_id, m2.family_id
        FROM measures m1, measures m2
        WHERE m1.id = ? AND m2.id = ?
      `;
      const familyResult = await query(familyQuery, [fromMeasureId, toMeasureId]);

      if (familyResult.rows.length > 0) {
        const row = familyResult.rows[0] as any;
        return row.family_id === row.family_id; // m1.family_id === m2.family_id
      }

      return false;
    } catch (error) {
      console.error('Error checking measure compatibility:', error);
      return false;
    }
  }
}

// Export the service instance
export const pricingService: ProductPricingService = new DatabasePricingService();
