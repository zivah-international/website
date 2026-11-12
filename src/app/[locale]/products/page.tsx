'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import PageHeader from '@/components/site/PageHeader';
import ProductCard from '@/components/site/ProductCard';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { getProductImage } from '@/lib/product-images';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  origin: string;
  certifications?: string[];
  category?: Category;
}

// Seafood leads every view, then the remaining marine line, agriculture and others.
const SEAFOOD_FIRST = [
  'camaron-blanco-premium',
  'larvas-camaron-postlarva',
  'atun-fresco-pacifico',
];

function categoryRank(product: Product) {
  const index = SEAFOOD_FIRST.indexOf(product.slug);
  if (index !== -1) return index;

  switch (product.category?.slug) {
    case 'marinos-y-pesca':
      return 10;
    case 'agricolas':
      return 20;
    case 'otros-productos':
      return 30;
    default:
      return 40;
  }
}

function sortCatalog(products: Product[]) {
  return [...products].sort(
    (a, b) => categoryRank(a) - categoryRank(b) || a.name.localeCompare(b.name)
  );
}

export default function ProductsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Read the initial category from the URL so /products?category=agricolas works.
  useEffect(() => {
    const category = new URLSearchParams(window.location.search).get('category');
    if (category) setSelectedCategory(category);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch(`/api/categories?locale=${locale}`),
          fetch(`/api/products?locale=${locale}&isActive=true`),
        ]);
        if (catRes.ok && prodRes.ok) {
          const catJson = await catRes.json();
          const prodJson = await prodRes.json();
          const cats: Category[] = catJson.data || catJson || [];
          const prods: Product[] = (prodJson.data || prodJson || []).map((product: Product) => ({
            ...product,
            certifications: Array.isArray(product.certifications) ? product.certifications : [],
          }));
          setCategories(cats);
          setProducts(prods);
        }
      } catch {
        // keep the empty state
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [locale]);

  const sortedProducts = useMemo(() => sortCatalog(products), [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return sortedProducts;
    return sortedProducts.filter(product => product.category?.slug === selectedCategory);
  }, [selectedCategory, sortedProducts]);

  const categoryLabel = (category: Category) => {
    switch (category.slug) {
      case 'marinos-y-pesca':
        return t('products.seafood');
      case 'agricolas':
        return t('products.agricultural');
      case 'otros-productos':
        return t('products.other');
      default:
        return category.name;
    }
  };

  const countFor = (slug: string) =>
    slug === 'all'
      ? sortedProducts.length
      : sortedProducts.filter(product => product.category?.slug === slug).length;

  const filters = [
    { slug: 'all', label: t('products.all') },
    ...categories.map(category => ({ slug: category.slug, label: categoryLabel(category) })),
  ];

  return (
    <>
      <PageHeader
        crumbs={[{ label: t('nav.home'), href: '/' }, { label: t('nav.products') }]}
        eyebrow={t('products.eyebrow')}
        title={t('products.title')}
        lead={t('products.lead')}
        action={
          <Button
            asChild
            variant='brand'
            size='brand'
          >
            <Link
              href='/quote'
              data-track='begin_checkout'
              data-track-category='cta'
              data-track-label='products_header_quote'
            >
              {t('products.requestQuote')}
            </Link>
          </Button>
        }
      />

      {!loading && products.length > 0 && (
        <div className='border-y border-border bg-background'>
          <div className='mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8'>
            <div className='scrollbar-hide flex gap-6 overflow-x-auto py-4'>
              {filters.map(filter => {
                const active = selectedCategory === filter.slug;

                return (
                  <button
                    key={filter.slug}
                    type='button'
                    aria-pressed={active}
                    onClick={() => setSelectedCategory(filter.slug)}
                    className={`shrink-0 border-b-2 pb-1 text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors ${
                      active
                        ? 'border-accent text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {filter.label} ({countFor(filter.slug)})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <section className='bg-background py-12 lg:py-16'>
        <div className='mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8'>
          {loading ? (
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {[0, 1, 2].map(index => (
                <div
                  key={index}
                  className='overflow-hidden rounded-[2px] border border-border bg-surface'
                >
                  <div className='aspect-[4/3] animate-pulse bg-muted' />
                  <div className='space-y-3 p-6'>
                    <div className='h-3 w-1/3 animate-pulse bg-muted' />
                    <div className='h-5 w-2/3 animate-pulse bg-muted' />
                    <div className='h-3 w-full animate-pulse bg-muted' />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className='max-w-xl py-10'>
              <h2 className='text-2xl text-foreground'>{t('products.emptyTitle')}</h2>
              <p className='mt-3 text-[15px] leading-relaxed text-muted-foreground'>
                {t('products.emptyBody')}
              </p>
              <Link
                href='/contact'
                className='prose-link mt-5 inline-block text-[13px] font-semibold text-foreground transition-colors hover:text-accent'
              >
                {t('products.emptyCta')}
              </Link>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className='py-10'>
              <p className='text-[15px] text-muted-foreground'>{t('products.filterEmpty')}</p>
              <button
                type='button'
                onClick={() => setSelectedCategory('all')}
                className='prose-link mt-3 text-[13px] font-semibold text-foreground transition-colors hover:text-accent'
              >
                {t('products.clearFilter')}
              </button>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  href={`/products/${product.slug}`}
                  imageSrc={getProductImage(product.slug, product.category?.slug)}
                  imageAlt={product.name}
                  priority={index === 0}
                  eyebrow={product.category ? categoryLabel(product.category) : ''}
                  title={product.name}
                  description={product.shortDescription || product.description || ''}
                  origin={product.origin}
                  certifications={product.certifications}
                  linkLabel={t('products.viewDetail')}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
