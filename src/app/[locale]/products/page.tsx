'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import Navigation from '@/components/Navigation';
import { getProductImage } from '@/lib/product-images';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  basePrice?: number;
  priceUnit?: string;
  minOrderQty?: number;
  imageUrl?: string;
  origin: string;
  certifications?: string[];
  isFeatured: boolean;
  isActive: boolean;
  category?: Category;
}

const CERT_COLORS: Record<string, string> = {
  BAP: 'bg-secondary/10 text-secondary',
  HACCP: 'bg-accent/10 text-accent',
  BRC: 'bg-primary/10 text-primary',
  GlobalGAP: 'bg-accent/15 text-accent',
  USDA: 'bg-primary/15 text-primary',
  ISO: 'bg-secondary/15 text-secondary',
};

export default function ProductsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Read initial category from URL search params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat) setSelectedCategory(cat);
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
          const prods: Product[] = (prodJson.data || prodJson || []).map(
            (p: {
              basePrice?: string | number | null;
              certifications?: unknown;
              [key: string]: unknown;
            }) => ({
              ...p,
              basePrice: p.basePrice ? parseFloat(p.basePrice) : null,
              certifications: Array.isArray(p.certifications) ? p.certifications : [],
            })
          );
          setCategories(cats);
          setProducts(prods);
        }
      } catch {
        // keep empty state
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [locale]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return products;
    return products.filter(p => p.category?.slug === selectedCategory);
  }, [selectedCategory, products]);

  return (
    <div className='min-h-screen'>
      <Navigation />

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <section className='bg-linear-to-b from-background to-muted/30 pt-28 pb-12'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Breadcrumb */}
          <nav
            className='mb-6 flex items-center gap-2 text-sm text-muted-foreground'
            aria-label='Breadcrumb'
          >
            <Link
              href={`/${locale}`}
              className='transition-colors hover:text-accent'
            >
              Inicio
            </Link>
            <span>/</span>
            <span className='font-medium text-foreground'>{t('products.title')}</span>
          </nav>

          <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
            <div className='border-l-4 border-primary/30 pl-5'>
              <p className='mb-1 text-xs font-semibold tracking-widest text-primary uppercase'>
                {t('products.badge')}
              </p>
              <h1 className='text-3xl font-bold text-foreground sm:text-4xl'>
                {t('products.title')}
              </h1>
              <p className='mt-2 max-w-xl text-base text-muted-foreground'>
                {t('products.description')}
              </p>
            </div>
            <div className='flex items-center gap-3'>
              <Link
                href={`/${locale}/quote`}
                className='inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/90'
                data-track='begin_checkout'
                data-track-label='solicitar_cotizacion_products_header'
                data-track-category='cta'
              >
                {t('products.requestQuote')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Filter ───────────────────────────────────────────────── */}
      <div className='sticky top-16 z-40 border-b border-border/40 bg-card/80 backdrop-blur-md'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='scrollbar-hide flex gap-2 overflow-x-auto py-3'>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Todos ({products.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Products Grid ─────────────────────────────────────────────────── */}
      <section className='bg-background py-12'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          {loading ? (
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className='animate-pulse rounded-2xl border bg-card p-6'
                >
                  <div className='mb-4 h-48 rounded-xl bg-muted' />
                  <div className='mb-3 h-5 rounded bg-muted' />
                  <div className='mb-2 h-4 rounded bg-muted' />
                  <div className='h-4 w-2/3 rounded bg-muted' />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className='py-20 text-center'>
              <div className='text-5xl text-muted-foreground'>📦</div>
              <p className='mt-4 text-lg text-muted-foreground'>
                No hay productos en esta categoría.
              </p>
            </div>
          ) : (
            <>
              <p className='mb-6 text-sm text-muted-foreground'>
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}{' '}
                encontrado{filteredProducts.length !== 1 ? 's' : ''}
              </p>
              <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {filteredProducts.map(product => (
                  <article
                    key={product.id}
                    className='group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
                  >
                    {/* Image */}
                    <div className='relative h-48 overflow-hidden bg-muted'>
                      <Image
                        src={getProductImage(
                          product.slug,
                          product.category?.slug,
                          product.imageUrl
                        )}
                        alt={product.name}
                        fill
                        className='object-cover transition-transform duration-500 group-hover:scale-105'
                        sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                      />
                      {product.isFeatured && (
                        <div className='absolute top-3 left-3 rounded-full bg-primary/80 px-2.5 py-1 text-xs font-bold text-primary-foreground shadow'>
                          ⭐ Destacado
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className='flex flex-1 flex-col p-5'>
                      {/* Category */}
                      {product.category && (
                        <div className='mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase'>
                          {product.category.icon} {product.category.name}
                        </div>
                      )}

                      <h2 className='mb-2 text-lg leading-tight font-bold text-foreground'>
                        {product.name}
                      </h2>

                      <p className='mb-4 flex-1 text-sm leading-relaxed text-muted-foreground'>
                        {product.shortDescription || product.description}
                      </p>

                      {/* Certs */}
                      {product.certifications && product.certifications.length > 0 && (
                        <div className='mb-4 flex flex-wrap gap-1.5'>
                          {product.certifications.slice(0, 3).map(cert => (
                            <span
                              key={cert}
                              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${CERT_COLORS[cert] ?? 'bg-muted text-muted-foreground'}`}
                            >
                              {cert}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Price + origin */}
                      <div className='mb-4 flex items-center justify-between border-t border-border/40 pt-4'>
                        <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                          🇪🇨 {product.origin || 'Ecuador'}
                        </div>
                        {product.basePrice && (
                          <div className='text-sm font-bold text-accent'>
                            ${product.basePrice.toFixed(2)}{' '}
                            <span className='text-xs font-normal text-muted-foreground'>
                              /{product.priceUnit}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* CTAs */}
                      <div className='flex gap-2'>
                        <Link
                          href={`/${locale}/quote?product=${product.slug}`}
                          className='flex-1 rounded-lg bg-primary py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-primary/90'
                          data-track='begin_checkout'
                          data-track-label='solicitar_cotizacion_card'
                          data-track-category='cta'
                        >
                          {t('products.requestQuote')}
                        </Link>
                        <Link
                          href={`/${locale}/products/${product.slug}`}
                          className='rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent/50 hover:text-accent'
                        >
                          {t('products.viewDetail')}
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className='bg-primary py-14 text-white'>
        <div className='container mx-auto px-4 text-center sm:px-6 lg:px-8'>
          <h2 className='mb-3 text-2xl font-bold'>¿No encontrás lo que buscás?</h2>
          <p className='mb-6 text-white/80'>
            Tenemos capacidad de sourcing personalizado. Contanos qué necesitás.
          </p>
          <div className='flex flex-col items-center gap-3 sm:flex-row sm:justify-center'>
            <a
              href='https://wa.me/593999002893?text=Hola%2C%20quisiera%20consultar%20sobre%20un%20producto%20espec%C3%ADfico.'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-[#20bd5c] hover:shadow-lg'
              data-track='generate_lead'
              data-track-source='whatsapp_products'
              data-track-currency='USD'
              data-track-value='0'
            >
              Consultar por WhatsApp
            </a>
            <Link
              href={`/${locale}/contact`}
              className='inline-flex items-center gap-2 rounded-xl border-2 border-white/40 px-6 py-3 font-semibold text-white transition-all hover:border-white hover:bg-white/10'
              data-track='cta_click'
              data-track-category='cta'
              data-track-label='contact_form_products'
            >
              Formulario de contacto
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
