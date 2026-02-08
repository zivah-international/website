import Link from 'next/link';
import { Suspense } from 'react';

import { localeFlags, locales } from '@/i18n/config';
import { canManage, getAuthUser } from '@/lib/auth';
import { query } from '@/lib/db';

interface ProductWithTranslations {
  id: number;
  name: string;
  slug: string;
  code: string | null;
  category_name: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: Date;
  translations: string[]; // Array of locale codes that have translations
}

async function ProductsTable() {
  const result = await query<{
    id: number;
    name: string;
    slug: string;
    code: string | null;
    category_name: string | null;
    is_active: boolean;
    is_featured: boolean;
    created_at: Date;
  }>(`
    SELECT
      p.id,
      p.name,
      p.slug,
      p.code,
      c.name as category_name,
      p.is_active,
      p.is_featured,
      p.created_at
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `);

  // Get translations for all products
  const translationResult = await query<{
    product_id: number;
    language_code: string;
  }>(`
    SELECT pt.product_id, l.code as language_code
    FROM product_translations pt
    JOIN languages l ON pt.language_id = l.id
  `);

  // Group translations by product
  const translationsByProduct = translationResult.rows.reduce(
    (acc, row) => {
      if (!acc[row.product_id]) {
        acc[row.product_id] = [];
      }
      acc[row.product_id].push(row.language_code);
      return acc;
    },
    {} as Record<number, string[]>
  );

  const products: ProductWithTranslations[] = result.rows.map(p => ({
    ...p,
    translations: translationsByProduct[p.id] || [],
  }));

  if (products.length === 0) {
    return (
      <div className='py-12 text-center'>
        <p className='mb-4 text-gray-500 dark:text-gray-400'>No products found</p>
        <Link
          href='/admin/products/new'
          className='inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700'
        >
          <span>➕</span> Add First Product
        </Link>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-sm'>
        <thead>
          <tr className='border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'>
            <th className='px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400'>
              Code
            </th>
            <th className='px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400'>
              Name
            </th>
            <th className='px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400'>
              Category
            </th>
            <th className='px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400'>
              Translations
            </th>
            <th className='px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400'>
              Status
            </th>
            <th className='px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr
              key={product.id}
              className='border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700/50 dark:hover:bg-gray-800/50'
            >
              <td className='px-4 py-3'>
                <span className='rounded bg-gray-100 px-2 py-1 font-mono text-xs dark:bg-gray-700'>
                  {product.code || '-'}
                </span>
              </td>
              <td className='px-4 py-3'>
                <div>
                  <p className='font-medium text-gray-900 dark:text-white'>{product.name}</p>
                  <p className='text-xs text-gray-500'>/{product.slug}</p>
                </div>
              </td>
              <td className='px-4 py-3 text-gray-600 dark:text-gray-400'>
                {product.category_name || '-'}
              </td>
              <td className='px-4 py-3'>
                <div className='flex items-center justify-center gap-1'>
                  {locales.map(locale => {
                    const hasTranslation = product.translations.includes(locale);
                    return (
                      <span
                        key={locale}
                        className={`text-lg ${hasTranslation ? '' : 'opacity-30 grayscale'}`}
                        title={`${localeFlags[locale as keyof typeof localeFlags]} ${hasTranslation ? 'Translated' : 'Missing'}`}
                      >
                        {localeFlags[locale as keyof typeof localeFlags]}
                      </span>
                    );
                  })}
                </div>
              </td>
              <td className='px-4 py-3 text-center'>
                <div className='flex items-center justify-center gap-2'>
                  {product.is_active ? (
                    <span className='inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900/50 dark:text-green-400'>
                      Active
                    </span>
                  ) : (
                    <span className='inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-400'>
                      Inactive
                    </span>
                  )}
                  {product.is_featured && (
                    <span
                      className='text-yellow-500'
                      title='Featured'
                    >
                      ⭐
                    </span>
                  )}
                </div>
              </td>
              <td className='px-4 py-3 text-right'>
                <div className='flex items-center justify-end gap-2'>
                  <Link
                    href={`/admin/products/${product.id}`}
                    className='rounded-lg bg-blue-100 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-400'
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/admin/products/${product.id}/translations`}
                    className='rounded-lg bg-purple-100 px-3 py-1.5 text-sm text-purple-700 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-400'
                  >
                    🌐 Translate
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductsTableSkeleton() {
  return (
    <div className='animate-pulse'>
      <div className='mb-4 h-10 rounded bg-gray-200 dark:bg-gray-700' />
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className='mb-2 h-16 rounded bg-gray-100 dark:bg-gray-800'
        />
      ))}
    </div>
  );
}

export default async function AdminProductsPage() {
  const user = await getAuthUser();

  if (!user || !canManage(user)) {
    return (
      <div className='p-6'>
        <div className='rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20'>
          <p className='text-red-700 dark:text-red-400'>
            You don&apos;t have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6'>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Products</h1>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            Manage products and their translations
          </p>
        </div>
        <Link
          href='/admin/products/new'
          className='inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700'
        >
          <span>➕</span> Add Product
        </Link>
      </div>

      {/* Translation Status Summary */}
      <div className='mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20'>
        <div className='flex items-center gap-4 text-sm'>
          <span className='font-medium text-blue-800 dark:text-blue-400'>Translation Status:</span>
          <span className='flex items-center gap-1'>
            <span className='text-lg'>🇪🇸</span> Spanish (Primary)
          </span>
          <span className='flex items-center gap-1'>
            <span className='text-lg'>🇺🇸</span> English
          </span>
          <span className='text-gray-500 dark:text-gray-400'>|</span>
          <span className='text-gray-600 dark:text-gray-400'>
            Grayed flags = missing translation
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className='rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
        <Suspense fallback={<ProductsTableSkeleton />}>
          <ProductsTable />
        </Suspense>
      </div>
    </div>
  );
}
