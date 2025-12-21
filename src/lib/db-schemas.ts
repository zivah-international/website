/**
 * Database Schema Validators
 * Zod schemas for runtime validation of database query results
 * These ensure type safety between MySQL and TypeScript
 */

import { z } from 'zod';

// Helper for parsing JSON TEXT fields
const jsonStringToObject = z
  .string()
  .transform(val => {
    if (!val) return null;
    try {
      return JSON.parse(val);
    } catch {
      return null;
    }
  })
  .nullable();

const jsonStringToArray = z.string().transform(val => {
  if (!val) return [];
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
});

// Base entity schema
const BaseEntitySchema = z.object({
  id: z.number(),
  created_at: z.date().or(z.string().transform(val => new Date(val))),
  updated_at: z
    .date()
    .or(z.string().transform(val => new Date(val)))
    .optional(),
});

// Product Schema
export const ProductDBSchema = BaseEntitySchema.extend({
  name: z.string(),
  slug: z.string(),
  category_id: z.number().nullable(),
  description: z.string().nullable(),
  short_description: z.string().nullable(),
  sku: z.string().nullable(),
  specifications: jsonStringToObject,
  stock_quantity: z.number(),
  min_order_qty: z.number().nullable(),
  image_url: z.string().nullable(),
  image_gallery: jsonStringToArray,
  origin: z.string(),
  harvest_season: z.string().nullable(),
  certifications: jsonStringToArray,
  nutritional_info: jsonStringToObject,
  is_active: z.boolean().or(z.number().transform(val => val === 1)),
  is_featured: z.boolean().or(z.number().transform(val => val === 1)),
  seo_title: z.string().nullable(),
  seo_description: z.string().nullable(),
  seo_keywords: z.string().nullable(),
});

export type ProductDB = z.infer<typeof ProductDBSchema>;

// Category Schema
export const CategoryDBSchema = BaseEntitySchema.extend({
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  icon: z.string().nullable(),
  color: z.string().nullable(),
  sort_order: z.number(),
  is_active: z.boolean().or(z.number().transform(val => val === 1)),
});

export type CategoryDB = z.infer<typeof CategoryDBSchema>;

// Quote Schema
export const QuoteDBSchema = BaseEntitySchema.extend({
  quote_number: z.string(),
  customer_name: z.string(),
  customer_email: z.string().email(),
  customer_phone: z.string().nullable(),
  company: z.string().nullable(),
  country_id: z.number().nullable(),
  shipping_address: jsonStringToObject,
  message: z.string().nullable(),
  status: z.enum(['PENDING', 'REVIEWED', 'QUOTED', 'APPROVED', 'REJECTED', 'EXPIRED']),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']),
  total_amount: z.number().nullable(),
  currency: z.string(),
  valid_until: z
    .date()
    .or(z.string().transform(val => new Date(val)))
    .nullable(),
  admin_notes: z.string().nullable(),
  internal_notes: z.string().nullable(),
  assigned_to_id: z.number().nullable(),
  user_id: z.number().nullable(),
});

export type QuoteDB = z.infer<typeof QuoteDBSchema>;

// Quote Item Schema
export const QuoteItemDBSchema = z.object({
  id: z.number(),
  quote_id: z.number(),
  product_id: z.number(),
  measure_id: z.number().nullable(),
  quantity: z.number(),
  unit_price: z.number(),
  total_price: z.number(),
  notes: z.string().nullable(),
  specifications: jsonStringToObject,
  created_at: z.date().or(z.string().transform(val => new Date(val))),
  updated_at: z
    .date()
    .or(z.string().transform(val => new Date(val)))
    .optional(),
});

export type QuoteItemDB = z.infer<typeof QuoteItemDBSchema>;

// Measure Schema
export const MeasureDBSchema = BaseEntitySchema.extend({
  name: z.string(),
  short_name: z.string(),
  symbol: z.string().nullable(),
  type: z.enum(['WEIGHT', 'VOLUME', 'LENGTH', 'AREA', 'QUANTITY', 'CONTAINER']),
  family_id: z.number().nullable(),
  base_unit: z.string().nullable(),
  conversion_factor: z.number().nullable(),
  is_active: z.boolean().or(z.number().transform(val => val === 1)),
  sort_order: z.number(),
  description: z.string().nullable(),
});

export type MeasureDB = z.infer<typeof MeasureDBSchema>;

// User Schema
export const UserDBSchema = BaseEntitySchema.extend({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  full_name: z.string().nullable(),
  country_id: z.number().nullable(),
  role: z.enum(['ADMIN', 'MANAGER', 'SALES', 'VIEWER']),
  is_active: z.boolean().or(z.number().transform(val => val === 1)),
  last_login: z
    .date()
    .or(z.string().transform(val => new Date(val)))
    .nullable(),
  login_count: z.number(),
  avatar: z.string().nullable(),
  phone: z.string().nullable(),
  department: z.string().nullable(),
  company: z.string().nullable(),
});

export type UserDB = z.infer<typeof UserDBSchema>;

// Country Schema
export const CountryDBSchema = BaseEntitySchema.extend({
  code: z.string(),
  name: z.string(),
  native_name: z.string().nullable(),
  flag: z.string().nullable(),
  icon: z.string().nullable(),
  continent: z.string(),
  currency_id: z.number().nullable(),
  calling_code: z.string().nullable(),
  phone_format: z.string().nullable(),
  is_active: z.boolean().or(z.number().transform(val => val === 1)),
});

export type CountryDB = z.infer<typeof CountryDBSchema>;

// Currency Schema
export const CurrencyDBSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  symbol: z.string().nullable(),
  exchange_rate: z.number().nullable(),
  is_active: z.boolean().or(z.number().transform(val => val === 1)),
  sort_order: z.number(),
  created_at: z.date().or(z.string().transform(val => new Date(val))),
  updated_at: z
    .date()
    .or(z.string().transform(val => new Date(val)))
    .optional(),
});

export type CurrencyDB = z.infer<typeof CurrencyDBSchema>;
