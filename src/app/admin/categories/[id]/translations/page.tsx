import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { canManage, getAuthUser } from '@/lib/auth';
import { hasRole } from '@/lib/auth-shared';
import { query } from '@/lib/db';

import { CategoryTranslationsForm } from './CategoryTranslationsForm';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
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
}

async function getCategory(id: number): Promise<Category | null> {
  const result = await query<Category>(
    `
    SELECT id, name, slug, description
    FROM categories WHERE id = $1
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

async function getTranslations(categoryId: number): Promise<Translation[]> {
  const result = await query<Translation>(
    `
    SELECT
      ct.language_id,
      l.code as language_code,
      ct.name,
      ct.description
    FROM category_translations ct
    JOIN languages l ON ct.language_id = l.id
    WHERE ct.category_id = $1
  `,
    [categoryId]
  );
  return result.rows;
}

export default async function CategoryTranslationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoryId = parseInt(id);

  const user = await getAuthUser();

  if (!user || !canManage(user) || !hasRole(user.role, 'sales_manager')) {
    redirect('/admin');
  }

  const [category, languages, translations] = await Promise.all([
    getCategory(categoryId),
    getLanguages(),
    getTranslations(categoryId),
  ]);

  if (!category) {
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
              href='/admin/categories'
              className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            >
              Categories
            </Link>
          </li>
          <li className='text-gray-400'>/</li>
          <li>
            <Link
              href={`/admin/categories/${id}`}
              className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            >
              {category.name}
            </Link>
          </li>
          <li className='text-gray-400'>/</li>
          <li className='text-gray-900 dark:text-white'>Translations</li>
        </ol>
      </nav>

      {/* Header */}
      <div className='mb-6'>
        <h1 className='flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white'>
          <span>🌐</span> Translations for &quot;{category.name}&quot;
        </h1>
        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
          Manage translations for this category in all available languages
        </p>
      </div>

      {/* Translations Form */}
      <div className='rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
        <CategoryTranslationsForm
          category={category}
          languages={languages}
          translations={translationsMap}
        />
      </div>
    </div>
  );
}
