import { z } from 'zod';

import { CommunicationType, QuotePriority, QuoteStatus, SettingType, UserRole } from '@/types';

// ============================================================================
// PRODUCT VALIDATION SCHEMAS
// ============================================================================

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  slug: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'El color debe ser un código hexadecimal válido')
    .optional(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const updateCategorySchema = createCategorySchema.partial();

export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  slug: z.string().optional(),
  categoryId: z.number().int().positive().optional(),
  description: z.string().optional(),
  shortDescription: z
    .string()
    .max(500, 'La descripción corta no puede exceder 500 caracteres')
    .optional(),
  sku: z.string().max(100).optional(),
  specifications: z.record(z.string(), z.any()).optional(),
  stockQuantity: z.number().int().min(0, 'El stock no puede ser negativo').default(0),
  minOrderQty: z.number().int().positive('La cantidad mínima debe ser mayor a 0').default(1),
  imageUrl: z.string().url('Debe ser una URL válida').optional(),
  imageGallery: z.array(z.string().url()).optional(),
  origin: z.string().max(100).default('Ecuador'),
  harvestSeason: z.string().max(100).optional(),
  certifications: z.array(z.string()).optional(),
  nutritionalInfo: z.record(z.string(), z.any()).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  seoTitle: z.string().max(255).optional(),
  seoDescription: z.string().max(500).optional(),
  measureId: z.number().int().positive().optional(),
  code: z.string().max(50).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productFiltersSchema = z.object({
  categoryId: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  search: z.string().min(1).optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  origin: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  inStock: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

// ============================================================================
// QUOTE VALIDATION SCHEMAS
// ============================================================================

export const addressSchema = z.object({
  street: z.string().min(1, 'La dirección es requerida'),
  city: z.string().min(1, 'La ciudad es requerida'),
  state: z.string().min(1, 'El estado/provincia es requerido'),
  country: z.string().min(1, 'El país es requerido'),
  postalCode: z.string().min(1, 'El código postal es requerido'),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
});

export const quoteItemSchema = z.object({
  productId: z.number().int().positive('Debe seleccionar un producto válido'),
  measureId: z.number().int().positive('Debe seleccionar una unidad de medida válida').optional(),
  quantity: z.number().int().positive('La cantidad debe ser mayor a 0'),
  unitPrice: z.number().positive('El precio unitario debe ser mayor a 0').optional(),
  notes: z.string().optional(),
  specifications: z.record(z.string(), z.any()).optional(),
});

export const createQuoteSchema = z
  .object({
    customerName: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(255, 'El nombre no puede exceder 255 caracteres'),
    customerEmail: z.string().email('Debe ser un email válido'),
    customerPhone: z
      .string()
      .regex(/^\+?[\d\s\-\(\)]+$/, 'Debe ser un número de teléfono válido')
      .min(10, 'El teléfono debe tener al menos 10 dígitos')
      .max(20, 'El teléfono no puede exceder 20 caracteres')
      .optional()
      .or(z.literal('')),
    company: z.string().max(255).optional(),
    countryId: z.number().int().positive('Debe seleccionar un país válido').optional(),
    recipientEmail: z.string().email('Debe ser un email válido para envío').optional(),
    shippingAddress: addressSchema.optional(),
    message: z.string().optional(),
    items: z.array(quoteItemSchema).min(1, 'Debe incluir al menos un producto'),
  })
  .refine(
    data => {
      // Enhanced phone validation based on country calling code
      if (data.customerPhone && data.customerPhone.trim() !== '') {
        const phone = data.customerPhone.replace(/\s|-|\(|\)/g, '');

        // Must start with + and have at least country code + 7 digits
        if (!phone.match(/^\+\d{8,}$/)) {
          return false;
        }

        // Validate specific country formats
        // Ecuador (+593): 12 digits total (+593 + 9 digits)
        if (phone.startsWith('+593') && !phone.match(/^\+593\d{9}$/)) {
          return false;
        }
        // USA/Canada (+1): 11 digits total (+1 + 10 digits)
        if (phone.startsWith('+1') && !phone.match(/^\+1\d{10}$/)) {
          return false;
        }
        // Colombia (+57): 12 digits total (+57 + 10 digits)
        if (phone.startsWith('+57') && !phone.match(/^\+57\d{10}$/)) {
          return false;
        }
        // Peru (+51): 11 digits total (+51 + 9 digits)
        if (phone.startsWith('+51') && !phone.match(/^\+51\d{9}$/)) {
          return false;
        }
        // Chile (+56): 11 digits total (+56 + 9 digits)
        if (phone.startsWith('+56') && !phone.match(/^\+56\d{9}$/)) {
          return false;
        }
        // Mexico (+52): 12 digits total (+52 + 10 digits)
        if (phone.startsWith('+52') && !phone.match(/^\+52\d{10}$/)) {
          return false;
        }
        // Spain (+34): 11 digits total (+34 + 9 digits)
        if (phone.startsWith('+34') && !phone.match(/^\+34\d{9}$/)) {
          return false;
        }
      }
      return true;
    },
    {
      message: 'Formato de teléfono inválido para el país seleccionado',
      path: ['customerPhone'],
    }
  );

export const updateQuoteSchema = z.object({
  status: z.nativeEnum(QuoteStatus).optional(),
  priority: z.nativeEnum(QuotePriority).optional(),
  adminNotes: z.string().optional(),
  internalNotes: z.string().optional(),
  assignedToId: z.number().int().positive().optional(),
  validUntil: z.date().optional(),
});

export const quoteFiltersSchema = z.object({
  status: z.nativeEnum(QuoteStatus).optional(),
  priority: z.nativeEnum(QuotePriority).optional(),
  customerEmail: z.string().email().optional(),
  assignedToId: z.number().int().positive().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  countryId: z.number().int().positive().optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

export const quoteCommunicationSchema = z.object({
  quoteId: z.number().int().positive(),
  type: z.nativeEnum(CommunicationType),
  subject: z.string().max(255).optional(),
  message: z.string().min(1, 'El mensaje es requerido'),
  isInternal: z.boolean().default(false),
  attachments: z.array(z.string().url()).optional(),
});

// ============================================================================
// USER AND AUTHENTICATION SCHEMAS
// ============================================================================

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, 'El usuario debe tener al menos 3 caracteres')
    .max(50, 'El usuario no puede exceder 50 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Solo se permiten letras, números y guiones bajos'),
  email: z.string().email('Debe ser un email válido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'
    ),
  fullName: z.string().max(255).optional(),
  role: z.nativeEnum(UserRole),
  permissions: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Debe ser un número de teléfono válido')
    .optional(),
  department: z.string().max(100).optional(),
});

export const updateUserSchema = createUserSchema.partial().omit({ password: true });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
    newPassword: z
      .string()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'La nueva contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'
      ),
    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email('Debe ser un email válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const userFiltersSchema = z.object({
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.boolean().optional(),
  department: z.string().optional(),
  search: z.string().min(1).optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

// ============================================================================
// CONTACT AND COMMUNICATION SCHEMAS
// ============================================================================

export const contactSubmissionSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  email: z.string().email('Debe ser un email válido'),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Debe ser un número de teléfono válido')
    .optional(),
  company: z.string().max(255).optional(),
  country: z.string().max(100).optional(),
  subject: z.string().max(255).optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  source: z.string().max(50).default('contact_form'),
});

export const newsletterSubscriptionSchema = z.object({
  email: z.string().email('Debe ser un email válido'),
  name: z.string().max(255).optional(),
  language: z.string().length(2).default('es'),
  interests: z.array(z.string()).optional(),
  source: z.string().max(50).optional(),
});

// ============================================================================
// SITE SETTINGS SCHEMAS
// ============================================================================

export const createSiteSettingSchema = z.object({
  key: z
    .string()
    .min(1, 'La clave es requerida')
    .max(100, 'La clave no puede exceder 100 caracteres')
    .regex(/^[a-z0-9_]+$/, 'Solo se permiten letras minúsculas, números y guiones bajos'),
  value: z.string().optional(),
  type: z.nativeEnum(SettingType),
  category: z.string().max(50).optional(),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  validationRules: z.record(z.string(), z.any()).optional(),
});

export const updateSiteSettingSchema = createSiteSettingSchema.partial().omit({ key: true });

// ============================================================================
// PAGE MANAGEMENT SCHEMAS
// ============================================================================

export const createPageSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es requerido')
    .max(255, 'El título no puede exceder 255 caracteres'),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .max(255, 'El slug no puede exceder 255 caracteres')
    .regex(/^[a-z0-9\-]+$/, 'Solo se permiten letras minúsculas, números y guiones'),
  content: z.string().min(1, 'El contenido es requerido'),
  excerpt: z.string().max(500).optional(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional(),
  language: z.string().length(2).default('es'),
  isPublished: z.boolean().default(false),
  template: z.string().max(50).optional(),
  featuredImage: z.string().url('Debe ser una URL válida').optional(),
  sortOrder: z.number().int().min(0).default(0),
});

export const updatePageSchema = createPageSchema.partial();

// ============================================================================
// ACTIVITY LOG SCHEMAS
// ============================================================================

export const createActivityLogSchema = z.object({
  action: z
    .string()
    .min(1, 'La acción es requerida')
    .max(100, 'La acción no puede exceder 100 caracteres'),
  tableName: z.string().max(50).optional(),
  recordId: z.number().int().positive().optional(),
  oldValues: z.record(z.string(), z.any()).optional(),
  newValues: z.record(z.string(), z.any()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

// ============================================================================
// PAGINATION AND SEARCH SCHEMAS
// ============================================================================

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const searchSchema = z
  .object({
    query: z.string().min(1, 'La búsqueda debe tener al menos 1 carácter').optional(),
    filters: z.record(z.string(), z.any()).optional(),
  })
  .merge(paginationSchema);

// ============================================================================
// FILE UPLOAD SCHEMAS
// ============================================================================

export const fileUploadSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string().refine(type => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    return allowedTypes.includes(type);
  }, 'Solo se permiten archivos de imagen (JPEG, PNG, WebP, SVG)'),
  size: z.number().max(10 * 1024 * 1024, 'El archivo no puede exceder 10MB'),
});

// ============================================================================
// API RESPONSE SCHEMAS
// ============================================================================

export const apiResponseSchema = z.object({
  error: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional(),
  timestamp: z.string(),
});

export const paginatedResponseSchema = z.object({
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number().int(),
    pageSize: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
});

// Type inference helpers
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductFiltersInput = z.infer<typeof productFiltersSchema>;
export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>;
export type QuoteFiltersInput = z.infer<typeof quoteFiltersSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;
export type NewsletterSubscriptionInput = z.infer<typeof newsletterSubscriptionSchema>;
export type CreateSiteSettingInput = z.infer<typeof createSiteSettingSchema>;
export type UpdateSiteSettingInput = z.infer<typeof updateSiteSettingSchema>;
export type CreatePageInput = z.infer<typeof createPageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
