'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
  origin: string;
  harvest_season: string | null;
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

interface ProductFormProps {
  product: Product | null;
  categories: Category[];
  measures: Measure[];
  isNew: boolean;
}

export function ProductForm({ product, categories, measures, isNew }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    code: product?.code || '',
    category_id: product?.category_id?.toString() || '',
    description: product?.description || '',
    short_description: product?.short_description || '',
    sku: product?.sku || '',
    stock_quantity: product?.stock_quantity?.toString() || '0',
    min_order_qty: product?.min_order_qty?.toString() || '1',
    image_url: product?.image_url || '',
    origin: product?.origin || 'Ecuador',
    harvest_season: product?.harvest_season || '',
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
    seo_title: product?.seo_title || '',
    seo_description: product?.seo_description || '',
    measure_id: product?.measure_id?.toString() || '',
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
      const url = isNew ? '/api/admin/products' : `/api/admin/products/${product?.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          category_id: formData.category_id ? parseInt(formData.category_id) : null,
          measure_id: formData.measure_id ? parseInt(formData.measure_id) : null,
          stock_quantity: parseInt(formData.stock_quantity),
          min_order_qty: formData.min_order_qty ? parseInt(formData.min_order_qty) : null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save product');
      }

      const data = await response.json();

      if (isNew) {
        router.push(`/admin/products/${data.id}/translations`);
      } else {
        router.push('/admin/products');
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

      {/* Basic Info */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Product Name (Spanish) <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            value={formData.name}
            onChange={handleNameChange}
            required
            className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
          />
          <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
            This is the default Spanish name. Add translations after creating.
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
            Product Code
          </label>
          <input
            type='text'
            value={formData.code}
            onChange={e => setFormData(prev => ({ ...prev, code: e.target.value }))}
            placeholder='e.g., AGR-BAN-001'
            className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            SKU
          </label>
          <input
            type='text'
            value={formData.sku}
            onChange={e => setFormData(prev => ({ ...prev, sku: e.target.value }))}
            className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Category
          </label>
          <select
            value={formData.category_id}
            onChange={e => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
            className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
          >
            <option value=''>Select category...</option>
            {categories.map(cat => (
              <option
                key={cat.id}
                value={cat.id}
              >
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Default Measure
          </label>
          <select
            value={formData.measure_id}
            onChange={e => setFormData(prev => ({ ...prev, measure_id: e.target.value }))}
            className='trans w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
          >
            <option value=''>Select measure...</option>
            {measures.map(m => (
              <option
                key={m.id}
                value={m.id}
              >
                {m.name} ({m.short_name})
              </option>
            ))}
          </select>
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
          rows={4}
          className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
        />
      </div>

      <div>
        <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
          Short Description (Spanish)
        </label>
        <textarea
          value={formData.short_description}
          onChange={e => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
          rows={2}
          className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
        />
      </div>

      {/* Inventory */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Stock Quantity
          </label>
          <input
            type='number'
            value={formData.stock_quantity}
            onChange={e => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
            min='0'
            className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Min Order Quantity
          </label>
          <input
            type='number'
            value={formData.min_order_qty}
            onChange={e => setFormData(prev => ({ ...prev, min_order_qty: e.target.value }))}
            min='1'
            className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Origin
          </label>
          <input
            type='text'
            value={formData.origin}
            onChange={e => setFormData(prev => ({ ...prev, origin: e.target.value }))}
            className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
          />
        </div>
      </div>

      {/* Media */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Image URL
          </label>
          <input
            type='text'
            value={formData.image_url}
            onChange={e => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
            placeholder='/assets/images/products/...'
            className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Harvest Season
          </label>
          <input
            type='text'
            value={formData.harvest_season}
            onChange={e => setFormData(prev => ({ ...prev, harvest_season: e.target.value }))}
            placeholder='e.g., Todo el año'
            className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
          />
        </div>
      </div>

      {/* SEO */}
      <div className='border-t border-gray-200 pt-6 dark:border-gray-700'>
        <h3 className='mb-4 text-lg font-medium text-gray-900 dark:text-white'>
          SEO Settings (Spanish)
        </h3>
        <div className='grid grid-cols-1 gap-4'>
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              SEO Title
            </label>
            <input
              type='text'
              value={formData.seo_title}
              onChange={e => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
              maxLength={60}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            />
            <p className='mt-1 text-xs text-gray-500'>{formData.seo_title.length}/60 characters</p>
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              SEO Description
            </label>
            <textarea
              value={formData.seo_description}
              onChange={e => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
              maxLength={160}
              rows={2}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            />
            <p className='mt-1 text-xs text-gray-500'>
              {formData.seo_description.length}/160 characters
            </p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className='flex items-center gap-6'>
        <label className='flex cursor-pointer items-center gap-2'>
          <input
            type='checkbox'
            checked={formData.is_active}
            onChange={e => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
            className='h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500'
          />
          <span className='text-sm text-gray-700 dark:text-gray-300'>Active</span>
        </label>

        <label className='flex cursor-pointer items-center gap-2'>
          <input
            type='checkbox'
            checked={formData.is_featured}
            onChange={e => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
            className='h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500'
          />
          <span className='text-sm text-gray-700 dark:text-gray-300'>Featured ⭐</span>
        </label>
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
