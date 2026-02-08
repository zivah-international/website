import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { canManage, getAuthUser } from '@/lib/auth';
import { query } from '@/lib/db';

import { ProductForm } from '../components/ProductForm';

interface Product {
  id: number;
  name: string;
  slug: string;
  code: string | null;
  category_id: number | null;
  description: string | null;
  short_description: string | null;
  sku: string | null;
  specifications: Record<string, unknown> | null;
  stock_quantity: number;
  min_order_qty: number | null;
  image_url: string | null;
  image_gallery: string[] | null;
  origin: string;
  harvest_season: string | null;
  certifications: string[] | null;
  nutritional_info: Record<string, unknown> | null;
  is_active: boolean;
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  measure_id: number | null;
}

interface Category {
  id: number;
  name: string;
}

interface Measure {
  id: number;
  name: string;
  short_name: string;
}

async function getProduct(id: string): Promise<Product | null> {
  if (id === 'new') return null;

  const result = await query<Product>(
    `
    SELECT * FROM products WHERE id = $1
  `,
    [parseInt(id)]
  );

  return result.rows[0] || null;
}

async function getCategories(): Promise<Category[]> {
  const result = await query<Category>(`
    SELECT id, name FROM categories WHERE is_active = true ORDER BY sort_order, name
  `);
  return result.rows;
}

async function getMeasures(): Promise<Measure[]> {
  const result = await query<Measure>(`
    SELECT id, name, short_name FROM measures WHERE is_active = true ORDER BY sort_order, name
  `);
  return result.rows;
}

export default async function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getAuthUser();

  if (!user || !canManage(user)) {
    redirect('/admin');
  }

  const [product, categories, measures] = await Promise.all([
    getProduct(id),
    getCategories(),
    getMeasures(),
  ]);

  if (id !== 'new' && !product) {
    notFound();
  }

  const isNew = id === 'new';

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <nav className='mb-4 text-sm'>
        <ol className='flex items-center gap-2'>
          <li>
            <Link
              href='/admin'
              className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            >
              Dashboard
            </Link>
          </li>
          <li className='text-gray-400'>/</li>
          <li>
            <Link
              href='/admin/products'
              className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            >
              Products
            </Link>
          </li>
          <li className='text-gray-400'>/</li>
          <li className='text-gray-900 dark:text-white'>{isNew ? 'New Product' : product?.name}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            {isNew ? 'Create New Product' : 'Edit Product'}
          </h1>
          {!isNew && (
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              ID: {product?.id} | Slug: {product?.slug}
            </p>
          )}
        </div>
        {!isNew && (
          <Link
            href={`/admin/products/${id}/translations`}
            className='inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700'
          >
            <span>🌐</span> Manage Translations
          </Link>
        )}
      </div>

      {/* Form */}
      <div className='rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
        <ProductForm
          product={product}
          categories={categories}
          measures={measures}
          isNew={isNew}
        />
      </div>
    </div>
  );
}
