'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { ArrowRight, QuoteIcon } from '@/components/ui/icons';
import { getAnimationClasses, useScrollAnimation } from '@/lib/hooks/use-scroll-animation';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
}

const CARD_STYLES = [
  {
    dot: 'bg-secondary',
    btn: 'bg-secondary hover:bg-secondary/90 text-white',
    text: 'text-secondary',
  },
  { dot: 'bg-accent', btn: 'bg-accent hover:bg-accent/90 text-white', text: 'text-accent' },
  { dot: 'bg-primary', btn: 'bg-primary hover:bg-primary/90 text-white', text: 'text-primary' },
  {
    dot: 'bg-secondary',
    btn: 'bg-secondary hover:bg-secondary/90 text-white',
    text: 'text-secondary',
  },
];

export default function CategoriesSection() {
  const t = useTranslations();
  const locale = useLocale();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    fetch(`/api/categories?locale=${locale}`)
      .then(r => (r.ok ? r.json() : { data: [] }))
      .then(json => setCategories(json.data || json || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, [locale]);

  return (
    <section
      className='bg-muted/30 py-14'
      id='products'
    >
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8 text-center'>
          <div className='mb-3 inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-semibold text-secondary'>
            {t('products.badge')}
          </div>
          <h2 className='mb-4 text-3xl font-bold text-foreground sm:text-4xl'>
            {t('products.title')}
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
            {t('products.description')}
          </p>
        </div>

        {loading ? (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className='animate-pulse rounded-2xl border bg-card p-8'
              >
                <div className='mb-4 h-12 w-12 rounded-xl bg-muted' />
                <div className='mb-3 h-5 rounded bg-muted' />
                <div className='h-4 rounded bg-muted' />
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={ref}
            className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-4 ${getAnimationClasses('fade-up', isVisible)}`}
          >
            {categories.slice(0, 4).map((cat, i) => {
              const style = CARD_STYLES[i % CARD_STYLES.length];
              return (
                <div
                  key={cat.id}
                  className='group flex flex-col rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5'
                >
                  <div className='mb-4 flex items-start justify-between'>
                    <span className='text-4xl'>{cat.icon || '📦'}</span>
                    <span className={`${style.dot} mt-2 h-2 w-2 rounded-full`} />
                  </div>
                  <h3 className='mb-2 text-lg font-bold text-foreground'>{cat.name}</h3>
                  <p className='mb-6 flex-1 text-sm leading-relaxed text-muted-foreground'>
                    {cat.description}
                  </p>
                  <div className='flex gap-2'>
                    <Link
                      href={`/${locale}/products?category=${cat.slug}`}
                      className={`${style.btn} flex-1 rounded-lg py-2 text-center text-xs font-semibold transition-colors`}
                    >
                      {t('products.viewDetail')}
                    </Link>
                    <Link
                      href={`/${locale}/quote`}
                      className='rounded-lg border border-border px-3 py-2 text-xs font-medium transition-colors hover:border-accent/50 hover:text-accent'
                      data-track='begin_checkout'
                      data-track-category='category_card'
                      data-track-label='home_category_quote'
                    >
                      {t('products.requestQuote')?.split(' ')[0]}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className='mt-10 text-center'>
          <Link
            href={`/${locale}/products`}
            className='inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg'
          >
            {t('home.viewFullCatalog')}
            <ArrowRight
              size={16}
              strokeWidth={2.5}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
