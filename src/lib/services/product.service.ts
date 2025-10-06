import { query } from '@/lib/db';
import {
  CreateProductInput,
  PaginatedResponse,
  Product,
  ProductFilters,
  UpdateProductInput,
} from '@/types';

export class ProductService {
  // Get paginated products with filters
  static async getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    const {
      categoryId,
      isActive,
      isFeatured,
      search,
      origin,
      certifications,
      inStock,
      page = 1,
      pageSize = 10,
    } = filters;

    const conditions: string[] = [];
    const params: unknown[] = [];

    // Apply filters
    if (categoryId !== undefined) {
      conditions.push(`p.category_id = ?`);
      params.push(categoryId);
    }
    if (typeof isActive === 'boolean') {
      conditions.push(`p.is_active = ?`);
      params.push(isActive);
    }
    if (typeof isFeatured === 'boolean') {
      conditions.push(`p.is_featured = ?`);
      params.push(isFeatured);
    }
    if (origin) {
      conditions.push(`p.origin LIKE ?`);
      params.push(`%${origin}%`);
    }
    if (inStock) {
      conditions.push(`p.stock_quantity > 0`);
    }

    // Search functionality
    if (search) {
      conditions.push(`(p.name LIKE ? OR p.description LIKE ? OR p.short_description LIKE ?)`);
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Certifications filter (JSON array contains)
    if (certifications && certifications.length > 0) {
      // MySQL JSON search
      conditions.push(`JSON_SEARCH(p.certifications, 'one', ?) IS NOT NULL`);
      params.push(`%${certifications.join('%')}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const skip = (page - 1) * pageSize;

    // Get products with category and quote count
    const productsQuery = `
      SELECT
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        c.id as category_id_ref,
        c.description as category_description,
        c.icon as category_icon,
        c.color as category_color,
        c.sort_order as category_sort_order,
        c.is_active as category_is_active,
        c.created_at as category_created_at,
        c.updated_at as category_updated_at,
        COUNT(qi.id) as quotes_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN quote_items qi ON p.id = qi.product_id
      ${whereClause}
      GROUP BY p.id, c.id
      ORDER BY p.is_featured DESC, p.created_at DESC
      LIMIT ${skip}, ${pageSize}
    `;

    // Get total count (use same WHERE clause but without GROUP BY and LIMIT)
    const countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `;

    const [productsResult, countResult] = await Promise.all([
      query(productsQuery, params),
      query(countQuery, params),
    ]);

    const rawProducts = productsResult.rows as Record<string, unknown>[];
    const total = parseInt((countResult.rows[0] as { total: string }).total);
    const totalPages = Math.ceil(total / pageSize);

    // Transform products to include properly structured category data
    const products = rawProducts.map(product => {
      const {
        category_name,
        category_slug,
        category_id_ref,
        category_description,
        category_icon,
        category_color,
        category_sort_order,
        category_is_active,
        category_created_at,
        category_updated_at,
        ...productData
      } = product;

      return {
        ...productData,
        category: category_id_ref
          ? {
              id: category_id_ref as number,
              name: category_name as string,
              slug: category_slug as string,
              description: category_description as string,
              icon: category_icon as string,
              color: category_color as string,
              sortOrder: category_sort_order as number,
              isActive: category_is_active as boolean,
              createdAt: category_created_at as string,
              updatedAt: category_updated_at as string,
            }
          : null,
      };
    });

    return {
      data: products as unknown as Product[],
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  // Get product by ID
  static async getProductById(id: number): Promise<Product | null> {
    const queryText = `
      SELECT
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        CASE
          WHEN COUNT(pv.id) > 0 THEN
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', pv.id,
                'name', pv.name,
                'sku', pv.sku,
                'price', pv.price,
                'stockQty', pv.stock_qty,
                'isActive', pv.is_active,
                'attributes', pv.attributes
              )
            )
          ELSE JSON_ARRAY()
        END as variants,
        CASE
          WHEN COUNT(qi.id) > 0 THEN
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', qi.id,
                'quoteId', qi.quote_id,
                'quantity', qi.quantity,
                'unitPrice', qi.unit_price,
                'totalPrice', qi.total_price,
                'notes', qi.notes,
                'specifications', qi.specifications,
                'quote', JSON_OBJECT(
                  'id', q.id,
                  'quoteNumber', q.quote_number,
                  'customerName', q.customer_name,
                  'status', q.status
                )
              )
            )
          ELSE JSON_ARRAY()
        END as quote_items
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_variants pv ON p.id = pv.product_id AND pv.is_active = true
      LEFT JOIN quote_items qi ON p.id = qi.product_id
      LEFT JOIN quotes q ON qi.quote_id = q.id
      WHERE p.id = ?
      GROUP BY p.id, c.id
    `;

    const result = await query(queryText, [id]);
    return result.rows[0] as Product | null;
  }

  // Get product by slug
  static async getProductBySlug(slug: string): Promise<Product | null> {
    const queryText = `
      SELECT
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        CASE
          WHEN COUNT(pv.id) > 0 THEN
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', pv.id,
                'name', pv.name,
                'sku', pv.sku,
                'price', pv.price,
                'stockQty', pv.stock_qty,
                'isActive', pv.is_active,
                'attributes', pv.attributes
              )
            )
          ELSE JSON_ARRAY()
        END as variants
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_variants pv ON p.id = pv.product_id AND pv.is_active = true
      WHERE p.slug = ?
      GROUP BY p.id, c.id
    `;

    const result = await query(queryText, [slug]);
    return result.rows[0] as Product | null;
  }

  // Get featured products
  static async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    const queryText = `
      SELECT
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true AND p.is_featured = true
      ORDER BY p.created_at DESC
      LIMIT ?
    `;

    const result = await query(queryText, [limit]);
    return result.rows as Product[];
  }

  // Get products by category
  static async getProductsByCategory(categorySlug: string, limit?: number): Promise<Product[]> {
    const queryText = `
      SELECT
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true AND c.slug = ? AND c.is_active = true
      ORDER BY p.is_featured DESC, p.created_at DESC
      ${limit ? 'LIMIT ?' : ''}
    `;

    const params = limit ? [categorySlug, limit] : [categorySlug];
    const result = await query(queryText, params);
    return result.rows as Product[];
  }

  // Create new product
  static async createProduct(data: CreateProductInput): Promise<Product> {
    // Generate slug if not provided
    if (!data.slug) {
      data.slug = this.generateSlug(data.name);
    }

    // Ensure slug is unique
    data.slug = await this.ensureUniqueSlug(data.slug);

    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map(() => '?');

    const queryText = `
      INSERT INTO products (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
    `;

    const result = await query(queryText, values);
    // For MySQL, get the inserted record
    if (!result.insertId) {
      throw new Error('Failed to get inserted ID');
    }
    const selectResult = await query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    return selectResult.rows[0] as Product;
  }

  // Update product
  static async updateProduct(id: number, data: UpdateProductInput): Promise<Product> {
    // If name is being updated and no slug provided, regenerate slug
    if (data.name && !data.slug) {
      data.slug = this.generateSlug(data.name);
      data.slug = await this.ensureUniqueSlug(data.slug, id);
    }

    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    const queryText = `
      UPDATE products
      SET ${setClause}, updated_at = NOW()
      WHERE id = ?
    `;

    await query(queryText, [...values, id]);
    // For MySQL, get the updated record
    const selectResult = await query('SELECT * FROM products WHERE id = ?', [id]);
    return selectResult.rows[0] as Product;
  }

  // Delete product (soft delete)
  static async deleteProduct(id: number): Promise<boolean> {
    try {
      const queryText = `
        UPDATE products
        SET is_active = false, updated_at = NOW()
        WHERE id = ?
      `;
      await query(queryText, [id]);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  // Update stock quantity
  static async updateStock(id: number, quantity: number): Promise<Product> {
    const queryText = `
      UPDATE products
      SET stock_quantity = ?, updated_at = NOW()
      WHERE id = ?
    `;

    await query(queryText, [quantity, id]);
    // For MySQL, get the updated record
    const selectResult = await query('SELECT * FROM products WHERE id = ?', [id]);
    return selectResult.rows[0] as Product;
  }

  // Get low stock products
  static async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
    const queryText = `
      SELECT
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true AND p.stock_quantity <= ? AND p.stock_quantity > 0
      ORDER BY p.stock_quantity ASC
    `;

    const result = await query(queryText, [threshold]);
    return result.rows as Product[];
  }

  // Search products with full-text search
  static async searchProducts(searchQuery: string, limit: number = 20): Promise<Product[]> {
    const queryText = `
      SELECT
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true AND (
        p.name LIKE ? OR
        p.description LIKE ? OR
        p.short_description LIKE ?
      )
      ORDER BY p.is_featured DESC, p.name ASC
      LIMIT ?
    `;

    const result = await query(queryText, [
      `%${searchQuery}%`,
      `%${searchQuery}%`,
      `%${searchQuery}%`,
      limit,
    ]);
    return result.rows as Product[];
  }

  // Get product statistics
  static async getProductStatistics() {
    const queries = [
      'SELECT COUNT(*) as count FROM products',
      'SELECT COUNT(*) as count FROM products WHERE is_active = true',
      'SELECT COUNT(*) as count FROM products WHERE is_active = true AND is_featured = true',
      'SELECT COUNT(*) as count FROM categories WHERE is_active = true',
      'SELECT COUNT(*) as count FROM products WHERE is_active = true AND stock_quantity <= 10 AND stock_quantity > 0',
    ];

    const results = await Promise.all(queries.map(q => query(q)));

    const [totalProducts, activeProducts, featuredProducts, categoriesCount, lowStockCount] =
      results.map(r => parseInt((r.rows[0] as { count: string }).count));

    // Get top selling products
    const topSellingQuery = `
      SELECT
        p.id,
        p.name,
        COUNT(qi.id) as quotes_count
      FROM products p
      LEFT JOIN quote_items qi ON p.id = qi.product_id
      GROUP BY p.id, p.name
      ORDER BY quotes_count DESC
      LIMIT 5
    `;

    const topSellingResult = await query(topSellingQuery);
    const topSellingProducts = topSellingResult.rows;

    return {
      totalProducts,
      activeProducts,
      featuredProducts,
      categoriesCount,
      totalValue: 0, // TODO: Calculate from ProductPrice table
      lowStockProducts: lowStockCount,
      topSellingProducts: (topSellingProducts as unknown[]).map((product: unknown) => {
        const p = product as { id: number; name: string; quotes_count: string };
        return {
          productId: p.id,
          productName: p.name,
          quotesCount: parseInt(p.quotes_count),
          totalQuantity: 0, // Would need separate query for actual quantities
        };
      }),
    };
  }

  // Utility methods
  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  private static async ensureUniqueSlug(slug: string, excludeId?: number): Promise<string> {
    let uniqueSlug = slug;
    let counter = 1;

    while (true) {
      const queryText = `
        SELECT id FROM products
        WHERE slug = ? ${excludeId ? 'AND id != ?' : ''}
        LIMIT 1
      `;
      const params = excludeId ? [uniqueSlug, excludeId] : [uniqueSlug];
      const result = await query(queryText, params);

      if (result.rows.length === 0) break;

      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    return uniqueSlug;
  }
}
