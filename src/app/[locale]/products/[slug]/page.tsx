import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';

interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  specifications?: Record<string, string>;
  basePrice?: number;
  priceUnit?: string;
  stockQuantity: number;
  minOrderQty?: number;
  imageUrl?: string;
  origin: string;
  harvestSeason?: string;
  certifications?: string[];
  nutritionalInfo?: Record<string, string>;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  category?: { name: string; slug: string; icon?: string };
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
    return products.find(p => p.slug === slug) ?? null;
  } catch {
    return null;
  }
}

interface ProductPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = await getProductBySlug(slug, locale ?? 'es');

  if (!product) {
    return { title: 'Producto no encontrado | ZIVAH International' };
  }

  return {
    title: product.seoTitle || `${product.name} | ZIVAH International`,
    description: product.seoDescription || product.shortDescription,
    keywords: `${product.name}, ${product.category?.name ?? ''}, Ecuador, exportación, premium`,
    openGraph: {
      title: product.seoTitle || `${product.name} | ZIVAH International`,
      description: product.seoDescription || product.shortDescription,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug, locale } = await params;
  const product = await getProductBySlug(slug, locale ?? 'es');

  if (!product) {
    notFound();
  }

  const certBadgeColors: Record<string, string> = {
    HACCP: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    BRC: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    BAP: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
    GlobalGAP: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    Orgánico: 'bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300',
    'Comercio Justo': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  };

  const quoteUrl = `/${locale ?? 'es'}/#quote`;

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Sticky CTA bar for mobile */}
      <div className='fixed right-0 bottom-0 left-0 z-40 border-t border-gray-200 bg-white p-3 shadow-lg sm:hidden dark:border-gray-700 dark:bg-gray-800'>
        <Link
          href={quoteUrl}
          data-track='begin_checkout'
          data-track-label='solicitar_cotizacion_mobile'
          data-track-category='cta'
        >
          <Button
            variant='accent'
            size='full'
            className='w-full font-semibold'
          >
            📋 Solicitar Cotización
          </Button>
        </Link>
      </div>

      <div className='container mx-auto max-w-6xl px-4 py-16 pb-24 sm:pb-16'>
        {/* Breadcrumb */}
        <nav
          className='mb-8'
          aria-label='Breadcrumb'
        >
          <ol className='flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400'>
            <li>
              <Link
                href={`/${locale ?? 'es'}`}
                className='hover:text-accent transition-colors'
              >
                Inicio
              </Link>
            </li>
            <li aria-hidden='true'>/</li>
            <li>
              <Link
                href={`/${locale ?? 'es'}/#products`}
                className='hover:text-accent transition-colors'
              >
                Productos
              </Link>
            </li>
            {product.category && (
              <>
                <li aria-hidden='true'>/</li>
                <li>
                  <Link
                    href={`/${locale ?? 'es'}/#${product.category.slug}`}
                    className='hover:text-accent transition-colors'
                  >
                    {product.category.name}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden='true'>/</li>
            <li className='font-medium text-gray-900 dark:text-white'>{product.name}</li>
          </ol>
        </nav>

        {/* Product Header */}
        <div className='mb-8 overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-800'>
          <div className='grid gap-0 md:grid-cols-2'>
            {/* Product Image */}
            <div className='bg-muted/30 relative flex min-h-64 items-center justify-center p-8 md:min-h-80'>
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={480}
                  height={480}
                  className='max-h-80 w-auto rounded-xl object-cover shadow-md'
                  priority
                />
              ) : (
                <div className='flex flex-col items-center gap-3'>
                  <span className='text-8xl'>{product.category?.icon ?? '📦'}</span>
                  <span className='text-muted-foreground text-sm'>Imagen no disponible</span>
                </div>
              )}
              {product.isFeatured && (
                <div className='absolute top-4 left-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-900 shadow'>
                  ⭐ Destacado
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className='flex flex-col gap-6 p-8'>
              {/* Category + Name */}
              <div>
                {product.category && (
                  <p className='text-accent mb-2 text-sm font-semibold tracking-wider uppercase'>
                    {product.category.name}
                  </p>
                )}
                <h1 className='mb-3 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white'>
                  {product.name}
                </h1>
                {product.shortDescription && (
                  <p className='text-base leading-relaxed text-gray-600 dark:text-gray-300'>
                    {product.shortDescription}
                  </p>
                )}
              </div>

              {/* Certifications */}
              {product.certifications && product.certifications.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {product.certifications.map((cert, i) => (
                    <span
                      key={i}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${certBadgeColors[cert] ?? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
                    >
                      ✓ {cert}
                    </span>
                  ))}
                </div>
              )}

              {/* Commercial Info */}
              <div className='rounded-xl bg-gray-50 p-5 dark:bg-gray-700/50'>
                <div className='mb-3 flex items-center justify-between'>
                  <span className='text-sm text-gray-500 dark:text-gray-400'>Precio base FOB:</span>
                  {product.basePrice ? (
                    <span className='text-accent text-2xl font-bold'>
                      ${product.basePrice.toFixed(2)}{' '}
                      <span className='text-sm font-normal text-gray-500'>{product.priceUnit}</span>
                    </span>
                  ) : (
                    <span className='text-sm font-medium text-gray-600 dark:text-gray-300'>
                      Consultar cotización
                    </span>
                  )}
                </div>
                <div className='grid grid-cols-2 gap-3 text-sm'>
                  <div>
                    <span className='block text-gray-500 dark:text-gray-400'>Pedido mínimo:</span>
                    <span className='font-semibold text-gray-900 dark:text-white'>
                      {product.minOrderQty
                        ? `${product.minOrderQty.toLocaleString()} ${product.priceUnit?.split('/')[1] ?? ''}`
                        : 'A convenir'}
                    </span>
                  </div>
                  <div>
                    <span className='block text-gray-500 dark:text-gray-400'>Origen:</span>
                    <span className='font-semibold text-gray-900 dark:text-white'>
                      🇪🇨 {product.origin}
                    </span>
                  </div>
                  {product.harvestSeason && (
                    <div>
                      <span className='block text-gray-500 dark:text-gray-400'>Temporada:</span>
                      <span className='font-semibold text-gray-900 dark:text-white'>
                        {product.harvestSeason}
                      </span>
                    </div>
                  )}
                  {product.sku && (
                    <div>
                      <span className='block text-gray-500 dark:text-gray-400'>SKU:</span>
                      <span className='font-mono text-xs font-semibold text-gray-900 dark:text-white'>
                        {product.sku}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Primary CTAs */}
              <div className='hidden flex-col gap-3 sm:flex sm:flex-row'>
                <Link
                  href={quoteUrl}
                  className='flex-1'
                  data-track='begin_checkout'
                  data-track-label='solicitar_cotizacion_product'
                  data-track-category='cta'
                >
                  <Button
                    variant='accent'
                    size='lg'
                    className='w-full font-semibold shadow-md hover:shadow-lg'
                  >
                    📋 Solicitar Cotización
                  </Button>
                </Link>
                <Link
                  href={`/${locale ?? 'es'}/#contact`}
                  data-track='cta_click'
                  data-track-label='contactar_product'
                  data-track-category='cta'
                >
                  <Button
                    variant='outline'
                    size='lg'
                    className='hover:bg-muted w-full border-2 font-medium'
                  >
                    💬 Contactar
                  </Button>
                </Link>
              </div>

              <p className='text-xs text-gray-400 dark:text-gray-500'>
                * Precio referencial FOB Ecuador. El precio final puede variar según Incoterms,
                volumen y destino.
              </p>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Main Content */}
          <div className='space-y-8 lg:col-span-2'>
            {/* Full Description */}
            {product.description && (
              <div className='rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-800'>
                <h2 className='mb-4 text-xl font-bold text-gray-900 dark:text-white'>
                  Descripción del Producto
                </h2>
                <p className='leading-relaxed text-gray-700 dark:text-gray-300'>
                  {product.description}
                </p>
              </div>
            )}

            {/* Technical Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className='rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-800'>
                <h2 className='mb-6 text-xl font-bold text-gray-900 dark:text-white'>
                  🔬 Especificaciones Técnicas
                </h2>
                <div className='divide-y divide-gray-100 dark:divide-gray-700'>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className='flex items-start justify-between gap-4 py-3'
                    >
                      <span className='min-w-0 shrink-0 font-medium text-gray-900 capitalize dark:text-white'>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className='text-right text-gray-600 dark:text-gray-400'>
                        {value as string}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nutritional / Additional Info */}
            {product.nutritionalInfo && Object.keys(product.nutritionalInfo).length > 0 && (
              <div className='rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-800'>
                <h2 className='mb-6 text-xl font-bold text-gray-900 dark:text-white'>
                  📊 Información Nutricional
                </h2>
                <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
                  {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                    <div
                      key={key}
                      className='rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-700/40'
                    >
                      <div className='text-accent text-sm font-bold'>{value as string}</div>
                      <div className='mt-1 text-xs text-gray-500 capitalize dark:text-gray-400'>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trust Signals */}
            <div className='rounded-2xl border border-green-200 bg-green-50 p-8 dark:border-green-800/50 dark:bg-green-900/10'>
              <h2 className='mb-4 text-xl font-bold text-green-800 dark:text-green-300'>
                ✅ Por qué comprar con ZIVAH
              </h2>
              <ul className='space-y-3 text-sm text-green-700 dark:text-green-400'>
                <li className='flex items-start gap-2'>
                  <span className='mt-0.5 shrink-0'>🏆</span>
                  <span>Certificaciones HACCP, BRC, BAP y GlobalGAP vigentes en cada embarque</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='mt-0.5 shrink-0'>📄</span>
                  <span>
                    Documentación de exportación completa: Certificados de Origen, Sanitario e
                    Inspección
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='mt-0.5 shrink-0'>🌎</span>
                  <span>Logística coordinada desde Guayas, Ecuador y Miami, Florida</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='mt-0.5 shrink-0'>⚡</span>
                  <span>Respuesta comercial en menos de 24 horas hábiles</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='mt-0.5 shrink-0'>🔍</span>
                  <span>Trazabilidad completa desde origen hasta destino final</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Quote CTA Card */}
            <div className='rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800'>
              <h3 className='mb-1 text-lg font-bold text-gray-900 dark:text-white'>
                ¿Interesado en este producto?
              </h3>
              <p className='mb-5 text-sm text-gray-500 dark:text-gray-400'>
                Recibe una cotización FOB con especificaciones técnicas y documentación de
                exportación en menos de 24 horas.
              </p>
              <Link
                href={quoteUrl}
                data-track='begin_checkout'
                data-track-label='solicitar_cotizacion_sidebar'
                data-track-category='cta'
              >
                <Button
                  variant='accent'
                  size='full'
                  className='mb-3 w-full font-semibold shadow-md hover:shadow-lg'
                >
                  📋 Solicitar Cotización Ahora
                </Button>
              </Link>
              <Link
                href={`/${locale ?? 'es'}/#contact`}
                data-track='cta_click'
                data-track-label='hablar_asesor_sidebar'
                data-track-category='cta'
              >
                <Button
                  variant='outline'
                  size='full'
                  className='hover:bg-muted w-full border-2 font-medium'
                >
                  💬 Hablar con un Asesor
                </Button>
              </Link>
            </div>

            {/* Quick Contact */}
            <div className='bg-accent/5 border-accent/20 dark:bg-accent/10 dark:border-accent/30 rounded-2xl border p-6'>
              <h3 className='text-accent mb-4 text-base font-semibold'>Contacto Directo</h3>
              <div className='space-y-2 text-sm'>
                <a
                  href='mailto:sales@zivahinternational.com'
                  className='text-muted-foreground hover:text-accent flex items-center gap-2 transition-colors'
                  data-track='generate_lead'
                  data-track-source='email_product'
                  data-track-currency='USD'
                  data-track-value='0'
                >
                  <span>📧</span>
                  <span>sales@zivahinternational.com</span>
                </a>
                <a
                  href='tel:+593999002893'
                  className='text-muted-foreground hover:text-accent flex items-center gap-2 transition-colors'
                >
                  <span>📱</span>
                  <span>+593 99 900 2893</span>
                </a>
                <div className='text-muted-foreground flex items-center gap-2'>
                  <span>🏢</span>
                  <span>Samborondón, Guayas · Miami, FL</span>
                </div>
              </div>
            </div>

            {/* Certifications display */}
            {product.certifications && product.certifications.length > 0 && (
              <div className='rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800'>
                <h3 className='mb-4 text-base font-bold text-gray-900 dark:text-white'>
                  Certificaciones
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {product.certifications.map((cert, i) => (
                    <span
                      key={i}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${certBadgeColors[cert] ?? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
                    >
                      ✓ {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back to Products */}
        <div className='mt-12 text-center'>
          <Link
            href={`/${locale ?? 'es'}/#products`}
            className='text-accent hover:text-accent/80 inline-flex items-center gap-2 text-sm font-medium transition-colors'
          >
            ← Ver todos los productos
          </Link>
        </div>
      </div>
    </div>
  );
}
