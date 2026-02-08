import Link from 'next/link';
import { Suspense } from 'react';

import { localeFlags, locales } from '@/i18n/config';
import { canManage, getAuthUser } from '@/lib/auth';
import { hasRole } from '@/lib/auth-shared';
import { query } from '@/lib/db';

interface CategoryWithTranslations {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  sort_order: number;
  is_active: boolean;
  product_count: number;
  translations: string[];
}

async function CategoriesTable() {
  const result = await query<{
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    sort_order: number;
    is_active: boolean;
    product_count: string;
  }>(`
    SELECT
      c.id,
      c.name,
      c.slug,
      c.description,
      c.icon,
      c.color,
      c.sort_order,
      c.is_active,
      COUNT(p.id)::text as product_count
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
    GROUP BY c.id
    ORDER BY c.sort_order, c.name
  `);

  // Get translations for all categories
  const translationResult = await query<{
    category_id: number;
    language_code: string;
  }>(`
    SELECT ct.category_id, l.code as language_code
    FROM category_translations ct
    JOIN languages l ON ct.language_id = l.id
  `);

  // Group translations by category
  const translationsByCategory = translationResult.rows.reduce(
    (acc, row) => {
      if (!acc[row.category_id]) {
        acc[row.category_id] = [];
      }
      acc[row.category_id].push(row.language_code);
      return acc;
    },
    {} as Record<number, string[]>
  );

  const categories: CategoryWithTranslations[] = result.rows.map(c => ({
    ...c,
    product_count: parseInt(c.product_count),
    translations: translationsByCategory[c.id] || [],
  }));

  if (categories.length === 0) {
    return (
      <div className='py-12 text-center'>
        <p className='mb-4 text-gray-500 dark:text-gray-400'>No categories found</p>
        <Link
          href='/admin/categories/new'
          className='inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700'
        >
          <span>➕</span> Add First Category
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
              Order
            </th>
            <th className='px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400'>
              Category
            </th>
            <th className='px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400'>
              Products
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
          {categories.map(category => (
            <tr
              key={category.id}
              className='border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700/50 dark:hover:bg-gray-800/50'
            >
              <td className='px-4 py-3'>
                <span className='rounded bg-gray-100 px-2 py-1 font-mono text-xs dark:bg-gray-700'>
                  #{category.sort_order}
                </span>
              </td>
              <td className='px-4 py-3'>
                <div className='flex items-center gap-3'>
                  <span
                    className='flex h-10 w-10 items-center justify-center rounded-lg text-xl'
                    style={{ backgroundColor: category.color || '#e5e7eb' }}
                  >
                    {category.icon || '📁'}
                  </span>
                  <div>
                    <p className='font-medium text-gray-900 dark:text-white'>{category.name}</p>
                    <p className='text-xs text-gray-500'>/{category.slug}</p>
                  </div>
                </div>
              </td>
              <td className='px-4 py-3 text-center'>
                <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300'>
                  {category.product_count}
                </span>
              </td>
              <td className='px-4 py-3'>
                <div className='flex items-center justify-center gap-1'>
                  {locales.map(locale => {
                    const hasTranslation = category.translations.includes(locale);
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
                {category.is_active ? (
                  <span className='inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900/50 dark:text-green-400'>
                    Active
                  </span>
                ) : (
                  <span className='inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-400'>
                    Inactive
                  </span>
                )}
              </td>
              <td className='px-4 py-3 text-right'>
                <div className='flex items-center justify-end gap-2'>
                  <Link
                    href={`/admin/categories/${category.id}`}
                    className='rounded-lg bg-blue-100 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-400'
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/admin/categories/${category.id}/translations`}
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

function CategoriesTableSkeleton() {
  return (
    <div className='animate-pulse'>
      <div className='mb-4 h-10 rounded bg-gray-200 dark:bg-gray-700' />
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className='mb-2 h-16 rounded bg-gray-100 dark:bg-gray-800'
        />
      ))}
    </div>
  );
}

export default async function AdminCategoriesPage() {
  const user = await getAuthUser();

  if (!user || !canManage(user) || !hasRole(user.role, 'sales_manager')) {
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
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Categories</h1>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            Manage product categories and their translations
          </p>
        </div>
        <Link
          href='/admin/categories/new'
          className='inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700'
        >
          <span>➕</span> Add Category
        </Link>
      </div>

      {/* Translation Status Summary */}
      <div className='mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20'>
        <div className='flex items-center gap-4 text-sm'>
          <span className='font-medium text-blue-800 dark:text-blue-400'>Translation Status:</span>
          {locales.map(locale => (
            <span
              key={locale}
              className='flex items-center gap-1'
            >
              <span className='text-lg'>{localeFlags[locale as keyof typeof localeFlags]}</span>
              <span className='text-gray-600 dark:text-gray-400'>{locale.toUpperCase()}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Categories Table */}
      <div className='rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
        <Suspense fallback={<CategoriesTableSkeleton />}>
          <CategoriesTable />
        </Suspense>
      </div>
    </div>
  );
}
