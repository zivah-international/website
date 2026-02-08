import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { canManage, getAuthUser } from '@/lib/auth';
import { hasRole } from '@/lib/auth-shared';
import { query } from '@/lib/db';

import { CategoryForm } from '../components/CategoryForm';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  sort_order: number;
  is_active: boolean;
}

async function getCategory(id: string): Promise<Category | null> {
  if (id === 'new') return null;

  const result = await query<Category>(
    `
    SELECT id, name, slug, description, icon, color, sort_order, is_active
    FROM categories WHERE id = $1
  `,
    [parseInt(id)]
  );

  return result.rows[0] || null;
}

export default async function CategoryEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getAuthUser();

  if (!user || !canManage(user) || !hasRole(user.role, 'sales_manager')) {
    redirect('/admin');
  }

  const category = await getCategory(id);

  if (id !== 'new' && !category) {
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
              href='/admin/categories'
              className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            >
              Categories
            </Link>
          </li>
          <li className='text-gray-400'>/</li>
          <li className='text-gray-900 dark:text-white'>
            {isNew ? 'New Category' : category?.name}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            {isNew ? 'Create New Category' : 'Edit Category'}
          </h1>
          {!isNew && (
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              ID: {category?.id} | Slug: {category?.slug}
            </p>
          )}
        </div>
        {!isNew && (
          <Link
            href={`/admin/categories/${id}/translations`}
            className='inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700'
          >
            <span>🌐</span> Manage Translations
          </Link>
        )}
      </div>

      {/* Form */}
      <div className='rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
        <CategoryForm
          category={category}
          isNew={isNew}
        />
      </div>
    </div>
  );
}
