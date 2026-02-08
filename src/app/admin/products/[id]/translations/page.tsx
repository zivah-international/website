import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { canManage, getAuthUser } from '@/lib/auth';
import { query } from '@/lib/db';

import { ProductTranslationsForm } from './ProductTranslationsForm';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  seo_title: string | null;
  seo_description: string | null;
}

interface Language {
  id: number;
  code: string;
  name: string;
  native_name: string | null;
  is_default: boolean;
}

interface Translation {
  language_id: number;
  language_code: string;
  name: string;
  description: string | null;
  short_description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_auto_translated: boolean;
}

async function getProduct(id: number): Promise<Product | null> {
  const result = await query<Product>(
    `
    SELECT id, name, slug, description, short_description, seo_title, seo_description
    FROM products WHERE id = $1
  `,
    [id]
  );

  return result.rows[0] || null;
}

async function getLanguages(): Promise<Language[]> {
  const result = await query<Language>(`
    SELECT id, code, name, native_name, is_default
    FROM languages
    WHERE is_active = true
    ORDER BY sort_order, name
  `);
  return result.rows;
}

async function getTranslations(productId: number): Promise<Translation[]> {
  const result = await query<Translation>(
    `
    SELECT
      pt.language_id,
      l.code as language_code,
      pt.name,
      pt.description,
      pt.short_description,
      pt.seo_title,
      pt.seo_description,
      pt.is_auto_translated
    FROM product_translations pt
    JOIN languages l ON pt.language_id = l.id
    WHERE pt.product_id = $1
  `,
    [productId]
  );
  return result.rows;
}

export default async function ProductTranslationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = parseInt(id);

  const user = await getAuthUser();

  if (!user || !canManage(user)) {
    redirect('/admin');
  }

  const [product, languages, translations] = await Promise.all([
    getProduct(productId),
    getLanguages(),
    getTranslations(productId),
  ]);

  if (!product) {
    notFound();
  }

  // Transform translations to a map by language code
  const translationsMap = translations.reduce(
    (acc, t) => {
      acc[t.language_code] = t;
      return acc;
    },
    {} as Record<string, Translation>
  );

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
          <li>
            <Link
              href={`/admin/products/${id}`}
              className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            >
              {product.name}
            </Link>
          </li>
          <li className='text-gray-400'>/</li>
          <li className='text-gray-900 dark:text-white'>Translations</li>
        </ol>
      </nav>

      {/* Header */}
      <div className='mb-6'>
        <h1 className='flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white'>
          <span>🌐</span> Translations for &quot;{product.name}&quot;
        </h1>
        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
          Manage translations for this product in all available languages
        </p>
      </div>

      {/* Translations Form */}
      <div className='rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
        <ProductTranslationsForm
          product={product}
          languages={languages}
          translations={translationsMap}
        />
      </div>
    </div>
  );
}
