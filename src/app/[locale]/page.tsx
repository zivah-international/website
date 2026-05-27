'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import HeroSlider from '@/components/HeroSlider';
import Navigation from '@/components/Navigation';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
}

// ─── Slides ──────────────────────────────────────────────────────────────────
const SLIDES = [
  {
    // Bright fresh shrimp / seafood market
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920&q=85',
    badge: '🦐 Acuicultura Premium · Ecuador',
    title: 'Camarón Vannamei',
    titleHighlight: 'Certificado',
    subtitle: 'BAP · HACCP · GlobalGAP · Exportación directa desde Guayas',
    cta: 'Ver Camarón',
    ctaHref: '/products?category=marinos-y-pesca',
    ctaSecondary: 'Solicitar Cotización',
    ctaSecondaryHref: '/quote',
  },
  {
    // Colorful tropical mango / fruit
    image:
      'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1920&q=85',
    badge: '🥭 Frutas Tropicales · Origen Ecuador',
    title: 'Mango · Piña',
    titleHighlight: 'Premium',
    subtitle: 'Certificado GlobalGAP · Trazabilidad completa · 24h respuesta',
    cta: 'Ver Frutas',
    ctaHref: '/products?category=frutas-tropicales',
    ctaSecondary: 'Solicitar Cotización',
    ctaSecondaryHref: '/quote',
  },
  {
    // Warm cacao / coffee harvest daylight
    image:
      'https://images.pexels.com/photos/37516666/pexels-photo-37516666.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    badge: '🌿 Especialidades · Cacao · Café · Flores',
    title: 'Cacao Fino',
    titleHighlight: 'de Aroma',
    subtitle: 'Rainforest Alliance · UTZ · Comercio Justo · +30 productos',
    cta: 'Ver Catálogo',
    ctaHref: '/products',
    ctaSecondary: 'Hablar con un asesor',
    ctaSecondaryHref: '/contact',
  },
];

// ─── Featured products for photo grid ────────────────────────────────────────
const FEATURED_PRODUCTS = [
  {
    slug: 'camaron-blanco-premium',
    name: 'Camarón Vannamei',
    img: '1544551763-46a013bb70d5',
    href: '/products',
  },
  {
    slug: 'cacao-fino-aroma',
    name: 'Cacao Fino de Aroma',
    img: 'https://images.pexels.com/photos/7450070/pexels-photo-7450070.jpeg?auto=compress&cs=tinysrgb&w=500',
    href: '/products',
  },
  {
    slug: 'rosas-rojas-premium',
    name: 'Rosas Premium',
    img: 'https://images.pexels.com/photos/22604232/pexels-photo-22604232.jpeg?auto=compress&cs=tinysrgb&w=500',
    href: '/products',
  },
  {
    slug: 'mango-tommy-atkins',
    name: 'Mango Tommy Atkins',
    img: '1553279768-865429fa0078',
    href: '/products',
  },
  {
    slug: 'aguacate-hass-premium',
    name: 'Aguacate Hass',
    img: '1523049673857-eb18f1d7b578',
    href: '/products',
  },
  {
    slug: 'cafe-arabica-altura',
    name: 'Café Arábica',
    img: '1447933601403-0c6688de566e',
    href: '/products',
  },
  {
    slug: 'banano-cavendish-premium',
    name: 'Banano Premium',
    img: '1571771894821-ce9b6c11b08e',
    href: '/products',
  },
  { slug: 'pina-golden', name: 'Piña Golden', img: '1550258987-190a2d41a8ba', href: '/products' },
];

// ─── Category card accent colors ─────────────────────────────────────────────
const CARD_STYLES = [
  {
    bg: 'from-primary/10 to-primary/5 border-primary/20 hover:border-primary/50',
    dot: 'bg-primary',
    btn: 'bg-primary hover:bg-primary/90',
  },
  {
    bg: 'from-accent/10 to-accent/5 border-accent/20 hover:border-accent/50',
    dot: 'bg-accent',
    btn: 'bg-accent hover:bg-accent/90',
  },
  {
    bg: 'from-secondary/10 to-secondary/5 border-secondary/20 hover:border-secondary/50',
    dot: 'bg-secondary',
    btn: 'bg-secondary hover:bg-secondary/90',
  },
  {
    bg: 'from-primary/10 to-accent/5 border-primary/20 hover:border-accent/50',
    dot: 'bg-primary',
    btn: 'bg-primary hover:bg-primary/90',
  },
];

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/categories?locale=${locale}`)
      .then(r => (r.ok ? r.json() : { data: [] }))
      .then(json => setCategories(json.data || json || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, [locale]);

  return (
    <div className='min-h-screen'>
      <Navigation />

      {/* ── Hero Slider ──────────────────────────────────────────────────── */}
      <HeroSlider
        slides={SLIDES}
        locale={locale}
      />

      {/* ── Stats trust strip ────────────────────────────────────────────── */}
      <section className='bg-primary text-white'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-2 divide-white/20 md:grid-cols-4 md:divide-x'>
            {[
              { value: '5+', label: t('hero.stats.countriesServed'), icon: '🌎' },
              { value: '24h', label: t('hero.stats.containersYear'), icon: '⚡' },
              { value: '4+', label: t('hero.stats.yearsExperience'), icon: '🏆' },
              { value: '100%', label: t('hero.stats.qualityGuaranteed'), icon: '✅' },
            ].map((stat, i) => (
              <div
                key={i}
                className='flex flex-col items-center gap-1 py-7 text-center'
              >
                <span className='text-2xl'>{stat.icon}</span>
                <div className='text-3xl font-black'>{stat.value}</div>
                <div className='text-xs font-medium text-white/80'>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product photo gallery ─────────────────────────────────────────── */}
      <section className='bg-background py-16'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-10 text-center'>
            <p className='text-primary mb-2 text-sm font-bold tracking-widest uppercase'>
              Productos Destacados
            </p>
            <h2 className='text-foreground text-3xl font-bold sm:text-4xl'>
              Del campo ecuatoriano al mundo
            </h2>
            <p className='text-muted-foreground mx-auto mt-3 max-w-xl text-base'>
              +30 productos frescos certificados · Exportación FOB directa
            </p>
          </div>

          <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
            {FEATURED_PRODUCTS.map(product => (
              <Link
                key={product.slug}
                href={`/${locale}${product.href}`}
                className='group relative aspect-square overflow-hidden rounded-2xl shadow-sm'
              >
                <Image
                  src={
                    product.img.startsWith('http')
                      ? product.img
                      : `https://images.unsplash.com/photo-${product.img}?auto=format&fit=crop&w=500&q=80`
                  }
                  alt={product.name}
                  fill
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                  sizes='(max-width: 640px) 50vw, 25vw'
                />
                <div className='absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent' />
                <div className='absolute right-0 bottom-0 left-0 p-3'>
                  <p className='text-sm font-semibold text-white drop-shadow'>{product.name}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className='mt-8 text-center'>
            <Link
              href={`/${locale}/products`}
              className='border-primary text-primary hover:bg-primary inline-flex items-center gap-2 rounded-xl border-2 px-7 py-3 font-semibold transition-all hover:text-white'
            >
              Ver los 30+ productos →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <section
        className='bg-background py-20'
        id='products'
      >
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-12 text-center'>
            <div className='bg-secondary/10 text-secondary mb-3 inline-block rounded-full px-4 py-1.5 text-sm font-semibold'>
              {t('products.badge')}
            </div>
            <h2 className='text-foreground mb-4 text-3xl font-bold sm:text-4xl'>
              {t('products.title')}
            </h2>
            <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
              {t('products.description')}
            </p>
          </div>

          {loading ? (
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className='bg-card animate-pulse rounded-2xl border p-8'
                >
                  <div className='bg-muted mb-4 h-12 w-12 rounded-xl' />
                  <div className='bg-muted mb-3 h-5 rounded' />
                  <div className='bg-muted h-4 rounded' />
                </div>
              ))}
            </div>
          ) : (
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
              {categories.slice(0, 4).map((cat, i) => {
                const style = CARD_STYLES[i % CARD_STYLES.length];
                return (
                  <div
                    key={cat.id}
                    className={`group bg-linear-to-br ${style.bg} flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                  >
                    <div className='mb-4 flex items-start justify-between'>
                      <span className='text-4xl'>{cat.icon || '📦'}</span>
                      <span className={`${style.dot} mt-2 h-2 w-2 rounded-full`} />
                    </div>
                    <h3 className='text-foreground mb-2 text-lg font-bold'>{cat.name}</h3>
                    <p className='text-muted-foreground mb-6 flex-1 text-sm leading-relaxed'>
                      {cat.description}
                    </p>
                    <div className='flex gap-2'>
                      <Link
                        href={`/${locale}/products?category=${cat.slug}`}
                        className={`${style.btn} flex-1 rounded-lg py-2 text-center text-xs font-semibold text-white transition-colors`}
                      >
                        {t('products.viewDetail')}
                      </Link>
                      <Link
                        href={`/${locale}/quote`}
                        className='border-border hover:border-accent/50 hover:text-accent rounded-lg border px-3 py-2 text-xs font-medium transition-colors'
                      >
                        {t('products.requestQuote').split(' ')[0]}
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
              className='bg-accent hover:bg-accent/90 inline-flex items-center gap-2 rounded-xl px-8 py-3.5 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg'
            >
              Ver catálogo completo
              <svg
                className='h-4 w-4'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M17 8l4 4m0 0l-4 4m4-4H3'
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section
        className='bg-muted/30 py-20'
        id='process'
      >
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-12 text-center'>
            <div className='bg-primary/10 text-primary mb-3 inline-block rounded-full px-4 py-1.5 text-sm font-semibold'>
              {t('process.badge')}
            </div>
            <h2 className='text-foreground mb-4 text-3xl font-bold sm:text-4xl'>
              {t('process.title')}
            </h2>
            <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
              {t('process.description')}
            </p>
          </div>

          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {(['📋', '🔍', '📄', '🚢'] as const).map((icon, i) => {
              return (
                <div
                  key={i}
                  className='bg-card border-accent/25 hover:border-accent/55 relative rounded-2xl border-2 p-6 shadow-sm transition-all duration-300 hover:shadow-md'
                >
                  <div className='text-accent mb-2 text-5xl font-black opacity-15'>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className='mb-3 text-3xl'>{icon}</div>
                  <h3 className='text-foreground mb-1 text-base font-bold'>
                    {t(`process.steps.${i}.title`)}
                  </h3>
                  <p className='text-muted-foreground text-sm leading-relaxed'>
                    {t(`process.steps.${i}.description`)}
                  </p>
                  {i < 3 && (
                    <div className='text-muted-foreground/30 absolute top-1/2 -right-4 hidden -translate-y-1/2 text-xl lg:block'>
                      →
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className='mt-10 text-center'>
            <Link
              href={`/${locale}/quote`}
              className='bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-8 py-3.5 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg'
            >
              {t('hero.requestQuote')}
              <svg
                className='h-4 w-4'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M17 8l4 4m0 0l-4 4m4-4H3'
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className='bg-background py-20'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-12 text-center'>
            <div className='bg-accent/10 text-accent mb-3 inline-block rounded-full px-4 py-1.5 text-sm font-semibold'>
              {t('testimonials.badge')}
            </div>
            <h2 className='text-foreground mb-4 text-3xl font-bold sm:text-4xl'>
              {t('testimonials.title')}
            </h2>
          </div>
          <div className='grid gap-6 md:grid-cols-3'>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className='bg-card border-border/40 from-accent/5 to-card border-l-accent/50 flex flex-col rounded-2xl border border-l-4 bg-linear-to-br p-7 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md'
              >
                <div className='text-accent mb-4 text-4xl leading-none'>&ldquo;</div>
                <p className='text-muted-foreground mb-6 flex-1 text-sm leading-relaxed italic'>
                  {t(`testimonials.items.${i}.quote`)}
                </p>
                <div className='border-border/40 flex items-center gap-3 border-t pt-5'>
                  <div className='bg-accent/10 text-accent flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg'>
                    {t(`testimonials.items.${i}.flag`)}
                  </div>
                  <div>
                    <div className='text-foreground text-sm font-semibold'>
                      {t(`testimonials.items.${i}.author`)}
                    </div>
                    <div className='text-muted-foreground text-xs'>
                      {t(`testimonials.items.${i}.role`)} · {t(`testimonials.items.${i}.country`)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────────────────── */}
      <section className='bg-muted/40 border-border/50 border-y py-14'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-xl text-center'>
            <div className='text-accent mb-3 inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold tracking-widest uppercase shadow-sm dark:bg-white/10'>
              Newsletter B2B
            </div>
            <h3 className='text-foreground mb-2 text-2xl font-bold'>{t('newsletter.title')}</h3>
            <p className='text-muted-foreground mb-6 text-sm leading-relaxed'>
              {t('newsletter.description')}
            </p>
            <form
              onSubmit={e => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                window.location.href = `mailto:sales@zivahinternational.com?subject=Newsletter%20B2B&body=Email%3A%20${encodeURIComponent(email)}`;
              }}
              className='flex gap-2'
            >
              <input
                type='email'
                name='email'
                required
                placeholder={t('newsletter.placeholder')}
                className='border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-accent/50 flex-1 rounded-lg border px-4 py-2.5 text-sm focus:ring-2 focus:outline-none'
              />
              <button
                type='submit'
                className='bg-accent hover:bg-accent/90 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors'
              >
                {t('newsletter.cta')}
              </button>
            </form>
            <p className='text-muted-foreground mt-3 text-xs'>{t('newsletter.privacy')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
