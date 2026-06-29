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
          const prods: Product[] = (prodJson.data || prodJson || []).map((p: any) => ({
            ...p,
            basePrice: p.basePrice ? parseFloat(p.basePrice) : null,
            certifications: Array.isArray(p.certifications) ? p.certifications : [],
          }));
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
      <section className='from-background to-muted/30 bg-linear-to-b pt-28 pb-12'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Breadcrumb */}
          <nav
            className='text-muted-foreground mb-6 flex items-center gap-2 text-sm'
            aria-label='Breadcrumb'
          >
            <Link
              href={`/${locale}`}
              className='hover:text-accent transition-colors'
            >
              Inicio
            </Link>
            <span>/</span>
            <span className='text-foreground font-medium'>{t('products.title')}</span>
          </nav>

          <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
            <div>
              <div className='bg-secondary/10 text-secondary mb-3 inline-block rounded-full px-4 py-1.5 text-sm font-semibold'>
                {t('products.badge')}
              </div>
              <h1 className='text-foreground text-3xl font-bold sm:text-4xl'>
                {t('products.title')}
              </h1>
              <p className='text-muted-foreground mt-2 max-w-xl text-base'>
                {t('products.description')}
              </p>
            </div>
            <div className='flex items-center gap-3'>
              <Link
                href={`/${locale}/quote`}
                className='bg-accent hover:bg-accent/90 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5'
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
      <div className='bg-card/80 border-border/40 sticky top-16 z-40 border-b backdrop-blur-md'>
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
                  className='bg-card animate-pulse rounded-2xl border p-6'
                >
                  <div className='bg-muted mb-4 h-48 rounded-xl' />
                  <div className='bg-muted mb-3 h-5 rounded' />
                  <div className='bg-muted mb-2 h-4 rounded' />
                  <div className='bg-muted h-4 w-2/3 rounded' />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className='py-20 text-center'>
              <div className='text-muted-foreground text-5xl'>📦</div>
              <p className='text-muted-foreground mt-4 text-lg'>
                No hay productos en esta categoría.
              </p>
            </div>
          ) : (
            <>
              <p className='text-muted-foreground mb-6 text-sm'>
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}{' '}
                encontrado{filteredProducts.length !== 1 ? 's' : ''}
              </p>
              <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {filteredProducts.map(product => (
                  <article
                    key={product.id}
                    className='bg-card border-border/50 group flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
                  >
                    {/* Image */}
                    <div className='bg-muted relative h-48 overflow-hidden'>
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
                        <div className='bg-primary/80 text-primary-foreground absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-bold shadow'>
                          ⭐ Destacado
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className='flex flex-1 flex-col p-5'>
                      {/* Category */}
                      {product.category && (
                        <div className='text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase'>
                          {product.category.icon} {product.category.name}
                        </div>
                      )}

                      <h2 className='text-foreground mb-2 text-lg leading-tight font-bold'>
                        {product.name}
                      </h2>

                      <p className='text-muted-foreground mb-4 flex-1 text-sm leading-relaxed'>
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
                      <div className='border-border/40 mb-4 flex items-center justify-between border-t pt-4'>
                        <div className='text-muted-foreground flex items-center gap-1.5 text-xs'>
                          🇪🇨 {product.origin || 'Ecuador'}
                        </div>
                        {product.basePrice && (
                          <div className='text-accent text-sm font-bold'>
                            ${product.basePrice.toFixed(2)}{' '}
                            <span className='text-muted-foreground text-xs font-normal'>
                              /{product.priceUnit}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* CTAs */}
                      <div className='flex gap-2'>
                        <Link
                          href={`/${locale}/quote?product=${product.slug}`}
                          className='bg-accent hover:bg-accent/90 flex-1 rounded-lg py-2 text-center text-sm font-semibold text-white transition-colors'
                          data-track='begin_checkout'
                          data-track-label='solicitar_cotizacion_card'
                          data-track-category='cta'
                        >
                          {t('products.requestQuote')}
                        </Link>
                        <Link
                          href={`/${locale}/products/${product.slug}`}
                          className='border-border hover:border-accent/50 hover:text-accent rounded-lg border px-4 py-2 text-sm font-medium transition-colors'
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
            >
              Formulario de contacto
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
