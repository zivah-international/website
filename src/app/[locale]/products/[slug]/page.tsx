import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import CertificationMark from '@/components/site/CertificationMark';
import ProductCard from '@/components/site/ProductCard';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { getProductImage } from '@/lib/product-images';
import { getFichaTecnica } from '@/lib/product-specs';
import { CERTIFICATIONS } from '@/lib/public-data';

interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  specifications?: Record<string, string>;
  stockQuantity: number;
  origin: string;
  certifications?: string[];
  isFeatured: boolean;
  category?: { name: string; slug: string };
}

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '');

async function getProductBySlug(slug: string, locale: string): Promise<Product | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/products?search=${encodeURIComponent(slug)}&locale=${locale}&isActive=true`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const products: Product[] = json.data || [];
    return products.find(product => product.slug === slug) ?? null;
  } catch {
    return null;
  }
}

async function getCatalog(locale: string): Promise<Product[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/products?locale=${locale}&isActive=true&pageSize=200`,
      {
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

interface ProductPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = await getProductBySlug(slug, locale ?? 'es');

  if (!product) {
    const t = await getTranslations({ locale: locale ?? 'es', namespace: 'productDetail' });
    return { title: `${t('notFound')} | ZIVAH International` };
  }

  return {
    title: `${product.name} | ZIVAH International`,
    description: product.shortDescription || product.description,
    keywords: `${product.name}, ${product.category?.name ?? ''}, Ecuador, exportación`,
    openGraph: {
      title: `${product.name} | ZIVAH International`,
      description: product.shortDescription || product.description,
      images: [getProductImage(product.slug, product.category?.slug)],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug, locale } = await params;
  const currentLocale = locale ?? 'es';
  const [product, catalog, t, tNav, tProducts] = await Promise.all([
    getProductBySlug(slug, currentLocale),
    getCatalog(currentLocale),
    getTranslations({ locale: currentLocale, namespace: 'productDetail' }),
    getTranslations({ locale: currentLocale, namespace: 'nav' }),
    getTranslations({ locale: currentLocale, namespace: 'products' }),
  ]);

  if (!product) {
    notFound();
  }

  const ficha = getFichaTecnica(product.slug);
  const certifications = product.certifications ?? [];
  const imageSrc = getProductImage(product.slug, product.category?.slug);

  const specs = [
    { label: t('origin'), value: product.origin },
    {
      label: t('size'),
      value:
        ficha?.especificaciones['Calibre'] ??
        ficha?.especificaciones['Calibre (mm)'] ??
        Object.values(ficha?.especificaciones ?? {})[0] ??
        '—',
    },
    {
      label: t('packaging'),
      value: Object.values(ficha?.empaque ?? {})[0] ?? '—',
    },
    { label: t('certifications'), value: certifications.join(' · ') || '—' },
    { label: t('season'), value: ficha?.temporadaDisponible ?? '—' },
  ];

  // Same category first, current product excluded, capped at three.
  const related = catalog
    .filter(item => item.slug !== product.slug)
    .sort((a, b) => {
      const sameCategoryA = a.category?.slug === product.category?.slug ? 0 : 1;
      const sameCategoryB = b.category?.slug === product.category?.slug ? 0 : 1;
      return sameCategoryA - sameCategoryB;
    })
    .slice(0, 3);

  return (
    <div className='bg-background pt-28 pb-16 lg:pb-24'>
      <div className='mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8'>
        <nav
          aria-label='Breadcrumb'
          className='mb-8 flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground'
        >
          <Link
            href='/'
            className='transition-colors hover:text-accent'
          >
            {tNav('home')}
          </Link>
          <span aria-hidden='true'>/</span>
          <Link
            href='/products'
            className='transition-colors hover:text-accent'
          >
            {tNav('products')}
          </Link>
          <span aria-hidden='true'>/</span>
          <span className='text-foreground'>{product.name}</span>
        </nav>

        <div className='grid gap-10 lg:grid-cols-12 lg:gap-12'>
          <div className='order-2 lg:order-1 lg:col-span-7'>
            <div className='relative aspect-[4/3] overflow-hidden rounded-[2px] border border-border bg-muted'>
              <Image
                data-testid='product-hero-image'
                src={imageSrc}
                alt={product.name}
                fill
                priority
                sizes='(min-width: 1024px) 58vw, 100vw'
                className='object-cover'
              />
            </div>
          </div>

          <div className='order-1 lg:order-2 lg:col-span-5'>
            {product.category && (
              <p className='text-[11px] font-semibold tracking-[0.18em] text-accent uppercase'>
                {product.category.name}
              </p>
            )}
            <h1 className='mt-3 text-[clamp(2.25rem,4vw,3.5rem)] text-foreground'>
              {product.name}
            </h1>
            {product.shortDescription && (
              <p className='mt-3 text-[17px] leading-relaxed text-muted-foreground'>
                {product.shortDescription}
              </p>
            )}

            <dl
              data-testid='product-specs'
              aria-label={t('specsTitle')}
              className='mt-8 divide-y divide-border border-y border-border'
            >
              {specs.map(spec => (
                <div
                  key={spec.label}
                  className='grid grid-cols-[7.5rem_1fr] gap-4 py-3'
                >
                  <dt className='text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase'>
                    {spec.label}
                  </dt>
                  <dd className='text-[15px] text-foreground'>{spec.value}</dd>
                </div>
              ))}
            </dl>

            <div className='mt-8 flex flex-col items-start gap-4'>
              <Button
                asChild
                variant='brand'
                size='brand'
              >
                <Link
                  href={`/quote?product=${product.slug}`}
                  data-track='begin_checkout'
                  data-track-category='cta'
                  data-track-label='product_detail_quote'
                >
                  {t('requestQuote')}
                </Link>
              </Button>
              <Link
                href={`/products/${product.slug}/ficha-tecnica`}
                className='prose-link text-[13px] font-semibold text-foreground transition-colors hover:text-accent'
              >
                {t('downloadSheet')}
              </Link>
            </div>
          </div>
        </div>

        {(product.description || certifications.length > 0) && (
          <section className='mt-16 border-t border-border pt-10'>
            {product.description && (
              <p className='max-w-[68ch] text-[16px] leading-relaxed text-muted-foreground'>
                {product.description}
              </p>
            )}
            {certifications.length > 0 && (
              <div className='mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4'>
                {certifications.map(code => {
                  const certification = CERTIFICATIONS.find(item => item.code === code);

                  return (
                    <CertificationMark
                      key={code}
                      code={code}
                      name={certification?.name ?? code}
                    />
                  );
                })}
              </div>
            )}
          </section>
        )}

        {related.length > 0 && (
          <section className='mt-16 border-t border-border pt-10'>
            <h2 className='text-2xl text-foreground'>{t('relatedTitle')}</h2>
            <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {related.map(item => (
                <ProductCard
                  key={item.id}
                  testId='related-product'
                  href={`/products/${item.slug}`}
                  imageSrc={getProductImage(item.slug, item.category?.slug)}
                  imageAlt={item.name}
                  eyebrow={item.category?.name ?? ''}
                  title={item.name}
                  description={item.shortDescription || item.description || ''}
                  origin={item.origin}
                  certifications={item.certifications}
                  linkLabel={tProducts('viewDetail')}
                />
              ))}
            </div>
          </section>
        )}

        <div className='mt-12'>
          <Link
            href='/products'
            className='prose-link text-[13px] font-semibold text-foreground transition-colors hover:text-accent'
          >
            {t('backToCatalog')}
          </Link>
        </div>
      </div>
    </div>
  );
}
