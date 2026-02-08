import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { getAuthUser, isAdmin } from '@/lib/auth';
import { query } from '@/lib/db';

interface Language {
  id: number;
  code: string;
  name: string;
  native_name: string | null;
  is_active: boolean;
  is_default: boolean;
  sort_order: number;
  product_translations: number;
  category_translations: number;
}

async function LanguagesTable() {
  const result = await query<Language>(`
    SELECT
      l.*,
      (SELECT COUNT(*) FROM product_translations pt WHERE pt.language_id = l.id)::int as product_translations,
      (SELECT COUNT(*) FROM category_translations ct WHERE ct.language_id = l.id)::int as category_translations
    FROM languages l
    ORDER BY l.sort_order, l.name
  `);

  const languages = result.rows;

  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-sm'>
        <thead>
          <tr className='border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'>
            <th className='px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400'>
              Language
            </th>
            <th className='px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400'>
              Code
            </th>
            <th className='px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400'>
              Products
            </th>
            <th className='px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400'>
              Categories
            </th>
            <th className='px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400'>
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {languages.map(language => (
            <tr
              key={language.id}
              className='border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700/50 dark:hover:bg-gray-800/50'
            >
              <td className='px-4 py-3'>
                <div className='flex items-center gap-3'>
                  <span className='text-2xl'>
                    {language.code === 'es' ? '🇪🇸' : language.code === 'en' ? '🇺🇸' : '🌐'}
                  </span>
                  <div>
                    <p className='font-medium text-gray-900 dark:text-white'>
                      {language.native_name || language.name}
                    </p>
                    <p className='text-xs text-gray-500'>{language.name}</p>
                  </div>
                </div>
              </td>
              <td className='px-4 py-3'>
                <span className='rounded bg-gray-100 px-2 py-1 font-mono text-xs uppercase dark:bg-gray-700'>
                  {language.code}
                </span>
              </td>
              <td className='px-4 py-3 text-center'>
                <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'>
                  {language.product_translations}
                </span>
              </td>
              <td className='px-4 py-3 text-center'>
                <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-400'>
                  {language.category_translations}
                </span>
              </td>
              <td className='px-4 py-3 text-center'>
                <div className='flex items-center justify-center gap-2'>
                  {language.is_default && (
                    <span className='inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400'>
                      Default
                    </span>
                  )}
                  {language.is_active ? (
                    <span className='inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900/50 dark:text-green-400'>
                      Active
                    </span>
                  ) : (
                    <span className='inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-400'>
                      Inactive
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LanguagesTableSkeleton() {
  return (
    <div className='animate-pulse'>
      <div className='mb-4 h-10 rounded bg-gray-200 dark:bg-gray-700' />
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className='mb-2 h-16 rounded bg-gray-100 dark:bg-gray-800'
        />
      ))}
    </div>
  );
}

export default async function LanguagesSettingsPage() {
  const user = await getAuthUser();

  if (!user || !isAdmin(user)) {
    redirect('/admin');
  }

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
              href='/admin/settings'
              className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            >
              Settings
            </Link>
          </li>
          <li className='text-gray-400'>/</li>
          <li className='text-gray-900 dark:text-white'>Languages</li>
        </ol>
      </nav>

      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white'>
            <span>🌐</span> Languages
          </h1>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            View available languages and translation statistics
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className='mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20'>
        <h3 className='mb-2 font-medium text-blue-800 dark:text-blue-400'>Translation System</h3>
        <ul className='space-y-1 text-sm text-blue-700 dark:text-blue-300'>
          <li>
            • <strong>Spanish (es)</strong> is the default language - all content is created in
            Spanish first
          </li>
          <li>
            • <strong>English (en)</strong> translations can be added manually or via auto-translate
          </li>
          <li>• Auto-translate uses the configured translation API (OpenAI, DeepL, or Google)</li>
          <li>• To add more languages, contact your administrator to update the database</li>
        </ul>
      </div>

      {/* Languages Table */}
      <div className='rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
        <Suspense fallback={<LanguagesTableSkeleton />}>
          <LanguagesTable />
        </Suspense>
      </div>

      {/* Quick Links */}
      <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
        <Link
          href='/admin/products'
          className='rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-green-500 dark:border-gray-700 dark:bg-gray-800'
        >
          <div className='flex items-center gap-3'>
            <span className='text-2xl'>📦</span>
            <div>
              <p className='font-medium text-gray-900 dark:text-white'>
                Manage Product Translations
              </p>
              <p className='text-sm text-gray-500'>Add or edit product translations</p>
            </div>
          </div>
        </Link>

        <Link
          href='/admin/categories'
          className='rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-green-500 dark:border-gray-700 dark:bg-gray-800'
        >
          <div className='flex items-center gap-3'>
            <span className='text-2xl'>🏷️</span>
            <div>
              <p className='font-medium text-gray-900 dark:text-white'>
                Manage Category Translations
              </p>
              <p className='text-sm text-gray-500'>Add or edit category translations</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
