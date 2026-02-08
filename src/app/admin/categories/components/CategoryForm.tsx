'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

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

interface CategoryFormProps {
  category: Category | null;
  isNew: boolean;
}

const EMOJI_OPTIONS = ['🌱', '🦐', '📦', '🌾', '🍌', '🌹', '☕', '🐟', '🌿', '🌴', '🍫', '🥜'];
const COLOR_OPTIONS = [
  '#4CAF50',
  '#2196F3',
  '#795548',
  '#FF9800',
  '#E91E63',
  '#9C27B0',
  '#00BCD4',
  '#FF5722',
];

export function CategoryForm({ category, isNew }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    icon: category?.icon || '📦',
    color: category?.color || '#4CAF50',
    sort_order: category?.sort_order?.toString() || '0',
    is_active: category?.is_active ?? true,
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: isNew ? generateSlug(name) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = isNew ? '/api/admin/categories' : `/api/admin/categories/${category?.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sort_order: parseInt(formData.sort_order),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save category');
      }

      const data = await response.json();

      if (isNew) {
        router.push(`/admin/categories/${data.id}/translations`);
      } else {
        router.push('/admin/categories');
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6 p-6'
    >
      {error && (
        <div className='rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20'>
          <p className='text-red-700 dark:text-red-400'>{error}</p>
        </div>
      )}

      {/* Preview Card */}
      <div className='rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50'>
        <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>Preview</p>
        <div className='flex items-center gap-3'>
          <span
            className='flex h-12 w-12 items-center justify-center rounded-lg text-2xl'
            style={{ backgroundColor: formData.color }}
          >
            {formData.icon}
          </span>
          <div>
            <p className='font-medium text-gray-900 dark:text-white'>
              {formData.name || 'Category Name'}
            </p>
            <p className='text-sm text-gray-500'>/{formData.slug || 'category-slug'}</p>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Category Name (Spanish) <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            value={formData.name}
            onChange={handleNameChange}
            required
            className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
          />
          <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
            Default Spanish name. Add translations after creating.
          </p>
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Slug <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            value={formData.slug}
            onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            required
            className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Sort Order
          </label>
          <input
            type='number'
            value={formData.sort_order}
            onChange={e => setFormData(prev => ({ ...prev, sort_order: e.target.value }))}
            min='0'
            className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Status
          </label>
          <label className='mt-2 flex cursor-pointer items-center gap-2'>
            <input
              type='checkbox'
              checked={formData.is_active}
              onChange={e => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className='h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500'
            />
            <span className='text-sm text-gray-700 dark:text-gray-300'>Active</span>
          </label>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
          Description (Spanish)
        </label>
        <textarea
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
        />
      </div>

      {/* Icon Selection */}
      <div>
        <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
          Icon
        </label>
        <div className='flex flex-wrap gap-2'>
          {EMOJI_OPTIONS.map(emoji => (
            <button
              key={emoji}
              type='button'
              onClick={() => setFormData(prev => ({ ...prev, icon: emoji }))}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-all ${
                formData.icon === emoji
                  ? 'bg-green-50 ring-2 ring-green-500 dark:bg-green-900/50'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
              }`}
            >
              {emoji}
            </button>
          ))}
          <input
            type='text'
            value={formData.icon}
            onChange={e => setFormData(prev => ({ ...prev, icon: e.target.value }))}
            placeholder='Custom'
            className='w-20 rounded-lg border border-gray-300 px-2 py-1 text-center text-xl dark:border-gray-600 dark:bg-gray-700 dark:text-white'
          />
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
          Background Color
        </label>
        <div className='flex flex-wrap gap-2'>
          {COLOR_OPTIONS.map(color => (
            <button
              key={color}
              type='button'
              onClick={() => setFormData(prev => ({ ...prev, color }))}
              className={`h-10 w-10 rounded-lg transition-all ${
                formData.color === color ? 'ring-2 ring-gray-400 ring-offset-2' : ''
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
          <input
            type='color'
            value={formData.color}
            onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
            className='h-10 w-10 cursor-pointer rounded-lg border-0'
          />
        </div>
      </div>

      {/* Actions */}
      <div className='flex items-center justify-end gap-4 border-t border-gray-200 pt-6 dark:border-gray-700'>
        <button
          type='button'
          onClick={() => router.back()}
          className='rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
        >
          Cancel
        </button>
        <button
          type='submit'
          disabled={loading}
          className='flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50'
        >
          {loading ? (
            <>
              <span className='animate-spin'>⚙️</span> Saving...
            </>
          ) : (
            <>{isNew ? 'Create & Add Translations' : 'Save Changes'}</>
          )}
        </button>
      </div>
    </form>
  );
}
