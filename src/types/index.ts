// Base types for all database models
export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt?: Date;
}

// Product related types
export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  sortOrder: number;
  isActive: boolean;
  products?: Product[];
}

export interface CreateQuoteRequestValidation {}

export interface Product extends BaseEntity {
  name: string;
  slug: string;
  categoryId?: number;
  description?: string;
  shortDescription?: string;
  features?: string[];
  specifications?: Record<string, unknown>;
  price?: number;
  priceUnit?: string;
  stockQuantity: number;
  minOrderQty?: number;
  imageUrl?: string;
  imageGallery?: string[];
  origin: string;
  harvestSeason?: string;
  certifications?: string[];
  isActive: boolean;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  category?: Category;
  quoteItems?: QuoteItem[];
  productVariants?: ProductVariant[];
}

export interface ProductVariant extends BaseEntity {
  productId: number;
  name: string;
  sku?: string;
  price?: number;
  stockQuantity: number;
  specifications?: Record<string, unknown>;
  isActive: boolean;
  sortOrder: number;
  product: Product;
}

// Quote and order types
export enum QuoteStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CLOSED = 'CLOSED',
  EXPIRED = 'EXPIRED',
}

export enum QuotePriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface Quote extends BaseEntity {
  quoteNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  company?: string;
  country?: string;
  shippingAddress?: Address;
  message?: string;
  status: QuoteStatus;
  priority: QuotePriority;
  totalAmount?: number;
  currency: string;
  validUntil?: Date;
  adminNotes?: string;
  internalNotes?: string;
  assignedToId?: number;
  items: QuoteItem[];
  assignedTo?: User;
  communications?: QuoteCommunication[];
}

export interface QuoteItem {
  id: number;
  quoteId: number;
  productId: number;
  measureId?: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  specifications?: Record<string, unknown>;
  createdAt: Date;
  quote: Quote;
  product: Product;
  measure?: Measure;
}

export enum CommunicationType {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  NOTE = 'NOTE',
  SYSTEM = 'SYSTEM',
}

export interface QuoteCommunication {
  id: number;
  quoteId: number;
  userId?: number;
  type: CommunicationType;
  subject?: string;
  message: string;
  isInternal: boolean;
  attachments?: string[];
  createdAt: Date;
  quote: Quote;
  user?: User;
}

// User and authentication types
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  SALES = 'SALES',
  VIEWER = 'VIEWER',
}

export interface User extends BaseEntity {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  role: UserRole;
  permissions?: string[];
  isActive: boolean;
  lastLogin?: Date;
  loginCount: number;
  avatar?: string;
  phone?: string;
  department?: string;
  activityLogs?: ActivityLog[];
  assignedQuotes?: Quote[];
  communications?: QuoteCommunication[];
}

// Site configuration types
export enum SettingType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  JSON = 'JSON',
  EMAIL = 'EMAIL',
  URL = 'URL',
  IMAGE = 'IMAGE',
}

export interface SiteSetting {
  id: number;
  key: string;
  value?: string;
  type: SettingType;
  category?: string;
  description?: string;
  isPublic: boolean;
  validationRules?: Record<string, unknown>;
  updatedAt: Date;
  updatedBy?: number;
}

export interface Page extends BaseEntity {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  language: string;
  isPublished: boolean;
  publishedAt?: Date;
  template?: string;
  featuredImage?: string;
  sortOrder: number;
}

// Analytics and logging types
export interface ActivityLog {
  id: number;
  userId?: number;
  action: string;
  tableName?: string;
  recordId?: number;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  user?: User;
}

export interface ContactSubmission extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  subject?: string;
  message: string;
  source?: string;
  isRead: boolean;
  isResolved: boolean;
  assignedTo?: number;
  notes?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface Newsletter extends BaseEntity {
  email: string;
  name?: string;
  language: string;
  interests?: string[];
  isActive: boolean;
  confirmedAt?: Date;
  unsubscribedAt?: Date;
  source?: string;
  ipAddress?: string;
}

// Utility types
export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  foundingDate: string;
  addresses: {
    ecuador: Address;
    miami: Address;
  };
  contacts: {
    salesEmail: string;
    infoEmail: string;
    phoneEcuador: string;
    phoneMiami: string;
    whatsapp: string;
  };
  businessHours: {
    ecuador: string;
    miami: string;
  };
  statistics: {
    countriesServed: number;
    containersExported: number;
    yearsExperience: number;
    qualityIndex: number;
  };
}

// API response types
export interface ApiResponse<T = unknown> {
  error: boolean;
  data?: T;
  message?: string;
  timestamp: string;
}

export interface ApiErrorResponse {
  error: true;
  message: string;
  code: string;
  statusCode: number;
  details?: Record<string, unknown>;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form input types
export interface CreateProductInput {
  name: string;
  slug?: string;
  categoryId?: number;
  description?: string;
  shortDescription?: string;
  features?: string[];
  specifications?: Record<string, unknown>;
  price?: number;
  priceUnit?: string;
  stockQuantity?: number;
  minOrderQty?: number;
  imageUrl?: string;
  imageGallery?: string[];
  origin?: string;
  harvestSeason?: string;
  certifications?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

export interface CreateQuoteInput {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  company?: string;
  country?: string;
  shippingAddress?: Address;
  message?: string;
  items: {
    productId: number;
    quantity: number;
    unitPrice?: number;
    notes?: string;
    specifications?: Record<string, unknown>;
  }[];
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  color?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  role: UserRole;
  permissions?: string[];
  isActive?: boolean;
  phone?: string;
  department?: string;
}

// Filter types
export interface ProductFilters {
  categoryId?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  origin?: string;
  certifications?: string[];
  inStock?: boolean;
  page?: number;
  pageSize?: number;
}

export interface QuoteFilters {
  status?: QuoteStatus;
  priority?: QuotePriority;
  customerEmail?: string;
  assignedToId?: number;
  dateFrom?: Date;
  dateTo?: Date;
  country?: string;
}

export interface UserFilters {
  role?: UserRole;
  isActive?: boolean;
  department?: string;
}

// Statistics and analytics types
export interface QuoteStatistics {
  total: number;
  pending: number;
  processing: number;
  sent: number;
  accepted: number;
  rejected: number;
  closed: number;
  totalValue: number;
  averageValue: number;
  topCountries: Array<{
    country: string;
    count: number;
    value: number;
  }>;
  topProducts: Array<{
    productId: number;
    productName: string;
    count: number;
    value: number;
  }>;
}

export interface ProductStatistics {
  totalProducts: number;
  activeProducts: number;
  featuredProducts: number;
  categoriesCount: number;
  totalValue: number;
  lowStockProducts: number;
  topSellingProducts: Array<{
    productId: number;
    productName: string;
    quotesCount: number;
    totalQuantity: number;
  }>;
}

export interface DashboardStatistics {
  quotes: QuoteStatistics;
  products: ProductStatistics;
  recentActivities: ActivityLog[];
  monthlyTrends: Array<{
    month: string;
    quotes: number;
    value: number;
  }>;
}

// SEO and metadata types
export interface MetaTags {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
  address?: Address[];
  contactPoint?: {
    '@type': string;
    telephone?: string;
    contactType?: string;
    email?: string;
    availableLanguage?: string[];
  };
  foundingDate?: string;
  [key: string]: unknown;
}

// Measurement unit types
export enum MeasureType {
  WEIGHT = 'WEIGHT',
  VOLUME = 'VOLUME',
  LENGTH = 'LENGTH',
  AREA = 'AREA',
  QUANTITY = 'QUANTITY',
  CONTAINER = 'CONTAINER',
}

export interface Measure extends BaseEntity {
  name: string;
  shortName: string;
  symbol?: string;
  type: MeasureType;
  baseUnit?: string;
  conversionFactor?: number;
  isActive: boolean;
  sortOrder: number;
  description?: string;
  quoteItems?: QuoteItem[];
}
