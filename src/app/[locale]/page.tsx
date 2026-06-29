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

// ─── Featured products for photo grid (images only — names come from t()) ─────
const FEATURED_PRODUCTS = [
  {
    slug: 'camaron-blanco-premium',
    nameKey: 'shrimp',
    img: '1544551763-46a013bb70d5',
    href: '/products',
  },
  {
    slug: 'cacao-fino-aroma',
    nameKey: 'cacao',
    img: 'https://images.pexels.com/photos/7450070/pexels-photo-7450070.jpeg?auto=compress&cs=tinysrgb&w=500',
    href: '/products',
  },
  {
    slug: 'rosas-rojas-premium',
    nameKey: 'roses',
    img: 'https://images.pexels.com/photos/22604232/pexels-photo-22604232.jpeg?auto=compress&cs=tinysrgb&w=500',
    href: '/products',
  },
  {
    slug: 'mango-tommy-atkins',
    nameKey: 'mango',
    img: '1553279768-865429fa0078',
    href: '/products',
  },
  {
    slug: 'aguacate-hass-premium',
    nameKey: 'avocado',
    img: '1523049673857-eb18f1d7b578',
    href: '/products',
  },
  {
    slug: 'cafe-arabica-altura',
    nameKey: 'coffee',
    img: '1447933601403-0c6688de566e',
    href: '/products',
  },
  {
    slug: 'banano-cavendish-premium',
    nameKey: 'banana',
    img: '1571771894821-ce9b6c11b08e',
    href: '/products',
  },
  { slug: 'pina-golden', nameKey: 'pineapple', img: '1550258987-190a2d41a8ba', href: '/products' },
];

// ─── Category card accent colors ─────────────────────────────────────────────
const CARD_STYLES = [
  {
    bg: 'from-primary/10 to-primary/5 border-primary/20 hover:border-primary/50',
    dot: 'bg-primary',
    btn: 'bg-primary hover:bg-primary/90 text-white',
  },
  {
    bg: 'from-accent/10 to-accent/5 border-accent/20 hover:border-accent/50',
    dot: 'bg-accent',
    btn: 'bg-accent hover:bg-accent/90 text-white',
  },
  {
    bg: 'from-secondary/10 to-secondary/5 border-secondary/20 hover:border-secondary/50',
    dot: 'bg-secondary',
    btn: 'bg-secondary hover:bg-secondary/90 text-white',
  },
  {
    bg: 'from-primary/10 to-accent/5 border-primary/20 hover:border-accent/50',
    dot: 'bg-primary',
    btn: 'bg-primary hover:bg-primary/90 text-white',
  },
];

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // ─── Slides (inside component so t() is in scope) ───────────────────────
  const SLIDES = [
    {
      image:
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920&q=85',
      badge: t('hero.slides.shrimp.badge'),
      title: t('hero.slides.shrimp.title'),
      titleHighlight: t('hero.slides.shrimp.titleHighlight'),
      subtitle: t('hero.slides.shrimp.subtitle'),
      cta: t('hero.slides.shrimp.cta'),
      ctaHref: '/products?category=marinos-y-pesca',
      ctaSecondary: t('hero.slides.shrimp.ctaSecondary'),
      ctaSecondaryHref: '/quote',
    },
    {
      image:
        'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1920&q=85',
      badge: t('hero.slides.fruits.badge'),
      title: t('hero.slides.fruits.title'),
      titleHighlight: t('hero.slides.fruits.titleHighlight'),
      subtitle: t('hero.slides.fruits.subtitle'),
      cta: t('hero.slides.fruits.cta'),
      ctaHref: '/products?category=frutas-tropicales',
      ctaSecondary: t('hero.slides.fruits.ctaSecondary'),
      ctaSecondaryHref: '/quote',
    },
    {
      image:
        'https://images.pexels.com/photos/37516666/pexels-photo-37516666.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      badge: t('hero.slides.specialties.badge'),
      title: t('hero.slides.specialties.title'),
      titleHighlight: t('hero.slides.specialties.titleHighlight'),
      subtitle: t('hero.slides.specialties.subtitle'),
      cta: t('hero.slides.specialties.cta'),
      ctaHref: '/products',
      ctaSecondary: t('hero.slides.specialties.ctaSecondary'),
      ctaSecondaryHref: '/contact',
    },
  ];

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
          <div className='grid grid-cols-2 md:grid-cols-4'>
            {[
              {
                value: '5+',
                label: t('hero.stats.countriesServed'),
                icon: (
                  <svg
                    className='h-6 w-6 opacity-80'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
                    />
                  </svg>
                ),
              },
              {
                value: '24h',
                label: t('hero.stats.containersYear'),
                icon: (
                  <svg
                    className='h-6 w-6 opacity-80'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                ),
              },
              {
                value: '4+',
                label: t('hero.stats.yearsExperience'),
                icon: (
                  <svg
                    className='h-6 w-6 opacity-80'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0'
                    />
                  </svg>
                ),
              },
              {
                value: '100%',
                label: t('hero.stats.qualityGuaranteed'),
                icon: (
                  <svg
                    className='h-6 w-6 opacity-80'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z'
                    />
                  </svg>
                ),
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`flex flex-col items-center gap-2 py-8 text-center ${i < 3 ? 'border-r border-white/15 last:border-0' : ''}`}
              >
                <div className='mb-1'>{stat.icon}</div>
                <div className='text-3xl font-black tracking-tight'>{stat.value}</div>
                <div className='text-xs font-medium tracking-wide text-white/75 uppercase'>
                  {stat.label}
                </div>
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
              {t('hero.gallery.badge')}
            </p>
            <h2 className='text-foreground text-3xl font-bold sm:text-4xl'>
              {t('hero.gallery.title')}
            </h2>
            <p className='text-muted-foreground mx-auto mt-3 max-w-xl text-base'>
              {t('hero.gallery.subtitle')}
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
                  alt={t(`hero.gallery.products.${product.nameKey}`)}
                  fill
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                  sizes='(max-width: 640px) 50vw, 25vw'
                />
                <div className='absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent' />
                <div className='absolute right-0 bottom-0 left-0 p-3'>
                  <p className='text-sm font-semibold text-white drop-shadow'>
                    {t(`hero.gallery.products.${product.nameKey}`)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className='mt-8 text-center'>
            <Link
              href={`/${locale}/products`}
              className='bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-7 py-3 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg'
            >
              {t('hero.gallery.viewAll')}
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
                        className={`${style.btn} flex-1 rounded-lg py-2 text-center text-xs font-semibold transition-colors`}
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
              className='bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-8 py-3.5 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg'
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
                    <div className='text-primary/30 absolute top-1/2 -right-4 hidden -translate-y-1/2 lg:block'>
                      <svg
                        className='h-6 w-6'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M9 5l7 7-7 7'
                        />
                      </svg>
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
      <section className='bg-muted/20 py-20'>
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
                className='bg-card border-border/40 flex flex-col rounded-2xl border p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
              >
                <svg
                  className='text-primary/20 mb-4 h-8 w-8 shrink-0'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z' />
                </svg>
                <p className='text-muted-foreground mb-6 flex-1 text-sm leading-relaxed'>
                  {t(`testimonials.items.${i}.quote`)}
                </p>
                <div className='border-border/40 flex items-center gap-3 border-t pt-4'>
                  <div className='bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg'>
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
      <section className='bg-primary py-16 text-white'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-xl text-center'>
            <div className='mb-3 inline-block rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-widest text-white uppercase backdrop-blur-sm'>
              Newsletter B2B
            </div>
            <h3 className='mb-2 text-2xl font-bold text-white'>{t('newsletter.title')}</h3>
            <p className='mb-6 text-sm leading-relaxed text-white/80'>
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
                className='flex-1 rounded-lg border border-white/30 bg-white/15 px-4 py-2.5 text-sm text-white backdrop-blur-sm placeholder:text-white/60 focus:border-white/60 focus:ring-0 focus:outline-none'
              />
              <button
                type='submit'
                className='text-primary rounded-lg bg-white px-5 py-2.5 text-sm font-semibold transition-all hover:bg-white/90'
              >
                {t('newsletter.cta')}
              </button>
            </form>
            <p className='mt-3 text-xs text-white/60'>{t('newsletter.privacy')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
